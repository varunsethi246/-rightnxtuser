

ServiceConfiguration.configurations.remove({
    service: "facebook"
});

ServiceConfiguration.configurations.upsert({
  service: "facebook"
}, {
  $set: {
    appId: '288260801708620',
    loginStyle: "popup",
    secret: '4e11e10e3d070c0b8ad07aeef3e6711f'
  }
});
ServiceConfiguration.configurations.remove({
    service: "google"
});

ServiceConfiguration.configurations.insert({
	service: "google",
	clientId: "444930413096-44jp839bttpt711j51qg17kjsetcpj5t.apps.googleusercontent.com",
	// loginStyle: "popup",
	secret: "XHtrDzVcvDbb5E3GJX8i5a-9"
});

if(Meteor.isServer){
  Meteor.methods({
    getFriends:function(){
      var user = Meteor.user();
      // console.log(user);
      var Friends;
      if (user && user.services && user.services.facebook && !Friends){
        Friends = FacebookCollections.getFriends("me",["id","name"],100);
        // console.log('Friends: '+Friends);
      }
    }
  });
}

// var opts= { email: Meteor.user().services.google.email,
//               consumerKey: "582531225070-bh7eoha4tr4fu1ohucqmlocbjgvos5a6.apps.googleusercontent.com",
//               consumerSecret: "zAWVcm7AgzERci_5DWxMGKvj",
//               token: Meteor.user().services.google.accessToken,
//               refreshToken: Meteor.user().services.google.refreshToken};

//             gcontacts = new GoogleContacts(opts);

//             gcontacts.refreshAccessToken(opts.refreshToken, function (err, accessToken)
//              {
//                 if(err)
//                 {
//                     console.log ('gcontact.refreshToken, ', err);
//                     return false;
//                 }
//                 else
//                 {
//                     console.log ('gcontact.access token success!');
//                     gcontacts.token = accessToken;
//                     gcontacts.getContacts(function(err, contact) 
//                     {
//                                   //here i am able to access all contacts
//                       console.log(contact);
//                     })

//                 }
//              });