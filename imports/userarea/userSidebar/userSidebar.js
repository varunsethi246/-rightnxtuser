import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { BussImgLikes } from '/imports/api/businessImageLikesMaster.js';
import { Bookmark } from '/imports/api/bookmarkMaster.js';
import { BeenThere } from '/imports/api/beenThereMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { FollowUser } from '../../api/userFollowMaster.js';
import { SavedOffer } from '/imports/api/savedOffersMaster.js';
import { Enquiry } from '/imports/api/enquiryMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import './userSidebar.html';

Template.userSidebar.events({
	'click .userMenuItem':function(event){       
        $('.userMenuItem').removeClass('active');
        $(event.currentTarget).addClass('active');
        $("html,body").scrollTop(0);
	},
});

Template.userSidebar.helpers({
	'hideShowMenu':function(){
		if(Session.get("updateUserTimeline")==true){
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				data.statusClass = 'hide';
				data.activeClass = 'active';
				data.changeHref = '/'+(checkIdExists[2]);
			}else{
				data.statusClass = '';
				data.activeClass = '';
				data.changeHref = '';
			}
			return data;
		}else {
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			var data = {};
			if(checkIdExists[2] != '' && checkIdExists[2]){
				data.statusClass = 'hide';
				data.activeClass = 'active';
				data.changeHref = '/'+(checkIdExists[2]);
			}else{
				data.statusClass = '';
				data.activeClass = '';
				data.changeHref = '';
			}
			console.log('data :',data);
			return data;
		}			
		
	},

	'siderbarLikesCount':function(){
		// var count = Counts.get('LikesCount');
		// var likedDataReturn = {
		// 		noofLikes		: count,
		// }

			var id ='';
			var url = FlowRouter.current().path;
			var checkIdExists = url.split('/');
			if(checkIdExists[2] != '' && checkIdExists[2]){
				id = produceURLid(checkIdExists[2]);
				// console.log('id 3:',id);
				var count = 0;
				var likesData = Likes.find({"userid":id}).fetch();	
				if(likesData){
					for(i=0;i<likesData.length;i++){
						var bussdata = Business.findOne({'_id':likesData[i].businessId,"status":'active'});
						// console.log('bussdata')
							if(bussdata){
								count++;
							}
						}
						var likedDataReturn = {
							noofLikes		: count,
						}
						// console.log("likedDataReturn 2:",likedDataReturn);
						var current = window.location.host;
					// console.log("window.location : ",current );
					return likedDataReturn;
				}
			}else{
				// id = Meteor.userId();
				// console.log('id 4:',id);
				var count = Counts.get('LikesCount');
				var likedDataReturn = {
						noofLikes		: count,
				}
					return likedDataReturn;
			}

	},

	'siderbarBookmarkCount':function(){
		// var countBookmark = Counts.get('bookmarkCount');

		// var bookmarkDataReturn = {
		// 	noofBookmark		: countBookmark,
		// }
		// return bookmarkDataReturn;
		// }else {
		$("html,body").scrollTop(0);
		var id ='';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
			console.log('id 1',id);
			var bookmarkData = Bookmark.find({"userId":id}).fetch();
			var count = 0;
			if(bookmarkData){	
				for(i=0;i<bookmarkData.length;i++){
				var bussdata = Business.findOne({'businessLink':bookmarkData[i].businessLink,"status":'active'});
				// consosle.log('bussdata 1:',bussdata);
					if(bussdata){
						count++;
					}
				}

			// return likedDataReturn;	
				var bookmarkDataReturn = {
					noofBookmark		: count,
				}
				// console.log('bookmarkDataReturn 2 :',bookmarkDataReturn);
				
			}
			// console.log('bookmarkData :',bookmarkDataReturn);
				return bookmarkDataReturn;
		}else{
			console.log('id 2');
			var countBookmark = Counts.get('bookmarkCount');

			var bookmarkDataReturn = {
				noofBookmark		: countBookmark,
			}
			return bookmarkDataReturn;
		}

	},

	'siderbarBeenThereCount':function(){

		var count = Counts.get('beenThereCount');
		var beenThereDataReturn = {
				noofBeenThere		: count,
		}
		return beenThereDataReturn;
		
	},

	'siderbarOffersCount':function(){

		var count = Counts.get('saveOfferCount');
		var saveOfferCountReturn = {
				noofsaveOfferCount		: count,
		}
		return saveOfferCountReturn;	
	},

	'siderbarPhotosCount':function(){
		var count = Counts.get('ReviewsPhotoCount');
		var ReviewPhotoReturn = {
				noofPhoto		: count,
		}
		return ReviewPhotoReturn;		
	},

	'followers':function(){
		// followerCount
		var count = Counts.get('followeringCount');
		var followerCountReturn = {
				nooffollowerCount		: count,
		}
		return followerCountReturn;
	},

	'siderbarReviewCount':function(){

		var count = Counts.get('ReviewsCount');
		var ReviewDataReturn = {
				noofReviews		: count,
		}
		return ReviewDataReturn;
	},

	'ratingsCount':function(){
		var count = Counts.get('ReviewsCount');
		var RatingDataReturn = {
					noofRatingData		: count,
				}
		return RatingDataReturn;
	},
	

	'enquiryCountUser':function(){
		var count = Counts.get('enquiryCount');
		var	noofEnquiryData   = {
				noofEnquiry : count,
			}
		return noofEnquiryData;
		
	},
});




// q=rightnxt+url&oq=user+data&aqs=chrome..69i57j0j69i60l2j0l2.4907j0j7|{{changeHref}}|&sourceid=chrome&ie=UTF-8 
