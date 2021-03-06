import { Business } from '/imports/api/businessMaster.js';
import { BusinessImage } from '/imports/videoUploadserver/businessImageServer.js';
import { ReviewImage } from '/imports/videoUploadserver/reviewImageServer.js';
import { BusinessAds } from '/imports/api/businessAdsMaster.js';
import { Offers } from '/imports/api/offersMaster.js';

SearchSource.defineSource('business', (searchText, options)=> {
    // searchText = "city|area|categories OR text to search";
    var splitData = searchText.split('|');
    var searchResult = '';
    var selector = '';
    var option ='';
    var listCategory = [];

    var searchCity      = splitData[0];
    var searchArea      = splitData[1].split('-').join(' ');
    var searchCatg      = splitData[2].split('-').join(' ');
    var searchString    = splitData[2].split('-').join(' ');
    // console.log('searchCityMain',searchCity);

    if(searchCity == 'undefined'){
        searchCity = 'Pune';
    }

    if(searchArea == 'undefined' || searchArea == 'All Areas'){
        var areaSelector = {};
    } else {
        var areaSelector = { "businessArea" : searchArea };
    }

    if(searchCatg == 'undefined'){
        var catgSelector =  {};
    } else {
        var categRegExp = buildRegExp(searchCatg);
        if(categRegExp){
            var catgSelector = {
                                    $or:[
                                            {allCategories : categRegExp},
                                            {alltags       : categRegExp},
                                        ]
                                };
        }
    }

    if(searchString == 'undefined'){
        var textSelector =  {};
    } else {
        var textRegExp = buildRegExp(searchString);
        var textSelector = {};
        textSelector["$or"] = [];
        textSelector["$or"].push({"businessTitle" : textRegExp});
        textSelector["$or"].push({"businessTag" : textRegExp});
        textSelector["$or"].push({"businesscategories" : textRegExp});
    }
    // options = { sort: { businessTitle:1}, limit: 20 };
    options = { sort: { businessTitle:1}};

    var selector = {}; 
    selector["$and"] = [];
    selector["$and"].push(textSelector);
    selector["$and"].push({"businessCity":searchCity}); 
    selector["$and"].push({"status" : "active"}); 
    selector["$and"].push(areaSelector);
    // selector["$and"].push(catgSelector);
    
    // searchResult = Business.find(selector, options).fetch();
    searchResult = Business.find(selector).fetch();
    // console.log(searchResult,'searchResult');

    //new code 02 April 2019
    if(searchResult.length==0){
        var businessAdsDetails = BusinessAds.find({'status':'active'}).fetch();
        // console.log('businessAdsDetails',businessAdsDetails);
        var tempArr = [];
        if(businessAdsDetails.length>0){
            for (var a = 0; a < businessAdsDetails.length; a++) {
                if(searchArea != 'undefined' && searchArea != 'All Areas'){
                    var checkArea = businessAdsDetails[a].areas.findIndex(x=>x == searchArea);
                    if(checkArea>=0){ 
                        var showAds = tempArr.findIndex(x=>x.businessLink == businessAdsDetails[a].businessLink);
                        if(showAds<0){        
                            tempArr.push({'businessLink':businessAdsDetails[a].businessLink});                           
                            searchResult = Business.find({'businessLink':businessAdsDetails[a].businessLink}).fetch();               
                        }
                    }
                }
            }
        }
    }

    // console.log(searchResult,'searchResult');

    // =========================================================
    // ==================Get Image URL from Start ==============
    // =========================================================
    var searchPageShowImage = (imgId)=> {
		if(imgId){
            var imgData = BusinessImage.findOne({"_id":imgId});
			if(imgData)	{
				var data = {
					img : imgData.link(),
				}
				if(imgData.type == 'image/png'){
					data.checkpngImg = 'bkgImgNone';
				}else{
					data.checkpngImg = '';
				}
			}else{
                var imgObj = ReviewImage.findOne({"_id":imgId});
                if(imgObj) {
                    var data = {
                        img : imgObj.link(),
                    }
                    if(imgObj.type == 'image/png'){
                        data.checkpngImg = 'bkgImgNone';
                    }else{
                        data.checkpngImg = '';
                    }
                }else{
    				var data = {
    					img : 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg',
    					checkpngImg: '',
    				};
                }
			}
			return data;
        }
    }
    // =========================================================
    // ==================Get Image URL from End ================
    // =========================================================

    // Get Unique Categories
    if(searchResult){
        for(var i=0;i<searchResult.length;i++){
            if(searchResult[i].businesscategories){
                for(var j = 0 ; j < searchResult[i].businesscategories.length; j++){
                    if(searchResult[i].businesscategories[j] && searchResult[i].businesscategories[j].length > 0){
                        var catArrayString = (searchResult[i].businesscategories[j]).split('>');
                        if(catArrayString[1]){
                            catArrayString[1] = catArrayString[1].trim();
                        }
                        listCategory.push(catArrayString[1]);
                    }
                }
            }
        }
    }
    
    // Find Unique Level 1 Categories
    for(var i =0 ; i<listCategory.length;i++){
        listCategory = _.unique( listCategory );
    }
    listCategory = listCategory.filter(Boolean);
    var businessAdsDocs = [];
    
    if(listCategory.length > 0){
        var currentDate = moment(new Date()).format('YYYY-MM-DD');

        //===================Start new Selector==============================
        if(searchString == 'undefined'){
            var textAdsSelector =  {};
        } else {
            var textAdsRegExp = buildRegExp(searchString);
            var textAdsSelector = {};
            textAdsSelector["$or"] = [];
            textAdsSelector["$or"].push({"businessTitle" : textAdsRegExp});
            textAdsSelector["$or"].push({"category" : textAdsRegExp});
        }
        var adsSelector = {}; 
        adsSelector["$and"] = [];
        adsSelector["$and"].push(textAdsSelector);
        adsSelector["$and"].push({"status" : "active"}); 
        adsSelector["$and"].push({"city" : searchCity}); 
        adsSelector["$and"].push({"startDate" : {$lte : currentDate}});
        adsSelector["$and"].push({"endDate"   : {$gte : currentDate}});
        //===================End New Selector===============================

        // var adsSelector = {"category" : {$in : listCategory}, 
        //                     "status"   : "active", 
        //                     "startDate" : {$lte : currentDate},  
        //                     "endDate"   : {$gte : currentDate}
        //                     };
        
        var adsSort     = {sort: { "position" : 1 } } ;
        if(searchArea == 'undefined' || searchArea == 'All Areas'){
            var businessAds =  BusinessAds.find(adsSelector, adsSort).fetch();
        } else {
            var businessAds =  BusinessAds.find(adsSelector,{"areas":{ $in: [areaSelector] }}, adsSort).fetch();
        }

        // var adsSort     = {sort: { "position" : 1 } } ;
        // var businessAds =  BusinessAds.find(adsSelector, adsSort).fetch();
        if(businessAds){
            var commonLink = [];
            for(var i=0; i<businessAds.length; i++){
                if(searchArea != 'undefined' && searchArea != 'All Areas'){
                    var checkArea = businessAds[i].areas.findIndex(x=>x == searchArea);
                    if(checkArea>=0){ 
                        var paidBizLink = businessAds[i].businessLink;
                        searchResult = searchResult.filter(function( obj ) {
                            return obj.businessLink !== paidBizLink;
                        });
                        commonLink.push(paidBizLink);
                    }
                }else{
                    var paidBizLink = businessAds[i].businessLink;
                    searchResult = searchResult.filter(function( obj ) {
                        return obj.businessLink !== paidBizLink;
                    });
                    commonLink.push(paidBizLink);
                }
            }//for i
        
            //Now get all object documents for commonLink from business collection
            commonLink = _.unique(commonLink);
            
            // businessAdsDocs = [];
            // businessAdsDocs = Business.find({"businessLink":{$in : commonLink},"status":"active"}).fetch();
            // console.log('commonLink',commonLink);
            for(var n=0;n<commonLink.length;n++){
                // var busNewAdd = 
                var businessAdsDocsNew = Business.findOne({"businessLink":commonLink[n],"status":"active"});
                businessAdsDocs.push(businessAdsDocsNew);  
            }            
        }		
    }
    businessAdsDocs = businessAdsDocs.concat(searchResult);	
    // return businessAdsDocs;
    
    if(businessAdsDocs){
        for(var i=0;i<businessAdsDocs.length;i++){
             // ===================Get Image URL from ID Start=========================
                if(businessAdsDocs[i].publishedImage){
                    businessAdsDocs[i].businessSelectedImagesNew = searchPageShowImage(businessAdsDocs[i].publishedImage);
                } else{
                    if(businessAdsDocs[i].businessImages){
                        if(businessAdsDocs[i].businessImages[0]){
                            businessAdsDocs[i].businessSelectedImagesNew = searchPageShowImage(businessAdsDocs[i].businessImages[0].img);
                        }else{
                            var data = {
                                img : 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg',
                                checkpngImg: '',
                            };
                            businessAdsDocs[i].businessSelectedImagesNew = data;
                        }
                    }else{
                        var data = {
                            img : 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg',
                            checkpngImg: '',
                        };
                        businessAdsDocs[i].businessSelectedImagesNew = data;
                    }
                }
            // ===================Get Image URL from ID End=========================
            
            // ===================Get Rating From Business Start====================
                if(!businessAdsDocs[i].latestRating){
                    businessAdsDocs[i].latestRating = 0;
                }
                var intRating = parseInt(businessAdsDocs[i].latestRating);
                var balRating = businessAdsDocs[i].latestRating - intRating;
                var finalRating = intRating + balRating;
                if(balRating > 0 && balRating < 0.5){
                    var finalRating = intRating + 0.5;
                }
                if(balRating > 0.5){
                    var finalRating = intRating + 1;
                }

                var ratingObj = {};

                for(var j=1; j<=10; j++){
                    var x = "star" + j;
                    if(j <= finalRating*2){
                        if( j%2 == 0){
                            ratingObj[x] = "fixStar2";
                        }else{
                            ratingObj[x] = "fixStar1";
                        }				
                    }else{
                        ratingObj[x]  = "";
                    }
                
                }
                businessAdsDocs[i].businessRating = ratingObj;
            // ===================Get Rating From Business End===================
            
            // To Add Seperator as ',' in between Mobile and Landline Number Start
                if(businessAdsDocs[i].businessLandline&&businessAdsDocs[i].businessMobile){
                    businessAdsDocs[i].mobNumSeperator = ',';
                }else{
                    businessAdsDocs[i].mobNumSeperator = '';
                }
            // To Add Seperator as ',' in between Mobile and Landline Number End

            //Set business Image as per vendor Start
                if(businessAdsDocs[i].publishedImage){
                    businessAdsDocs[i].businessSelectedImagesNew = searchPageShowImage(businessAdsDocs[i].publishedImage);
                } else{
                    if(businessAdsDocs[i].businessImages){
                        if(businessAdsDocs[i].businessImages[0]){
                            businessAdsDocs[i].businessSelectedImagesNew = searchPageShowImage(businessAdsDocs[i].businessImages[0].img);
                        }else{
                            var data = {
                                img : 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg',
                                checkpngImg: '',
                            };
                            businessAdsDocs[i].businessSelectedImagesNew = data;
                        }
                    }else{
                        var data = {
                            img : 'https://s3.us-east-2.amazonaws.com/rightnxt1/StaticImages/general/rightnxt_image_nocontent.jpg',
                            checkpngImg: '',
                        };
                        businessAdsDocs[i].businessSelectedImagesNew = data;
                    }
                }
            //Set business Image as per vendor End

            // Find Offers of Business Start
                var bussId = businessAdsDocs[i]._id;		
                var busOffer = Offers.find({"businessId":bussId,"offerStatus":"Active"}).count();
                if(busOffer){
                    // businessAdsDocs[i].busOffer = busOffer.dealHeadline;
                   businessAdsDocs[i].busNoOffer = busOffer;
                }else{
                    // businessAdsDocs[i].busOffer = '';
                   businessAdsDocs[i].busNoOffer = 0;
                }
            // Find Offers of Business End
            

            // Find Total count of rating Start
                if(!businessAdsDocs[i].totalVote){
                    businessAdsDocs[i].totalVote = 0;
                }
            // Find Total count of rating End
        }
        return businessAdsDocs;
        // var data = Business.findOne({});
        // return data;
    }else{
        return [];
    }
});


function buildRegExp(searchText) {
    var words = searchText.trim().split(/[ \-\:]+/);
    var exps = _.map(words, function(word) {
        return "(?=.*" + word + ")";
    });

    var fullExp = exps.join('') + ".+";
    return new RegExp(fullExp, "i");
}

