# Dropbox Simulation

The goal is to simulate the features of Dropbox web application which is a personal cloud storage service, that can be used for file storage, peer to peer file sharing, group file sharing and user activity timeline.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Setup

Install ReactJS

On the terminal: npm install -g create-react-app
Install Node.js, Kafka server & MongoDB if you haven't already.
Install its dependencies.
Follow the steps on the terminal to start the servers:

Back-end server
	
1. cd nodelogin	
2. npm install	
3. npm start

Front-end server
	
1. cd reactlogin	
2. npm install	
3. npm start

Back-end Kafka 
	
1. cd kafka-back-end
2. npm install
3. npm init	
4. npm start

Kafka server

1. In a separate shell start the Zookeeper. 
	<kafka_dir>\bin\windows\zookeeper-server-start.bat ..\..\config\zookeeper.properties 
2. In a separate shell start the kafka server.
	<kafka_dir>\bin\windows\kafka-server-start.bat ..\..\config\server.properties
3. Create topics.
	<kafka_dir>\bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 1 --partitions 1 --topic mytopic

MongoDB

In a separate shell start the MongoDB daemon.
Open a browser window and navigate to: http://localhost:3000

## Features Of System

Basic Users functionalities: 
*	Sign up new user (at least first name, last name, Email and password) 
*	Sign in existing user (Encryption using Bcrypt) 
*	Sign out.
*	Sign Up with fields - first name, last name, Email and password. 
*	Upload a file 
*	List files
*	Delete a file 
*	Create a directory 
*	Star a folder/directory. 
*	Share a folder/directory by email/name/link.
	*	Users account provides the following basic details such as:
	*	About: User overview, Work and education, contact info and life events. 
	*	Interests like music, shows and sports and food
*	file list and activity report functionality. 
*	The server performs connection pooling for database access. 
*	Groups(share)functionalities:
	*	Create group
	*	Add member in a group
	*	Show members ingroup
	*	Assign access permission to a directory
	*	Delete member from a group
	*	Delete group


## Running the tests

To run Mocha tests, run the command npm test

## Built With

* [Express.js](http://www.dropwizard.io/1.0.2/docs/) - web application framework for Node.js
* [NPM](https://www.npmjs.com/) - Package Manager
* [Bootstrap](https://getbootstrap.com/) - front-end web framework 

## Authors

* **Manvitha Challagundla** - *Individual work* .

