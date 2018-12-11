const Mail = require("./mail");//коннект с майл
const Gmail = require("./gmail");//коннект с жмайл
const Yandex = require("./yandex");
const SendMail = require("./sendmail");
const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = express.json();
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

global.UserLogin;
//ПЕРЕМЕСТИЛА ВЫЗОВ В АВТОРИЗАЦИЮ
//Gmail.Connect("isulyfahretdinova@gmail.com", 'literatyra18', "gmail.com");
//global.gmail_massages = new Gmail.Message();//вызываем метод вытягивания сообщений из жмайл
//это глобальная переменная, куда попало не тыкать, как попало не называть!!!
//в нее в модуле записываем нужный массив/объект
//она глобальная на весь сервер, и в можулях тоже видна.
//таким же образом работаем с майлом и яндексом
//переменные для майла и яндекса global.mail_massages и global.yandex_massages соответственно
//сами модули лучше не трогай)


//дальше ответы на запросы

//регистрация пользователя
app.post("/front/app/create", jsonParser, function (req, res) {//регистрация только логина и пароля
     console.log("регистрация");
    if(!req.body) return res.sendStatus(400);
     Login = req.body.name;
     Password = req.body.pass;
    console.log(req.body.name);
    console.log(req.body.pass);
    const user = {login: Login, password: Password};
    mongoClient.connect(function(err, client){
    const db = client.db("final");
    const collection = db.collection("users");
    //проверять уникальность логина 
    collection.insertOne(user, function(err, result){//
               
        if(err) 
        	{return console.log(err);
       			 console.log("Регистрация не прошла");
					res.send('Регистрация не прошла');
        	}
        	else
        	{
    			console.log("Регистрация прошла успешно");
    			res.send("Регистрация прошла успешно");
    }
    });
});
});
//авторизация
app.post("/front/app/search", jsonParser, function (req, res) {
       console.log("Aвторизация");
	Login = req.body.name;
     Password = req.body.pass;
    console.log(req.body.name);
    console.log(req.body.pass);
    if(!req.body) return res.sendStatus(400);

	mongoClient.connect(function(err, client){

    const db = client.db("final");
    const collection = db.collection("users");
    collection.findOne({login: Login, password: Password}, function(err, user){
    if(err) 
	{
		return console.log(err);
		console.log("Aвторизация не прошла");
		res.send('Aвторизация не прошла');
	}
	else      //надо из бд вытащить все логиты пароль и здесь передать во все модули
	{
		try
		{
		if(user.login)
		{
			//и предусмотреть что у юзера есть не все почты, чтоб тут ничего не ломалось
			Mail.Connect("isulyshka@mail.ru", 'literatyra', "mail.ru");//передавать инфу из бд
			global.mail_massages = new Mail.Message();//вызываем метод вытягивания сообщений из майл
			Yandex.Connect('ebobo.ebobovich@yandex.com', 'literatyra18', "yandex.com");//передавать инфу из бд
			global.yandex_massages = new Yandex.Message();//вызываем метод вытягивания сообщений из яндекса 

    		Gmail.Connect("isulyfahretdinova@gmail.com", 'literatyra18', "gmail.com");//передавать инфу из бд
			global.gmail_massages = new Gmail.Message();//вызываем метод вытягивания сообщений из жмайл
			UserLogin = Login;
			console.log("Aвторизация прошла успешно");
    		res.send("Aвторизация прошла успешно");
		}
		}
		catch
		{
			console.log("Aвторизация не прошла");
			res.send('Aвторизация не прошла');
		}
	}
});
});
});
    //запрос на список сообщений +2
app.get("/front/gmail", urlencodedParser, function (req, res) {
	
	for (var i=0; i<gmail_massages.length; i++)
	{
	console.log(gmail_massages[i].head);
	console.log(gmail_massages[i].body);
}
	res.send(gmail_massages);
	//SendMail.MailSend();
});
//написать такой же на майл и яндекс

//пост запрос на отправку сообщения


app.post("/front/app/send", jsonParser, function (req, res) { //отправка сообщения на почты
       console.log("Отправка");
	var To = req.body.to;
	var Host = req.body.host;
    var Subject =req.body.subject;
    var Text = req.body.text;


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
				//убрать хардкод из библы
			//}
			console.log("Сообщение отправлено");
    		res.send("Сообщение отправлено");
		}
		//}
		catch
		{
			console.log("Что-то пошло не так");
    		res.send("Что-то пошло не так");
		}
	}

});
});
//});

app.get("/front/mailNumber", urlencodedParser, function (req, res) {//конкретное сообщение из майл
	
	//var number = ?????????????
	res.send(mail_massages[number].body);
});


app.get("/front/gmailNumber", urlencodedParser, function (req, res) {//конкретное сообщение из жмайл
	
//var number = ?????????????
	res.send(gmail_massages[number].body);
});


app.get("/front/yandexNumber", urlencodedParser, function (req, res) {//конкретное сообщение из яндекса
//var number = ?????????????
	res.send(yandex_massages[number].body);
});



   //запуск фронта
app.get("/front", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/front.html");
});

app.get("/", function(request, response){
    response.send("Главная страница");
});

app.listen(5000);