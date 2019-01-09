import { Template } from 'meteor/templating' ;

import { Business } from '/imports/api/businessMaster.js';
import { Likes } from '/imports/api/likesMaster.js';
import { emptyReviewTemplate } from '../../common/emptyReviewTemplate.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';

import '../userLayout.js'
import './userLike.html'
import '../../common/emptyReviewTemplate.html'


Template.userLike.helpers({
	'checkLikeLoading': function(count){
		// var id = '';
		// var url = FlowRouter.current().path;
		// var checkIdExists = url.split('/');
		// if(checkIdExists[2] != '' && checkIdExists[2]){
		// 	id = produceURLid(checkIdExists[2]);
		// }else{
		// 	id = Meteor.userId();
		// }
		// var likesData = Likes.find({"userid":id}).count();
		if(parseInt(count) <= 0){
			return true;
		}else{
			return false;
		}

	},
	'businessName':function(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {}; 
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		// var count =0;
		var count = Counts.get('LikesCount');

		var dataArray = [];
		var bussDataArray =[];
		var likesData = Likes.find({"userid":id}).fetch();
		if(likesData){
			for(i=0;i<likesData.length;i++){
			var bussdata = Business.findOne({'_id':likesData[i].businessId,"status":'active'});
				if(bussdata){
					var businessName	 = bussdata.ownerFullName;
					var businessArea	 = bussdata.businessArea;
					var businessLink	 = bussdata.businessLink;
					var businessCity	 = bussdata.businessCity;
					var businessTitle	 = bussdata.businessTitle;
					var businessImage ='';

					if(bussdata.publishedImage){
						var pic = BusinessImage.findOne({"_id":bussdata.publishedImage});
						if(pic){
							businessImage = pic.link();
						}else{
							var imgObj = ReviewImage.findOne({"_id":bussdata.publishedImage});
							if(imgObj){
								businessImage = imgObj.link();
							}else{
								businessImage = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
							}
						}
					}
					else if(bussdata.businessImages){
						if(bussdata.businessImages.length>0){
							var pic = BusinessImage.findOne({"_id":bussdata.businessImages[0].img});
							if(pic){
								businessImage = pic.link();
							}else{
								var imgObj = ReviewImage.findOne({"_id":bussdata.businessImages[0].img});
								if(imgObj){
									businessImage = imgObj.link();
								}else{
									businessImage = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
								}
							}
						}else{
							businessImage = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
						}
					}else{
						businessImage = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
					}
								// console.log(businessImages);
						
					var reviewDateAgo = moment(likesData[i].createdAt).fromNow();

					bussDataArray.push({
							ownerFullName	: businessName,
							businessArea	: businessArea,
							businessLink	: businessLink,
							businessTitle	: businessTitle,
							businessCity	: businessCity,	
							createdAt		: likesData[i].createdAt,
							businessImg     : businessImage,
					});
					// returnLikeData.push(bussDataArray[i]);
				}

			}// i


			var likedDataReturn = {
				noofLikes		: count,
				bussDataArray	: bussDataArray,
			}
			return likedDataReturn;
		}
		

	},
    'timeAgo': function(datetime) {

	  // if(datetime == ''){
	  //   return 'Never Logged In';
	  // }else{
	  //   // Session.get('time');
	    return moment(datetime).fromNow();
	  // }
	},
});
userLikeForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userLike'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userLikeForm }

UI.registerHelper('timeAgo', function(datetime) {
  if(datetime == ''){
    return 'Never Logged In';
  }else{
    Session.get('time');
    return moment(datetime).fromNow();
  }
});

setInterval(function() {
    Session.set("time", new Date())
}, 60); //Every minute