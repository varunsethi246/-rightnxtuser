import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { Session } from 'meteor/session';
import './main.html';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

// import { BusinessOwnerImages } from '/imports/ostriofiles/addBusinessOwnerClient.js';
// import  {BusinessOwnerImages}  from '/imports/videoUploadClient/addBusinessOwner.js';
Meteor.startup(() => {

	global.Buffer = function() {}
	global.Buffer.isBuffer = () => false
	global.Buffer = global.Buffer || require("buffer").Buffer; // eslint-disable-line
	// global.Buffer = global.Buffer || require("buffer").Buffer;
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
// $(document).mouseup(function(e) 
// {
//     var container = $(".passwordWrongSpan");

//     // if the target of the click isn't the container nor a descendant of the container
//     if (container.is(e.target) && !container.has(e.target).length === 0) 
//     {
//         container.hide();
//     }
// });
// $("body").click
// (
//   function(e)
//   {
//     if(e.target.className !== $('#publish3'))
//     {
//       $(".passwordWrongSpan").hide();
//     }
//   }
// );
Meteor.startup(function () {
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

// add Proof image function
// addBusinessOwnerImages = function(file,self,businessLink) {
//     // console.log("file",file);
//     // console.log("prooftype",prooftype);
//     // console.log("self",self);
//     uploadInstance = BusinessOwnerImages.insert({
//                                         file: file,
//                                         // meta: {
//                                         //                 locator : self.props.fileLocator,
//                                         //                 userId  : Meteor.userId() // Optional, used to check on server for file tampering
//                                         // },
//                                         streams         : 'dynamic',
//                                         chunkSize       : 'dynamic',
//                                         allowWebWorkers : true // If you see issues with uploads, change this to false
//     }, false);

//     // self.setState({
//     //     uploading  : uploadInstance, // Keep track of this instance to use below
//     //     inProgress : true // Show the progress bar now
//     // });

//     // These are the event functions, don't need most of them, it shows where we are in the process
//     uploadInstance.on('start', function () {
//     });

//     uploadInstance.on('end', function (error, fileObj) {
//     });

//     uploadInstance.on('uploaded',  (error, fileObj) => {
//         if(fileObj){
//             // console.log("fileObj._id: ",fileObj._id);
           
//                 Meteor.call("updateBusinessAboutOwnerImage",fileObj._id,businessLink,(error, result)=>{
//                     // swal({
//                     //     position: 'top-right',
//                     //     type: 'success',
//                     //     title: 'Uploaded Successfully',
//                     //     showConfirmButton: false,
//                     //     timer: 1500
//                     // });
//                 });
//         }

//         // self.setState({
//         //     uploading  : [],
//         //     progress   : 0,
//         //     inProgress : false
//         // });
//     });

//     uploadInstance.on('error', function (error, fileObj) {
//     });

//     // uploadInstance.on('progress', function (progress, fileObj) {
//     //     Session.set("uploadProofDocProgressPercent",progress);
       
//     //     self.setState({
//     //         progress : progress
//     //     })
//     // });

//     uploadInstance.start(); // Must manually start the uploaded
// }


