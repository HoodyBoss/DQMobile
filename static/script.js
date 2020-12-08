'use strict';

function getCookie(name) {
  var dc = document.cookie;
  var prefix = name + "=";
  var begin = dc.indexOf("; " + prefix);
  if (begin == -1) {
      begin = dc.indexOf(prefix);
      if (begin != 0) return null;
  }
  else
  {
      begin += 2;
      var end = document.cookie.indexOf(";", begin);
      if (end == -1) {
      end = dc.length;
      }
  }
  // because unescape has been deprecated, replaced with decodeURI
  //return unescape(dc.substring(begin + prefix.length, end));
  return decodeURI(dc.substring(begin + prefix.length, end));
}

window.addEventListener('load', function () {
  document.getElementById('sign-out').onclick = function () {
    firebase.auth().signOut().then(function(){ 
      deleteAllCookies();
      document.location.href = "/logout?logout=true";
    }).catch(function(error) {
      // An error happened.
    });
  };

  document.getElementById('sign-out-x').onclick = function () {
    firebase.auth().signOut().then(function(){ 
      deleteAllCookies();
      document.location.href = "/logout?logout=true";
    }).catch(function(error) {
      // An error happened.
    });
  };

});

const app = new Vue({
  el: '#app',
  data: {
    message: 'Ahoy Vue!'
  }
})

function signout(){
  firebase.auth().signOut().then(function(){ 
    deleteAllCookies();
    document.location.href = "/logout?logout=true";
  }).catch(function(error) {
    // An error happened.
  });
  
}


function redirect( uri ){
  document.location.href = "/redirect?dest_uri="+uri;
}

function deleteAllCookies() {
  var cookies = document.cookie.split(";");

  for (var i = 0; i < cookies.length; i++) {
      var cookie = cookies[i];
      var eqPos = cookie.indexOf("=");
      var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
  }
}