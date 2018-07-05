userTimelinePageFunc= function () {    
	console.log('in mainfunction');
	import('/imports/userarea/userTimeline/userTimelinePage.js')
	.then(function (handle) {        
		handle.userTimelinePageForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
profileSettingFunc= function () {    
	import('/imports/userarea/profileSetting/profileSetting.js').then(function (handle) {        
		handle.profileSettingForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
UMregisterFunc= function () {
// console.log('asda');    
	import('/imports/common/UM/UMregister.js').then(function (handle) {        
		handle.UMregisterForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

LoginOTPFunc= function () {    
	import('/imports/common/LoginOTP.js').then(function (handle) {        
		handle.LoginOTP();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
VenderLoginFormFunc= function () {    
	import('/imports/common/vendorLoginForm.js').then(function (handle) {        
		handle.VenderLoginForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorSignUpFormFunc= function () {    
	import('/imports/common/vendorSignUpForm.js').then(function (handle) {        
		handle.vendorSignUpForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

loadingFf = function () {    
	import('/imports/common/common.js').then(function (handle) {        
		handle.loadingF();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}

notificationConfigFunc= function () {    
	import('/imports/notifications/notificationConfig.js').then(function (handle) {        
		handle.notificationConfigForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
vendorBusinessLayoutFunc= function () {    
	import('/imports/vendor/vendorBusinessDetails/vendorBusinessDetails.js')
	.then(function (handle) {        
		handle.vendorBusinessLayoutForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
generalContentFunc= function () {    
	import('/imports/general/generalLayout/generalLayout.js').then(function (handle) {        
		handle.generalContentForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
faqFormThreeFunc= function () {    
	import('/imports/general/FAQ/faq.js').then(function (handle) {        
		handle.faqFormThree();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}
editPagesFunc= function () {    
	import('/imports/general/EditPages/editPages.js').then(function (handle) {        
		handle.editPagesForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}


jobListFunc= function () {    
	import('/imports/general/careers/career.js').then(function (handle) {        
		handle.jobListForm();    
	})
	.then(function(){
		$("#inject-loader-wrapper").fadeOut(1500, function() { $(this).remove(); });
	})
}