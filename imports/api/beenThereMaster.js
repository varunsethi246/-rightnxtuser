import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { check } from 'meteor/check';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

import { Business } from './businessMaster.js';

export const BeenThere = new Mongo.Collection('beenThere');

if (Meteor.isServer) {
  // This code only runs on the server
	Meteor.publish('beenThereCount', function(userId) {
		// var userId =  this.userId;
		Counts.publish(this, 'beenThereCount', BeenThere.find({'userId':userId,'businessStatus':'active'}));
		Counts.publish(this, 'beenThereCount', BeenThere.find({'userId':userId}));
	});
	Meteor.publish('beenThere', function beenThere(businessLink) {
		var businessObj = Business.findOne({"businessLink" : businessLink});
		if(businessObj){
	    return BeenThere.find({"businessId":businessObj._id});  		
		}
	});

	Meteor.publish('userBeenThere', function userBeenThere(userId) {
	    return BeenThere.find({"userId":userId});  		
	});
	Meteor.publish('alluserBeenThere', function alluserBeenThere() {
	    return BeenThere.find({});  		
	});
	Meteor.publish('businessBeenThereCount', function businessBeenThereCount() {
	    return BeenThere.find({});  		
	});

   Meteor.publish('VendorBeenThereCount', function(businessLink) {
		Counts.publish(this, 'VendorBeenThereCount', BeenThere.find({'businessStatus':'active','businessLink':businessLink}));
	});
}

Meteor.methods({
	'insertBeenThere':function(businessurl,actInact){

		var businessObj = Business.findOne({"businessLink":businessurl});
		if(businessObj){
			businessId 			= businessObj._id;
			if(actInact == 'inactive'){
				BeenThere.remove({'businessId':businessId});
			}else{
				BeenThere.insert({ 
				 	'userId'        	: Meteor.userId(),
				 	'businessId'		: businessId,
				 	'businessLink'		: businessurl,
				 	'businessStatus'	: 'active',
					'createdAt'     	: new Date(),
					}, function(error,result){
						if(error){
							return error;
						}
						if(result){
							return result; 
						}
					}

				);				
			}
		}		
	
	},
});