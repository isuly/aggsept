var Client = require('instagram-private-api').V1;
var device = new Client.Device('hey');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/hey.json'); 

//login

module.exports.sendDM = function(login, password, conversationalistName, messageText)
{
Client.Session.create(device, storage, login, password)
	.then(function(session) 
	{
        var accountId = storage.getAccountId()//user's acc id
        .then(function(accountId)
        	{ 
        	    return  accountId;
      	    })

   	    .then(function(username)
   	    { 
   	    	return Client.Account.searchForUser(session, conversationalistName) //also can fetch from threadItem!
   	    	.then(function(account) 
   	    		{ 
   	    			//console.log (account.id); //another person's acc id
   	    			var conversationalistId = account.id; 
   	    			return conversationalistId; 
   	    		}) 
   	    	.catch(function(account)
   	    		{ 
   	    			console.error(err.message)
   	    		}); 
   	    })

   	    .then(function(conversationalistId) 
   	    {
         return Client.Thread.configureText(session, conversationalistId, messageText);
  	    })
   	});
}

//sendDM('ms.isulysha', 'literatyra18', 'imciflam', 'it works')