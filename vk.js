
var vkAuth = require('vk-auth')(123456, 'audio');


const express = require("express");
const bodyParser = require("body-parser");
  const jsonParser = express.json();
const app = express();
  var globall;
// создаем парсер для данных application/x-www-form-urlencoded
const urlencodedParser = bodyParser.urlencoded({extended: false});
 const MongoClient = require("mongodb").MongoClient;
 
// создаем объект MongoClient и передаем ему строку подключения
const mongoClient = new MongoClient("mongodb://localhost:27017/", { useNewUrlParser: true });
/*mongoClient.connect(function(err, client){
 
    if(err){
        return console.log(err);
    }
    // взаимодействие с базой данных
    client.close();
});*/
app.get("/front/app", urlencodedParser, function (request, response) {
       console.log("AAAAAAAAAAAAAAAAAAAAA!");
    if(!request.body) return response.sendStatus(400);
     //creating an object
/*mongoClient.connect(function(err, client){
      
    const db = client.db("UserInfo");
    const collection = db.collection("users");
    let user = {login: request.body.Login, password: request.body.Password};
    collection.insertOne(user, function(err, result){
          
        if(err){ 
            return console.log(err);
        }
        console.log(result.ops);
        console.log("Юзер добавлен!");
        client.close();
    });*/
    var tmp = 'kek';
    response.send(tmp);
    });
//});
app.get("/front/app/:id", urlencodedParser, function (request, response) {
       console.log("AAAAAAAAAA!");
const id = Number(request.params.id);
console.log(id);
    if(!request.body) return response.sendStatus(400);
     //creating an object
mongoClient.connect(function(err, client){
      
    const db = client.db("users");
    const collection = db.collection("UserInfo");
   // var user = {id: 3, login: 'lol', password: sdfghj};
   collection.findOne({id: id}, function(err, user){//find one
               
        if(err) return console.log(err);
globall=user;
        console.log(globall);
           vkAuth.authorize(globall.login, globall.password);
    vkAuth.on('error', function(err) {
    console.log(err);
});
    vkAuth.on('auth', function(tokenParams) {
    console.log ('kek '+tokenParams.access_token);
    response.send(tokenParams.access_token);
});
  // vkAu
        //response.send(user);//return one
    });
   //console.log(globall);
 /*  vkAuth.authorize(globall.login, globall.password);
    vkAuth.on('error', function(err) {
    console.log(err);
});
    vkAuth.on('auth', function(tokenParams) {
    console.log ('kek '+tokenParams.user_id);
    response.send(`user_id =` +tokenParams.user_id);
});*/
   //response.send();
    /*collection.insertOne(user, function(err, result){
          
        if(err){ 
            return console.log(err);
        }
        console.log(result.ops);
        console.log("Юзер добавлен!");
        client.close();*/
    });
    
    });
app.get("/front", urlencodedParser, function (request, response) {
    response.sendFile(__dirname + "/front.html");
});
/*app.post("/front", urlencodedParser, function (request, response) {
    if(!request.body) {return response.sendStatus(400);}
    else
    {
        mongoClient.connect(function(err, client){
      
    const db = client.db("UserInfo");
    const collection = db.collection("users");
    let user = {login: request.body.Login, password: request.body.Password};
    collection.insertOne(user, function(err, result){
          
        if(err){ 
            return console.log(err);
        }
        console.log(result.ops);
        console.log("Юзер добавлен!");
        client.close();
    });
   console.log(request.body);
    vkAuth.authorize(request.body.Login, request.body.Password);
    vkAuth.on('error', function(err) {
    //console.log(err);
});

vkAuth.on('auth', function(tokenParams) {
    console.log ('kek '+tokenParams.user_id);
    response.send(`user_id =` +tokenParams.user_id);
});
    })
}
});*/
  
app.get("/", function(request, response){
    response.send("Главная страница");
});
app.listen(3000);