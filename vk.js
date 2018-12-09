
//var vkAuth = require('vk-auth')(123456, 'friends');


const express = require("express");
const bodyParser = require("body-parser");
const jsonParser = express.json();
const app = express();
const urlencodedParser = bodyParser.urlencoded({extended: false});
const MongoClient = require("mongodb").MongoClient;
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });

//регистрация пользователя
app.post("/front/app/create", jsonParser, function (req, res) {
     console.log("регистрация");
    if(!req.body) return res.sendStatus(400);
     //creating an object
     Login = req.body.name;
     Password = req.body.pass;
    console.log(req.body.name);
    console.log(req.body.pass);
    const user = {login: Login, password: Password};
    mongoClient.connect(function(err, client){
    	//где пусто дописать дефолтные значения
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
    	console.log("Регисрация прошла успешно");
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
    
   //запуск фронта
app.get("/front", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/front.html");
});

app.get("/", function(request, response){
    response.send("Главная страница");
});
app.listen(5000);