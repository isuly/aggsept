var Client = require('instagram-private-api').V1;
var device = new Client.Device('hey');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/hey.json'); 
const express = require("express");
const app = express();


//login







   
 app.get("/all", function(request, response)
 {
        
var chatThread = {};
var msgs = [];
chatThread.msgs = msgs;

let promise = Client.Session.create(device, storage, 'ms.isulysha', 'literatyra18')
    .then(function(session) {
        var accountId = storage.getAccountId()//user's acc id


        .then(function(accountId)
            { 
                //console.log(accountId); //user's acc id
                return  accountId;
            }) 


        .then(function () { 
            new Client.Feed.Inbox(session).get()


            .then(function (t) 
                { 
                    // console.log(t.length); //chats amount
                     var threadId = t[0]._params.threadId;//номер чатика сверху
                     return threadId;//gets threadId
                    
                })


      .then(function (threadId, accountId)
      { 
        var mediaArray = [];

        let anotherfeed = new Client.Feed.ThreadItems(session, threadId , 10)//last 20 thread items
        anotherfeed.get()


        .then(function(messages)
        { 
            if (mediaArray.length < 1 || mediaArray[mediaArray.length - 1].id !== messages[messages.length - 1]._params.id) 
            {
            for (let i=9; i>=0; i--)//last 10 messages, chronological order
            {  
                if (messages[i]!=undefined && messages[i]._params.text!=undefined)
                {    
                   
                     var msgTitle = messages[i]._params.userId;
                     var msgBody = messages[i]._params.text; 
                     var msg = 
                     {
                        "msgTitle": msgTitle,
                        "msgBody": msgBody, 
                        "msgSide": 0
                     }
                     chatThread.msgs.push(msg); 

                 // console.log(messages[i]._params.userId);
                  //console.log(messages[i]._params.text);
                  storage.getAccountId()
                  .then(function(accountId)
                  {  
                  if (messages[i]._params.userId==accountId && messages[i]._params.userId !="undefined")
                     { 
                    
                    // var x = getUsernameById(messages[i]._params.userId);
                     console.log('message ' + i+ ' was written by current user'); 
                    chatThread.msgs[i].msgSide == 1;
 
                     } 
                     reversedArray = chatThread.msgs.reverse()
                     if (i==0)
                    { 
                        var reversedThread = {};
                        reversedThread.reversedArray = reversedArray;
                      //  console.log (reversedArray);
                         response.send(reversedThread);
                    }
                  }) 

              }


             } 
               
         }

        })
       })
 
      })


      /* function getUsernameById(userId)
        {
        Client.Account.getById(session, userId)
       .then(function(accountInstance) {
        var currentUserName = accountInstance.params.username;
          console.log(accountInstance.params.username);
         console.log(accountInstance.params.profilePicUrl);
        //sleep(1000);
        return currentUserName;
       }) 
     }*/


    })

});

 app.listen(8888, function(){
        console.log("Сервер ожидает подключения на 8888...");
    });

