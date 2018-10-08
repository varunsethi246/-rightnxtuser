import './VendorGotLikes.html';
import '../../vendorBusinessDetails/businessEventIcons.html'
import '/imports/vendor/vendorBusinessDetails/businessEventIcons.html'

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { Review } from '../../../api/reviewMaster.js';

import { FollowUser } from '/imports/api/userFollowMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';

import '../../vendor.js';
// import '../../vendorBusinessDetails/businessEventIcons.js';

// Template.VendorGotLikes.onCreated(function(){
//   this.subscribe('vendorImage');
// });

Template.VendorGotLikes.helpers({
	'businessLikesData': function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessLikes = Likes.find({"businessLink":businessLink}).fetch();
		if(businessLikes){
			for(i=0; i<businessLikes.length; i++){
				var id = businessLikes[i].userid;
				if(id){
					// console.log("id",id);
					var data = Meteor.users.findOne({"_id":id});
					// console.log("data",data);
					if(data){
						if(data.profile){
							if(data.profile.userProfilePic){
								var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
								if(pic){
									businessLikes[i].userProfilePic = pic.link();	
								}
								else{
									businessLikes[i].userProfilePic = "/users/profile/profile_image_dummy.svg";	
								}
							}else{
								businessLikes[i].userProfilePic = "/users/profile/profile_image_dummy.svg";
							}
						}
					}
					
				}
				var timeAgo = moment(businessLikes[i].createdAt).fromNow();
				businessLikes[i].timeAgo = timeAgo;
			}
			
			return businessLikes;
		}


	},
	'businessName' : function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var likeCount = Likes.find({"businessId":businessObj._id}).count();
			var value = {
							"businessTitle" : businessObj.businessTitle,
							"likeCount"		: likeCount,
						}
			return value;
		}

	},
	'likeNumber':function(){
		var businessLink = FlowRouter.getParam('businessLink');
		var businessObj = Business.findOne({"businessLink":businessLink,"status": "active"});
		if(businessObj){
			var likeCount = Likes.find({"businessId":businessObj._id}).count();
			if (likeCount == 0) {
				return false;
			}else{
				return true;
			}
		}

	},
	'UserFollowerCount': function(userid){
		var followersObj = FollowUser.find({"followUserId":userid}).count();
		console.log("followersObj: ",followersObj);
		if(followersObj){
			var objFollw = {
				UserFollowerNo : followersObj,
			}
			return objFollw;
		}else{
			var objFollw = {
				UserFollowerNo : 0,
			}
			return objFollw;

		}
		
	},

	'UserReviewCount': function(userId){
		var reviewObj = Review.find({"userId":userId}).count();
		// console.log("reviewObj: ",reviewObj);
		if(reviewObj){
			var objRev = {
				UserReviewNo : reviewObj,
			}
			return objRev;
		}else{
			var objRev = {
				UserReviewNo : 0,
			}
			return objRev;

		}
		
	}
});


VendorGotLikesForm = function () {  
  BlazeLayout.render("vendorLayout",{main: 'VendorGotLikes'});
}

export { VendorGotLikesForm };