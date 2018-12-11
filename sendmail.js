var nodemailer = require('nodemailer');


module.exports.MailSend = function(Service, From, To, Subject, Text, Password)
{
  Service = 'mail.ru';
  From = 'isulyshka@mail.ru';
Password = 'literatyra';
To = 'isulyshka@mail.ru';
Subject = 'тестовая отправка2';
Text = 'тестовое сообщение2';

var transporter = nodemailer.createTransport({
  service: Service,
  auth: {
    user: From,
    pass: Password
  }
});

var mailOptions = {
  from: From,
  to: To,
  subject: Subject,
  text: Text
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});
}