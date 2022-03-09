# Nojudgies.com


Contents
=======================
* [Project Description](#project-description)
    * [Website Functionality](#website-functionality)
* [Installation & Usage](#installation--usage)
    * [Installation](#installation)
    * [Server](#server)
    * [Client](#client)
* [Technologies](#technologies)
* [Process](#process)
* [Screenshots - Images](#screenshots---images)
* [Win & Challenges](#win--challenges)
* [Licence](#licence)


--------

# Project Description

Nojudgies.com is an online safe space for people to laugh, rant, be human, comment, react and communicate anonymously and without judgment.

**Who is it for?**

Anyone who wants to post whatever they want, anonymously, without fear of judgemenet (within reason). Have a laugh, rant, complain and not be judged.

**What's its purpose?**

Nojudgies.com provides a safe place where users can freely and anonymously express their thoughts that they couldn't most other places and get things off their chest.

We believe that our website can help the mental health of visitors by reducing [stigma](https://www.ccmhrsb.org/stop-the-judgement), bullying, discrimination, as well as by reducing depression, anxiety, and stress levels. (reference studies: [[1]](https://www.ccmhrsb.org/stop-the-judgement), [[2]](https://www.mentalhelp.net/depression/judgmental-thinking-and-anxiety/), [[3]](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC3532328/))

## Website Functionality

* Users are able to visit the website and anonymously post journal entries.
* Users are able to visit the website and anonymously post journal entries.
* Users can write up to 350 characters per journal entry.
* Users are able to choose gifs from [giphy](https://developers.giphy.com/branch/master/docs/api/#quick-start-guide) in their posts and comments
    * they are able to choose between four gifs per post or comment.
* Users are able to view other peoples' entries.
* Users are able to react to other peoples’ entries with an emoji. (!!!!!!!!!!)
    * Users have three emojis to choose from (!!!!!!!!!!)
* Users are able to comment on other people’s entries.


-----

# Installation & Usage

## Installation

* Clone or download the repo.
* Open terminal and navigate to the server directory.
* Run `npm install` to install dependencies.

--------

## Server

* Open terminal and navigate to the server directory.
* Initialize an npm package: `npm init -y`
* Install express: `npm install express`
* Install body-parser to be able to request the body: `npm install body-parser`
* Install jest for testing: `npm install jest --save-dev`
* Install supertest for testing: `npm install supertest --save-dev`
* Install cors: `npm install cors --save`
* Optionally install nodemon to update changes from server without having to re-launch the server when changes are taken place: `npm install nodemon --save-dev`
* Update the package.json file as followed: 

        "scripts": {
            "start": "node server.js",
            "test": "jest --watch --silent",
            "coverage": "jest --coverage",
            "dev": "nodemon server.js"

* Run the server: `npm run dev`            
* To test the files of the server run: `npm run test`, or `npm run coverage` to also get the percent of the degree to which the source code of the program is executed when running the respective tests.

--------

## Client

--------

# Technologies

* HTML/CSS, JavaScript

--------

# Process

* Created an initial design of the website at wireframe.cc
* Set up the server with a *models* and *controllers* directory, and got the server running
* Created test scripts for testing the server
* Set up the client side (............)
* (..................)

--------

# Screenshots - Images

--------

# Win & Challenges

--------

# Licence
