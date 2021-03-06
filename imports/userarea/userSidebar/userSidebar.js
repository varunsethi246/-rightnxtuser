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

Template.userSidebar.onRendered(()=>{
	var urlLinks = FlowRouter.current().path;
	var urlLink = urlLinks.split('/');
	// console.log(urlLink[1]);
	if (urlLink[1]) {
	// console.log(urlLink[1]);

		var linkUrl = $('.'+urlLink[1]).parent().attr('data-target');
		// console.log(linkUrl);
		// console.log($('.userMenuItem').addClass('active'));
		if (linkUrl) {
			// console.log('if');
			$('.'+linkUrl).addClass('active');
			// $('.userMenuItem')
		}
		// else{
		// 	console.log('else');

		// 	$('.'+linkUrl).addClass('active');

		// }
	}

});

Template.userSidebar.events({
	'click .userMenuItem':function(event){       
        $('.userMenuItem').removeClass('active');
        $(event.currentTarget).addClass('active');
        $("html,body").scrollTop(0);
	},
	'click .closeMenuTab': function(event){
		$(event.currentTarget).parent().parent().removeClass('in');
	},
	// 'click .userSiderActive':function(event){
	// 	var link = $(event.currentTarget).attr('data-target');
	// 	var urlLinks = FlowRouter.current().path;
	// 	var urlLink = urlLinks.split('/');
	// 	console.log(urlLink);
	// 	if (urlLink[1] === link) {
	// 		$(event.currentTarget).addClass('active');
	// 	}
	// }
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
			return data;
		}			
		
	},

	'siderbarLikesCount':function(){
		var count = Counts.get('LikesCount');
		var likedDataReturn = {
			noofLikes		: count,
		}
		return likedDataReturn;
	},

	'siderbarBookmarkCount':function(){
		// $("html,body").scrollTop(0);
		var countBookmark = Counts.get('bookmarkCount');

		var bookmarkDataReturn = {
			noofBookmark		: countBookmark,
		}
		return bookmarkDataReturn;

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
