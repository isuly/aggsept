//two-way auntification, opened issues 
/*var Client = require('instagram-private-api').V1;
// Load the core build.
var _ = require('lodash');
var Promise = require ('bluebird');
var device = new Client.Device('someuser');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/someuser.json');

function challengeMe(error){
	return Client.Web.Challenge.resolve(error,'phone')
		.then(function(challenge){
			// challenge instanceof Client.Web.Challenge
			console.log(challenge.type);
			// can be phone or email
			// let's assume we got phone
			if(challenge.type !== 'phone') return;
			//Let's check if we need to submit/change our phone number
			return challenge.phone('')
				.then(function(){return challenge});
		})
		.then(function(challenge){
			// Ok we got to the next step, the response code expected by Instagram
			return challenge.code('');
		})
		.then(function(challenge){
			// And we got the account confirmed!
			// so let's login again
			return loginAndFollow(device, storage, 'ms.isulysha', 'literatyra');
		}) 
}


function loginAndFollow(device, storage, user, password) {
	return Client.Session.create(device, storage, 'ms.isulysha', 'literatyra')
	.then(function(session) {
		var feed = new Client.Feed.InboxPending(session);
		Promise.mapSeries(_.range(0, 1), function() {
			return feed.get();
		})
		.then(function(results) {
			var inbox = _.flatten(results);
			console.log(inbox);
		})  
	})
		.spread(function(session, account) {
			return Client.Relationship.create(session, account.id);
		})
}


loginAndFollow(device, storage, 'ms.isulysha', 'literatyra')
	.catch(Client.Exceptions.CheckpointError, function(error){
		// Ok now we know that Instagram is asking us to
		// prove that we are real users
		return challengeMe(error);
	}) 
	.then(function(relationship) {

		console.log(relationship.params)
		// {followedBy: ... , following: ... }
		// Yey, you just followed an account
	});
*/


 



var Client = require('instagram-private-api').V1;
var device = new Client.Device('hey');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/hey.json'); 


//login
Client.Session.create(device, storage, 'ms.isulysha', 'literatyra18')
	.then(function(session) {
        var accountId = storage.getAccountId()//user's acc id
        .then(function(accountId)
        	{ 
        		//console.log(accountId); //user's acc id
        	    return  accountId;
      	    }) 
 



	 	//sending DM
   	    .then(function(username)
   	    { 
   	    	return Client.Account.searchForUser(session, 'imciflam') //also can fetch from threadItem!
   	    	.then(account => 
   	    		{ 
   	    			//console.log (account.id); //another person's acc id
   	    			var conversationalistId = account.id; 
   	    			return conversationalistId; 
   	    		}) 
   	    	.catch(err => console.error(err.message)); 
   	    })

   	    .then(function(conversationalistId) {
         return Client.Thread.configureText(session, conversationalistId,"haha.");
  	    })
   	     


   	    //last ms + name + userpic
        var feed = new Client.Feed.Inbox(session, accountId); 
        feed.get()
            .then(function(results) {
            	
            		for (var i = 0; i < 5; i++)
            		{
            		if (results[i]!=undefined)
            	    {	  
            		 console.log(results[i]._params.title);//last chat convo name
            		 //console.log(results[i].items[0]._params.text);//last message's text
            		 console.log(results[i]._params.lastPermanentItem.text);//same as first option
            	 	console.log(results[i]._params.users[0].profile_pic_url);//last profile_pics
            	    }
            	    else return results[0].items;
            	    
                    }
            })
            .then(function (items) {
                console.log("success")
            }) 


       

  		//all messages in a single chat by threadId
      //todo - who sent msg
  		.then(function () { 
			new Client.Feed.Inbox(session).get()
			.then(function (t) 
				{ 
           console.log(t.length); //chats amount
					 var threadId = t[0]._params.threadId;
					 return threadId;//gets threadId
					
				})
      .then(function (threadId, accountId)
      { 
        var mediaArray = [];

        let anotherfeed = new Client.Feed.ThreadItems(session, threadId , 20)//last 20 thread items
        anotherfeed.get()
        .then(function(messages)
        { 
        	if (mediaArray.length < 1 || mediaArray[mediaArray.length - 1].id !== messages[messages.length - 1]._params.id) 
        	{
        	for (let i=9; i>=0; i--)//last 10 messages, chronological order
        	{  
        		if (messages[i]!=undefined && messages[i]._params.text!=undefined)
            	{    
              storage.getAccountId()
                .then(function(accountId)
              { 
            //console.log(accountId); //user's acc id
            if (messages[i]._params.userId==accountId)
              {

                var x = getUsernameById(messages[i]._params.userId);
                console.log('message ' + i+ ' was written by current user'); 
                //
              }
              }) 
              //getUsernameById(messages[i]._params.userId); 
            	console.log(messages[i]._params.userId);
        		  console.log(messages[i]._params.text);
        		  }
        	 }
         }
        })
       })
      })



   		//direct requests
        feed2 = new Client.Feed.InboxPending(session);
        //direct requests checker
        if (feed2.getPendingRequestsTotal()!=null)
        {
          feed2.get()
         .then(function(json) {
         	console.log(json[0]._params.users[0].username);
         	console.log(json[0]._params.lastPermanentItem.text);  
         	console.log(json[0]._params.users[0].profile_pic_url);
           console.log(feed2.getPendingRequestsTotal());//counts direct requests 
        })
        } 


        /*Client.Account.getById(session, '9123651275')
       .then(function(account) {
    console.log(account.params);
          })*/



        function getUsernameById(userId)
        {
        Client.Account.getById(session, userId)
       .then(function(accountInstance) {
        var currentUserName = accountInstance.params.username;
        console.log(accountInstance.params.username);
        //console.log(accountInstance.params.profilePicUrl);
        //sleep(1000);
        return currentUserName;
       })


     }

	})

 