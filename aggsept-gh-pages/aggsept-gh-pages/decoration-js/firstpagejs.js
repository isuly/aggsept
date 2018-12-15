var reglink = document.querySelector(".reg-link")
var signinlink = document.querySelector(".signin-link")
var registration = document.querySelector(".registration")
var signin = document.querySelector(".signin")

reglink.addEventListener("click", function(evt)
{
evt.preventDefault();
registration.classList.add('show');
signin.classList.add('hide');
});

signinlink.addEventListener("click", function(evt)
{
evt.preventDefault();
signin.classList.remove('hide');
registration.classList.remove('show');
});
