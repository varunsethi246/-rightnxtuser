import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

FlowRouter.route('/contactUs', {
    name: 'contactUs',
    action: function() {
        contactUsFunc();
    }
});

FlowRouter.route('/career', {
    name: 'career',
    action: function() {
        careerFunc();
    }
});

FlowRouter.route('/about', {
    action: function() {
        aboutUsFunc();
    }
});

FlowRouter.route('/claim/:city', {
    name: 'claim',
    waitOn(params) {        
        return [ 
            Meteor.subscribe('notificationTemplate') ,  
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('allCity'),
            Meteor.subscribe('vendorBusiness'), 
            Meteor.subscribe('vendorImage',Meteor.userId()),
       ];   
    },
    action: function() {
        claimFunc();
    }
});

FlowRouter.route('/claim', {
    name: 'claim',
    waitOn(params) {        
        return [ 
            Meteor.subscribe('notificationTemplate') ,  
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('allCity'),
            Meteor.subscribe('vendorBusiness'), 
            Meteor.subscribe('vendorImage',Meteor.userId()), 
       ];   
    },
    action: function() {
        claimFunc();
    }
});

FlowRouter.route('/userProfile',{
    name:'userProfile',
    waitOn(params) {   
        var id = Meteor.userId();      
        return [ 
            Meteor.subscribe('notificationTemplate'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'), 
            Meteor.subscribe('userfunction'), 
            Meteor.subscribe('area'),
            Meteor.subscribe('allvendorImage'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('allreviews'),
            Meteor.subscribe('configSettings'), 
            Meteor.subscribe('reviewCommLikes'),
            Meteor.subscribe('followUser'),

            // count
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
    action(){
        userTimelinePageFunc();
        var url = FlowRouter.current().path;
        var checkIdExists = url.split('/');
        if(checkIdExists.length<2){
            Session.set("updateUserTimeline",true);
        }else{
            Session.set("updateUserTimeline",false);
        }
    }
});

FlowRouter.route('/userLike',{
 name:'userLike',
 waitOn(params) { 
        var id = Meteor.userId();       
        return [ 
            Meteor.subscribe('notificationTemplate'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('userBusinessLikes',id),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'), 
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),   
        ];   
    }, 
 action(){
  userLikeFunc();
 }
});

FlowRouter.route('/userLike/:userName',{
 name:'userLike',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('userData',id),
            Meteor.subscribe('area'),
            Meteor.subscribe('vendorImage'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('userBusinessLikes',id),
            Meteor.subscribe('vendorBusiness'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),    
        ];   
    }, 
    action(){
      userLikeFunc();
    }
});


FlowRouter.route('/userReview', {
    name:'User Review',
    waitOn(params) {
        var id = Meteor.userId();        
        return [ 
            Meteor.subscribe('notificationTemplate'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('userfunction'), 
            Meteor.subscribe('area'),
            Meteor.subscribe('allvendorImage'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('allreviews'),
            Meteor.subscribe('followUser'),  
            Meteor.subscribe('reviewCommLikes'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),      
        ];   
    },
    action: function() {
        userReviewPageFunc();
    }
});

FlowRouter.route('/userReview/:userName', {
    name:'User Review',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }        
        return [ 
            Meteor.subscribe('notificationTemplate'),
            Meteor.subscribe('notification'),
            Meteor.subscribe('userfunction'), 
            Meteor.subscribe('area'),
            Meteor.subscribe('allvendorImage'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('allreviews'),
            Meteor.subscribe('followUser'),  
            Meteor.subscribe('reviewCommLikes'),  
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id), 
        ];   
    },
    action: function() {
        userReviewPageFunc();
    }
});


FlowRouter.route('/userPhotos', {
    name:'User Photos',
    waitOn(params) {   
        var id = Meteor.userId();     
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('reviewUser'),
            Meteor.subscribe('userImgLikes'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id), 
        ];   
    },
    action: function() {
        userPhotosFunc();
    }
});

FlowRouter.route('/userPhotos/:userName', {
    name:'User Photos',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }               
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('userData',id),
            Meteor.subscribe('area'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('allreviews'),
            Meteor.subscribe('userImgLikes'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),  
        ];   
    },
    action: function() {
        userPhotosFunc();
    }
});

FlowRouter.route('/userFollowers', {
    name:'User Followers',
    waitOn(params) {        
        var id = Meteor.userId();
        return [ 
            Meteor.subscribe('notificationTemplate') , 
            Meteor.subscribe('notification'), 
            Meteor.subscribe('userfunction'),  
            Meteor.subscribe('area'),
            Meteor.subscribe('allvendorImage'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('vendorBusiness'), 
            Meteor.subscribe('followUser'),  
            Meteor.subscribe('allreviews'),  
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id), 
            Meteor.subscribe('followerCount',id), 
        ];   
    },
    action: function() {
        userFollowersFunc();
    }
});

FlowRouter.route('/userFollowers/:userName', {
    name:'User Followers',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }              
        return [ 
            Meteor.subscribe('notificationTemplate') , 
            Meteor.subscribe('notification'), 
            Meteor.subscribe('userfunction'),  
            Meteor.subscribe('area'),
            Meteor.subscribe('allvendorImage'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('vendorBusiness'), 
            Meteor.subscribe('followUser'),  
            Meteor.subscribe('allreviews'),  
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id), 
            Meteor.subscribe('followerCount',id),    
        ];   
    },
    
    action: function() {
        userFollowersFunc();
    }
});

FlowRouter.route('/userBookmarks', {
    name:'User Bookmarks',
    waitOn(params) {        
        var id = Meteor.userId();
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('userBookmark',id),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorBusiness'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),     
        ];   
    },
    action: function() {
        userBookmarksFunc();
    }
});

FlowRouter.route('/userBookmarks/:userName', {
    name:'User Bookmarks',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }         
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('userData',id),
            Meteor.subscribe('area'),
            Meteor.subscribe('userBookmark',id),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorBusiness'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),      
        ];   
    },
    action: function() {
        userBookmarksFunc();
    }
});

FlowRouter.route('/userBeenThere', {
    name:'User Been There',
    waitOn(params) {        
        var id = Meteor.userId();
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('userBeenThere',id),
            Meteor.subscribe('vendorBusiness'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),      
        ];   
    },
    action: function() {
        userBeenThereFunc();
    }
});

FlowRouter.route('/userBeenThere/:userName', {
    name:'User Been There',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }                
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('userData',id),
            Meteor.subscribe('area'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('userBeenThere',id),
            Meteor.subscribe('vendorBusiness'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),      
        ];   
    },
    action: function() {
        userBeenThereFunc();
    }
});

FlowRouter.route('/userRatings', {
    name:'User Ratings',
    waitOn(params) {        
        var id = Meteor.userId();
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('currentUserReviews',id),
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),         
        ];   
    },
    action: function() {
        userRatingsFunc();
    }
});

FlowRouter.route('/userRatings/:userName', {
    name:'User Ratings',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }                
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'),
            Meteor.subscribe('userData',id),
            Meteor.subscribe('area'),
            Meteor.subscribe('currentUserReviews',id),
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),      
        ];   
    },
    action: function() {
        userRatingsFunc();
    }
});

FlowRouter.route('/userOffers', {
    name:'User Offers',
    waitOn(params) {        
        var id = Meteor.userId();
        return [ 
            Meteor.subscribe('notificationTemplate') , 
            Meteor.subscribe('notification'),
            Meteor.subscribe('currentuser'),
            Meteor.subscribe('area'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessOfferImage'),
            Meteor.subscribe('userOffer',id), 
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('offers'),
            Meteor.subscribe('adminfunction'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),          
        ];   
    },
    action: function() {
        userOffersFunc();
    }
});

FlowRouter.route('/userOffers/:userName', {
    name:'User Offers',
    waitOn(params,queryParams) {  
        if(queryParams){
            var id = queryParams.id;
        }else{
            var id = Meteor.userId();
        }                
        return [ 
            Meteor.subscribe('notificationTemplate') , 
            Meteor.subscribe('notification'),
            Meteor.subscribe('userData',id),
            Meteor.subscribe('area'),
            Meteor.subscribe('vendorImage',id),
            Meteor.subscribe('businessOfferImage'),
            Meteor.subscribe('userOffer',id), 
            Meteor.subscribe('vendorBusiness'),
            Meteor.subscribe('offers'),
            Meteor.subscribe('adminfunction'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),          
        ];   
    },
    action: function() {
        userOffersFunc();
    }
});

FlowRouter.route('/userEnquiry', {
    name:'User Enquiry',
    waitOn(params) {
        var id = Meteor.userId();        
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'), 
            Meteor.subscribe('currentuser'),  
            Meteor.subscribe('area'),
            Meteor.subscribe('allvendorImage'),
            Meteor.subscribe('businessImage'),
            Meteor.subscribe('reviewImage'),
            Meteor.subscribe('businessEnquiryImage'),
            Meteor.subscribe('userEnquiry'),
            Meteor.subscribe('vendorBusiness'), 
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),    
        ];   
    },
    action: function() {
        userEnquiryPageFunc();
    }
});


function activateSidebarLink(){
    var currentURL = FlowRouter.current().path;
    var actualURL = currentURL.substring(1);
    $('.sidebarlink').removeClass('active');
    $('.'+actualURL).addClass('active');
}

FlowRouter.route('/findYourFriends',{
 name:'findYourFriends',
    waitOn(params,queryParams) {  
        var id = Meteor.userId();
        return [ 
            Meteor.subscribe('notificationTemplate') ,
            Meteor.subscribe('notification'), 
            Meteor.subscribe('area'),
            Meteor.subscribe('userfunction'),  
            Meteor.subscribe('followUser'),  
            Meteor.subscribe('allreviews'), 
            Meteor.subscribe('allvendorImage'),
            // count
            Meteor.subscribe('LikesCount',id),
            Meteor.subscribe('ReviewsCount',id),
            Meteor.subscribe('beenThereCount',id), 
            Meteor.subscribe('bookmarkCount',id),
            Meteor.subscribe('enquiryCount',id),
            Meteor.subscribe('ReviewsPhotoCount',id),
            Meteor.subscribe('saveOfferCount',id),
            Meteor.subscribe('followeringCount',id),     
        ];   
    }, 
    action(){
        findYourFriendsFunc();
    }
});

// === Admin ===  

// FlowRouter.route('/', {
//     name: 'Admin Home Page',
//     action: function() {
//         // console.log('loading');
//         AdminHomepageFunction();
//     }
// });

// FlowRouter.route('/adminDashboard', {
//     name: 'general Header',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                     Meteor.subscribe('noOfUserCount'),
//                     Meteor.subscribe('noOfVendorCount'),
//                     Meteor.subscribe('noOfBusinessInactive'),
//                     Meteor.subscribe('noOfBusinessActive'),
//                     Meteor.subscribe('noOfEnqWeek'),
//                     Meteor.subscribe('noOfEnqMonth'),
//                     Meteor.subscribe('noOfEnqYear'),
//                     Meteor.subscribe('noOfOfferWeek'),
//                     Meteor.subscribe('noOfofferYear'),
//                     Meteor.subscribe('noOfofferMonth'),
//                ];   
//     }, 
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "adminDashboard"});
//         adminDashboardFunc();
//     }
// });

// FlowRouter.route('/companySettings', {
//     name: 'company settings',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('tempLogoImage'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                ];   
//     }, 
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         BlazeLayout.render('adminLayout',{main: "companySettings"});
//         // companysettingsFunc();
//     }
// });

// FlowRouter.route('/jobList', {
//     name: 'Job Lists',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('newjob'),  
//                     Meteor.subscribe('allCity'),  
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'), 
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,    
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main: "jobList"});
//         jobListFunc();
//     }
// });

// FlowRouter.route('/joinUsForm', {
//     name: 'careerJoinUsForm',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('career'),
//                     Meteor.subscribe('newjob'),
//                     Meteor.subscribe('resumeS3'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
                    
//                 ];   
//     }, 
   
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "careerJoinUsForm"});
//         careerJoinUsFormFunc();
//     }
// });

// FlowRouter.route('/addNewJob', {
//     name: 'AddNewJobForm',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
     
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "AddNewJobForm"});
//         addNewJobFormFunc();
//     }
// });
// FlowRouter.route('/homePageBanner', {
//     name: 'homePageBanner',
//      waitOn(params) {        
//         return [ 
//                     // Meteor.subscribe('allCity'),
//                     // Meteor.subscribe('allStates'),
//                     // Meteor.subscribe('notification'),
//                     // Meteor.subscribe('userfunction'),
//                     // Meteor.subscribe('notificationTemplate'),
//                     // Meteor.subscribe('vendorBusiness'),
//                 ];   
//     }, 

//     triggersEnter : [activateSidebarLink],
//     action: function() {

//         homePageBannerFunc();
//     }
// });

// FlowRouter.route('/listOfUsers', {
//     name: 'listOfUsers',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('noOfUser'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "listofUser"});
//         listOfUsersFunc();
//     }
// });

// FlowRouter.route('/editMyProfile', {
//     name: 'Edit Profile',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "editMyProfileAdmin"});
//         editMyProfileAdminFunc();
//     }
// });

// FlowRouter.route('/BusinessBlkupload', {
//     name: 'Business Blkupload',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
   
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "businessBlkup"});
//         businessBlkupFunc()
//     }
// });

// FlowRouter.route('/editRoles', {
//     name: 'editRoles',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "adminAddRolesList"});
//         adminAddRolesListFunc();
//     }
// });

// FlowRouter.route('/businessbanners', {
//     name: 'Business Banners',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('noOfInvoiceCount'),
//                     Meteor.subscribe('allpayment'),
//                     Meteor.subscribe('position'),
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('allbusinessBanner'),
//                     Meteor.subscribe('discounts'),
//                     Meteor.subscribe('position'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     // meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
//     triggersEnter : [activateSidebarLink],     
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "businessBanner"});
//         businessBannerFunc();
//     }
// });

// FlowRouter.route('/businessbannersInvoice/:businessLink', {
//     name: 'Business Banners Invoice',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allpayment'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('allbusinessBanner'),
//                     Meteor.subscribe('discounts'),
//                     Meteor.subscribe('position'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "bannerInvoice"});
//         bannerInvoiceFunc();
//     }
// });

// FlowRouter.route('/businessBannerList', {
//     name: 'Business Banners List',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allpayment'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('allbusinessBanner'),
//                     Meteor.subscribe('discounts'),
//                     Meteor.subscribe('position'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     triggersEnter : [activateSidebarLink],     
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "businessBannerList"});
//         businessBannerListFunc();
//     }
// });

// FlowRouter.route('/businessAds', {
//     name: 'Business Ads',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('noOfInvoiceCount'),
//                     Meteor.subscribe('allpayment'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('allBusinessAds'),
//                     Meteor.subscribe('adsDiscount'),
//                     Meteor.subscribe('adsPosition'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },

//     triggersEnter : [activateSidebarLink],     
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "businessAds"});
//         businessAdsFunc();
//     }
// });

// FlowRouter.route('/businessAdsInvoice/:businessLink', {
//     name: 'Business Ads Invoice',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allpayment'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('allBusinessAds'),
//                     Meteor.subscribe('adsDiscount'),
//                     Meteor.subscribe('adsPosition'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
    
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "adsInvoice"});
//         adsInvoiceFunc();
//     }
// });

// FlowRouter.route('/businessAdsList', {
//     name: 'Business Ads List',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allpayment'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('companySettings'),
//                     Meteor.subscribe('allBusinessAds'),
//                     Meteor.subscribe('adsDiscount'),
//                     Meteor.subscribe('adsPosition'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "businessAdsList"});
//         businessAdsListFunc();
//     }
// });

// FlowRouter.route('/adsDiscountManagement', {
//     name: 'Ads Discount Management',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('adsDiscount'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'adsDiscountManagement'});
//         adsDiscountManagementFunc();
//     }
// });

// FlowRouter.route('/adsPositionManagement', {
//     name: 'Ads Position Management',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('adsPosition'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'adsPositionManagement'});
//         adsPositionManagementFunc();
//     }
// });

// FlowRouter.route('/manageLocations', {
//     name: 'Manage Locations',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     triggersEnter : [activateSidebarLink],     
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "manageLocations"});
//         manageLocationsFunc();
//     }
// });

// FlowRouter.route('/categoriesLevels', {
//     name: 'Categories Levels List',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     triggersEnter : [activateSidebarLink],     
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "manageCategoriesList"});
//         manageCategoriesListFunc();
//     },
//     triggersExit: [trackCatgLevelsLeft]
// });

// function trackCatgLevelsLeft(context){
//     console.log('left catg levels page');
//     Session.set('catgListLimit',10);
// }

// FlowRouter.route('/listOfBusiness', {
//     name: 'Categories Levels List',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('allBusinesses'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                     Meteor.subscribe('noOfBusiness'),
//                 ];   
//     },
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "listOfBusiness"});
//         listOfBusinessFunc();
//     }
// });

// FlowRouter.route('/editBusinessAdmin/:businessLink', {
//     name: 'Edit Business Admin',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('oneBusiness',params.businessLink),
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('businessVideo'),
//                     Meteor.subscribe('businessMenu'),
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('categories'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                     Meteor.subscribe('review'),
//                     Meteor.subscribe('review',params.businessLink),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "editBusinessAdmin"});
//         editBusinessAdminFunc();
//     }
// });

// FlowRouter.route('/addnewbusinessAdmin', {
//     name: 'addnewbusinessAdmin',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('vendorBusiness'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('userProfile'),
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "myBusinessAdmin"});
//         addNewBusInfoAdminFunc();
//     }
// });

// FlowRouter.route('/openingAndClosingDaysAdmin/:businessLink', {
//     name: 'vendor Header',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('oneBusiness',params.businessLink),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },

//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "openCloseDayAdmin"});
//         openCloseDayAdminFunc();
//     }
// });

// FlowRouter.route('/aboutOwnerAdmin/:businessLink', {
//     name: 'vendor Header',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('oneBusiness',params.businessLink),
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },

//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "aboutOwnerAdmin"});
//         aboutOwnerAdminFunc();
//     }
// });

// FlowRouter.route('/imagesAndVideosAdmin/:businessLink', {
//     name: 'vendor Header',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('oneBusiness',params.businessLink),
//                     Meteor.subscribe('businessImgS3'),
//                     Meteor.subscribe('businessVideo'),
//                     Meteor.subscribe('businessMenu'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render( 'adminLayout',{main: "addImagesVidAdmin"});
//         addImagesVidAdminFunc();
//     }
// });

// FlowRouter.route('/UMdeleteUserConfirm/:userId', {
//     name: 'Delete Confirm',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },

//     action: function() {
//         // BlazeLayout.render( 'adminLayout',{main: "UMdeleteUserConfirm"});
//         UMdeleteUserConfirmFunc();
//     }
// });

// FlowRouter.route('/createUser', {
//     name: 'Create User',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('configSettings'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },

//     triggersEnter : [activateSidebarLink],
//     action: function() {
//         // BlazeLayout.render( 'adminLayout',{main: "createUsers"});
//         createUsersFunc();
//     }
// });

// FlowRouter.route('/editUsersProfile/:userId', {
//     name: 'Edit My Profile',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('area'),
//                     Meteor.subscribe('allCity'),
//                     Meteor.subscribe('allStates'),
//                     Meteor.subscribe('configSettings'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate'),
//                     Meteor.subscribe('userData',params.userId),
//                 ];   
//     },

//     action: function() {
//         // BlazeLayout.render( 'adminLayout',{main: "editMyProfiles"});
//         editMyProfilesFunc();
//     }
// });

// FlowRouter.route('/contactUsList', {
//     name: 'contactUsList',
//      waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('contactUs'),
//                     Meteor.subscribe('noOfContactUs'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('notificationTemplate'),
//                 ];   
//     },

//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "contactUsList"});
//         contactUsListFunc();
//     }
// });

// FlowRouter.route('/configSettings', {
//     name: 'configSettings',
//     action: function() {
//         // BlazeLayout.render('configSettings');
//         configSettingsFunc();
//     }
// });

// function activateSidebarLink(){
//     var currentURL = FlowRouter.current().path;
//     var actualURL = currentURL.substring(1);
//     $('.sidebarlink').removeClass('active');
//     $('.'+actualURL).addClass('active');
// }



// FlowRouter.route('/AdSaleReport', {
//     name: 'contactUsList',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('contactUs'),  
//                     Meteor.subscribe('noOfContactUs'),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('allpayment'),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "salesReportTabs"});
//         salesTableViewFunc();
//     }
// });

// FlowRouter.route('/BannerSaleReport', {
//     name: 'contactUsList',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('contactUs'),  
//                     Meteor.subscribe('noOfContactUs'),  
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('allpayment'),
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render('adminLayout',{main: "salesReportTabsBanner"});
//         salesReportTabsBannerFunc();

//     }
// });

// // FlowRouter.route('/BannerSaleReport', {
// //     name: 'contactUsList',
    
// //     subscriptions: function(params, queryParams) {
// //         this.register('contactUs', Meteor.subscribe('contactUs'));  
// //         this.register('noOfContactUs', Meteor.subscribe('noOfContactUs'));  
// //         this.register('userfunction', Meteor.subscribe('userfunction'));  
// //         this.register('notification', Meteor.subscribe('notification'));
// //         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
// //      },
// //     action: function() {
// //         BlazeLayout.render('adminLayout',{main: "contactUsList"});
// //     }
// // });



// FlowRouter.route('/createEmailTemplate', {
//     name: 'createEmailTemplate',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userfunction'), 
//                     Meteor.subscribe('rolefunction'),
//                     Meteor.subscribe('notification'),
//                ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'createEmailTemplate'});
//         createEmailTemplateFunc();
//     }
// });

// FlowRouter.route('/createEmailTemplate', {
//     name: 'createEmailTemplate',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userfunction'), 
//                     Meteor.subscribe('rolefunction'),
//                     Meteor.subscribe('notification'),
//                ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'editTemplate'});
//         editTemplateFunc();
//     }
// });

// FlowRouter.route('/userDefinedTemplate', {
//     name: 'userDefinedTemplate',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userfunction'), 
//                     Meteor.subscribe('rolefunction'),
//                     Meteor.subscribe('notification'),
//                ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'userDefinedTemplate'});
//         userDefinedTemplateFunc();
//     }
// });




// FlowRouter.route('/viewTemplate', {
//     name: 'viewTemplate',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('userfunction'), 
//                ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'viewTemplate'});
//         viewTemplateFunc();
//     }
// });

// FlowRouter.route('/ViewAllNotification', {
//     name: 'ViewAllNotification',
//     waitOn(params) {        
//         return [ 
//         Meteor.subscribe('businessImgS3'),  
//         Meteor.subscribe('notification') ,
//         Meteor.subscribe('notificationTemplate') ,
//      ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'ViewAllNotif'});
//         ViewAllNotifFunc();
//     }
// });

// FlowRouter.route('/mailTemplate', {
//     name: 'mailTemplate',
//     subscriptions: function(params, queryParams) {
//         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
//         this.register('userfunction', Meteor.subscribe('userfunction') );
//         this.register('notification', Meteor.subscribe('notification')); 
//     },
//     action: function() {
//         BlazeLayout.render("adminLayout",{main:'mailTemplate'});
//     }
// });


// FlowRouter.route('/sendMailnNotification', {
//     name: 'sendMailnNotification',
//     subscriptions: function(params, queryParams) {
//         this.register('notification', Meteor.subscribe('notification')); 
//         this.register('userfunction', Meteor.subscribe('userfunction'));  
//         this.register('notificationTemplate', Meteor.subscribe('notificationTemplate') );
//         this.register('vendorBusinessEnquiry', Meteor.subscribe('vendorBusinessEnquiry') );
//         this.register('enquiryImgS3', Meteor.subscribe('enquiryImgS3'));
//         this.register('business', Meteor.subscribe('vendorBusiness'));  
//         this.register('allpayment', Meteor.subscribe('allpayment'));
//         this.register('allreviews', Meteor.subscribe('allreviews'));
//         this.register('likes', Meteor.subscribe('userBusinessLikes'));
//         this.register('userfunction', Meteor.subscribe('userfunction') );
//         this.register('followUser', Meteor.subscribe('followUser')); 
//     },
//     action: function() {
//         BlazeLayout.render('sendMailnNotification');
//     }
// });

// FlowRouter.route('/discountManagement', {
//     name: 'discountManagement',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('discounts') ,
//                ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'discountManagement'});
//         discountManagementFunc();
//     }
// });

// FlowRouter.route('/positionManagement', {
//     name: 'positionManagement',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('notification'), 
//                     Meteor.subscribe('userfunction'),  
//                     Meteor.subscribe('notificationTemplate') ,
//                     Meteor.subscribe('position') ,
//                ];   
//     }, 
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main:'positionManagement'});
//         positionManagementFunc();
//     }
// });


// FlowRouter.route('/aboutUs-form', {
//     name: 'Aboutusform',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('generalContent'), 
//                     Meteor.subscribe('userProfileS3'),  
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,      
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main: "aboutUsForm"});
//         aboutUsFormTwoFunc();
//     }
// });

// FlowRouter.route('/generalcontent-form', {
//     name: 'GENERALCONTENTform',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('generalContent'),  
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,     
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main: "generalContentForm"});
//         generalContentFunc();
//     }
// });

// FlowRouter.route('/admin-FAQ-form', {
//     name: 'Admin FAQ Form',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('generalContent'),  
//                     Meteor.subscribe('userProfileS3'), 
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,      
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main: "faqForm"});
//         faqFormThreeFunc();
//     }
// });

// FlowRouter.route('/editPages', {
//     name: 'Edit Webpages',
//     waitOn(params) {        
//         return [ 
//                     Meteor.subscribe('businessImgS3'),  
//                     Meteor.subscribe('generalContent'),
//                     Meteor.subscribe('userProfileS3'),   
//                     Meteor.subscribe('notification'),
//                     Meteor.subscribe('userfunction'),
//                     Meteor.subscribe('notificationTemplate') ,      
//                 ];   
//     },
//     action: function() {
//         // BlazeLayout.render("adminLayout",{main: "editPages"});
//         editPagesFunc();
//     }
// });


   // user
