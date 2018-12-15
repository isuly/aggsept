var link = document.querySelector(".container li:nth-child(2)");
var popup = document.querySelector(".modal");
var close = document.querySelector(".invisible");

link.addEventListener("click", function(evt)
{
evt.preventDefault();
popup.classList.add('modal-show');
});

close.addEventListener("click", function(evt)
{
evt.preventDefault();
popup.classList.remove('modal-show'); 
});
