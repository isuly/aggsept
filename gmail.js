/*var Imap = require('imap'),
    inspect = require('util').inspect;

var imap = new Imap({
  user: 'isulyfahretdinova@gmail.com',
  password: 'literatyra18',
  host: 'imap.gmail.com',
  port: 993,
  tls: true
});*/
/*var imap = new Imap({
  user: 'isulyshka@mail.ru',
  password: 'literatyra',
  host: 'imap.mail.ru',
  port: 993,
  tls: true
});*/
/*var imap = new Imap({
  user: 'ebobo.ebobovich@yandex.com',
  password: 'literatyra18',
  host: 'imap.yandex.com',
  port: 993,
  tls: true
});
*/
var imap;
var Imap;
var count=0;
Imap = require('imap'),
inspect = require('util').inspect;
User = "isulyfahretdinova@gmail.com";
Password = "literatyra18";
Host = "gmail.com";

module.exports.Connect = function(User, Password, Host)
{
imap = new Imap({
  user: User,
  password: Password,
  host: 'imap.'+Host,
  port: 993,
  tls: true
});
}
var hm;
var message = {};
var rezz = {};
global.myList = new Array();
var result;
var g = 5;
function openInboxGmail(cb) {
  imap.openBox('INBOX', true, cb);
}

module.exports.Message = function()
{
imap.once('ready', function() {
  openInboxGmail(function(err, box) {
    if (err) throw err;
       // console.log("You have messages in your INBOX: "+box.messages.total);//считает правильно
    var f = imap.seq.fetch(box.messages.total-3+':'+box.messages.total, {//3 последних
      bodies: ['HEADER.FIELDS (FROM TO SUBJECT DATE)','TEXT'],
      struct: true
    });
    f.on('message', function(msg, seqno) {
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          var tmp = inspect(Imap.parseHeader(buffer));
          var re = /(base64[^\>]*----ALT)/;
          var lol = buffer.match(re);
          var msgg;
          var rez='';
          var i = 10;
          var tmp2;
         if(lol!=null)
         {
          msgg=lol[0];
          while(msgg[i]!='-')
          {
          rez+=msgg[i];
          i++;
        }
        }
        if(rez.length>5)
        {
            hm=rez;
        }
        if(tmp.length>5)
          {
         
          try
          {
          var kek = Buffer.from(hm, 'base64').toString('utf8');
          var message = {};
          message.head = tmp;
          message.body = kek;
          myList[count]=message;
          count++;
          }
          catch
          {
            console.log('Это надо пропустить');
          }
          }
        });
      });
    });

    f.once('end', function() {
      console.log('Done fetching all messages!');
      gmail_massages=myList;//вот тут записываем в глобальную переменную считаные сообщения
     imap.end();
    });
  });
});

imap.connect();
}
