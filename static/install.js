'use strict';

/*
importScripts('/cache-polyfill.js');

self.addEventListener('install', function(e) {
 e.waitUntil(
   caches.open('airhorner').then(function(cache) {
     return cache.addAll([
       '/',
       '/index.html',
       '/index.html?homescreen=1',
       '/?homescreen=1',
       '/styles/main.css',
       '/scripts/main.min.js',
       '/sounds/airhorn.mp3'
     ]);
   })
 );
});
*/

let deferredInstallPrompt = null;
const installButton = document.getElementById('butInstall');
if (installButton !== null) {
  installButton.addEventListener('click', installPWA);
}

window.addEventListener('beforeinstallprompt', saveBeforeInstallPromptEvent);

function saveBeforeInstallPromptEvent(evt) {
  deferredInstallPrompt = evt;
  if (installButton !== null) {
    installButton.removeAttribute('hidden');
  }
}

function installPWA(evt) {
  deferredInstallPrompt.prompt();
  if (installButton !== null) {
    installButton.setAttribute('hidden', true);
  }
  deferredInstallPrompt.userChoice
  .then((choice) => {
    if (choice.outcome === 'accepted') {
      console.log('User accepted the add to homescreen prompt', choice);
    } else {
      console.log('User dismissed the add to homescreen prompt', choice);
    }
    deferredInstallPrompt = null;
  });
}

window.addEventListener('appinstalled', logAppInstalled);

function logAppInstalled(evt) {
  console.log('App was installed.', evt);
}
