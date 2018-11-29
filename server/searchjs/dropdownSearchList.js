import { Categories } from '/imports/api/masterData/categoriesMaster.js';
import { Business } from '/imports/api/businessMaster.js';

SearchSource.defineSource('dropdownSearch', function(searchText, options) {
    searchTextString = searchText.split('|');
    var options = {
      keepHistory: 0,
      localSearch: false
    };
    var option = (typeof options == "object") ? options : { sort: { level1: -1 } , limit: 40 };
    // console.log('option ',option);
    var finalArray = [];
    var catArrSort = [];
    var catArrSortList = [];
    var newBusArr = [];

    var count = 1;
    if(searchTextString[2]) {
        var regExp = buildRegExp(searchTextString[2]);

        //Get Business List related to Search Text
        var searchCity = searchTextString[0];
        var searchArea = searchTextString[1];

        if(searchCity == 'undefined'){
            searchCity = 'Pune';
        }
        if(searchArea == 'undefined' || searchArea == 'All Areas'){
            var areaSelector = {};
        }else{
            var areaSelector = { "businessArea" : searchArea };
        }

        console.log('regExp',regExp);

        if(regExp){
            var busSelector = {$or: [
                {businessTitle: regExp},
                {businessTag: regExp},
                {businesscategories: regExp},
            ]};

            //Get Category List related to Search Text
            var selector = {$or: [
                {level0: regExp},
                {level1: regExp},
                {level2: regExp},
                {level3: regExp},
                {level4: regExp},
                {tags   : regExp},
                {menuStatus:'Enable'}
            ]};
        }

        var newSelector = {};
        newSelector["$and"] = [];
        if(busSelector){
            newSelector["$and"].push(busSelector);
        }
        if(searchCity){
            newSelector["$and"].push({"businessCity":searchCity}); 
        }
        newSelector["$and"].push({"status" : "active"}); 
        if(areaSelector){
            newSelector["$and"].push(areaSelector);
        }

        if(newSelector){
            console.log('newSelector',newSelector);
            newBusArr = Business.find(newSelector, {
                            fields : {"businessTitle":1, "businessLink":1,"businessArea":1,"businessState":1, "businessCity":1},
                            sort   : { businessTitle: 1 },
                            limit  : 40,
                        }).fetch();

            if(newBusArr){
                console.log('newBusArr',newBusArr);
                for(i=0;i<newBusArr.length;i++){
                    newBusArr[i]._id = count;
                    newBusArr[i].searchType = "Business";
                    count = count + 1;
                }
            }
        }

        if(selector){
            console.log('selector',selector);
            var newCatArr = Categories.find(selector, {
                        fields : {"level0":1, "level1":1,"level2":1,"level3":1,"level4":1, "tags":1,"menuStatus":"Enable"},
                        sort   : { level1: 1 },
                        limit  : 40,
                    }).fetch();
            var stringText = searchTextString[2];
            if(stringText){
                console.log('stringText',stringText);
                var newSearch = new RegExp([stringText].join(""), "i");
            }

            if(newCatArr && newSearch){
                console.log('newSearch',newSearch);
                console.log('newCatArr',newCatArr);
                for(j=0;j<newCatArr.length;j++){
                   if((newCatArr[j].menuStatus) == 'Enable'){
                     // catArrSort.push(newCatArr[j].level4);
                   if(((newCatArr[j].level4).search(newSearch))!=-1){
                     catArrSort.push(newCatArr[j].level4);
                   } else if (((newCatArr[j].level3).search(newSearch))!=-1){
                     catArrSort.push(newCatArr[j].level3);
                   } else if (((newCatArr[j].level2).search(newSearch))!=-1){
                     catArrSort.push(newCatArr[j].level2);
                   } else if (((newCatArr[j].level1).search(newSearch))!=-1){
                     catArrSort.push(newCatArr[j].level1);
                   } else if (((newCatArr[j].level0).search(newSearch))!=-1){
                     catArrSort.push(newCatArr[j].level0);
                   }
                   }
                }

                if(catArrSort){
                    console.log('catArrSort',catArrSort);
                    catArrSort     = _.uniq(catArrSort, function(p){ return p; });
                    for(i=0;i<catArrSort.length;i++){
                        var selectedObj = {
                            "_id"             :   count,
                            "categoryTitle"   :   catArrSort[i],
                            "searchType"      :   "Category",
                        }
                        catArrSortList.push(selectedObj);
                        count = count + 1;
                    }
                }
            }
        }
    }

    if(catArrSortList.length > 0){    
        console.log('catArrSortList',catArrSortList);
        if(newBusArr){
            console.log('newBusArr',newBusArr);
            finalArray = catArrSortList.concat(newBusArr);
        }
        // finalArray = newBusArr.concat(catArrSortList);
        console.log("finalArray: ",finalArray);
    }

    if(finalArray.length>0){
        return finalArray;
    }else {
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
