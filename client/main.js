import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

Meteor.startup(() => {

	global.Buffer = function() {}
	global.Buffer.isBuffer = () => false
	global.Buffer = global.Buffer || require("buffer").Buffer; // eslint-disable-line
	// global.Buffer = global.Buffer || require("buffer").Buffer;

	TimeSync.loggingEnabled = false;

	generateURLid =function(id){
		var newurl = 'visituser?q=rightnxt+url&oq=user..69i57j0j69i60l2j0l2.4907j0j7&id='+id+'&sourceid=chrome&ie=UTF-8';
		return newurl;
	}
	
	produceURLid = function (id){
		if(id){		
			var newid = FlowRouter.getQueryParam('id');
			return newid;
		}
	}
});

$(document).on("click",function(){
	$('.activeDownList').hide();
	$('.activeDownListFlag').hide();
	// $('.passwordWrongSpan').removeClass('reviewWrngErrorMsg');
});

$(document).on('click',function(){
	$(".loginClosenew").click(function() {
	    $('.loginEmail').val('');
	    $('.loginPassword').val('');
	});
});




