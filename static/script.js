'use strict';

 // Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
var firebaseConfig = {
  apiKey: "AIzaSyAl0Easa13-lCBzWypHaCa82sWqguCWqNs",
  authDomain: "deepquant-fdc0e.firebaseapp.com",
  databaseURL: "https://deepquant-fdc0e.firebaseio.com",
  projectId: "deepquant-fdc0e",
  storageBucket: "deepquant-fdc0e.appspot.com",
  messagingSenderId: "603615433658",
  appId: "1:603615433658:web:36b388b4f8e1914b814383",
  measurementId: "G-5WV6GCSVM1"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

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
    firebase.auth().signOut();
  };

  // FirebaseUI config.
  var uiConfig = {
      signInSuccessUrl: '/',
      signInOptions: [
      // Comment out any lines corresponding to providers you did not check in
      // the Firebase console.
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      //firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      //firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      //firebase.auth.GithubAuthProvider.PROVIDER_ID,
      //firebase.auth.PhoneAuthProvider.PROVIDER_ID

    ],
    // Terms of service url.
    tosUrl: '<your-tos-url>'
  };

  firebase.auth().onAuthStateChanged(function (user) {

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    
    if ( user ) {
      // User is signed in, so display the "sign out" button and login info.
      
        document.getElementById('sign-out').hidden = false;
        document.getElementById('login-info').hidden = false;
      
        user.getIdToken().then(function (token) {
        // Add the token to the browser's cookies. The server will then be
        // able to verify the token against the API.
        // SECURITY NOTE: As cookies can easily be modified, only put the
        // token (which is verified server-side) in a cookie; do not add other
        // user information.
        document.cookie = "token=" + token;
        if ( !urlParams.has( "flag" ) ) {
          document.location.href = "/login?flag=yes";
        }
      });
    } else {
      // User is signed out.
      // Initialize the FirebaseUI Widget using Firebase.
      var ui = new firebaseui.auth.AuthUI(firebase.auth());
      // Show the Firebase login button.
      ui.start('#firebaseui-auth-container', uiConfig);
      // Update the login state indicators.
      
      document.getElementById('sign-out').hidden = true;
      document.getElementById('login-info').hidden = true;
      
      // Clear the token cookie.
      document.cookie = "token=";
    }
  }, function (error) {
    console.log(error);
    alert('Unable to log in: ' + error)
  });
});

