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
			url = url+path;

			return url;
		}
		else
		{
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
	console.log(my_url);
	queue.deq();
	already_visited[my_url] = true;

	var done = false;

	req(String(my_url), function(err,response,html)
	{
		console.log("here");
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
					var page_src = a_tags[i].attribs["href"];
					page_src = ret_complete_url(cur_url,page_src);
					
					if (!already_visited.hasOwnProperty(page_src))
					{
						queue.enq(page_src);
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
			// console.log(resource);
		}

		var funcall = abc();
	});
}

function main()
{
	rl.question("Please enter the url: ", function(answer) 
	{
	  start_url = answer;
	  console.log(start_url);
	  console.log(already_visited);

	  rl.close();

	  // add the start URL to the priority queue

	  queue.enq(start_url);

		var funcall = abc();

		// console.log(requisite_array);

	});
}

var execute = main();