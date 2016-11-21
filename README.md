This is a simple web crawler which takes in a URL as an input and returns 
the static assets (images, scripts and stylesheets) of all the URLs which are
reachable from the starting URL in a JSON format.

Insatllation Instructions for Windows:
--------------------------------------

1. Install NodeJS for Windows from the following link:
		
		https://nodejs.org/en/download/

2. To download the required libraries on the system, open command prompt in the home 
	directory of the project and type:

		npm install

Insatllation instructions for Ubuntu:
-------------------------------------

1a. To install NodeJS for Ubuntu, open Terminal and type:
		
		curl -sL https://deb.nodesource.com/setup_7.x | sudo -E bash -
		sudo apt-get install -y nodejs

						OR

1b. Install NodeJS for Linux from the following link:
		
		https://nodejs.org/en/download/

2. To download the required libraries on the system, open command prompt in the home 
	directory of the project and type:

		sudo npm install

Instruction to run the code:
----------------------------

1. Open the home directory of the project in a terminal or command prompt and type:
	
		node crawler.js

2. The web crawler prompts for a starting URL. Enter the URL as

		http://<name-of-the-website>

3. The web crawler returns the static assets of all the websites reachable from the starting 
	URL in the form of an array of JSON objects for eg;

		[
			{
				"url":"http://www.example1.com",
				"assets": [
					"http://www.example1.com/img1.jpg",
					"http://www.example1.com/img2.jpg",
					"http://www.example1.com/scripts/script1.js"
				]
			},
			{
				"url":"http://www.example2.com",
				"assets": [
					"http://www.example2.com/img1.jpg",
					"http://www.example2.com/stylesheets/csstheme1.css",
					"http://www.example1.com/scripts/script1.js"
				]
			}
		]