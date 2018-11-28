import './userProfile.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';
import { FollowUser } from '/imports/api/userFollowMaster.js';
import { VendorImage } from '/imports/videoUploadClient/vendorImageClient.js';
import ImageCompressor from 'image-compressor.js';

Template.userProfile.onCreated(function() {
    this.currentUpload = new ReactiveVar(false);
    // this.subscribe('vendorImage');
});

Template.userProfile.helpers({
	currentUserFollow:function(){
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('&');
		if (checkIdExists[2] == Meteor.userId()) {
			return true;
		}

	},
	currentUpload: function() {
        return Template.instance().currentUpload.get();
    },

	'userDetails' : function(){
		if(Session.get("updateUserTimeline")==true){
			var id = Meteor.userId();
			if(!Roles.userIsInRole(id, ['Vendor'])){
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}
			}
			// console.log('userprofile|'+id+'|');
	
			if(id){
				var data = Meteor.users.findOne({"_id":id},{"profile":1});
				if(data){
					// data.aboutText =  data.profile.aboutMe;
					var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
					if(pic){
						if(pic.type=='image/png'){
							data.checkPng = 'bkgImgNone';	
						}else{
							data.checkPng = '';	
						}
						data.profile.userProfilePic = pic.link();	
					}
					else{
						data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					if(Roles.userIsInRole(id, ['Vendor'])){
						data.statusClass = 'show';
					}else{
						if(checkIdExists[2] != '' && checkIdExists[2]){
							data.statusClass = 'hide';
						}else{
							data.statusClass = 'show';
						}
					}
					if(data.profile.city == '-'){
						data.profile.city = false;
					}
	
					var url = FlowRouter.current().path;
	
					if(url=='/profileSetting' || url== '/notificationConfiguration' || url=="/editProfile"){
						data.statusClassPro = 'hide';
						data.statusClassProSet = 'show';
					}else{
						data.statusClassPro = 'show';
						data.statusClassProSet = 'hide';
					}

					if(url.split('/')[2]){
						data.followButton = 'hideFollowButton';
					}else{
						data.followButton = '';
						data.followButtonText 	= "Follow";
						data.followButtonClass = "";
						var verifyFollow = FollowUser.findOne({
																"userId": Meteor.userId(),
																"followUserId": data._id
															 });
						if(verifyFollow){
							data.followButtonText 	= "Following";
							data.followButtonClass = "alreadyFollowing";
						}
					}
					return data;
				}			
			}
		}else{
			var id = Meteor.userId();
			if(!Roles.userIsInRole(id, ['Vendor'])){
				var url = FlowRouter.current().path;
				var checkIdExists = url.split('/');
				// console.log("checkIdExists: ",checkIdExists);
	
				if(checkIdExists[2] != '' && checkIdExists[2]){
					id = produceURLid(checkIdExists[2]);
				}
			}
	
			if(id){
				var data = Meteor.users.findOne({"_id":id},{"profile":1});
				if(data){
					// data.aboutText =  data.profile.aboutMe;
					var pic = VendorImage.findOne({"_id":data.profile.userProfilePic});
					if(pic){
						if(pic.type=='image/png'){
							data.checkPng = 'bkgImgNone';	
						}else{
							data.checkPng = '';	
						}
						data.profile.userProfilePic = pic.link();	
					}
					else{
						data.profile.userProfilePic = "/users/profile/profile_image_dummy.svg";	
					}
					if(Roles.userIsInRole(id, ['Vendor'])){
						data.statusClass = 'show';
					}else{
						if(checkIdExists[2] != '' && checkIdExists[2]){
							data.statusClass = 'hide';
						}else{
							data.statusClass = 'show';
						}
					}
					if(data.profile.city == '-'){
						data.profile.city = false;
					}
	
					var url = FlowRouter.current().path;
	
					if(url=='/profileSetting' || url== '/notificationConfiguration' || url=="/editProfile"){
						data.statusClassPro = 'hide';
						data.statusClassProSet = 'show';
					}else{
						data.statusClassPro = 'show';
						data.statusClassProSet = 'hide';
					}

					if(!url.split('/')[2]){
						data.followButton = 'hideFollowButton';
					}else{
						data.followButton = '';
						var verifyFollow = FollowUser.findOne({
																"userId": Meteor.userId(),
																"followUserId": data._id
															 });
						if(verifyFollow){
							data.followButtonText 	= "Following";
							data.followButtonClass = "alreadyFollowing";
						}else{
							data.followButtonText 	= "Follow";
							data.followButtonClass = "";
						}
					}

					return data;
				}			
			}
		}
		
	},

	'displayUserProfile' : function(id){
		if(id){
			return true;
		}
		else{
			return false;
		}
	},
});



Template.userProfile.events({
	'mouseenter .genHead' : function(event){
		var checkIdExists = FlowRouter.getQueryParam('id');
		if(checkIdExists){
			$(event.target).find('.profileBkImg').css('opacity','1');
			$(event.target).find('.cameraIconPro').css('opacity','0');
			$(event.target).find('.cameraIconPro').children('.profilepicHide').css('cursor','default');
		}
	},

	'click .cameraIconPro' : function(event){
		var checkIdExists = FlowRouter.getQueryParam('id');
		if(!checkIdExists){
			$("input[id='uploadImg']").click();
		}
	},
	
	'change .userProfileImg': function(event,template){

		// var name = event.currentTarget.files[0].name;
		// console.log('name:',name);
	    // event.preventDefault();
	    if(event.currentTarget.files[0]){  
	    	// console.log(event.currentTarget.files[0].size);
	    	// $('#userPic').removeClass('bkgImgNone');
	    	// $('#userPic').attr('src','');
	    	const imageCompressor = new ImageCompressor();

			imageCompressor.compress(event.currentTarget.files[0])
			  .then((result) => {
			    // console.log(result);

			    // Handle the compressed image file.
			    // We upload only one file, in case
				// multiple files were selected
				const upload = VendorImage.insert({
					file: result,
					streams: 'dynamic',
					chunkSize: 'dynamic',
					// imagetype: 'profile',
				}, false);

				upload.on('start', function () {
					template.currentUpload.set(this);
				});

				upload.on('end', function (error, fileObj) {
					if (error) {
					  // alert('Error during upload: ' + error);
					   console.log('Error during upload 1: ' + error);
					   console.log('Error during upload 1: ' + error.reason);
					} else {
				  		// alert('File "' + fileObj._id + '" successfully uploaded');
				    	Bert.alert('User Image uploaded.','success','growl-top-right');
				  	
					  	// console.log(fileObj._id);
					  	Meteor.call("updateUserProfileImage", fileObj._id,
					        function(error, result) { 
					            if(error) {
					              console.log ('Error Message: ' +error ); 
					            }else{
					                // Bert.alert( 'Image Updated successfully!!!!', 'success', 'growl-top-right' );
					                // $('.editBlogImage').hide();
					        }
					    });
					}
					template.currentUpload.set(false);
				});

				upload.start();
			  })
			  .catch((err) => {
			    // Handle the error
			})    
	    }
	},
	'click .userFollow' : function(event){
		event.preventDefault();
		// var followid = event.currentTarget.id.split('-');
		// var followUserId = followid[1];
		var followUserId = FlowRouter.getQueryParam('id');
		var userId = Meteor.userId();
		var verifyFollow = FollowUser.findOne({"userId": Meteor.userId(),"followUserId": followUserId});
		
		if(verifyFollow){
			var id = verifyFollow._id;
			Meteor.call('removeUserFollow',id,function(error,result){
				if (error) {
					console.log(error);
				}else{
					var admin = Meteor.users.findOne({'roles':'admin'});
				    if(admin){
				    	var adminId = admin._id;
				    }//admin

	                	var userVar    = Meteor.users.findOne({'_id':followUserId});
	                	if(userVar){
	        				var username 	= userVar.profile.name;
	                		var date 		= new Date();
	                		var currentDate = moment(date).format('DD/MM/YYYY');
	                		var msgvariable = {
								'[username]' 	: username,
			   					'[currentDate]'	: currentDate
			               	};
							var inputObj = {
							    to           : followUserId,
							    templateName : 'UnFollow',
							    variables    : msgvariable,
							}
							sendInAppNotification(inputObj);

							var inputObj = {
								from         : adminId,
							    to           : followUserId,
							    templateName : 'UnFollow',
							    variables    : msgvariable,
							}

							sendMailNotification(inputObj);
							$('.followII').css('display','block');
	                	}//userVar
				}
			});
		}else{
			Meteor.call('insertUserFollow',followUserId, function(error, result){
			if(error){
				// Bert.alert('Some technical issue happened... You couldn\'t follow', 'danger', 'growl-top-right');
			}else{
				var admin = Meteor.users.findOne({'roles':'admin'});
			    if(admin){
			    	var adminId = admin._id;
			    }//admin 
				var getResult = result;
				var followData = FollowUser.findOne({"_id":getResult});
              	if(followData){
                	var usermailId = followData.followUserId;
                	var userVar    = Meteor.users.findOne({'_id':usermailId});
                	if(userVar){
        				var username 	= userVar.profile.name;
                		var date 		= new Date();
                		var currentDate = moment(date).format('DD/MM/YYYY');
                		var msgvariable = {
							'[username]' 	: username,
		   					'[currentDate]'	: currentDate
		               	};
						var inputObj = {
						    to           : usermailId,
						    templateName : 'Follow',
						    variables    : msgvariable,
						}
						sendInAppNotification(inputObj);
						var inputObj = {
							from         : adminId,
						    to           : usermailId,
						    templateName : 'Follow',
						    variables    : msgvariable,
						}
						sendMailNotification(inputObj);
						$('.followII').css('display','none');
                	}//userVar
              	}//followData 
			}
		});
		}
	},

});

