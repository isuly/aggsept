const sendDirectMessage = require("./sendDirectMessage");
const Mail = require("./mail");//коннект с майл
const Gmail = require("./gmail");//коннект с жмайл
const Yandex = require("./yandex");
const SendMail = require("./sendmail");
var path = require('path');
const express = require("express");
 

//express.use(express.static(path.join(__dirname, 'public')));
const bodyParser = require("body-parser");
const jsonParser = express.json();
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

global.UserLogin;

var Client = require('instagram-private-api').V1;
var device = new Client.Device('hey');
var storage = new Client.CookieFileStorage(__dirname + '/cookies/hey.json'); 
const fs = require('fs');

app.use(express.static('public'));
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
//протестить весь коннект с бд
//написать норм комментарии
//добавить в инст бд??????????

//дальше ответы на запросы

//регистрация пользователя
app.post("/front/app/create", jsonParser, function (req, res) {//регистрация только логина и пароля
     console.log("регистрация");
     var resp = {};
    if(!req.body) return res.sendStatus(400);
     Login = req.body.name;
     Password = req.body.pass;
    console.log(req.body.name);
    console.log(req.body.pass);
    UserLogin = Login;
    const user = {login: Login, password: Password, mail_login: '' ,mail_password: '' , gmail_login:'' , gmail_password:  '' ,
        yandex_login: '' , yandex_password: '' , inst_login: '' ,inst_password: ''};
    mongoClient.connect(function(err, client){
    const db = client.db("final");
    const collection = db.collection("users");

    //проверять уникальность логина 
    collection.insertOne(user, function(err, result){//
               
        if(err) 
        	{
        		return console.log(err);
       			console.log("Регистрация не прошла");
				resp.result = false;
				res.send(resp);
        	}
        	else
        	{
    			console.log("Регистрация прошла успешно");
    			resp.result = true;
				res.send(resp);
    }
    });
});
});

app.post("/front/app/createall", jsonParser, function (req, res) {//регистрация остальных
     console.log("регистрация остальных");
      var resp = {};
    if(!req.body) return res.sendStatus(400);
     Login = UserLogin;
     //Password = req.body.pass;
          MailLogin = req.body.maillogin;
     MailPassword = req.body.mailpass;
          GmailLogin = req.body.gmaillogin;
     GmailPassword = req.body.gmailpass;
          YandexLogin = req.body.yandexlogin;
     YandexPassword = req.body.yandexpass;
     InstLogin = req.body.instlogin;
     InstPassword = req.body.instpass;
    //console.log(req.body.name);
    //console.log(req.body.pass);
    //const user = {login: Login, password: Password};
    mongoClient.connect(function(err, client){
    const db = client.db("final");
    const collection = db.collection("users");
    collection.findOneAndUpdate(
        {login: Login},              // критерий выборки
        { $set: {mail_login: MailLogin,mail_password:  MailPassword, gmail_login: GmailLogin, gmail_password:  GmailPassword,
        yandex_login: YandexLogin, yandex_password:  YandexPassword, inst_login: InstLogin,inst_password:  InstPassword} },     // параметр обновления
        {                           // доп. опции обновления    
            returnOriginal: false
        },
        function(err, user){
        	if(err) 
        	{return console.log(err);
       			 console.log("Регистрация не прошла");
					    resp.result = false;
	res.send(resp);
        	}
        	else{
        		console.log(user);

			Mail.Connect(user.mail_login, user.mail_password, "mail.ru");//передавать инфу из бд
			global.mail_massages = new Mail.Message();//вызываем метод вытягивания сообщений из майл
			Yandex.Connect(user.yandex_login, user.yandex_password, "yandex.com");//передавать инфу из бд
			global.yandex_massages = new Yandex.Message();//вызываем метод вытягивания сообщений из яндекса 
    		Gmail.Connect(user.gmail_login, user.gmail_password, "gmail.com");//передавать инфу из бд
			global.gmail_massages = new Gmail.Message();
			UserLogin = Login;



    resp.result = true;
	res.send(resp);
}
})
})
});



//авторизация
app.post("/front/app/search", jsonParser, function (req, res) {
       console.log("Aвторизация");
	Login = req.body.name;
     Password = req.body.pass;
    console.log(req.body.name);
    console.log(req.body.pass);
    var resp = {};
    if(!req.body) return res.sendStatus(400);

			//Mail.Connect("isulyshka@mail.ru", 'literatyra', "mail.ru");//передавать инфу из бд
			//global.mail_massages = new Mail.Message();//вызываем метод вытягивания сообщений из майл
			//Yandex.Connect('ebobo.ebobovich@yandex.com', 'literatyra18', "yandex.com");//передавать инфу из бд
			//global.yandex_massages = new Yandex.Message();//вызываем метод вытягивания сообщений из яндекса 

    	//	Gmail.Connect("isulyfahretdinova@gmail.com", 'literatyra18', "gmail.com");//передавать инфу из бд
		//	global.gmail_massages = new Gmail.Message();//вызываем метод вытягивания сообщений из жмайл
	mongoClient.connect(function(err, client){

    const db = client.db("final");
    const collection = db.collection("users");
     //app.locals.collection = client.db("final").collection("users");
  
        //const collection = req.app.locals.collection;
    collection.findOne({login: Login, password: Password}, function(err, user){
    if(err) 
	{
		return console.log(err);
		resp.result = false;
		console.log("Aвторизация не прошла");
		    resp.result = false;
	res.send(resp);
	}
	else      
	{
		try
		{
		if(user.login)//и предусмотреть что у юзера есть не все почты, чтоб тут ничего не ломалось
		{
			
			/*Mail.Connect(mail_login, mail_password, "mail.ru");//передавать инфу из бд
			global.mail_massages = new Mail.Message();//вызываем метод вытягивания сообщений из майл
			Yandex.Connect('ebobo.ebobovich@yandex.com', 'literatyra18', "yandex.com");//передавать инфу из бд
			global.yandex_massages = new Yandex.Message();//вызываем метод вытягивания сообщений из яндекса 

    		Gmail.Connect("isulyfahretdinova@gmail.com", 'literatyra18', "gmail.com");//передавать инфу из бд
			global.gmail_massages = new Gmail.Message();*///вызываем метод вытягивания сообщений из жмайл


			Mail.Connect(user.mail_login, user.mail_password, "mail.ru");//передавать инфу из бд
			global.mail_massages = new Mail.Message();//вызываем метод вытягивания сообщений из майл
			Yandex.Connect(user.yandex_login, user.yandex_password, "yandex.com");//передавать инфу из бд
			global.yandex_massages = new Yandex.Message();//вызываем метод вытягивания сообщений из яндекса 
    		Gmail.Connect(user.gmail_login, user.gmail_password, "gmail.com");//передавать инфу из бд
			global.gmail_massages = new Gmail.Message();
			UserLogin = Login;
			console.log("Aвторизация прошла успешно");
    		    resp.result = true;
	res.send(resp);
		}
		}
		catch
		{
			console.log("Aвторизация не прошла");
			    resp.result = false;
				res.send(resp);
		}
	}
});
  });
});
    //запрос на список сообщений
app.get("/front/gmail", urlencodedParser, function (req, res) {
	
	/*for (var i=0; i<gmail_massages.length; i++)
	{
	console.log(gmail_massages[i].head);
	console.log(gmail_massages[i].body);
}*/
	res.send(gmail_massages);
	//SendMail.MailSend();
});

app.get("/front/mail", urlencodedParser, function (req, res) {
	
	/*for (var i=0; i<mail_massages.length; i++)
	{
	console.log(mail_massages[i].head);
	console.log(mail_massages[i].body);
}*/
	res.send(mail_massages);
	//SendMail.MailSend();
});
app.get("/front/gmail", urlencodedParser, function (req, res) {
	
	/*for (var i=0; i<yandex_massages.length; i++)
	{
	console.log(yandex_massages[i].head);
	console.log(yandex_massages[i].body);
}*/
	res.send(yandex_massages);
	//SendMail.MailSend();
});


//пост запрос на отправку сообщения
//**********************************************************
app.post("/front/app/send", jsonParser, function (req, res) { //отправка сообщения на почты
       console.log("Отправка");
	var To = req.body.to;
	var Host = req.body.host;
    var Subject =req.body.subject;
    var Text = req.body.text;
var resp = {};

	var To = "isulyshka@mail.ru";
	var Host = "mail.ru";
    var Subject = 'тест в mail';
    var Text = 'вжух вжух';

    var From, Password;
    //console.log(req.body.name);
    //console.log(req.body.pass);
    if(!req.body) return res.sendStatus(400);

	mongoClient.connect(function(err, client){

    const db = client.db("final");
    //const collection = db.collection("users");
    //collection.findOne({login: UserLogin}, function(err, user){
    if(false) 
	{
		return console.log(err);
		//console.log("Aвторизация не прошла");
		//res.send('Aвторизация не прошла');
	}
	else     //пока хардкод но работает
	{
		try
		{
		//if(user.login)
		//{
			/*switch (host)
			{
				case ('mail.ru'):
				{
					From = user.mail_login;
					Password = user.mail_password;
				};
				case ('gmail.com'):
				{
					From = user.gmail_login;
					Password = user.gmail_password;
				};
				case ('yandex.com'):
				{
					From = user.yandex_login;
					Password = user.yandex_password;
				};

			}*/
				SendMail.MailSend();//передать нужные параметры
				//пока пусть так останется
			//}
			console.log("Сообщение отправлено");
    		resp.result = true;
	res.send(resp);
		}
		//}
		catch
		{
			console.log("Что-то пошло не так");
    		resp.result = false;
	res.send(resp);
		}
	}

});
});
//});


//Сюда передай через урл номер сообщения
app.get("/front/mailNumber/:num", urlencodedParser, function (req, res) {//конкретное сообщение из майл
	
	const number = Number(request.params.num);
	res.send(mail_massages[number].body);
});


app.get("/front/gmailNumber/:num", urlencodedParser, function (req, res) {//конкретное сообщение из жмайл
	
const number = Number(request.params.num);
	res.send(gmail_massages[number].body);
});


app.get("/front/yandexNumber/:num", urlencodedParser, function (req, res) {//конкретное сообщение из яндекса
const number = Number(request.params.num);
	res.send(yandex_massages[number].body);
});

//отправка сообщений в инсту
// сюда передать кому и что отправить
app.post("/front/app/sendinst", jsonParser, function (req, res) {
    console.log("send inst");

    mongoClient.connect(function(err, client){

    const db = client.db("final");
    const collection = db.collection("users");
    collection.findOne({login: UserLogin}, function(err, user){
    if(err) 
	{
		return console.log(err);
		resp.result = false;
		console.log("Aвторизация не прошла");
		    resp.result = false;
	res.send(resp);
	}
	else      
	{
    sendDirectMessage.sendDM(user.inst_login, user.inst_password, 'imciflam', 'it works');
    }
})
    })
});

//});
//дописать передачу параметров
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

//дописать передачу параметров
 app.get("/all", function(request, response)
 {
 
        
var chatThread = {};
var msgs = [];
var flags = [];
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
    
                  storage.getAccountId()
                  .then(function(accountId)
                  {  
                  if (messages[i]._params.userId==accountId)
                     {  
                    chatThread.msgs[i].msgSide = 1; 
 
                     }  
                     chatThread.msgs.push("msgSide: " + chatThread.msgs[i].msgSide); 
                    delete chatThread.msgs[i]['msgSide'];
 

                     if (i==0)
                    {  
                      console.log(chatThread);
                       response.send(chatThread);







                      //  var reversedThread = {};
                      //  reversedThread.reversedArray = reversedArray; 
                        // console.log(reversedArray); 
                        // response.send(reversedThread);
                    }
                  }) 
              }
             }    
         }
        })
       })
      })
    })
});


//передача параметров по урлу

  app.get("/all/:num", urlencodedParser, function(request, response)
 {
//const chatNumber = new objectId(request.params.chatNumber); 
const number = Number(request.params.num);
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
                     var threadId = t[number]._params.threadId;//номер чатика сверху
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
                    chatThread.msgs[i].msgSide = 1;
 
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







//обновление
app.get("/front/app/search", jsonParser, function (req, res) {
       console.log("обновление");
     var resp = {};
mongoClient.connect(function(err, client){

    const db = client.db("final");
    const collection = db.collection("users");
    collection.findOne({login: UserLogin}, function(err, user){
    if(err) 
	{
		return console.log(err);
		resp.result = false;
		console.log("(((((");
		    resp.result = false;
	res.send(resp);
	}
	else      
	{
			//и предусмотреть что у юзера есть не все почты, чтоб тут ничего не ломалось
			Mail.Connect(user.mail_login, user.mail_password, "mail.ru");//передавать инфу из бд
			global.mail_massages = new Mail.Message();//вызываем метод вытягивания сообщений из майл
			response.send(mail_massages);
		}
})
        })
   });
//обновление
app.get("/front/app/search", jsonParser, function (req, res) {
       console.log("обновление");
     var resp = {};
mongoClient.connect(function(err, client){

    const db = client.db("final");
    const collection = db.collection("users");
    collection.findOne({login: UserLogin}, function(err, user){
    if(err) 
	{
		return console.log(err);
		resp.result = false;
		console.log("Aвторизация не прошла");
		    resp.result = false;
	res.send(resp);
	}
	else      
	{
    		Gmail.Connect(user.gmail_login, user.gmail_password, "gmail.com");//передавать инфу из бд
			global.gmail_massages = new Gmail.Message();//вызываем метод вытягивания сообщений из жмайл
			response.send(gmail_massages);
		}
})
})
});
//обновление
app.get("/front/app/search", jsonParser, function (req, res) {
       console.log("обновление");
     var resp = {};
mongoClient.connect(function(err, client){

    const db = client.db("final");
    const collection = db.collection("users");
    collection.findOne({login: UserLogin}, function(err, user){
    if(err) 
	{
		return console.log(err);
		resp.result = false;
		console.log("Aвторизация не прошла");
		    resp.result = false;
	res.send(resp);
	}
	else      
	{
			Yandex.Connect(user.yandex_login, user.yandex_password, "yandex.com");//передавать инфу из бд
			global.yandex_massages = new Yandex.Message();//вызываем метод вытягивания сообщений из яндекса 
			response.send(yandex_massages);
		}
})
    })
   });

   //запуск фронта
app.get("/front/", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/index.html");
    //response.sendFile(__dirname + "/firstpagejs.js");
});
/*app.get("/front/", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/front.html");
    //response.sendFile(__dirname + "/firstpagejs.js");
});*/

app.get("/", function(request, response){
    response.send("Главная страница");
});


app.get('css/page1styles.css', function(req, res) {
  res.sendFile(__dirname + "/" + "page1styles.css");
});

 

app.listen(5000);