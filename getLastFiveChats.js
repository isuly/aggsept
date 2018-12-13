 var Client = require('instagram-private-api').V1;
var device = new Client.Device('hey');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/hey.json'); 
const fs = require('fs');
const express = require("express");
const app = express();

 


// Add headers
app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'null');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

 app.get("/about", function(request, response)
 {
      
var messagesThread = {};
var messages = [];
messagesThread.messages = messages;
let promise = new Client.Session.create(device, storage, 'ms.isulysha', 'literatyra18')
	.then(function(session) 
	{
        var accountId = storage.getAccountId()//user's acc id
        .then(function(accountId)
        	{ 
        		//console.log(accountId); //user's acc id
        	    return  accountId;
      	    }) 
           		//direct requests
        feed2 = new Client.Feed.InboxPending(session);
        //direct requests checker
        if (feed2.getPendingRequestsTotal()!=null)
        {
          feed2.get()
         .then(function(json) {

            var messageTitle = json[0]._params.users[0].username;
            var messageBody = json[0]._params.lastPermanentItem.text;
            var profilePic = json[0]._params.users[0].profile_pic_url;
            var message = 
            {
            	     	"messageTitle": messageTitle,
            	     	"messageBody": messageBody,
            	     	"profilePic": profilePic
             }
            messagesThread.messages.push(message);  
        })
        } 
        var feed = new Client.Feed.Inbox(session, accountId); 
        feed.get()
            .then(function(results) 
            {
            		for (var i = 0; i < 10; i++)
            		{
            		if (results[i]!=undefined)
            	    {	 

            	     var messageTitle = results[i]._params.title;
            	     var messageBody = results[i]._params.lastPermanentItem.text;
            	     var profilePic = results[i]._params.users[0].profile_pic_url;
            	     var message = 
            	     {
            	     	"messageTitle": messageTitle,
            	     	"messageBody": messageBody,
            	     	"profilePic": profilePic
            	     }
            	     messagesThread.messages.push(message); 
            	    }
            	    else 
            	    	{ 
            	    		return messagesThread;
            	    	}
            	    
                    }
            })

            .then(function (messagesThread) {
                 response.send(messagesThread);
            })  
  })         

 


});

app.listen(8888, function(){
        console.log("Сервер ожидает подключения на 8888...");
    });

