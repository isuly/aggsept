const Gmail = require("./gmail");//коннект с жмайл
const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = express.json();
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

//передавать из бд логин и пароль???
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
    collection.findOne({login: Login, password: Password}, function(err, user){//find one
    				Gmail.Connect("isulyfahretdinova@gmail.com", 'literatyra18', "gmail.com");
			global.gmail_massages = new Gmail.Message();
    if(err) 
	{
		return console.log(err);
		console.log("Aвторизация не прошла");
		res.send('Aвторизация не прошла');
	}
	else
	{
		try
		{
		if(user.login)
		{

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
    //запрос на список сообщений
app.get("/front/gmail", urlencodedParser, function (req, res) {
	//получить инфу из бд
	console.log(gmail_massages[0].body);
	res.send(gmail_massages[0].body);
});


   //запуск фронта
app.get("/front", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/front.html");
});

app.get("/", function(request, response){
    response.send("Главная страница");
});

app.listen(5000);