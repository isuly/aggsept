var imap;
var Imap;
var count=0;
Imap = require('imap'),
inspect = require('util').inspect;
//User = 'ebobo.ebobovich@yandex.com';
//Password = 'literatyra18';
//Host = "yandex.com";

module.exports.Connect = function(User, Password, Host)//передаем почту, пароль и хост
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
global.myList = new Array();
var count=0;

function openInbox(cb) {
  imap.openBox('INBOX', true, cb);
}
module.exports.Message = function()
{
imap.once('ready', function() {
  openInbox(function(err, box) {
    if (err) throw err;
    //console.log("You have messages in your INBOX: "+box.messages.total);
    var f = imap.seq.fetch(1+':'+box.messages.total, {
      bodies: ['HEADER','TEXT'],
      struct: true
    });
    f.on('message', function(msg, seqno) {
      //console.log('Message #%d', seqno);
      var prefix = '(#' + seqno + ') ';
      msg.on('body', function(stream, info) {
        var buffer = '';
        stream.on('data', function(chunk) {
          buffer += chunk.toString('utf8');
        });
        stream.once('end', function() {
          //console.log('++++++++++++++++++++++++++++++'+buffer);
          var tmp = inspect(Imap.parseHeader(buffer));
          var re = /(base64[^\>]*----ALT)/;
          var lol = buffer.match(re);//сооющение
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
          //var kek = Buffer.from(hm, 'base64').toString('utf8');
          var message = {};
          message.head = inspect(Imap.parseHeader(buffer).subject);
          //message.body = kek;
          //console.log(message.head);
         // console.log(message.body);
          myList[count]=message;
          count++;
          }
          catch
          {
            console.log('Это надо пропустить');
          }
        }
        else
        {
          try
          {
          var kek = Buffer.from(hm, 'base64').toString('utf8');
          //var message = {};
          //message.head = inspect(Imap.parseHeader(buffer).subject);
          //message.body = kek;
          //console.log(message.head);
          
          myList[count-1].body = kek;
          //console.log(myList[count-1].body);
          }
          catch
          {
            console.log('Это надо пропустить');
          }

        }
          //console.log('+++++++++++++++++'+buffer+'\r\n');
         /* var tmp = inspect(Imap.parseHeader(buffer));
          var re = /(base64[^\>]*----ALT)/;
          var lol = buffer.match(re);
          //console.log('+++++++++++++++++'+lol+'\r\n');
          var msgg;
          var rez='';
          var i = 10;
          if(tmp.toString().length>5)
          {
          //var message = {};
          message.head = inspect(Imap.parseHeader(buffer));
          console.log('Заголовок письма: '+'\r\n');
          console.log(inspect(Imap.parseHeader(buffer).from));
          console.log(inspect(Imap.parseHeader(buffer).to));
          console.log(inspect(Imap.parseHeader(buffer).subject)+'\r\n'+'\r\n');
          myList[count]=message;
          count++;
          }
          else
          {
          if(lol!=null)
         {
          msgg=lol[0];
          while(msgg[i]!='-')
          {
          //console.log('************************'+msgg[i]);
          rez+=msgg[i];
          i++;
        }
        //console.log('************************'+rez);
        }
       // console.log('1************************'+rez);
        if(rez.length>5)
        {
            hm=rez;
         //console.log('+++++++++++++++'+hm);
        }
        var kek = Buffer.from(hm, 'base64').toString('utf8');
        //console.log('+++++++++++++++++'+kek+'\r\n');
          //message.body = kek;
          myList[count-1].body = kek;
          //count++;
          console.log('Message: '+ myList[count-1].body+'\r\n');
          //console.log('+++++++++++++++++'+buffer+'\r\n');
          }
         */
       // });
      });
      msg.once('attributes', function(attrs) {
       // console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
      });
      msg.once('end', function() {
        //console.log(prefix + 'Finished');
      });
    });
    f.once('error', function(err) {
      console.log('Fetch error: ' + err);
    });
    f.once('end', function() {
      console.log('Done fetching all messages!');
      yandex_massages=myList;
      imap.end();
    });
  });
});
});
/*imap.once('error', function(err) {
  console.log(err);
});

imap.once('end', function() {
  console.log('Connection ended');
});*/

imap.connect();
}

