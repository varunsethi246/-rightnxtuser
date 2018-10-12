import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from '/imports/api/businessMaster.js';
import { Offers } from '/imports/api/offersMaster.js';
import { Review } from '/imports/api/reviewMaster.js';
import { SavedOffer } from '/imports/api/savedOffersMaster.js';
import { OfferImage } from '/imports/videoUploadClient/offerImageClient.js';

import { Categories } from '../../api/masterData/categoriesMaster.js';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './userOffers.html';

sortOfferDateAscending = function(){
    var products = $('.businessVendorOfferText');
    products.sort(function(a, b){ return $(a).data("date")-$(b).data("date")});
    $("#offerDateSort").html(products);

}

sortOfferDateDescending = function(){
    var products = $('.businessVendorOfferText');
    products.sort(function(a, b){ return $(b).data("date") - $(a).data("date")});
    $("#offerDateSort").html(products);

}


Template.userOffers.helpers({
	checkOfferLoading(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		
		var userSavedOffer = SavedOffer.find({"userId":id}).count();
		if(userSavedOffer<=0){
			return true;
		}else{
			return false;
		}
	},
	userOffersData(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		var data = {};
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var userSavedOffer = SavedOffer.find({"userId":id}).fetch();
		// console.log("userSavedOffer: ",userSavedOffer);
		var userOffersList = [];

	  	if(userSavedOffer){
			for(i=0; i<userSavedOffer.length; i++){
				var businessOffers = Offers.findOne({"_id" : userSavedOffer[i].offerId});
				if(businessOffers){
					var getBusData = Business.findOne({"_id":businessOffers.businessId});
					businessOffers.busTitle = getBusData.businessTitle;
					businessOffers.busLink = getBusData.businessLink;
					var date = businessOffers.expirationFromDate;
					var toDate = businessOffers.expirationToDate;
					var offerDateNumber = new Date(businessOffers.expirationToDate);
					businessOffers.offerDateNumber = offerDateNumber.getTime();
					businessOffers.expirationFromDate = moment(date).format("DD MMM");
					businessOffers.expirationToDate = moment(toDate).format("DD MMM YYYY");
					var businessName = Business.findOne({"_id":businessOffers.businessId});
					if(businessName){
						var categories  = getCategory(businessName.businesscategories);
						if(categories){
							businessOffers.categoryClasses = categories;
						}
						businessName.businessArea 	= businessName.businessArea.split(' ').join('-');
						businessOffers.AreaClasses 	= businessName.businessArea.split('.').join('-');
					}
					userOffersList.push(businessOffers);
				}

			}
			// console.log("userOffersList: ",userOffersList);
			return userOffersList;
		}
	},
	offerImgData(){
		var businessOffers = Offers.findOne({"_id" : this._id, "offerStatus":'Active'});
		if(businessOffers){
			var pic = OfferImage.findOne({'_id' : businessOffers.offerImage});
			if(pic){
				return pic;
			}	
		}
	},
});




getCategory = function(categoriesArray){
	var categories = [];
	if(categoriesArray){
		// console.log(categoriesArray);
		var categoriesCount = categoriesArray.length;
		// console.log(categoriesCount);
		for(j = 0 ; j < categoriesCount ; j++)
		{
			var levelDataObject =  categoriesArray[j];
			// console.log('levels data : ', levelData);
			// console.log(typeof levelData);
			var levelData  =  String(levelDataObject);
			if (levelData) {
			  var levels     =  levelData.split('>');
				if(levels[1]){
					// console.log(levels[1]);
					var level1 = levels[1].trim();
					// console.log(level1);
					categories.push(level1);
					// levelData = '';
				}	
			}
		}
		// console.log(categories);
		var busCategories = _.uniq(categories);
		var categoryClasses = '';
		for(k=0;k<busCategories.length;k++){
			var businessSplit = busCategories[k].split(' ').join('-');
			categoryClasses = categoryClasses + ' ' + businessSplit;
		}
		return categoryClasses;
	}
}



Template.userOffers.helpers({
	businessOfferCategoriesList(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var userId     = id;
		var categories =[];
		var offerData = SavedOffer.find({"userId":userId}).fetch();
		if(offerData){
			for (var i = 0; i < offerData.length; i++) {
				var businessLinkVar	= offerData[i].businessId;
				var businessData   	= Business.findOne({'_id':businessLinkVar});
				if(businessData.businesscategories){
					var categoriesCount = businessData.businesscategories.length;
					for(j = 0 ; j < categoriesCount ; j++)
					{
						var levelData =  businessData.businesscategories[j];
						// console.log('levels data : '+ levelData);
						var levels = levelData.split('>');
						if(levels[1]){
							var level1 = levels[1].trim();
							categories.push(level1);
						}
						
					}
				}
			}
			var busCategories = _.uniq(categories);
			// console.log('categories: '+ JSON.stringify(busCategories,4,null));
			return busCategories;
		}

	},

	businessOfferLocationList(){
		var id = '';
		var url = FlowRouter.current().path;
		var checkIdExists = url.split('/');
		if(checkIdExists[2] != '' && checkIdExists[2]){
			id = produceURLid(checkIdExists[2]);
		}else{
			id = Meteor.userId();
		}
		var userId     = id;
		var location =[];
		var userSavedOffer = SavedOffer.find({"userId":userId}).fetch();
		if(userSavedOffer){
			for (var i = 0; i < userSavedOffer.length; i++) {
				var businessLinkVar	= userSavedOffer[i].businessId;
				var businessData   	= Business.findOne({'_id':businessLinkVar});
				if(businessData.businessArea){
					location.push(businessData.businessArea);
				}
			}
			var busOffer = _.uniq(location);
			// console.log('offer: '+ JSON.stringify(busOffer,4,null));
			return busOffer;
		}

	},

});


Template.userOffers.events({
	'click .userOfferShare' : function(event){
		var fromEmail = Meteor.users.findOne({roles:'admin'}).emails[0].address;
		var id = event.currentTarget.id;
		var offerData = Offers.findOne({'_id': id});
		var offerImgObj  = OfferImage.findOne({'_id' : offerData.offerImage});

		if(offerImgObj){
			var offerImgId = offerImgObj.link();
		}else{
			var offerImgId = '';
		}

		if(offerData){
			var subj = offerData.dealHeadline;
			var dealDesc = offerData.dealDescription;
			var from = moment(offerData.expirationFromDate).format("DD MMM");
			var to = moment(offerData.expirationToDate).format("DD MMM YYYY");
		}
		
		var toEmail = $('#toVEmail-'+id).val();	
		if (offerImgId) {
			var image = offerImgId;
		}else{
			var imgUri = "images/logo.png";
	    	var image  = Meteor.absoluteUrl(imgUri);
		}	
	    var name = Meteor.users.findOne({_id:Meteor.userId()}).profile.name;
	    var addText = $('#toVAddNote-'+id).val();
	    var msg = 'Hi there, <br/><br/>'+name+ ' has share offer with you. Check it out.<p>'+addText+'</p><br/><div style="border: 1px solid #ccc; width: 550px;"><img src='+image+' alt="" style="height: 60px; width: 60px; padding-left: 15px; padding-top: 15px;" /><SPAN style= "font-size: 16px; font-weight: 700; position:absolute; top: 40%; padding-left: 2%;">'+subj+'</SPAN><span style=""><h5 style="padding-right: 15px; padding-left: 15px;">Expiration Date: From '+from+' To '+to+' </h5><hr style="margin-right: 15px; margin-left: 15px;"><p style="font-size: 14px; padding-right: 15px; padding-left: 15px; text-align: justify; font-weight: 400; color: #555;">'+dealDesc+'</p></span></div>';

		Meteor.call('sendEmailRightNxt', toEmail, fromEmail, subj, msg,function(error,result){
			if(error){
				Bert.alert('Please enter email Id.', 'danger', 'growl-top-right' );
				return;
			}else{
				$('#shareOfferPage-'+id).modal('hide');
				Bert.alert('Offer successfully shared with your friend.','success','growl-top-right');
			}
		});
	},
	'click .knowMore': function(event){
		var $this = $(event.target);

		if($this.hasClass('lessShow')){
			$this.html('Know More');
			$this.parent().parent().find('.informationHide').fadeOut();
			$this.removeClass('lessShow');
		}else{
			$this.parent().parent().find('.informationHide').fadeIn();
			$this.html('Less');
			$this.addClass('lessShow');
		}
	},

	'change #sortOfferDate' : function(){
		var sortDate = $('#sortOfferDate').val();
		if(sortDate == 'oldestRevFirst'){
			sortOfferDateAscending();
		}else{
			sortOfferDateDescending();
		}
	},

	'change .categorySelect' : function(event){
		event.preventDefault();
		var categoryValueSelected = $(event.target).val();
		var showCat = categoryValueSelected.split(' ').join('-');
		if(categoryValueSelected == '-'){
			$('.businessVendorOfferText').show();
		}else{
			$('.businessVendorOfferText').hide();
			$('.'+showCat).show();			
		}
	},

	'change .locationSelect' : function(event){
		event.preventDefault();
		var LocationValueSelected = $(event.target).val();
		var showLoc = LocationValueSelected.split(' ').join('-');
		var showLoc = showLoc.split('.').join('-');
		// console.log('showLoc ',showLoc);
		if(LocationValueSelected == '-'){
			$('.businessVendorOfferText').show();
		}else{
			$('.businessVendorOfferText').hide();
			$('.'+showLoc).show();			
		}
	},
});

userOffersForm = function () {  
  BlazeLayout.render("userLayout",{content: 'userOffers'});
  // Blaze.render(Template.userLayout,document.body);
}
export { userOffersForm }