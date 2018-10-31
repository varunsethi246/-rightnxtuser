App.info({
  name: 'rightnxt',
  version: "1.10.0", 
  author: 'iAssure IT',
  email: 'rightnxt123@gmail.com',
  website: 'https://rightnxt.com'
});

App.setPreference('loadUrlTimeoutValue', '700000', 'android');
App.accessRule('*://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/*');
// App.accessRule('*');
App.accessRule('https://*.googleapis.com/*');
App.accessRule('https://*.google.com/*');
App.accessRule('https://*.gstatic.com/*');
App.accessRule('blob:*',{type: 'intent'});
App.accessRule('polyblob:*',{type: 'intent'});
App.accessRule('https://rightnxt.com', { type: 'navigation' });
App.accessRule('https:*');
// App.accessRule('https://s3.us-east-2.amazonaws.com/rightnxt1/BannerVideo/n9a6JFjfWRTtDmM9X-original.mp4');
// App.launchScreens({
//   'android_mdpi_portrait': 'splashscreen/320.png',
// });
// App.icons({
//   'android_mdpi': 'splashscreen/48.png',
//   'android_hdpi': 'splashscreen/72.png',
//   'android_xhdpi': 'splashscreen/96.png',
//   'android_xxhdpi': 'splashscreen/144.png',
//   'android_xxxhdpi': 'splashscreen/192.png',
// });