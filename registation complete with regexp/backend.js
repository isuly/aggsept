'use strict';

(function () {
  var URL_UPLOAD = 'https://jsonplaceholder.typicode.com/posts'; 



  function upLoadForm(data) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';

    xhr.addEventListener('load', onFormLoad);
    xhr.addEventListener('error', onFormUpLoadError);
    xhr.addEventListener('timeout', onFormUpLoadTimeOut);

    xhr.timeout = 5000;
    xhr.open('POST', URL_UPLOAD);
    xhr.send(data);

    function onFormLoad() {
      if (xhr.status === 200) {
        console.log("code 200")
      //  onLoad();
      } else {
        var errMessage = 'Ошибка загрузки объявления: ' + xhr.status; 
      }
    }

    function onFormUpLoadError() {
      var errMessage = 'Ошибка загрузки объявления: ' + xhr.status + '. Проверьте интернет-соединение'; 
    }

    function onFormUpLoadTimeOut() {
      var errMessage = 'Данные не успели загрузиться на сервер: ' + xhr.status; 
    }
  }

  window.backend = {
    upLoadForm: upLoadForm,\
  };
})();