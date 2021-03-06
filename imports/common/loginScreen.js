import { Bert } from 'meteor/themeteorchef:bert';
import { FlowRouter } from 'meteor/ostrio:flow-router-extra';

import '/imports/common/common.js';


// if (Meteor.isClient) {

  Template.loginScreen.events({
  'click .verifyotp':function(event){
    $('.modal-backdrop').remove();
    Session.set("loginSession", undefined);
    $('.loginModalZindex').hide();
  },
  'click .forgotPass': function(event) {
    $('.passwordWrongSpan').removeClass('passwordWrongWar');
    $('label.error').hide();
    $('input[type="email"]').val('');
    $('input[type="password"]').val('');
    $('.loginLabel').removeClass('active');
  },
    'click .UMloginbutton': function(event, template) {
      event.preventDefault();

      // var forgotPasswordForm = $(e.currentTarget);
      // console.log(forgotPasswordForm);
      var email , trimInput ;

      // var emailVar = e.target.email.value;
      var emailVar = $("#forgotPasswordEmail").val();
      trimInput = function(val) {
        return val.replace(/^\s*|\s*$/g, "");
      }

      if (emailVar) {
        // console.log('emailVar :',emailVar);
        emailtrim = trimInput(emailVar);
        email     = emailtrim.toLowerCase();

        var vendorObj = Meteor.users.findOne({"emails.address":email});
        if(!vendorObj){
          Bert.alert('This email address does not exist.','danger','growl-top-right');
        }else{
            if(vendorObj.roles[0] == 'user'){
              $('.enteredEmail').text(email);
              $('.forgotEmailMessage').show();
              $('.disableBtn').attr('disabled','disabled');
              // console.log('email :',email);
              Accounts.forgotPassword({email: email}, function(err) {
                if (err) {
                  if (err.message === 'User not found [403]') {
                    Bert.alert('This email does not exist:'+err.reason);
                  } else {
                    Bert.alert('We are sorry but something went wrong:'+err.reason);
                  }
                } else {
                  // console.log('Email Sent. Check your mailbox.');
                  Bert.alert('Email Sent. Check your mailbox.',"success","growl-top-right");
                }
              });
            }else{
              Bert.alert("You can't change your password. Please contact us.","danger","growl-top-right");
            }
        }
      }else{
          Bert.alert('Please enter your registered email address.',"danger","growl-top-right");
      }
        
          
        // Bert.alert( "Instructions sent! We've sent an email with instructions on how to reset your password.If you don't receive an email within a few minutes, check your spam and junk folders.", 'success', 'growl-top-right' );
      return false;
    },

    'click .forgotEmail':function(e){
      e.preventDefault();
      $('.disableBtn').removeAttr('disabled');
      console.log('value change');
    },
    'click .frgtClose':function(e){
      $('.forgotEmailMessage').hide();
      $('.resetPwd').removeClass('diplayNoneresetPwd');
      $("#forgotPasswordEmail").val('');
      $('.forgotEmailMessage').hide();

      // $('.disableBtn').attr('disabled','disabled');
      $('.disableBtn').prop('disabled', false);

    },
    'click .frgtPwds':function(e){
      $("#forgotPasswordEmail").val('');
      // $('.disableBtn').attr('disabled','disabled');
      $('.disableBtn').prop('disabled', false);
      $('.forgotEmailMessage').css('display','none');
    },

  'click .forgotEmail':function(e){
    e.preventDefault();
    $('.disableBtn').removeAttr('disabled');
    // console.log('value change');
  },

    
  'click .loginLabel' : function(event){
      $(event.target).siblings().focus();
    },
    
  'submit .loginForm': function(event) {
    event.preventDefault();

    var email = event.target.email.value.toLowerCase();
    var pwd   = event.target.pwd.value;

    var vendorObj = Meteor.users.findOne({"emails.address":email});
    if(!vendorObj){      
      Bert.alert('This email address does not exist.','danger','growl-top-right');
    }else{
      if(vendorObj.roles[0] == 'user'){
        $('#loginModal').hide();
          Meteor.call('checkEmailVerification', email, (error,data)=>{
            if (data == "verified"){


              Meteor.loginWithPassword(email, pwd, (error)=> {
                 if (error) {
                    $('#loginModal').show();
                    $('.passwordWrongSpan').text("The email address or password you entered is not valid. Please try again");
                    $('.passwordWrongSpan').addClass('passwordWrongWar');
                    
                    // Bert.alert( error.reason, 'danger', 'fixed-top', 'fa-frown-o' );
                  } else {
                    // Bert.alert('Welcome To Rightnxt.com!');
                    $('.passwordWrongSpan').removeClass('passwordWrongWar');

                    event.target.email.value   ='';
                    event.target.pwd.value     =''; 
                    // FlowRouter.go('/');
                                        
                    $('.modal-backdrop').remove();

                    var loggedInUser = Meteor.userId();
                    // var user = Meteor.users.findOne({'_id' : loggedInUser });
                    var user = Meteor.user();
                    if(user){
                      if (Roles.userIsInRole(loggedInUser, ['user'])) {
                            // var msgvariable = {
                            //    '[username]'      : user.profile.name,
                            //    '[currentDate]'   : currentDate,
                            // };
                            // var inputObj = {
                            //                   notifPath     : '',
                            //                   from          : adminId,
                            //                   to            : Meteor.userId(),
                            //                   templateName  : 'Thanks for Registering',
                            //                   variables     : msgvariable,
                            //                }
                            // sendMailNotification(inputObj);
                            FlowRouter.go('/userProfile',{'userId':loggedInUser});

                      }else if (Roles.userIsInRole(loggedInUser, ['Vendor'])) {
                            FlowRouter.go('/vendorDashboard');
                      }
                      else{
                            FlowRouter.go('/adminDashBoard');
                      }                      
                    }
                  }
                }
              );

            }else if(data == "unverified"){
                   $('#loginModal').show();
                   $('.passwordWrongSpan').text("Please use the option Verify Account for OTP verification.");
                   $('.passwordWrongSpan').addClass('passwordWrongWar');
            }else if(data == "Blocked"){
                   $('#loginModal').show();
                   $('.passwordWrongSpan').text("You're profile is blocked. Please contact Admin.");
                   $('.passwordWrongSpan').addClass('passwordWrongWar');
            }else{    
                  $('#loginModal').show();
                  $('.passwordWrongSpan').text("The email address or password you entered is not valid. Please try again");
                  $('.passwordWrongSpan').addClass('passwordWrongWar');         
            }
          });
        }else{
          Bert.alert('This email address does not exist.',"danger","growl-top-right");
        }
      }
    return false;
  },

   'click .frgtClose': function(event) {
    $('#forgotPwdModal').modal('hide');
  },

});
 
// }

Template.header.events({
  
  'click .loginClosenew': function(event) {
    $('.modal-backdrop').hide();
    $('.passwordWrongSpan').text("");
    $('#emailLogin-error').hide();
    $('#pwdlogin-error').hide();
  },
});


Template.loginScreen.onRendered(function(){
  $('.disableBtn').attr('disabled','disabled');

  $.validator.addMethod("regex_1", function(value, element, regexpr) {          

      return regexpr.test(value);
  }, "Please enter a valid email address.");

   $(".loginForm").validate({
    rules:{
            email:{
            regex_1: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
          },
        
         
      }
   });

   // $('.loginEmail').on('focus',function(){
   //    $(this).siblings('.loginLabel').addClass('newLoginLabel');


   // });

    if($('.loginForm').find('input').val() !== ''){
      $('.loginForm').find('input').prev('.loginLabel').addClass('active highlight');
    }

     $('.loginForm').find('input').on('keyup blur focus', function(e){
       var $this = $(this),
          label = $this.prev('.loginLabel');
          if (e.type === 'keyup') {
            if ($this.val() === '') {
                label.removeClass('active highlight');
              } else {
                label.addClass('active highlight');
              }
          } else if (e.type === 'blur') {
            if( $this.val() === '' ) {
              label.removeClass('active highlight'); 
            } else {
              label.removeClass('highlight');   
            }   
          } else if (e.type === 'focus') {
            if( $this.val() === '' ) {
              label.removeClass('highlight'); 
            } 
            else if( $this.val() !== '' ) {
              label.addClass('highlight');
            }
          }

     });
      
});


