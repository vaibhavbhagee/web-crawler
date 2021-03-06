/* Web crawler for Go-Cardless coding challenge*/

var readline = require('readline'); // For console input
var chr = require('cheerio'); // For parsing HTML
var req = require('request'); // For making HTML request
var pq = require('priorityqueuejs'); // For making a queue of the URLs visited

var rl = readline.createInterface
({
  input: process.stdin,
  output: process.stdout
});

var start_url = ""; // to store the input URL
var html_data = ""; // to store the HTML data of the web page
var already_visited = {}; // to store the links which have already been visited
var requisite_array = []; // To store the final output of JSON objects with URLs and assets
var queue = new pq(); // to store the non visited URLs

function ret_complete_url(url,path)
{
	if (path.substring(0,4) != "http") // the path is not an absolute path
	{
		if (path.charAt(0) == '/') // path begins with a /
		{
			if (url.charAt(url.length-1) == '/')
				url = url.substring(0,url.length-1)+path;
			else
				url = url+path;

			return url;
		}
		else if (path.substring(0,2) == "./") // path begins with a ./
		{
			if (url.charAt(url.length-1) == '/')
				url = url.substring(0,url.length-1)+path.substring(1,path.length);
			else
				url = url+path.substring(1,path.length);

			return url;
		}
		else if (path.substring(0,3) == "../") // path begins with a ../
		{
			if (url.charAt(url.length-1) == '/')
				url = url.substring(0,url.length-1)+path.substring(2,path.length);
			else
				url = url+path.substring(2,path.length);

			return url;
		}
		else
		{
			if (url.charAt(url.length-1) == '/')
				url = url+path;
			else
				url = url+"/"+path;

			return url;
		}
	}
	else
		return path;
}

function abc()
{
	if (queue.size() == 0)
	{
		console.log(requisite_array);
		return 0;
	}

	var my_url = queue.peek().toString(); // pick the first non visited URL
	// console.log(my_url);
	queue.deq(); // remove the first item from the queue

	var done = false;

	req(String(my_url), function(err,response,html)
	{
		// console.log("here");
		if (err)
			console.log("Error in making a request!!!");
		else
		{
			var $ = chr.load(html); // Load the html in the JQuery context

			var cur_url = my_url; // current URL

			var resource = {}; // to store the resources of the current page

			resource["url"] = cur_url;
			resource["assets"] = [];

			// links reachable from the current page
			var a_tags = $("a");

			for(var i = 0; i < a_tags.length; i++)
			{
				if (a_tags[i].attribs.hasOwnProperty("href")) // if the tag has a source
				{
					var page_path = a_tags[i].attribs["href"];
					var page_src = ret_complete_url(cur_url,page_path);
					
					if (already_visited.hasOwnProperty(page_src) != true && page_path.substring(0,4) == "http")
					{
						queue.enq(page_src);
						already_visited[page_src] = true;
					}
				}
			}

			// images as resources
			a_tags = $("img");

			for(var i = 0; i < a_tags.length; i++)
			{
				if (a_tags[i].attribs.hasOwnProperty("src")) // if the tag has a source
				{
					var img_src = a_tags[i].attribs["src"];
					img_src = ret_complete_url(cur_url,img_src);
					
					resource["assets"].push(img_src);
				}
			}

			a_tags = $("body");

			for(var i = 0; i < a_tags.length; i++)
			{
				if (a_tags[i].attribs.hasOwnProperty("background")) // if the body tag has a background attribute
				{
					var img_src = a_tags[i].attribs["background"];
					img_src = ret_complete_url(cur_url,img_src);
					
					resource["assets"].push(img_src);
				}
			}

			// scripts as resources
			a_tags = $("script");

			for(var i = 0; i < a_tags.length; i++)
			{
				if (a_tags[i].attribs.hasOwnProperty("src")) // if the tag has a source
				{
					var script_src = a_tags[i].attribs["src"];
					script_src = ret_complete_url(cur_url,script_src);

					resource["assets"].push(script_src);
				}
			}

			// stylesheets as resources
			a_tags = $("link");

			for(var i = 0; i < a_tags.length; i++)
			{
				if (a_tags[i].attribs.hasOwnProperty("rel")) // if the tag has the rel attribute
				{
					if (a_tags[i].attribs.hasOwnProperty("href"))
					{
						var link_rel = a_tags[i].attribs["rel"];

						if (link_rel == "stylesheet") // if the resource is a stylesheet
						{
							var stylesheet_src = a_tags[i].attribs["href"]; // source of the stylesheet
							stylesheet_src = ret_complete_url(cur_url,stylesheet_src);

							resource["assets"].push(stylesheet_src);
						}
					}
				}
			}

			requisite_array.push(resource);
			// console.log(requisite_array);
		}

		var funcall = abc();
	});
}

function main()
{
	rl.question("Please enter the url: ", function(answer) 
	{
	  start_url = answer;

	  rl.close();

	  // add the start URL to the priority queue and hash table
	  already_visited[start_url] = true;
	  queue.enq(start_url);

		var funcall = abc();

	});
}

var execute = main();