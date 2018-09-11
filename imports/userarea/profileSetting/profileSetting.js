import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Template } from 'meteor/templating';
import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '../userLayout.js';
import './profileSetting.html';
import './profileSettingSidebar.js';
import './profileSettingLayout.html';
import './editProfile.js';

Template.profileSetting.events({
  'submit #change-password': function(event){
    event.preventDefault();

    var newPwd =  event.target.newPwd.value;
    var confirmPwd =  event.target.confirmPwd.value;
    var currentPwd =  event.target.currentPwd.value;


    var hashpwd = Package.sha.SHA256(currentPwd);
    Meteor.call('checkPassword', hashpwd, function(err, result) {
      if(result){
        // Bert.alert( 'Old Password is correct!', 'success', 'fixed-top' );
        if(newPwd == confirmPwd){
            Meteor.call('changeMyPassword',newPwd,function(err,result){
              if(err){
                Bert.alert('Password can not be changed!', 'danger', 'growl-top-right');
              }else{
                FlowRouter.go('/');
                Bert.alert('Your password has been changed successfully! Please login again!', 'success', 'growl-top-right' );
                // $("html,body").scrollTop(0);
              }
          });
        }else{
         Bert.alert('Your New Password does not match with Confirm Password!', 'danger', 'growl-top-right', 'fa-frown-o' );        
        }
      }else{
        Bert.alert('Your Old Password is not correct!', 'danger', 'growl-top-right', 'fa-frown-o' );        
      }
    }); 
  },

  'click .userYesbtn': function(event) {
    event.preventDefault();
    
    var fromEmail = Meteor.users.findOne({roles:'admin'}).emails[0].address;
    var userId    = Meteor.userId();
    var name      = Meteor.users.findOne({_id:userId}).profile.name;
    var to        = Meteor.users.findOne({_id:userId}).emails[0].address;
    var msg       = 'Hi '+name+', <br/><br/> Your account is block sucssefuly. To unblock contact us.';
    var subject   = 'Your account is block.';
    // console.log(fromEmail);
    // console.log(to);
    // console.log(name);
    // console.log(msg);
    // console.log(subject);
    Meteor.call('blockUser',function(err, result) {
        if (err) {
          console.log("err",err);
          }else {
            Meteor.call('sendBlockEmailRightnxt', to , fromEmail, subject , msg,function(error,result){
              if(error){
                Bert.alert(error.reason, 'danger', 'growl-top-right' );
                return;
              }else{
                Bert.alert('Your profile is blocked, please contact us for the next steps.','success','growl-top-right','fa-frown-o');
                $('.modal-backdrop').hide();
                $('#userDeleteModal').hide();
                Meteor.logout();
              }
            });
                FlowRouter.go('/');
          }
      });
    },  

});


profileSettingForm = function () {  
  BlazeLayout.render("profileSettingLayout",{profileSettings: 'profileSetting'});
  // Blaze.render(Template.userLayout,document.body);
}
export { profileSettingForm }
