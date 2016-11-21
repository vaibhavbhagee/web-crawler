/* Web crawler for Go-Cardless coding challenge*/

var readline = require('readline'); // For console input
var express = require('express');
var chr = require('cheerio'); // For parsing HTML
var req = require('request'); // For making HTML request

var rl = readline.createInterface
({
  input: process.stdin,
  output: process.stdout
});

var start_url = ""; // to store the input URL
var html_data = ""; // to store the HTML data of the web page
var already_visited = {}; // to store the links which have already been visited
var requisite_array = []; // To store the final output of JSON objects with URLs and assets

function main()
{
	rl.question("Please enter the url: ", function(answer) 
	{
	  start_url = answer;
	  console.log(start_url);
	  already_visited[start_url] = true;

	  console.log(already_visited);

	  rl.close();

		req(start_url, function(err,response,html)
		{
			if (err)
				console.log("Error in making a request!!!");
			else
			{
				var $ = chr.load(html); // Load the html in the JQuery context

				var cur_url = start_url; // current URL

				var resource = {}; // to store the resources of the current page

				resource["url"] = cur_url;
				resource["assets"] = [];

				// images as resources
				var a_tags = $("img");

				for(var i = 0; i < a_tags.length; i++)
				{
					if (a_tags[i].attribs.hasOwnProperty("src")) // if the tag has a source
					{
						var img_src = a_tags[i].attribs["src"];

						if (img_src.charAt(0) == '/') // not an absolute path
						{
							img_src = cur_url+img_src;
						}

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

						if (script_src.charAt(0) == '/') // not an absolute path
						{
							script_src = cur_url+script_src;
						}

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

								if (stylesheet_src.charAt(0) == '/') // not an absolute path
								{
									stylesheet_src = cur_url+stylesheet_src;
								}

								resource["assets"].push(stylesheet_src);
							}
						}
					}
				}

				console.log(resource);
			}
		});

	});
}

var execute = main();