import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/', {
    name: 'Home Page',
    waitOn(params) {        
        return [ 
              // Meteor.subscribe('notificationTemplate'),
              // Meteor.subscribe('notification'),
              // Meteor.subscribe('area'),
              // Meteor.subscribe('categories'),
              // Meteor.subscribe('userfunction'),   
              // Meteor.subscribe('userRole'),
              // Meteor.subscribe('allCity'),
              // Meteor.subscribe('currentuser'),
              // Meteor.subscribe('homeBannerVideo'),
              // Meteor.subscribe('getBizVideoBanner'),  
        ];   
    },
    action: function() {
        // console.log('loading');
        HomepageFunc();
    }
});


FlowRouter.route('/profileSetting', {
    name:'Profile Setting',
    waitOn(params) {        
        return [ 
                    // Meteor.subscribe('userProfile'),
                    // Meteor.subscribe('userProfileS3'), 
                    // Meteor.subscribe('businessImgS3'), 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('currentuser'),  
                    Meteor.subscribe('vendorImage',Meteor.userId()),  
                    Meteor.subscribe('adminfunction'),  
                ];   
    },
    action: function() {
        // BlazeLayout.render("profileSettingLayout", {profileSettings:"profileSetting"} );
        profileSettingFunc();
    }
});

FlowRouter.route('/editProfile', {
    name:'Edit Profile',
    waitOn(params) {
        return [ 
                    // Meteor.subscribe('userProfileS3'),  
                    // Meteor.subscribe('businessImgS3'), 
                    Meteor.subscribe('allStates'), 
                    Meteor.subscribe('allCity'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('currentuser'),  
                    Meteor.subscribe('vendorImage',Meteor.userId()),  
                ];   
    },
    action: function() {
        // BlazeLayout.render("profileSettingLayout", {profileSettings:"editProfile"} );
        editProfileFunc();
    }
});

FlowRouter.route('/viewNotification', {
    name: 'ViewAllNotification',
     waitOn(params) {        
        return [ 
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,
                    // Meteor.subscribe('userProfileS3'),
                    // Meteor.subscribe('currentuser'),
                     
                    Meteor.subscribe('followUser'),  
                    Meteor.subscribe('userBusinessLikes',Meteor.userId()),
                    Meteor.subscribe('userBookmark',Meteor.userId()),
                    Meteor.subscribe('userBeenThere',Meteor.userId()),  
                    // Meteor.subscribe('businessImgS3'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('allSavedOffer'), 
                    Meteor.subscribe('reviewUser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('allCity'),
                    Meteor.subscribe('vendorBusiness'), 

                    Meteor.subscribe('LikesCount',Meteor.userId()),
                    Meteor.subscribe('ReviewsCount',Meteor.userId()),
                    Meteor.subscribe('beenThereCount',Meteor.userId()), 
                    Meteor.subscribe('bookmarkCount',Meteor.userId()),
                    Meteor.subscribe('enquiryCount',Meteor.userId()),
                    Meteor.subscribe('ReviewsPhotoCount',Meteor.userId()),
                    Meteor.subscribe('saveOfferCount',Meteor.userId()),
                    Meteor.subscribe('followeringCount',Meteor.userId()), 
                ];   
    },

    action: function() {
        // console.log('in function');
        ViewAdminNotifsFunc();

    }
});
FlowRouter.route('/notificationConfiguration', {
    name: 'notificationConfig',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('area'),
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'), 
                    Meteor.subscribe('vendorImage',Meteor.userId()), 
                    // Meteor.subscribe('rolefunction'), 
                    // Meteor.subscribe('userProfileS3'), 
                    // Meteor.subscribe('businessImgS3'),  
                    // Meteor.subscribe('allCity'),
               ];   
    },
    action: function() {
        // BlazeLayout.render("profileSettingLayout", {profileSettings:'notificationConfig'});
        notificationConfigFunc()
    }
});

FlowRouter.route('/UMonetimeSignup', {
    name: 'UMonetimeSignup',
    action: function() {

        UMregisterFunc();
    }
});

FlowRouter.route('/LoginOTP', {
    name: 'Login OTP',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('UserInfoForOTP'),
               ];   
    }, 
    action: function() {

        LoginOTPFunc();
    }
});


FlowRouter.route('/vendorpage', {
    name: 'vendor Page',
    action: function() {
        BlazeLayout.render("vendorpage");
    }
});

FlowRouter.route('/vendorLoginForm', {
    action: function() {
        VenderLoginFormFunc();
    }
});

FlowRouter.route('/vendorSignUpForm', {
    action: function() {
        vendorSignUpForm();
    }
});

FlowRouter.route( '/verify-email/:token', {
  name: 'verify-email',
  action( params ) {
    Accounts.verifyEmail( params.token, ( error ) =>{
      if ( error ) {
        Bert.alert( error.reason, 'danger' );
      } else {
        var loggedInUser = Meteor.userId();
        if(loggedInUser){
            FlowRouter.go('/');
            Meteor.call('sendWelcomeMail',
             function(error, result){
                if(error){
                    console.log("Error is" +error.reason);
                }else{
                    Bert.alert( 'Welcome to RightNxt!!!!', 'success', 'growl-top-right' );
                }
            });           
        }
      }
    });
  }
});




FlowRouter.route('/comingSoon', {
    name: 'coming soon',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('vendorImage',Meteor.userId()),
                    // Meteor.subscribe('businessImgS3'),  
                    // Meteor.subscribe('userProfileS3'), 
               ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "comingSoon"});
        comingSoonFunc();

    }
});


FlowRouter.route('/privacy-policy', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,                
                ];   

    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "privacyPolicy"});
        privacyPolicyFunc();
    }
});


FlowRouter.route('/terms-of-service', {
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'),
                    Meteor.subscribe('userProfileS3'),   
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,               
                ];   
    },
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "termsOfService"});
        termsOfServiceFunc();
    }
});


FlowRouter.route('/merchant-guidelines', {
    waitOn(params) { 
        console.log(params);       
        return [ 
                    Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('area'),
                    Meteor.subscribe('generalContent'), 
                    Meteor.subscribe('userProfileS3'),  
                    Meteor.subscribe('notification'),
                    // Meteor.subscribe('userfunction'),
                    Meteor.subscribe('notificationTemplate') ,      
                ];   
    },  
    action: function() {
        // BlazeLayout.render("generalLayout", {generalcontent: "merchantGuidelines"});
        merchantGuidelinesFunc();
    }
});


FlowRouter.route('/:businessurl', {
    name: 'Business Page',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('adminfunction'),
                    Meteor.subscribe('notificationTemplate'),
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('currentuser'),
                    Meteor.subscribe('area'),
                    Meteor.subscribe('oneBusiness',params.businessurl), 
                    Meteor.subscribe('businessImage'),
                    Meteor.subscribe('businessMenuImage'),
                    Meteor.subscribe('businessOfferImage'),
                    Meteor.subscribe('allvendorImage'),
                    Meteor.subscribe('ownerImage'),
                    Meteor.subscribe('reviewImage'),
                    Meteor.subscribe('getBizVideo'),
                    Meteor.subscribe('review',params.businessurl),
                    Meteor.subscribe('businessOffers',params.businessurl),
                    Meteor.subscribe('bookmark',params.businessurl),
                    Meteor.subscribe('beenThere',params.businessurl),
                    Meteor.subscribe('savedOffer',params.businessurl),
                    Meteor.subscribe('imageComment',params.businessurl), 
                    Meteor.subscribe('imageCommentLike',params.businessurl),                    
                    Meteor.subscribe('businessLikes',params.businessurl), 
                    Meteor.subscribe('reviewCommentLikes',params.businessurl),
                    Meteor.subscribe('busImageLikesCount',params.businessurl),
                    Meteor.subscribe('bussImgLikes'),
                    Meteor.subscribe('followUser'),
                    Meteor.subscribe('vendorBusinessEnquiry'),
                    Meteor.subscribe('businessEnquiryImage'),
                    // Meteor.subscribe('allSavedOffer'),
                    // Meteor.subscribe('allBusinesses'),
                    // Meteor.subscribe('vendorBusinessEnquiry'),
                    // Meteor.subscribe('allpayment'),
                    // Meteor.subscribe('allreviews'),
                    // Meteor.subscribe('offers'),
                    // Meteor.subscribe('allStatistics'),
                    // Meteor.subscribe('reviewCount'),
                    // Meteor.subscribe('vendorImage'),
                    // Meteor.subscribe('followerCounts'),
                    // Meteor.subscribe('vendorBusiness'),
                    // Meteor.subscribe('userReviewS3',params.businessurl),
                    // Meteor.subscribe('userReviewS3'),
                    // Meteor.subscribe('offerImagesS3'),
                    // Meteor.subscribe('businessImgS3'),
                    // Meteor.subscribe('enquiryImgS3'),
                    // Meteor.subscribe('userReviewS3'),
                    // Meteor.subscribe('userProfileS3'),
                    // Meteor.subscribe('businessMenu'),
                    // Meteor.subscribe('businessVideo'), 
                    // Meteor.subscribe('review'),
               ];   
    }, 
    // subscriptions: function(params, queryParams) {
    //     // using Fast Render
        
    // },
    action: function() {
        // console.log('on business page');
        // BlazeLayout.render("vendorBusinessLayout");
        vendorBusinessLayoutFunc();
    }
});

FlowRouter.route('/reset-password/:token', {
    name: 'resetpassword',
    waitOn(params) {        
        return [ 
                    // Meteor.subscribe('userfunction'),
                    // Meteor.subscribe('notification'),
                    // Meteor.subscribe('notificationTemplate') ,

                ];   
    },

    action: function() {
        console.log('in resetpassword');

        ResetPasswordFunc();
    }
});





// FlowRouter.route('/viewNotifications', {
//     name: 'ViewAllNotification-admin',
//      waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('followUser'),  
//                     Meteor.subscribe('userBusinessLikes',Meteor.userId()),
//                     Meteor.subscribe('userBookmark',Meteor.userId()),
//                     Meteor.subscribe('userBeenThere',Meteor.userId()),  
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('vendorBusinessEnquiry'),
//                     Meteor.subscribe('allSavedOffer'), 
//                     Meteor.subscribe('reviewUser'),
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('vendorBusiness'),  
//                 ];   
//     },

//     action: function() {
//         ViewAllNotifFuncs();

//     }
// });

FlowRouter.route('/search/:city/:area/:category/:searchText', {
   name: 'Business List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'),  
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('adminfunction'), 
                    Meteor.subscribe('allBusinessAds'), 
                    Meteor.subscribe('businessListSearch'),  
                    Meteor.subscribe('offersListSearch'),
                    Meteor.subscribe('businessListReview'),
                    // Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('businessEnquiryCount'),
                    Meteor.subscribe('areaListSearch'),
                    Meteor.subscribe('categoriesListSearch'),  
                    // Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('allbusinessBanner'), 
                    Meteor.subscribe('allBusinesses'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('offers'),
                   
               ];   
    }, 
    action: function() {
        // console.log('fdsaa');
        // BlazeLayout.render("businessList");
        businessListFunc();
    }
});

FlowRouter.route('/search/:city/:area/:searchText', {
    name: 'Business List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'),  
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'), 
                    Meteor.subscribe('adminfunction'), 
                    Meteor.subscribe('allBusinessAds'), 
                    Meteor.subscribe('businessListSearch'),  
                    Meteor.subscribe('offersListSearch'),
                    Meteor.subscribe('businessListReview'),
                    // Meteor.subscribe('userProfileS3'), 
                    Meteor.subscribe('businessEnquiryCount'),
                    Meteor.subscribe('areaListSearch'),
                    Meteor.subscribe('categoriesListSearch'),  
                    // Meteor.subscribe('businessImgS3'),  
                    Meteor.subscribe('allbusinessBanner'), 
                    Meteor.subscribe('allBusinesses'),
                    Meteor.subscribe('categories'),
                    Meteor.subscribe('offers'),

               ];   
    }, 
    action: function() {
        // console.log('fdsaa');
        // BlazeLayout.render("businessList");
        businessListFunc();
    }
});
FlowRouter.route('/search/:city/:area', {
    name: 'Business List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'), 
                    // Meteor.subscribe('currentuser'),  
                    Meteor.subscribe('userfunction'),  
                    // Meteor.subscribe('adminfunction'), 
                    Meteor.subscribe('allBusinessAds'), 
                    Meteor.subscribe('businessListSearch'),  
                    Meteor.subscribe('offersListSearch'),
                    Meteor.subscribe('businessListReview'),
                    Meteor.subscribe('businessEnquiryCount'),
                    Meteor.subscribe('areaListSearch'),
                    Meteor.subscribe('categoriesListSearch'),  
                    Meteor.subscribe('allbusinessBanner'),
                    Meteor.subscribe('allBusinesses'),
                    Meteor.subscribe('offers'),

                    // Meteor.subscribe('userProfileS3'), 
                    // Meteor.subscribe('businessImgS3'), 
               ];   
    }, 
    action: function() {
        // console.log('hello');
        // BlazeLayout.render("businessList");
        businessListFunc();
    }
});


// // FlowRouter.route('/searchMap/:city/:area/:category/:searchText/:currentMap', {
// //     name: 'Business List',
// //     subscriptions: function(params, queryParams) {
// //         this.register('userfunction', Meteor.subscribe('userfunction'));  
// //         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
// //         this.register('notification', Meteor.subscribe('notification')); 
// //         this.register('adminfunction', Meteor.subscribe('adminfunction')); 
// //         this.register('allBusinessAds', Meteor.subscribe('allBusinessAds')); 
// //         this.register('businessListSearch', Meteor.subscribe('businessListSearch'));  
// //         this.register('offersListSearch', Meteor.subscribe('offersListSearch'));
// //         this.register('businessListReview', Meteor.subscribe('businessListReview'));
// //         this.register('userProfileS3', Meteor.subscribe('userProfileS3')); 
// //         this.register('businessEnquiryCount', Meteor.subscribe('businessEnquiryCount'));
// //         this.register('areaListSearch', Meteor.subscribe('areaListSearch'));
// //         this.register('categoriesListSearch', Meteor.subscribe('categoriesListSearch'));  
// //         this.register('businessImgS3', Meteor.subscribe('businessImgS3'));  
// //         this.register('allbusinessBanner', Meteor.subscribe('allbusinessBanner')); 
        
// //      },
// //     action: function() {
// //         BlazeLayout.render("businessList");
// //     }
// // });

FlowRouter.route('/searchMap/:city/:area/:searchText/:currentMap', {
    name: 'Business List',
    waitOn(params) {        
        return [ 
                    Meteor.subscribe('userfunction'), 
                    Meteor.subscribe('notificationTemplate') ,
                    Meteor.subscribe('notification'),
                    Meteor.subscribe('adminfunction'),
                    Meteor.subscribe('allBusinessAds'),
                    Meteor.subscribe('businessListSearch'), 
                    Meteor.subscribe('offersListSearch'),
                    Meteor.subscribe('businessListReview'),
                    Meteor.subscribe('userProfileS3'),
                    Meteor.subscribe('businessEnquiryCount'),
                    Meteor.subscribe('areaListSearch'),
                    Meteor.subscribe('categoriesListSearch'), 
                    Meteor.subscribe('businessImgS3'), 
                    Meteor.subscribe('allbusinessBanner'),
                    Meteor.subscribe('offers'),
                    
               ];   
    }, 
    
    action: function() {
        // console.log('hi');
        // BlazeLayout.render("businessList");
        businessListFunc();

    }
});

// // FlowRouter.route('/searchMap/:city/:area/:searchText/:currentMap', {
// //     name: 'Business List',
// //     subscriptions: function(params, queryParams) {
// //         this.register('userfunction', Meteor.subscribe('userfunction'));  
// //         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
// //         this.register('notification', Meteor.subscribe('notification')); 
// //         this.register('adminfunction', Meteor.subscribe('adminfunction')); 
// //         this.register('allBusinessAds', Meteor.subscribe('allBusinessAds')); 
// //         this.register('businessListSearch', Meteor.subscribe('businessListSearch'));  
// //         this.register('offersListSearch', Meteor.subscribe('offersListSearch'));
// //         this.register('businessListReview', Meteor.subscribe('businessListReview'));
// //         this.register('userProfileS3', Meteor.subscribe('userProfileS3')); 
// //         this.register('businessEnquiryCount', Meteor.subscribe('businessEnquiryCount'));
// //         this.register('areaListSearch', Meteor.subscribe('areaListSearch'));
// //         this.register('categoriesListSearch', Meteor.subscribe('categoriesListSearch'));  
// //         this.register('businessImgS3', Meteor.subscribe('businessImgS3'));  
// //         this.register('allbusinessBanner', Meteor.subscribe('allbusinessBanner')); 
        
// //      },
// //     action: function() {
// //         BlazeLayout.render("businessList");
// //     }
// // });


// // FlowRouter.route('/businessList/:searchText', {
// //     name: 'Business List',
// //     subscriptions: function(params, queryParams) {
// //         this.register('business', Meteor.subscribe('vendorBusiness'));  
// //         this.register('enquiry', Meteor.subscribe('vendorBusinessEnquiry'));
// //         this.register('enquiryImgS3', Meteor.subscribe('enquiryImgS3'));
// //      },
// //     action: function() {
// //         BlazeLayout.render("businessList");
// //     }
// // });

// // FlowRouter.route('/businessMapView', {
// //      name: 'Business List',
// //     subscriptions: function(params, queryParams) {
// //         this.register('business', Meteor.subscribe('vendorBusiness'));  
// //         this.register('enquiry', Meteor.subscribe('vendorBusinessEnquiry'));
// //         this.register('enquiryImgS3', Meteor.subscribe('enquiryImgS3'));
// //         this.register('area', Meteor.subscribe('area'));
// //         this.register('review', Meteor.subscribe('reviewUser'));
// //     },
// //     action: function() {
// //         BlazeLayout.render("businessMapView");
// //     }
// // });