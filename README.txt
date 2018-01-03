
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
	<kafka_dir>\bin\windows\zookeeper-server-start.bat ..\..\config\zookeeper.propertiesand 
2. In a separate shell start the kafka server.
	<kafka_dir>\bin\windows\kafka-server-start.bat ..\..\config\server.properties
3. Create topics.
	<kafka_dir>\bin\windows\kafka-topics.bat --create --zookeeper localhost:2181 --replication-factor 	  1 --partitions 1 --topic mytopic

MongoDB

In a separate shell start the MongoDB daemon.
Open a browser window and navigate to: http://localhost:3000
