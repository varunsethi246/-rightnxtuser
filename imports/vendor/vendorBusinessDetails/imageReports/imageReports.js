import './imageReports.html';
import './imageReportModal.html';
import './imageCommet.html';
import '../vendorBusinessCarousel.html';
import '../imageCarouselItems.html';

// import { UserProfileStoreS3New } from '/client/cfsjs/UserProfileS3.js';
// import { BusinessVideoUpload } from '/client/cfsjs/businessVideo.js';
import { Business } from '/imports/api/businessMaster.js';
import { Reports } from '/imports/api/reportMaster.js';
import { BussImgLikes } from '/imports/api/businessImageLikesMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { ImageComment } from '/imports/api/imageCommentMaster.js';
import { ImageCommentLike } from '/imports/api/imageCommentLikeMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { BusinessImage } from '/imports/videoUploadClient/businessImageClient.js';
import { BusinessMenu } from '/imports/videoUploadClient/businessMenuClient.js';
import { ReviewImage } from '/imports/videoUploadClient/reviewImageClient.js';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';
import { FollowUser } from '/imports/api/userFollowMaster.js';

// hello
Template.imageCommet.onCreated(function(){
  this.subscribe('businessImage');
});
Template.imageReports.onCreated(function(){
  this.subscribe('businessImage');
  this.subscribe('businessMenuImage');
});
Template.imageCommet.helpers({
	'imgFrom' : function(user){
		if (user == 'review'){
			return true;
		}else{
			return false;
		}
	},
	'businessComment':function(){
		var busLink = FlowRouter.getParam("businessurl");
		var imgId = Session.get("ModalimageID");
		var reviewDetails = Review.find({"businessLink":busLink}).fetch();
		if(reviewDetails){
			for(var i = 0; i < reviewDetails.length; i++){
				if(reviewDetails[i].reviewImages){
					for(var j = 0 ; j < reviewDetails[i].reviewImages.length; j++){
						if(reviewDetails[i].reviewImages[j].img == imgId){
							var reviewCounts = Review.find({"userId":reviewDetails[i].userId}).count();
							var followerCounts = FollowUser.find({'followUserId':reviewDetails[i].userId}).count();
							var reviewTimeAgo = moment(reviewDetails[i].reviewDate).fromNow();
							var userName = Meteor.users.findOne({"_id":reviewDetails[i].userId});
							if(userName){
								var userProfileUrl = generateURLid(userName._id);
								if(userName.profile.userProfilePic){
									var pic = VendorImage.findOne({"_id":userName.profile.userProfilePic});
									if(pic){
										var pic = pic.link();
									}else{
										var pic = '/user/profile/profile_image_dummy.svg';
									}
								}else{
									var pic = '/user/profile/profile_image_dummy.svg';
								}
								var dataReturn = {
									reviewCounts   : reviewCounts,
									followerCounts : followerCounts,
									reviewTimeAgo  : reviewTimeAgo,
									userName	   : userName.profile.name,
									pic 		   : pic,
									typeofImg      : 'review',
									userProfileUrl : userProfileUrl,
								};
								return dataReturn;

							}
						}
					}
				}
			}
		}
		var businessName = Business.findOne({"businessLink":busLink});
		if(businessName){
			if(businessName.publishedImage){
				var pic = BusinessImage.findOne({"_id":businessName.publishedImage});
				if(pic){
					var pic = pic.link();
				}else{
					var pic1 = ReviewImage.findOne({"_id":businessName.publishedImage});
					if(pic1){
						var pic = pic1.link();
					}else{
						var pic = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
					}
				}
			}
			else if(businessName.businessImages.length>0){
				if(businessName.businessImages[0].img){
					var pic = BusinessImage.findOne({"_id":businessName.businessImages[0].img});
					if(pic){
						var pic = pic.link();
					}else{
						var pic1 = ReviewImage.findOne({"_id":businessName.businessImages[0].img});
						if(pic1){
							var pic = pic1.link();
						}else{
							var pic = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
						}
					}
				}else{
					var pic = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
				}
			}else{
				var pic = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
			}
			var dataReturn = {
				businessName    : businessName.businessTitle,
				businessaddress : businessName.businessCity,
				createdTimeAgo  : moment(businessName.createdAt).fromNow(),
				pic      	    : pic,
				typeofImg      : 'business',
			};
			return dataReturn;
		}
	},

	'showComment':function(){
		var businessLink = FlowRouter.getParam('businessurl');
		var imgId = Session.get("ModalimageID");
		var commentDetails = ImageComment.find({'businessLink': businessLink,'imgId':imgId},{sort:{"imgCommentDate":-1}}).fetch();
		if(commentDetails){
			for (var i = 0; i < commentDetails.length; i++){
				if(commentDetails[i].userId){
					var userObj = Meteor.users.findOne({"_id":commentDetails[i].userId});
					if(userObj){
						commentDetails[i].commentUserName = userObj.profile.name;
						if(Roles.userIsInRole(commentDetails[i].userId, ['user'])){
							if(commentDetails[i].userId != Meteor.userId()){
								commentDetails[i].userProfileUrl = generateURLid(commentDetails[i].userId);
							}
						}

						if(userObj.profile.userProfilePic){								
							var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
							if(pic){
								commentDetails[i].userProfileImgPath = pic.link();	
							}
							else{
								commentDetails[i].userProfileImgPath = "/users/profile/profile_image_dummy.svg";
							}				
						}else{
							commentDetails[i].userProfileImgPath = '/users/profile/profile_image_dummy.svg';
						}
						commentDetails[i].userCommentDateAgo = moment(commentDetails[i].imgCommentDate).fromNow();
						var replyOfReply = [];

						if(commentDetails[i].imgMultiComment){
							commentDetails[i].commentReplyCount = commentDetails[i].imgMultiComment.length;
						}

						if(commentDetails[i].userId === Meteor.userId()){
							commentDetails[i].deletEditBlock = 'showDelEditBlock';
						}else{
							commentDetails[i].deletEditBlock = 'hideDelEditBlock';
						}

						var selector = {	
											"businessLink"	: commentDetails[i].businessLink,
											"commentDocId" 	: commentDetails[i]._id,
											"imgId" 		: commentDetails[i].imgId,
											"userId"		: Meteor.userId(),
											"replyId" 		: '',
										};
						var checkCommentLike =  ImageCommentLike.findOne(selector);
						

						// if(checkCommentLike){
						// 	commentDetails[i].likeUnlike = true;	
						// }else{
						// 	commentDetails[i].likeUnlike = false;
						// }
						var commentLikeCount = ImageCommentLike.find({
													"businessLink"	: commentDetails[i].businessLink,
													"commentDocId" 	: commentDetails[i]._id,
													"imgId" 		: (commentDetails[i].imgId).toString(),
													// "userId"		: Meteor.userId(),
													"replyId" 		: '',
												}).fetch();
						if(commentLikeCount){
							commentDetails[i].commentLikeCount = commentLikeCount.length;
						}else{
							commentDetails[i].commentLikeCount = "0";
						}

						


						if(commentDetails[i].imgMultiComment){
							for(j=0;j<commentDetails[i].imgMultiComment.length;j++){
								var userObj = Meteor.users.findOne({"_id":commentDetails[i].imgMultiComment[j].userId});
								if(userObj){
									commentDetails[i].imgMultiComment[j].commentUserName = userObj.profile.name;
									// commentDetails[i].imgMultiComment[j].userProfileUrl = generateURLid(userObj._id);

									if(userObj.profile.userProfilePic){								
										var pic = VendorImage.findOne({"_id":userObj.profile.userProfilePic});
										if(pic){
											commentDetails[i].imgMultiComment[j].userProfileImgPath = pic.link();	
										}
										else{
											commentDetails[i].imgMultiComment[j].userProfileImgPath = "/users/profile/profile_image_dummy.svg";
										}				
									}else{
										commentDetails[i].imgMultiComment[j].userProfileImgPath = '/users/profile/profile_image_dummy.svg';
									}
									commentDetails[i].imgMultiComment[j].userCommentDateAgo = moment(commentDetails[i].imgMultiComment[j].imgCommentDate).fromNow();
									
									if(commentDetails[i].imgMultiComment[j].userId === Meteor.userId()){
										commentDetails[i].imgMultiComment[j].deletEditReplyBlock = 'showDelEditBlock';
									}else{
										commentDetails[i].imgMultiComment[j].deletEditReplyBlock = 'hideDelEditBlock';
									}

									var selector = {	
											"commentDocId" 	: commentDetails[i]._id,
											"businessLink"	: commentDetails[i].businessLink,
											"imgId" 		: commentDetails[i].imgId,
											"userId"		: Meteor.userId(),
											"replyId" 		: (commentDetails[i].imgMultiComment[j].replyId).toString(),
										};
									var checkCommentLike =  ImageCommentLike.findOne(selector);
									
									var commentLikeCount = ImageCommentLike.find({
																"businessLink"	: commentDetails[i].businessLink,
																"commentDocId" 	: commentDetails[i]._id,
																"imgId" 		: commentDetails[i].imgId,
																// "userId"		: commentDetails[i].imgMultiComment[j].userId,
																"replyId" 		: (commentDetails[i].imgMultiComment[j].replyId).toString(),
															}).fetch();

									


									if(commentLikeCount){
										commentDetails[i].imgMultiComment[j].commentReplyLikeCount = commentLikeCount.length;
									}else{
										commentDetails[i].imgMultiComment[j].commentReplyLikeCount = 0;
									}




								}

							}
						}
					}						
				}
				// if(imgId == commentDetails[i].imgId){
				// 	// console.log("commentDetails: ",commentDetails);
				// 	return commentDetails;
				// }
			}
			// console.log("commentDetails: ",commentDetails);
			return commentDetails;

		}
	},

	'currentUserPic':function(){
		var userPic = Meteor.users.findOne({'_id':Meteor.userId()});
		if(userPic){
			if(userPic.profile){
				if(userPic.profile.userProfilePic){
					var userProfilePic = VendorImage.findOne({'_id':userPic.profile.userProfilePic});
					if(userProfilePic){
						var userImage = userProfilePic.link();
					}else{						
						var userImage = '/users/profile/profile_image_dummy.svg';
					}
				}else{
					var userImage = '/users/profile/profile_image_dummy.svg';
				}
			}else{
				var userImage = '/users/profile/profile_image_dummy.svg';
			}
			return userImage;
		}
	},
});


// =============================== ReportsModal ===============================

Template.imageReportModal.onRendered(function(){
	$('.carousel').each(function(){
        $(this).carousel({
            interval: false
        });
    });
});

Template.imageReportModal.events({
	'click .checkid':function(event){
		event.preventDefault();
		var id = $(event.target).parent().attr('id');
		// console.log('id ' , id);
	},
	'click .imageReportClose':function(event){
		event.preventDefault();
		$('#imageReportOne').modal('hide');
		$('#imageReportComment').val('');
		$('#selectImageReport').val('Select an option...');
	},

	'click #imageReportSubmit': function(event) {
		event.preventDefault();
		// if (Meteor.userId()) {
			var businessurl	= FlowRouter.getParam("businessLink");
			var businessname = Business.find({'businessLink' : businessurl}).fetch();
			var picId = Session.get('ModalimageID')
			// var reportData = $('#imageReportComment').val();
			
			if(businessname){	
				var formValues = {
					businessLink 				: FlowRouter.getParam("businessurl"),
					selectImageReport			: $('#selectImageReport').val(),
					imageReportComment 			: $('#imageReportComment').val(),
					reportType					: 'image',
					reportedImage				: picId,
				}

				if(formValues.selectImageReport != 'Select an option...'){
					Meteor.call('insertreports',formValues, function(error,result){
							if(error){
								Bert.alert('error while inserting data','danger','growl-top-right');
							}else{
								Bert.alert('Report Submitted !','success','growl-top-right');
			                  
			                    // event.target.selectImageReport.value       = ''; 
			                    $('#imageReportComment').val('');
								$('#imageReportOne').modal('hide');		

								//============================================================
								// 			Notification Email / SMS / InApp
								//============================================================
								var admin = Meteor.users.findOne({'roles':'admin'});
							    if(admin){
							    	var adminId = admin._id;
							    }

								var businessData = Business.findOne({"businessLink":formValues.businessLink});
								if(businessData){
									var vendorId = businessData.businessOwnerId;
	                				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

	                  	  			var userId = Meteor.userId();
	                				var userDetail = Meteor.users.findOne({'_id':userId});

	                				if(vendorDetail&&userDetail){

			        					//Send Notification, Mail and SMS to Vendor
	                					var vendorname 	= vendorDetail.profile.name;
				                		var date 		= new Date();
				                		var currentDate = moment(date).format('DD/MM/YYYY');
				                		var msgvariable = {
											'[username]' 	: vendorname,
						   					'[currentDate]'	: currentDate,
			   								'[businessName]': businessData.businessTitle,
			   								'[reason]' 		: formValues.selectImageReport,
			   								'[comment]'		: formValues.imageReportComment

						               	};

										var inputObj = {
											notifPath	 : formValues.businessLink,
										    to           : vendorId,
										    templateName : 'Vendor Modal Image Report',
										    variables    : msgvariable,
										    type 		 : "Modal",
										    picId		 : picId
										}
										sendInAppNotification(inputObj);

										var inputObj = {
											notifPath	 : formValues.businessLink,
											from         : adminId,
										    to           : vendorId,
										    templateName : 'Vendor Modal Image Report',
										    variables    : msgvariable,
										    type 		 : "Modal",
										    picId		 : picId

										}
										sendMailNotification(inputObj);

										//Send Notification, Mail and SMS to Current User
	                					var username 	= userDetail.profile.name;
				                		var date 		= new Date();
				                		var currentDate = moment(date).format('DD/MM/YYYY');
				                		var msgvariable = {
											'[username]' 	: username,
						   					'[currentDate]'	: currentDate,
			   								'[businessName]': businessData.businessTitle,
			   								'[reason]' 		: formValues.selectImageReport,
			   								'[comment]'		: formValues.imageReportComment
						               	};

										var inputObj = {
											notifPath	 : formValues.businessLink,
											from         : adminId,
										    to           : userId,
										    templateName : 'User Modal Image Report',
										    variables    : msgvariable,
										    type 		 : "Modal",
										    picId		 : picId
										    
										}
										sendMailNotification(inputObj); 

										//Send Notification and Mail to Admin
										var username 	= userDetail.profile.name;
				                        var date    = new Date();
				                        var currentDate = moment(date).format('DD/MM/YYYY');
				                        var msgvariable = {
				                           '[username]'   	: username,
				                           '[adminname]'    : 'Admin',
				                           '[currentDate]'  : currentDate,
				                           '[businessName]' : businessData.businessTitle,
			   							   '[reason]' 		: formValues.selectImageReport,
			   							   '[comment]'		: formValues.imageReportComment

				                        };

				                        var inputObj = {
				                                    notifPath     : formValues.businessLink,
				                                    to            : adminId,
				                                    templateName  : 'Admin Business Page Modal Report',
				                                    variables     : msgvariable,
				                        }
				                        sendInAppNotification(inputObj);

				                        var inputObj = {
				                                    notifPath     : formValues.businessLink,
				                                    from          : adminId,
				                                    to            : adminId,
				                                    templateName  : 'Admin Business Page Modal Report',
				                                    variables     : msgvariable,
				                        }
				                        sendMailNotification(inputObj);
	                				}
								}
								//============================================================
								// 			End Notification Email / SMS / InApp
								//============================================================
				

	                             
							}
						}
					);
				}else{
					Bert.alert('Please select one option.', 'danger', 'growl-top-right' );
				}
			}			
					
		
	},
	'click .reportModalIcon':function(event){
		event.preventDefault();
		if(Meteor.userId()){
			if($('#imgModalReport').hasClass('in')){
				$('#imgModalReport').removeClass('in');
			}

		}else{
			$('#loginModal').modal('show');
			$('.loginScreen').show();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			// $('.genLoginSignup').show();
			$('.thankyouscreen').hide();
			$('.signUpBox').hide();
		}
	},
});


// ======================== imageaReport =============================

Template.imageReports.onRendered(function() {
		Session.set("carouselLikeCount",0);
	  	this.autorun(function(c) {
	    var user = Meteor.userId()
	    // var name = user && user.profile && user.profile.name;
		    if (user) {
		    	$('.likeIconModal').hide('likeIconModal');
		    }
	  });
});


Template.imageReports.helpers({
	'imageCarouselSlideBig' : function(){
		
		var businessLink = FlowRouter.getParam('businessurl');
		Session.set('urlforModal',businessLink);
		var business = Business.findOne({"businessLink":businessLink});
		var arrayBusiness = [];
		if(business){
			if(Session.get('ShowMenuImage')){
				if(business.businessMenu){
					var picId = Session.get('ModalimageID')
					for (var i = 0 ; i <  business.businessMenu.length; i++) {
						var picMenu = BusinessMenu.findOne({"_id":business.businessMenu[i].menu});
						var newObj = {};
						newObj.imgLikesStatus 	= 'inactive';
						newObj.imgLikeClass 	= 'fa-heart-o';
						newObj.userId 			= Meteor.userId();
						newObj._id			= business.businessMenu[i].menu ;
						if(picMenu){
							if(picMenu._id == picId){
								newObj.img 			=  picMenu.link() ;
								newObj.activeClass 	= 'active';
							}else{
								newObj.img 			=  picMenu.link() ;
								newObj.activeClass 	= '';
							}
						}
						arrayBusiness.push(newObj);
					}
				}
			}else{
				if(business.businessImages){
					var picId = Session.get('ModalimageID')
					for (var i = 0 ; i <  business.businessImages.length; i++) {
						var pic = BusinessImage.findOne({"_id":business.businessImages[i].img});
						var newObj = {};
						newObj.imgLikesStatus 	= 'inactive';
						newObj.imgLikeClass 	= 'fa-heart-o';
						newObj.userId 			= Meteor.userId();
						newObj._id				= business.businessImages[i].img ;
						if(pic){
							if(pic._id == picId	){
								newObj.img 			=  pic.link() ;
								newObj.activeClass 	= 'active';
							}else{
								newObj.img 			=  pic.link() ;
								newObj.activeClass 	= '';
							}
							// arrayBusiness.push(newObj);
						}//if pic
						else{
							var picreview = ReviewImage.findOne({"_id":business.businessImages[i].img});
							if(picreview){
								if(picreview._id == picId){
									newObj.img 			=  picreview.link() ;
									newObj.activeClass 	= 'active';
								}else{
									newObj.img 			=  picreview.link() ;
									newObj.activeClass 	= '';
								}
							}
						}
						arrayBusiness.push(newObj);

					}//for loop
				}//if businessImage
			}

			//Find whether current user liked the image
			if(Meteor.userId()){
				for(i=0; i<arrayBusiness.length;i++ ){
					var imageLikes = BussImgLikes.findOne({"userid":Meteor.userId(),"LikedImage":arrayBusiness[i]._id});					
					if(imageLikes){
						arrayBusiness[i].imgLikesStatus = 'active';
						arrayBusiness[i].imgLikeClass 	= 'fa-heart';
						arrayBusiness[i].userId 		= Meteor.userId();
					}

					if(arrayBusiness[i].activeClass == 'active'){
						$('.likeModalIcon').removeClass('fa-heart fa-heart-o');
						if(arrayBusiness[i].imgLikesStatus == 'active'){
							$('.likeModalIcon').removeClass('fa-heart-o inactivelikeImg');
							$('.likeModalIcon').addClass('fa-heart activelikeImg');
						}else{
							$('.likeModalIcon').removeClass('fa-heart activelikeImg');
							$('.likeModalIcon').addClass('fa-heart-o inactivelikeImg');
						}
	
						var imageLikeCount = BussImgLikes.find({"LikedImage":arrayBusiness[i]._id}).count();
						// console.log('imageLikeCount',imageLikeCount);					
						$('.likesCount').text(imageLikeCount);
					}

				}
			}
			// console.log(arrayBusiness);
			return arrayBusiness;
		}
	},

});

Template.imageReports.events({
	'click .nextImageID':function(event){
		var imgIdNext = $('#myCarousel1 .carousel-inner').find('.active').next().children('img').attr('id');
		if(!imgIdNext){
			imgIdNext = $('#myCarousel1 .carousel-inner').find('.imageReportSlider').first().children('img').attr('id');
		}
		Session.set("ModalimageID",imgIdNext);
	},
	'click .previousImageID':function(event){
		var imgIdPrevious = $('#myCarousel1 .carousel-inner').find('.active').prev().children('img').attr('id');
		if(!imgIdPrevious){
			imgIdPrevious = $('#myCarousel1 .carousel-inner').find('.imageReportSlider').last().children('img').attr('id');
		}
		Session.set("ModalimageID",imgIdPrevious);
	},

	'click .likeModalIcon': function(event){
		event.preventDefault();
		// console.log('click');
		var businessLink = $(event.target).parent().attr('id');

		if($("#likeimage").hasClass('inactivelikeImg')){

			$("#likeimage").removeClass('inactivelikeImg');
			$("#likeimage").addClass('activelikeImg');

			var picId = Session.get('ModalimageID');

			if(picId){
				// var businessId = businessname._id;	
				var formValues = {
						'businessLink' 			: businessLink,
						'LikedImage'			: picId,
					}
					// console.log('formValues :',formValues);
				// if(Meteor.userId()){
					Meteor.call('insertBussImgLikes',formValues,'active',
						function(error,result){
							if(error){
								Bert.alert('Some error occured while liking this page!','danger','growl-top-right','fa-remove');
							}else{

								//============================================================
								// 			Notification Email / SMS / InApp
								//============================================================
								var admin = Meteor.users.findOne({'roles':'admin'});
							    if(admin){
							    	var adminId = admin._id;
							    }

								var businessData = Business.findOne({"businessLink":businessLink});
								if(businessData){
									var vendorId = businessData.businessOwnerId;
                    				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

                      	  			var userId = Meteor.userId();
                    				var userDetail = Meteor.users.findOne({'_id':userId});

                    				if(vendorDetail&&userDetail){

			        					//Send Notification, Mail and SMS to Vendor
                    					var vendorname 	= vendorDetail.profile.name;
				                		var date 		= new Date();
				                		var currentDate = moment(date).format('DD/MM/YYYY');
				                		var msgvariable = {
											'[username]' 	: vendorname,
						   					'[currentDate]'	: currentDate,
			   								'[businessName]': businessData.businessTitle

						               	};

										var inputObj = {
											notifPath	 : businessLink,
										    to           : vendorId,
										    templateName : 'Vendor Modal Image Like',
										    variables    : msgvariable,
										    type 		 : "Modal",
										    picId		 : picId
										}
										sendInAppNotification(inputObj);

										var inputObj = {
											notifPath	 : businessLink,
											from         : adminId,
										    to           : vendorId,
										    templateName : 'Vendor Modal Image Like',
										    variables    : msgvariable,
										    type 		 : "Modal",
										    picId		 : picId

										}
										sendMailNotification(inputObj);

										//Send Notification, Mail and SMS to Current User
                    					var username 	= userDetail.profile.name;
				                		var date 		= new Date();
				                		var currentDate = moment(date).format('DD/MM/YYYY');
				                		var msgvariable = {
											'[username]' 	: username,
						   					'[currentDate]'	: currentDate,
			   								'[businessName]': businessData.businessTitle

						               	};

										// var inputObj = {
										// 	notifPath	 : businessLink,
										//     to           : vendorId,
										//     templateName : 'Vendor Business Page Like',
										//     variables    : msgvariable,
										// }
										// sendInAppNotification(inputObj);

										var inputObj = {
											notifPath	 : businessLink,
											from         : adminId,
										    to           : userId,
										    templateName : 'User Modal Image Like',
										    variables    : msgvariable,
										    type 		 : "Modal",
										    picId		 : picId

										}
										sendMailNotification(inputObj); 
                    				}
								}
								//============================================================
								// 			End Notification Email / SMS / InApp
								//============================================================

							}
						}
					);			
			}else{
				$('#loginModal').modal('show');
				$('.loginScreen').show();
				$('.signupScreen').hide();
				$('.thankyouscreen').hide();
				// $('.genLoginSignup').show();
				$('.thankyouscreen').hide();
				$('.signUpBox').hide();

			}
		}else{
			$("#likeimage").removeClass('activelikeImg');
			$("#likeimage").addClass('inactivelikeImg');			
	
			var picId = Session.get('ModalimageID');
			if(picId){
				// var businessId = businessname._id;	
				var formValues = {
						'businessLink' 			: businessLink,
						'LikedImage'			: picId,
					}
					// console.log('formValues',formValues);
				// if(Meteor.userId()){
					Meteor.call('insertBussImgLikes',formValues,'inactive',
						function(error,result){
							if(error){
								Bert.alert('Some error occured while liking this page!','danger','growl-top-right','fa-remove');
							}else{
								// Bert.alert('Sorry to see you unLiked our business! Hope we do better next time.','warning','growl-top-right','fa-check');
							}
						}
					);				
			}else{
				$('#loginModal').modal('show');
			}
		}
		// }
	},

	'click .imageReportCloseFirst': function(event){
		Session.set("carouselLikeCount",0);
		$('.modal-backdrop').hide();
		// Session.set('nextImageCOUNT',0);
	},

	'click #shareModalReports':function(event){
		event.preventDefault();
		if(Meteor.userId()){

		}else{
			$('#loginModal').modal('show');
			$('.loginScreen').show();
			$('.signupScreen').hide();
			$('.thankyouscreen').hide();
			// $('.genLoginSignup').show();
			$('.thankyouscreen').hide();
			$('.signUpBox').hide();
			$('.nonuserShare').hide();
			}
	},
	
	'click .closeImgReportShare':function(event){
		event.preventDefault();
		$('#imageReportShare').modal('hide');
		$('.modal-backdrop').hide();
	},
	'click .nonUserCloseBtn':function(event){
		event.preventDefault();
		$('#imageReportShare').hide();
		$('.modal-backdrop').hide();
	},
	'click .nonUserOkayBtn':function(event){
		event.preventDefault();
		$('#imageReportShare').hide();
		$('.modal-backdrop').hide();
	},
	'click .likeClose':function(event){
		event.preventDefault();
		$('#nonuserreview').hide();
		$('.modal-backdrop').hide();
	},

	'click .likeOkey':function(event){
		event.preventDefault();
		$('#nonuserreview').hide();
		$('.modal-backdrop').hide();
	},

	'click .reportClose':function(event){
		event.preventDefault();
		$('#imageReportOne').hide();
		$('.modal-backdrop').hide();
	},

	'click .reportOkey':function(event){
		event.preventDefault();
		$('#imageReportOne').hide();
		$('.modal-backdrop').hide();
	},
	'click .likeIconModal':function(event){
		event.preventDefault();
		$('#loginModal').modal('show');
		$('.loginScreen').show();
		$('.signupScreen').hide();
		$('.thankyouscreen').hide();
		// $('.genLoginSignup').show();
		$('.thankyouscreen').hide();
		$('.signUpBox').hide();
		$('#imageReportShare').hide();
	},
	'click .bussImgShareFB':function(event){
		event.preventDefault();
		var id = $('.vModalContentfb').attr('id');
		var url = location.href;
		var title = Session.get('urlforModal');
		var businessData = Business.findOne({'businessLink':title});
		if(businessData){
			var description = businessData.businessAboutBus;
			if(description){
				var descriptionBus = description.slice(0,150);

			}else{
				var descriptionBus = "Welcome to My Page"

			}
			if(businessData.businessImages){
				var imgId = $('#myCarousel1 .carousel-inner').find('.active').children('img').attr('id');
				var pic = BusinessImage.findOne({"_id":imgId});
				if(pic){
					businessData.businessImages = pic.path;
				}else{
					businessData.businessImages = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
				}

			}else{
				businessData.businessImages = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
			}

			var img = businessData.businessImages;
			var image = 'https://qa.rightnxt.s3.amazonaws.com/BusinessImages/'+img;
			fbShare(url,title,description,image);
		}//businessData
		
	},
	'click .bussImgShareGP ':function(event){
		event.preventDefault();
		var url = window.location.href;
		var title = Session.get('urlforModal');
		var imageID = Session.get('ModalimageID');
		var businessData = Business.findOne({'businessLink':title});
		if(businessData){
			if(businessData.businessImages){
				var pic = BusinessImage.findOne({"_id":imageID});
				if(pic){
					businessData.businessImages = pic.path;
				}else{
					businessData.businessImages = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
				}

			}else{
				businessData.businessImages = 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg';
			}
			var img = businessData.businessImages;
			var image = 'https://rightnxt.s3.amazonaws.com/BusinessImages/'+img;
			googleplusshare(image);
		}//businessData
	},
});

// ==============share function============
fbShare = function(URL,title,description,image){

  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "//connect.facebook.net/en_US/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  window.fbAsyncInit = function() {
    FB.init({
      appId      : '1441873185871088',
      xfbml      : true,
      version    : 'v2.10'
    });

    FB.ui({
        method: 'share_open_graph',
        action_type: 'og.shares',
        action_properties: JSON.stringify({
            object : {
               'og:url'        : URL, 
               'og:title'      : title,
               'og:description': description,
               'og:image'      : image 
            }
        })
        },
      function(response) {});


  };
}
googleplusshare = function(image) {
  sharelink = "https://plus.google.com/share?url="+image;
  newwindow=window.open(sharelink,'name','height=400,width=600');
  if (window.focus) {newwindow.focus()}                                                                                                                                
  return false;
}  


Template.imageCarouselItems.events({
	'click .modalIdSeach':function(event){
		var currentId = event.currentTarget; 
		var id = $(currentId).children().attr('id');
		Session.set('ModalimageID',id);
		Session.set('ShowMenuImage','');
	},
});

Template.imageCommet.events({
	'keypress .modalComments':function(event){
		if(event.key == 'Enter'){
			var formValues = {
				"imgcomment"			: (event.currentTarget.value).trim(),
				"userId" 				: Meteor.userId(),
				"businessLink" 			: FlowRouter.getParam('businessurl'),
				"imgId" 	 			: Session.get('ModalimageID'),
			};
			if(formValues.imgcomment){
				Meteor.call('insertImageComment',formValues, function(error, result){
					if(error){
						// Bert.alert("Form values not submitted.","danger","growl-top-right");
					}else{
						//============================================================
						// 			Notification Email / SMS / InApp
						//============================================================
						var admin = Meteor.users.findOne({'roles':'admin'});
					    if(admin){
					    	var adminId = admin._id;
					    }

						var businessData = Business.findOne({"businessLink":formValues.businessLink});
						if(businessData){
							var vendorId = businessData.businessOwnerId;
            				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

              	  			var userId = Meteor.userId();
            				var userDetail = Meteor.users.findOne({'_id':userId});

            				if(vendorDetail&&userDetail){

	        					//Send Notification, Mail and SMS to Vendor
            					var vendorname 	= vendorDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
	   								'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : formValues.businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : formValues.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId

								}
								sendMailNotification(inputObj);

								//Send Notification, Mail and SMS to Current User
            					var username 	= userDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: username,
				   					'[currentDate]'	: currentDate,
	   								'[businessName]': businessData.businessTitle

				               	};

								// var inputObj = {
								// 	notifPath	 : formValues.businessLink,
								//     to           : vendorId,
								//     templateName : 'Vendor Business Page Like',
								//     variables    : msgvariable,
								// }
								// sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : formValues.businessLink,
									from         : adminId,
								    to           : userId,
								    templateName : 'User Modal Image Comment',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId

								}
								sendMailNotification(inputObj); 
            				}
						}
						//============================================================
						// 			End Notification Email / SMS / InApp
						//============================================================

						event.currentTarget.value='';
					}
				});
			}
			
    	}
	},
	'click .commentReply':function(event){
		$(event.currentTarget).siblings('.reportModInputReply').toggleClass('showCmmnt');
	},
	'keypress #replyOfreplyInput':function(event){
		var commentId = $(event.currentTarget).attr('data-commentId');
		var commentUser = $(event.currentTarget).attr('data-userId');

		if(event.key == 'Enter'){
			var formValues = {
				"imgcomment"			: (event.currentTarget.value).trim(),
				"userId" 				: Meteor.userId(),
				"businessLink" 			: FlowRouter.getParam('businessurl'),
				"imgId" 	 			: Session.get('ModalimageID'),
				"commentId"				: commentId,
			};
			if(formValues.imgcomment){
				Meteor.call('insertImgCommntOfCmmnt',formValues, function(error, result){
					if(error){
					}else{
						//============================================================
						// 			Notification Email / SMS / InApp
						//============================================================
						var admin = Meteor.users.findOne({'roles':'admin'});
					    if(admin){
					    	var adminId = admin._id;
					    }

						var businessData = Business.findOne({"businessLink":formValues.businessLink});
						if(businessData){
							var vendorId = businessData.businessOwnerId;
	        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

	          	  			var userId = Meteor.userId();
	        				var userDetail = Meteor.users.findOne({'_id':userId});

	        				var commentedUser = Meteor.users.findOne({'_id':commentUser});
	        				

	        				if(vendorDetail&&userDetail&&commentedUser){

	        					//Send Notification, Mail and SMS to Vendor
	        					var vendorname 	= vendorDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
	   								'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : formValues.businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Reply',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : formValues.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Reply',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId

								}
								sendMailNotification(inputObj);


								//Send Notification, Mail and SMS to User that added Comment
								if(commentUser!=userId){
		        					var commentUserName 	= commentedUser.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: commentUserName,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									var inputObj = {
										notifPath	 : formValues.businessLink,
									    to           : commentUser,
									    templateName : 'User Modal Image Added Comment Reply',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId
									}
									sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : commentUser,
									    templateName : 'User Modal Image Added Comment Reply',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj);
								}


								//Send Notification, Mail and SMS to Current User
								if(commentUser!=userId){

		        					var username 	= userDetail.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									// var inputObj = {
									// 	notifPath	 : formValues.businessLink,
									//     to           : vendorId,
									//     templateName : 'Vendor Business Page Like',
									//     variables    : msgvariable,
									// }
									// sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : userId,
									    templateName : 'User Modal Image Comment Reply',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj); 
								}
	        				}
						}
					
						//============================================================
						// 			End Notification Email / SMS / InApp
						//============================================================
						event.currentTarget.value='';
						$('.reportModInputReply').removeClass('showCmmnt');
					}
				});
			}
    	}
	},
	'keypress #replyOfreplyInputTwo':function(event){
		var commentId = $(event.currentTarget).attr('data-commentId');
		var commentUser = $(event.currentTarget).attr('data-userId');

		if(event.key == 'Enter'){
			var formValues = {
				"imgcomment"			: (event.currentTarget.value).trim(),
				"userId" 				: Meteor.userId(),
				"businessLink" 			: FlowRouter.getParam('businessurl'),
				"imgId" 	 			: Session.get('ModalimageID'),
				"commentId"				: commentId,
			};
			if(formValues.imgcomment){
				Meteor.call('insertImgCommntOfCmmnt',formValues, function(error, result){
					if(error){
					}else{
						
						//============================================================
						// 			Notification Email / SMS / InApp
						//============================================================
						var admin = Meteor.users.findOne({'roles':'admin'});
					    if(admin){
					    	var adminId = admin._id;
					    }

						var businessData = Business.findOne({"businessLink":formValues.businessLink});
						if(businessData){
							var vendorId = businessData.businessOwnerId;
	        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

	          	  			var userId = Meteor.userId();
	        				var userDetail = Meteor.users.findOne({'_id':userId});

	        				var commentedUser = Meteor.users.findOne({'_id':commentUser});
	        				

	        				if(vendorDetail&&userDetail&&commentedUser){

	        					//Send Notification, Mail and SMS to Vendor
	        					var vendorname 	= vendorDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
	   								'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : formValues.businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Reply',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : formValues.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Reply',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId

								}
								sendMailNotification(inputObj);

								//Send Notification, Mail and SMS to User that added Comment
								if(commentUser!=userId){
		        					var commentUserName 	= commentedUser.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: commentUserName,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									var inputObj = {
										notifPath	 : formValues.businessLink,
									    to           : commentUser,
									    templateName : 'User Modal Image Added Comment Reply',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId
									}
									sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : commentUser,
									    templateName : 'User Modal Image Added Comment Reply',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj);
								}


								//Send Notification, Mail and SMS to Current User
								// if(commentUser!=userId){

		        					var username 	= userDetail.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									// var inputObj = {
									// 	notifPath	 : formValues.businessLink,
									//     to           : vendorId,
									//     templateName : 'Vendor Business Page Like',
									//     variables    : msgvariable,
									// }
									// sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : userId,
									    templateName : 'User Modal Image Comment Reply',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj); 
								// }
	        				}
						}
					
						//============================================================
						// 			End Notification Email / SMS / InApp
						//============================================================
						event.currentTarget.value='';
					}
				});
			}
    	}
	},
	'click .commentLike': function(event){
		var commentDocId = $(event.currentTarget).attr('data-docId');
		var userId =  Meteor.userId(); 
		var businessLink = FlowRouter.getParam('businessurl');
		var imageId =   $(event.currentTarget).attr('data-imageId'); 
		var commentUser =   $(event.currentTarget).attr('data-userId'); 

		var selector = {
			"businessLink"		: businessLink,
			"imgId"				: imageId,
			"userId"			: userId,
			"replyId"			: '',
			"commentDocId"		: commentDocId,
		}
		var data = ImageCommentLike.findOne(selector);

		var formValues = {
			"userId" 				: userId,
			"businessLink" 			: businessLink,
			"imgId" 	 			: imageId,
			"commentDocId"			: commentDocId,
		}

		if(formValues){
			Meteor.call('insertImageCommentLike', formValues, function(error, result){
				if(error){
				}else{
					// Vendor Modal Image Comment Reply
					// Vendor Modal Image Comment Reply

					// User Modal Image Added Comment Reply
					// User Modal Image Added Comment Reply

					// User Modal Image Comment Reply

					//============================================================
					// 			Notification Email / SMS / InApp
					//============================================================
					if(!data){
						var admin = Meteor.users.findOne({'roles':'admin'});
					    if(admin){
					    	var adminId = admin._id;
					    }

						var businessData = Business.findOne({"businessLink":formValues.businessLink});
						if(businessData){
							var vendorId = businessData.businessOwnerId;
	        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

	          	  			var userId = Meteor.userId();
	        				var userDetail = Meteor.users.findOne({'_id':userId});

	        				var commentedUser = Meteor.users.findOne({'_id':commentUser});
	        				

	        				if(vendorDetail&&userDetail&&commentedUser){

	        					//Send Notification, Mail and SMS to Vendor
	        					var vendorname 	= vendorDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
	   								'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : formValues.businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Like',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : formValues.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Like',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId

								}
								sendMailNotification(inputObj);


								//Send Notification, Mail and SMS to User that added Comment
								// commentUser userId
								if(commentUser!=userId){
		        					var commentUserName 	= commentedUser.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: commentUserName,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									var inputObj = {
										notifPath	 : formValues.businessLink,
									    to           : commentUser,
									    templateName : 'User Modal Image Added Comment Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId
									}
									sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : commentUser,
									    templateName : 'User Modal Image Added Comment Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj);
								}


								//Send Notification, Mail and SMS to Current User
								if(commentUser!=userId){

		        					var username 	= userDetail.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									// var inputObj = {
									// 	notifPath	 : formValues.businessLink,
									//     to           : vendorId,
									//     templateName : 'Vendor Business Page Like',
									//     variables    : msgvariable,
									// }
									// sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : userId,
									    templateName : 'User Modal Image Comment Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj); 
								}
	        				}
						}
					}
					//============================================================
					// 			End Notification Email / SMS / InApp
					//============================================================
				}
			});
		}
	},
	'click .commntMReplyLike': function(event){
		var commentDocId = $(event.currentTarget).attr('data-docId');
		var userId =  Meteor.userId(); 
		var businessLink = FlowRouter.getParam('businessurl');
		var imageId =   $(event.currentTarget).attr('data-imageId'); 
		var commentId =   $(event.currentTarget).attr('data-likeDocId'); 
		var commentUser =   $(event.currentTarget).attr('data-likeDocId'); 
		var userIdReply =   $(event.currentTarget).attr('data-userIdReply'); 
		var userIdComment =   $(event.currentTarget).attr('data-userIdComment'); 

		var formValues = {
			"userId" 				: userId,
			"businessLink" 			: businessLink,
			"imgId" 	 			: imageId,
			"commentDocId"			: commentDocId,
			"commentId"				: commentId,
		}

		var selector = {
			"businessLink"		: businessLink,
			"imgId"				: imageId,
			"userId"			: userId,
			"replyId"			: commentUser,
			"commentDocId"		: commentDocId,
		}
		var data = ImageCommentLike.findOne(selector);



		if(formValues){
			Meteor.call('insertCommentReplyLike', formValues, function(error, result){
				if(error){
				}else{

					// //============================================================
					// // 			Notification Email / SMS / InApp
					// //============================================================
					if(!data){
						var admin = Meteor.users.findOne({'roles':'admin'});
					    if(admin){
					    	var adminId = admin._id;
					    }

						var businessData = Business.findOne({"businessLink":formValues.businessLink});
						if(businessData){
							var vendorId = businessData.businessOwnerId;
	        				var vendorDetail = Meteor.users.findOne({'_id':vendorId});

	          	  			var userId = Meteor.userId();
	        				var userDetail = Meteor.users.findOne({'_id':userId});

	        				var commentedUser = Meteor.users.findOne({'_id':userIdComment});
	        				var repliedUser = Meteor.users.findOne({'_id':userIdReply});

	        				

	        				if(vendorDetail&&userDetail&&commentedUser&&repliedUser){

	        					//Send Notification, Mail and SMS to Vendor
	        					var vendorname 	= vendorDetail.profile.name;
		                		var date 		= new Date();
		                		var currentDate = moment(date).format('DD/MM/YYYY');
		                		var msgvariable = {
									'[username]' 	: vendorname,
				   					'[currentDate]'	: currentDate,
	   								'[businessName]': businessData.businessTitle

				               	};

								var inputObj = {
									notifPath	 : formValues.businessLink,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Reply Like',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId
								}
								sendInAppNotification(inputObj);

								var inputObj = {
									notifPath	 : formValues.businessLink,
									from         : adminId,
								    to           : vendorId,
								    templateName : 'Vendor Modal Image Comment Reply Like',
								    variables    : msgvariable,
								    type 		 : "Modal",
								    picId		 : formValues.imgId

								}
								sendMailNotification(inputObj);


								//Send Notification, Mail and SMS to User that added Comment
								if(userIdComment!=userId){
		        					var commentUserName 	= commentedUser.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: commentUserName,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									var inputObj = {
										notifPath	 : formValues.businessLink,
									    to           : userIdComment,
									    templateName : 'User Modal Image Added Comment Reply Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId
									}
									sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : userIdComment,
									    templateName : 'User Modal Image Added Comment Reply Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj);
								}

								//Send Notification, Mail and SMS to User that added Comment Reply
								if(repliedUser!=userId){
		        					var commentUserName 	= repliedUser.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: commentUserName,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									var inputObj = {
										notifPath	 : formValues.businessLink,
									    to           : repliedUser,
									    templateName : 'User Modal Image Added Comment SubReply Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId
									}
									sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : repliedUser,
									    templateName : 'User Modal Image Added Comment SubReply Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj);
								}


								//Send Notification, Mail and SMS to Current User
								if(commentUser!=userId){

		        					var username 	= userDetail.profile.name;
			                		var date 		= new Date();
			                		var currentDate = moment(date).format('DD/MM/YYYY');
			                		var msgvariable = {
										'[username]' 	: username,
					   					'[currentDate]'	: currentDate,
		   								'[businessName]': businessData.businessTitle

					               	};

									// var inputObj = {
									// 	notifPath	 : formValues.businessLink,
									//     to           : vendorId,
									//     templateName : 'Vendor Business Page Like',
									//     variables    : msgvariable,
									// }
									// sendInAppNotification(inputObj);

									var inputObj = {
										notifPath	 : formValues.businessLink,
										from         : adminId,
									    to           : userId,
									    templateName : 'User Modal Image Comment SubReply Like',
									    variables    : msgvariable,
									    type 		 : "Modal",
									    picId		 : formValues.imgId

									}
									sendMailNotification(inputObj); 
								}
	        				}
						}
					}
					
				
					// //============================================================
					// // 			End Notification Email / SMS / InApp
					// //============================================================
					// Vendor Modal Image Comment Reply Like
					// Vendor Modal Image Comment Reply Like

					// User Modal Image Added Comment Reply Like
					// User Modal Image Added Comment Reply Like

					// User Modal Image Added Comment SubReply Like
					// User Modal Image Added Comment SubReply Like

					// User Modal Image Comment SubReply Like

				}
			});
		}
	},
	'click .replyEllpDelete': function(event){
		var imgId 			= $(event.currentTarget).attr('data-imgId');
		var cuurrrentUserId = Meteor.userId();
		var commentDocId 	= $(event.currentTarget).attr('data-docId');
		var commentUserId	= $(event.currentTarget).attr('data-authUserId');
		var businessLink 	= FlowRouter.getParam('businessurl');

		var formValues = {
			"userId" 				: cuurrrentUserId,
			"businessLink" 			: businessLink,
			"imgId" 	 			: imgId,
			"commentDocId"			: commentDocId,
		}


		if(cuurrrentUserId == commentUserId){
			Meteor.call('deleteImageCommentLike',formValues, function(error,result){
				if(error){
				}else{
					// Bert.alert('Comment Deleted Successfully!', 'success', 'growl-top-right');
				}
			});

			Meteor.call('deleteImageComment', formValues, function(error,result){
				if(error){
				}else{
					Bert.alert('Comment Deleted Successfully!', 'success', 'growl-top-right');
				}
			});
		}
	},
	'click .replyOfRplyEllpDelete': function(event){
		var imgId 			= $(event.currentTarget).attr('data-imgId');
		var cuurrrentUserId = Meteor.userId();
		var commentDocId 	= $(event.currentTarget).attr('data-docId');
		var commentUserId	= $(event.currentTarget).attr('data-authUserId');
		var businessLink 	= FlowRouter.getParam('businessurl');
		var replyId 		= $(event.currentTarget).attr('data-replyid');

		var formValues = {
			"businessLink" 			: businessLink,
			"imgId" 	 			: imgId,
			"commentDocId"			: commentDocId,
			"replyId"				: parseInt(replyId),
		}

		if(cuurrrentUserId == commentUserId){
			Meteor.call('deleteReplyImageCommentLike',formValues, function(error,result){
				if(error){
				}else{
					// Bert.alert('Comment Deleted Successfully!', 'success', 'growl-top-right');
				}
			});
			Meteor.call('deleteReplyImageComment', formValues, function(error,result){
				if(error){
				}else{
					Bert.alert('Comment Deleted Successfully!', 'success', 'growl-top-right');
				}
			});
		}
	},
	'click .replyEllpEdit': function(event){
		var imgId 			= $(event.currentTarget).attr('data-imgId');
		var cuurrrentUserId = Meteor.userId();
		var commentDocId 	= $(event.currentTarget).attr('data-docId');
		var commentUserId	= $(event.currentTarget).attr('data-authUserId');
		var businessLink 	= FlowRouter.getParam('businessurl');

		var imgComment = ImageComment.findOne({"_id":commentDocId});
		if(imgComment){
			$(event.currentTarget).parent().parent().parent().siblings('.userCommentText').children('.replyInputShwHid').addClass('editReplyTextHide');
			$(event.currentTarget).parent().parent().parent().siblings('.userCommentText').children('.editReplyInput').addClass('editReplyInputC');
			$(event.currentTarget).parent().parent().parent().siblings('.userCommentText').children('.editReplyInput').val(imgComment.imgcomment);
		}

	},
	'keypress .editReplyInput':function(event){
		var commentId = $(event.currentTarget).attr('data-commentId');
		if(event.key == 'Enter'){
			var formValues = {
				"imgcomment"			: (event.currentTarget.value).trim(),
				"userId" 				: Meteor.userId(),
				"businessLink" 			: FlowRouter.getParam('businessurl'),
				"imgId" 	 			: Session.get('ModalimageID'),
				"commentId"				: commentId,
			};
			if(formValues.imgcomment){
				Meteor.call('updateImgCommnt',formValues, function(error, result){
					if(error){
					}else{
						$('.replyInputShwHid').removeClass('editReplyTextHide');
						$('.editReplyInput').removeClass('editReplyInputC');
						event.currentTarget.value='';

					}
				});
			}
    	}
	},
	'click .replyOfRplyEllpEdit': function(event){
		var imgId 			= $(event.currentTarget).attr('data-imgId');
		var cuurrrentUserId = Meteor.userId();
		var commentDocId 	= $(event.currentTarget).attr('data-docId');
		var commentUserId	= $(event.currentTarget).attr('data-authUserId');
		var businessLink 	= FlowRouter.getParam('businessurl');
		var replyId 		= $(event.currentTarget).attr('data-replyId');
						


		var imgComment = ImageComment.findOne({"_id":commentDocId});
		if(imgComment){
			if(imgComment.imgMultiComment){
				for(i=0;i<imgComment.imgMultiComment.length;i++){
					if(imgComment.imgMultiComment[i].replyId==replyId){
						$(event.currentTarget).parent().parent().parent().siblings('.userCommentText').children('.replyOfReplyInpShwHid').addClass('editReplyTextHide');
						$(event.currentTarget).parent().parent().parent().siblings('.userCommentText').children('.editReplyOfReplyInput').addClass('editReplyInputC');
						$(event.currentTarget).parent().parent().parent().siblings('.userCommentText').children('.editReplyOfReplyInput').val(imgComment.imgMultiComment[i].imgcomment);
					}
				}
			}


			
		}

	},
	'keypress .editReplyOfReplyInput':function(event){
		var commentId = $(event.currentTarget).attr('data-commentId');
		var replyId   = $(event.currentTarget).attr('data-replyId');
		if(event.key == 'Enter'){
			var formValues = {
				"imgcomment"			: (event.currentTarget.value).trim(),
				"userId" 				: Meteor.userId(),
				"businessLink" 			: FlowRouter.getParam('businessurl'),
				"imgId" 	 			: Session.get('ModalimageID'),
				"commentId"				: commentId,
				"replyId"				: parseInt(replyId),
			};
			if(formValues.imgcomment){
				Meteor.call('updateReplyImgCommnt',formValues, function(error, result){
					if(error){
					}else{
						event.currentTarget.value='';
						$('.replyOfReplyInpShwHid').removeClass('editReplyTextHide');
						$('.editReplyOfReplyInput').removeClass('editReplyInputC');
					}
				});
			}
    	}
	},
	
});