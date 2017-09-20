// Initialize Firebase
var config = {
    apiKey: "AIzaSyD9wtfxBV2zr0kDuPQiMFi_4XFP5uPwo_g",
    authDomain: "charity-group.firebaseapp.com",
    databaseURL: "https://charity-group.firebaseio.com",
    projectId: "charity-group",
    storageBucket: "",
    messagingSenderId: "281572341780"
};
firebase.initializeApp(config);

var charityFirebaseData = firebase.database();
var firebaseKey = "";
var saveCharityName = "";
var saveCharityURL = "";
var userName = "";
var userComment = "";
var userDonation = "";
var myMapLat = "";
var myMapLng = "";
var myMapLatLng = "";
var mapCharityAddress = "";

function charitySearch() {

    firebaseKey = "";

    // If a previous seach exists, remove it
    $("#searchResultsPanel").remove();
    // If there's already a Charity Detail Panel, get rid of it
    $("#detailWell").empty();

    var searchURL = "";

    searchURL = "https://api.data.charitynavigator.org/v2/Organizations?";

    searchURL += $.param({
        'app_id': "5e08aab6",
        'app_key': "0c71a6ac17b03675853b689acc2f37ee",
    });

    var searchTerm = "";
    var searchType = "";
    if ($("#search-term").val().trim() !== ""){
        searchTerm = $("#search-term").val().trim();
    }

    if (searchTerm !== ""){
        searchURL += "&" + $.param({
            'search': searchTerm,
            'searchType': "NAME_ONLY",
            'sort': "RELEVANCE",
        });
    }

    if ($("#zipcode").val().trim() !== ""){
        searchURL += "&" + $.param({
            'zip': $("#zipcode").val().trim(),
        });
    }

    if ($("#state").val().trim() !== ""){
        searchURL += "&" + $.param({
            'state': $("#state").val().trim().toUpperCase(),
        });
    }

    if ($("#city").val().trim() !== ""){
        searchURL += "&" + $.param({
            'city': $("#city").val().trim(),
        });
    }

    searchURL += "&" + $.param({
        'pageSize': $("#num-records-select option:selected").val(),
    });

    $.ajax({
        url: searchURL,
        method: "GET"
    }).done(function(response) {

        // Create the panel body where the search results will be put
        var newCharityPanelBody = $('<div>');
        newCharityPanelBody.addClass('panel-body charitySearchResults');
        newCharityPanelBody.attr('id','well-section');

        // Create a new row for the search results header row
        var newCharityListingDiv = $('<div>');            
        newCharityListingDiv.addClass("row charityListing charityListColumnHeader");

        // The Detail button column
        var col1Div = $('<div>');
        col1Div.addClass('col-sm-1 charityListColumnHeaderItem');    
        col1Div.text = "Show Charity Detail";
        newCharityListingDiv.append(col1Div);

        // The charity name
        var col2Div = $('<div>');
        col2Div.addClass('col-sm-4 charityListColumnHeaderItem');         
        col2Div.text("Charity");
        newCharityListingDiv.append(col2Div);

        // The category
        var col3Div = $('<div>');
        col3Div.addClass('col-sm-3 charityListColumnHeaderItem');
        col3Div.text("Category");
        newCharityListingDiv.append(col3Div);

        // The cause
        var col4Div = $('<div>');
        col4Div.addClass('col-sm-4 charityListColumnHeaderItem');         
        col4Div.text("Cause");
        newCharityListingDiv.append(col4Div);

        // Add all the columns to the charity listing row
        $(newCharityPanelBody).append(newCharityListingDiv);
        //$("#charityListDiv").append(newCharityListingDiv);

        var charitiesReturnedCount = 0;
        charitiesReturnedCount = response.length;

        for(i=0 ; i < charitiesReturnedCount ; i++){   

            // Create a new row for the charity listing
            var newCharityListingDiv = $('<div>');            
            newCharityListingDiv.addClass("row charityListing");

            // The save button column
            var col1Div = $('<div>');
            col1Div.addClass('col-sm-1 charityItem charityButtons');    
            var btnEdit = $('<button>');
            btnEdit.addClass('getDetail');
            btnEdit.attr('data-index',response[i].ein);
            btnEdit.html('&#128269');
            col1Div.append(btnEdit);        
            newCharityListingDiv.append(col1Div);

            // The charity name
            var col2Div = $('<div>');
            col2Div.addClass('col-sm-4 charityItem');         
            col2Div.text(response[i].organization.charityName);
            newCharityListingDiv.append(col2Div);

            // The category
            var col3Div = $('<div>');
            col3Div.addClass('col-sm-3 charityItem');
            if(response[i].hasOwnProperty('category')){ 
                col3Div.text(response[i].category.categoryName);
            }
            newCharityListingDiv.append(col3Div);

            // The cause
            var col4Div = $('<div>');
            col4Div.addClass('col-sm-4 charityItem');         
            if(response[i].hasOwnProperty('cause')){ 
                col4Div.text(response[i].cause.causeName);
            }
            newCharityListingDiv.append(col4Div);

            // Add all the columns to the charity listing row
            $(newCharityPanelBody).append(newCharityListingDiv);
        }

        // Create a div for the search results panel
        var newCharityPanel = $('<div>');
        newCharityPanel.addClass('panel panel-primary');
        newCharityPanel.attr('id','searchResultsPanel'); 

        // Create a div for the search results panel header
        var newCharityPanelHeader = $('<div>');
        newCharityPanelHeader.addClass('panel-heading');
        // Create an h3 for the search results panel header text
        var newCharityPanelTitle = $('<div>');
        // newCharityPanelTitle.addClass('fa fa-table');
        newCharityPanelTitle.html("<h3 class='panel-title'><strong><i class='fa  fa-list-alt'></i>   Charity Search Results</strong></h3>");

        // Roll up the h3 and header div into the panel
        newCharityPanelHeader.append(newCharityPanelTitle);
        newCharityPanel.append(newCharityPanelHeader);

        // Roll up the panel body div into the panel
        newCharityPanel.append(newCharityPanelBody);

        // Roll up the panel body div into the panel
        newCharityPanel.append(newCharityPanelBody);
        $("#charitySearch").append(newCharityPanel);
    }); 
}

function getCharityDetail(charityEIN){

    // // If there's already a Charity Detail Panel, get rid of it
    $("#detailWell").empty();

    $("#charityDetail1Div").empty();
    $("#charityDetail2Div").empty();
    $("#charityDetail3Div").empty();

    saveCharityName = "";
    saveCharityURL = "";

    // Build the URL for the second API call, this one for getting the
    // charity's detailed data. 

    var detailURL = "";
    detailURL = "https://api.data.charitynavigator.org/v2/Organizations/";
    detailURL += charityEIN + "?";

    detailURL += $.param({
        'app_id': "5e08aab6",
        'app_key': "0c71a6ac17b03675853b689acc2f37ee",
        });

    // Performing GET requests to the Charity Navigator API and logging the responses to the console
    $.ajax({
        url: detailURL,
        method: "GET"
        }).done(function(responseDetail) {

            console.log (responseDetail);
            // Create the panel body where the detailed information will be put
            var charityDetailPanelBody = $('<div>');
            charityDetailPanelBody.addClass('panel-body');
            charityDetailPanelBody.attr('id','charityDetailBody');

            // Create divs for each of the detail rows: 1, 2, 3
            var charityDetail1Div = $("<div>");
            charityDetail1Div.addClass('charityDetailListing');
            var charityDetail2Div = $("<div>");
            charityDetail2Div.addClass('charityDetailListing');
            var charityDetail3Div = $("<div>");
            charityDetail3Div.addClass('charityDetailListing');
            // Create divs for each of the detail row labels: 1, 2, 3
            var charityDetail1LabelsDiv = $("<div>");
            var charityDetail2LabelsDiv = $("<div>");
            var charityDetail3LabelsDiv = $("<div>");

            // // Create a new row for the Charity Detail header row
            // var newCharityDetailDiv = $('<div>');            
            // newCharityListingDiv.addClass("row charityListing charityDetailColumnHeader");

            // Create a new row for the charity detail row 1
            var newCharityListingDiv1 = $('<div>');
            var newCharityListingLabelDiv1 = $('<div>')            
            newCharityListingDiv1.addClass('row');
            newCharityListingLabelDiv1.addClass("row charityListColumnHeader");

            // The save button column (Goes in the label row so it lines up)
            var col1LabelDiv = $('<div>');
            col1LabelDiv.addClass('col-sm-1 charityItem charityButtons');    
            var btnSave = $('<button>');
            btnSave.addClass('saveDetail');
            btnSave.attr('data-index',responseDetail.ein);
            btnSave.html('&#128190');
            col1LabelDiv.append(btnSave);        
            newCharityListingLabelDiv1.append(col1LabelDiv);

            // Blank column
            var col1Div = $('<div>');
            col1Div.addClass('col-sm-1 charityItem charityButtons');    
            newCharityListingDiv1.append(col1Div);

            // // Blank Label column
            // var col1LabelDiv = $('<div>');
            // col1LabelDiv.addClass('col-sm-1 charityItem charityButtons');    
            // newCharityListingLabelDiv.append(col1LabelDiv);

            // The charity name
            var col2Div = $('<div>');
            col2Div.addClass('col-sm-4 charityItem');         

            saveCharityName = responseDetail.charityName;
            saveCharityURL = responseDetail.charityNavigatorURL;
            col2Div.html("<a href='" + saveCharityURL + "' target='_blank'>" + saveCharityName + "</a>");
            newCharityListingDiv1.append(col2Div);

            // Charity Label
            var col2LabelDiv = $('<div>');
            col2LabelDiv.addClass('col-sm-4 charityListColumnHeaderItem');         
            col2LabelDiv.text("Charity");
            newCharityListingLabelDiv1.append(col2LabelDiv);

            // The category
            var col3Div = $('<div>');
            col3Div.addClass('col-sm-3 charityItem');
            if(responseDetail.hasOwnProperty('category')){    
                col3Div.text(responseDetail.category.categoryName);
            }
            newCharityListingDiv1.append(col3Div);

            // The category label
            var col3LabelDiv = $('<div>');
            col3LabelDiv.addClass('col-sm-3 charityListColumnHeaderItem');         
            col3LabelDiv.text("Category");
            newCharityListingLabelDiv1.append(col3LabelDiv);

            // The cause
            var col4Div = $('<div>');
            col4Div.addClass('col-sm-4 charityItem');
            if(responseDetail.hasOwnProperty('cause')){    
                col4Div.text(responseDetail.cause.causeName);
            }
            newCharityListingDiv1.append(col4Div);

            // The cause label
            var col4LabelDiv = $('<div>');
            col4LabelDiv.addClass('col-sm-4 charityListColumnHeaderItem');         
            col4LabelDiv.text("Cause");
            newCharityListingLabelDiv1.append(col4LabelDiv);

            // Add all the columns to the charityDetail1Div row
            charityDetail1Div.append(newCharityListingDiv1);
            // Add all the columns to the charityDetail1LabelsDiv row
            charityDetail1LabelsDiv.append(newCharityListingLabelDiv1);

            // Create a new row for the address detail
            var newCharityListingDiv2 = $('<div>');            
            newCharityListingDiv2.addClass("row charityListing");

            var newCharityListingLabelDiv2 = $('<div>');            
            newCharityListingLabelDiv2.addClass("row charityListColumnHeaderItem");


            // The map button column (Goes in the label row so it lines up)
            var colMapBtnDiv = $('<div>');
            colMapBtnDiv.addClass('col-sm-1 charityItem charityButtons');    
            newCharityListingDiv2.append(colMapBtnDiv);

            // var colBlankAddrDiv = $('<div>');
            // colBlankAddrDiv.addClass('col-sm-1 charityItem');         
            // newCharityListingDiv2.append(colBlankAddrDiv);
            var colBlankAddrLabelDiv = $('<div>');
            colBlankAddrLabelDiv.addClass('col-sm-1 charityItem');         
            newCharityListingLabelDiv2.append(colBlankAddrLabelDiv);

            // The charity's address
            var colAddressDiv = $('<div>');
            colAddressDiv.addClass('col-sm-4 charityItem'); 
            
            if(responseDetail.hasOwnProperty('mailingAddress')){
                
                var charityAddress = responseDetail.mailingAddress.streetAddress1 + " " + 
                responseDetail.mailingAddress.city + ", " + 
                responseDetail.mailingAddress.stateOrProvince + 
                " " + responseDetail.mailingAddress.postalCode

                mapCharityAddress = charityAddress;

                getCharityMap();

                colAddressDiv.text(charityAddress);
            }

            newCharityListingDiv2.append(colAddressDiv);

            // The charity's address label
            var colAddressLabelDiv = $('<div>');
            colAddressLabelDiv.addClass('col-sm-4 charityListColumnHeaderItem'); 
            colAddressLabelDiv.text("Mailing Address");
            newCharityListingLabelDiv2.append(colAddressLabelDiv);

            // The charity's rating with Charity Navigator
            var colRatingDiv = $('<div>');
            colRatingDiv.addClass('col-sm-3 charityItem');  
            if(responseDetail.hasOwnProperty('currentRating')){    
                colRatingDiv.html("<img src='" + responseDetail.currentRating.ratingImage.large + "' alt=" +
                responseDetail.currentRating.rating + ">");
            }
            newCharityListingDiv2.append(colRatingDiv);

            // The charity's rating label
            var colRatingLabelDiv = $('<div>');
            colRatingLabelDiv.addClass('col-sm-3 charityListColumnHeaderItem');  
            colRatingLabelDiv.text("Rating");
            newCharityListingLabelDiv2.append(colRatingLabelDiv);

            // The charity's score with Charity Navigator
            var colScoreDiv = $('<div>');
            colScoreDiv.addClass('col-sm-4 charityItem');
            if(responseDetail.hasOwnProperty('currentRating')){
                colScoreDiv.text(responseDetail.currentRating.score);
            }
            newCharityListingDiv2.append(colScoreDiv);

            // The charity's score label
            var colScoreLabelDiv = $('<div>');
            colScoreLabelDiv.addClass('col-sm-4 charityListColumnHeaderItem');
            colScoreLabelDiv.text("Score");
            newCharityListingLabelDiv2.append(colScoreLabelDiv);

            // Add all the columns to the charityDetail2Div row
            charityDetail2Div.append(newCharityListingDiv2);
            charityDetail2LabelsDiv.append(newCharityListingLabelDiv2);

            // Create a new row for the charity detail row 3
            var newCharityListingDiv3 = $('<div>');            
            newCharityListingDiv3.addClass("row charityListing");
            var newCharityListingLabelDiv3 = $('<div>');            
            newCharityListingLabelDiv3.addClass("row charityListColumnHeaderItem");

            var colBlankMissionDiv = $('<div>');
            colBlankMissionDiv.addClass('col-sm-1 charityItem');         
            newCharityListingDiv3.append(colBlankMissionDiv);

            // The charity's mission statement
            var colMissionDiv = $('<div>');
            colMissionDiv.addClass('col-sm-11 charityItem');         
            if(responseDetail.hasOwnProperty('mission')){
                colMissionDiv.text(responseDetail.mission);
            }
            newCharityListingDiv3.append(colMissionDiv);

            // The Blank column
            var colBlankMissionLabelDiv = $('<div>');
            colBlankMissionLabelDiv.addClass('col-sm-1 charityItem');         
            newCharityListingLabelDiv3.append(colBlankMissionLabelDiv);

            // The charity's mission statement label
            var colMissionLabelDiv = $('<div>');
            colMissionLabelDiv.addClass('col-sm-11 charityListColumnHeaderItem');
            colMissionLabelDiv.text("Charity Mission Statement");
            newCharityListingLabelDiv3.append(colMissionLabelDiv);
            charityDetail3LabelsDiv.append(newCharityListingLabelDiv3)
            // Add all the columns to the charityDetail3Div row
            charityDetail3Div.append(newCharityListingDiv3);

            // // Create a div for the map
            var newCharityListingDiv4 = $('<div>');            
            newCharityListingDiv4.addClass("row charityListing");
            newCharityListingDiv4.attr('id','charityMapDiv');

            var newCharityListingLabelDiv4 = $('<div>');            
            newCharityListingLabelDiv4.addClass("row charityListColumnHeaderItem");
            // var colMapDiv = $('<img>');
            // colMapDiv.addClass('col-sm-12 charityItem');
            // colMapDiv.attr('id','charityMap');

            // var imgMapURL = "";
            // imgMapURL = 'https://maps.googleapis.com/maps/api/staticmap?';

            // imgMapURL += $.param({
            //     'key': "AIzaSyCxobnawImV3Vr521y6IyKBG6Kca7iymaA",
            //     'center': charityAddress,
            //     'zoom': "13",
            //     'size': "500x300",
            //     'maptype': "roadmap",
            //     });

            // imgMapURL += "&markers=color:blue%7Clabel:S%7C";
            // imgMapURL += myMapLat + "," + myMapLng;
            // console.log (imgMapURL);

            // colMapDiv.attr('src',imgMapURL);
            // colMapDiv.attr('alt',charityAddress);

            // //colMapDiv.attr('src','https://maps.googleapis.com/maps/api/staticmap?center=3910+Harry+Hines+Boulevard,Dallas,TX&zoom=13&size=600x300&maptype=roadmap&markers=color:blue%7Clabel:S%7C32.8076949,-96.8124691&key=AIzaSyCxobnawImV3Vr521y6IyKBG6Kca7iymaA')

            // newCharityListingDiv4.append(colMapDiv);

            charityDetailPanelBody.append(charityDetail1LabelsDiv);
            charityDetailPanelBody.append(charityDetail1Div);
            charityDetailPanelBody.append(charityDetail2LabelsDiv);
            charityDetailPanelBody.append(charityDetail2Div);

            charityDetailPanelBody.append(charityDetail3LabelsDiv);
            charityDetailPanelBody.append(charityDetail3Div);

            // Create a div for the search detail panel
            var charityDetailPanel = $('<div>');
            charityDetailPanel.addClass('panel panel-primary');
            charityDetailPanel.attr('id','charityDetailPanel'); 

            // Create a div for the search results panel header
            var charityDetailPanelHeader = $('<div>');
            charityDetailPanelHeader.addClass('panel-heading');
            // Create an h3 for the search results panel header text
            var charityDetailPanelTitle = $('<div>');
            // newCharityPanelTitle.addClass('fa fa-table');
            charityDetailPanelTitle.html("<h3 class='panel-title'><strong><i class='fa  fa-list-alt'></i>   Charity Detail</strong></h3>");

            // Roll up the h3 and header div into the panel
            charityDetailPanelHeader.append(charityDetailPanelTitle);
            charityDetailPanel.append(charityDetailPanelHeader);

            // Roll up the panel body div into the panel
            charityDetailPanel.append(charityDetailPanelBody);

            // Add a row for the user data
            var userDataDiv = $("<div>");
            userDataDiv.addClass ('row');
            userDataDiv.attr('id','userData');

            var colBlankUserData = $('<div>');
            colBlankUserData.addClass('col-sm-1 charityItem');
            userDataDiv.append(colBlankUserData);

            var formHTML = "";

            formHTML = "<form id='userDonationInputForm'>";
            formHTML += "<label for='userDonationInput'>Amount:</label>";
            formHTML += "<input type='text' class='form-control' id='userDonationInput'>";
            formHTML += "</form>";

            var colUserDonation = $('<div>');
            colUserDonation.addClass('col-sm-5 charityItem');
            colUserDonation.html(formHTML);
            userDataDiv.append(colUserDonation);

            formHTML = "<form id='userCommentInputForm'>";
            formHTML += "<label for='userCommentInput'>Comments:</label>";
            formHTML += "<input type='text' class='form-control' id='userCommentInput'>";
            formHTML += "</form>";

            var colUserComments = $('<div>');
            colUserComments.addClass('col-sm-6 charityItem');
            colUserComments.html(formHTML);
            userDataDiv.append(colUserComments);

            charityDetailPanel.append(userDataDiv);

            charityDetailPanel.append(newCharityListingDiv4);

            // Roll up the panel div into the panel detailWell div on the main page
            $("#detailWell").append(charityDetailPanel);

            if (userName !== ""){
                $("#retrieveUserRecordsInput").val(userName);
            }

            if (userDonation !== ""){
                $("#userDonationInput").val(userDonation);
            }
            if (userComment !== ""){
                $("#userCommentInput").val(userComment);
            }

    });
}

function saveCharityListing(ein){

    var donationAmt = $("#userDonationInput").val().trim();
    var itsNumeric = false;
    itsNumeric = $.isNumeric(donationAmt);
    console.log(itsNumeric);

    console.log(donationAmt)
    // If the user name hasn't been filled in, prompt the user to do so.
    if ($("#retrieveUserRecordsInput").val().trim() === "") {
        presentModalMessage("Missing User Name", "Please enter your User Name under Save/Retrieve Records");

    // If the Donation amount is not a number, prompt the user to fix it.
     } else if (itsNumeric !== true) {
        presentModalMessage("Invalid Donation Amount", "Please enter a numeric value for the Donation Amount");

    // All is well, proceed with the save
    } else {

        if (firebaseKey === ""){
            charityFirebaseData.ref().child('savedCharities').push({
                userName: $("#retrieveUserRecordsInput").val(),
                charityEIN: ein,
                charityName: saveCharityName,
                charityURL: saveCharityURL,
                userComment: $("#userCommentInput").val(),
                userDonation: $("#userDonationInput").val(),
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        } else {
            //charityFirebaseData.ref().child('savedCharities').push({
            charityFirebaseData.ref().child('savedCharities/' + firebaseKey).set({
                userName: $("#retrieveUserRecordsInput").val(),
                charityEIN: ein,
                charityName: saveCharityName,
                charityURL: saveCharityURL,
                userComment: $("#userCommentInput").val(),
                userDonation: $("#userDonationInput").val(),
                dateAdded: firebase.database.ServerValue.TIMESTAMP
            });
        }

        var userToRetrieve = $("#retrieveUserRecordsInput").val();
        // Removed the previous Saved Records panel
        $("#savedRecords").empty();
        retrieveUserCharities(userToRetrieve);
        presentModalMessage("Record Saved!","Your Charity has been saved.");
    }
}

function retrieveUserCharities(userName){

    if ($("#retrieveUserRecordsInput").val() !== "") {

        var userCharityData = charityFirebaseData.ref().child('savedCharities');
        var userCharityQuery = userCharityData
                                    .orderByChild('userName')
                                    .equalTo(userName);

        userCharityQuery.on('value', snap => {

            // Remove the previous Saved Records panel
            $("#userSavedRecordsPanel").remove();
            $("#savedRecords").empty();

            var userData = snap.val();
            var userDataKeys = Object.keys(userData);

            // Create the panel body where the saved records will be put
            var savedRecordsBody = $('<div>');
            savedRecordsBody.addClass('panel-body charitySearchResults');
            savedRecordsBody.attr('id','well-savedRecords');

            // Loop through the returned  JSON object and
            // fill in the panel body row div
            for (var i = 0; i < userDataKeys.length; i++) {

                var k = userDataKeys[i];
                var recUserName = userData[k].userName;
                var recCharityName = userData[k].charityName;
                var recCharityURL = userData[k].charityURL;
                var recCharityEIN = userData[k].charityEIN;
                var recUserComment = userData[k].userComment;
                var recUserDonation = userData[k].userDonation;

                // Create a new row for the saved record
                var savedRecordRowDiv = $('<div>');            
                savedRecordRowDiv.addClass("row charityListing");

                // The save button column
                var col1Div = $('<div>');
                col1Div.addClass('col-sm-2 charityItem charityButtons');    
                var btnEdit = $('<button>');
                btnEdit.addClass('getSavedRecordDetail');
                btnEdit.attr('data-index',recCharityEIN);
                btnEdit.attr('data-firebaseKey',k);
                btnEdit.attr('data-userName',recUserName);
                btnEdit.attr('data-userComment',recUserComment);
                btnEdit.attr('data-userDonation',recUserDonation);
                btnEdit.html('&#128269');
                col1Div.append(btnEdit);
                savedRecordRowDiv.append(col1Div);

                // The charity name
                var col2Div = $('<div>');
                col2Div.addClass('col-sm-8 charityItem');         
                col2Div.text(recCharityName);
                savedRecordRowDiv.append(col2Div);

                // The save button column
                var col3Div = $('<div>');
                col3Div.addClass('col-sm-2 charityItem charityButtons');    
                var btnDelete = $('<button>');
                btnDelete.addClass('getDeleteSavedRecord');
                btnDelete.attr('data-index',recCharityEIN);
                btnDelete.attr('data-firebaseKey',k);
                btnDelete.attr('data-userName',recUserName);
                btnDelete.attr('data-userComment',recUserComment);
                btnDelete.attr('data-userDonation',recUserDonation);
                btnDelete.html('&#128473');
                col3Div.append(btnDelete);
                savedRecordRowDiv.append(col3Div);

                // Append the Saved Record row to the body
                savedRecordsBody.append(savedRecordRowDiv);

            }
            
            // Create a div for the saved records panel
            var savedRecordsPanel = $('<div>');
            savedRecordsPanel.addClass('panel panel-primary');
            savedRecordsPanel.attr('id','userSavedRecordsPanel'); 

            // Create a div for the saved records panel header
            var savedRecordsPanelHeader = $('<div>');
            savedRecordsPanelHeader.addClass('panel-heading');
            // Create an h3 for the search results panel header text
            var savedRecordsPanelTitle = $('<div>');
            savedRecordsPanelTitle.html("<h3 class='panel-title'><strong><i class='fa  fa-list-alt'></i>   Your Saved Charities</strong></h3>");

            // Roll up the title and header div into the panel
            savedRecordsPanelHeader.append(savedRecordsPanelTitle);
            savedRecordsPanel.append(savedRecordsPanelHeader);

            // Roll up the panel body div into the panel
            savedRecordsPanel.append(savedRecordsBody);
            $("#savedRecords").append(savedRecordsPanel);
        });

        // If a previous seach exists, remove it
        $("#searchResultsPanel").remove();
        // If there's already a Charity Detail Panel, get rid of it
        $("#detailWell").empty();
        $("#charityDetail1Div").empty();
        $("#charityDetail2Div").empty();
        $("#charityDetail3Div").empty();

    } else {
        // If the user name hasn't been filled in, prompt the user to do so.
        $("#mUserName").modal();
    }

}

function deleteSavedRecord(deleteMe){
    console.log ("Got into the deleteSavedRecord function for " + deleteMe);

    charityFirebaseData.ref().child('savedCharities/' + firebaseKey).remove();
    presentModalMessage("Record Deleted!","Your Charity has been deleted.");
}

function getCharityMap(){

    var mapURL = "https://maps.googleapis.com/maps/api/geocode/json?";
    
    mapURL += $.param({
        'key': "AIzaSyCxobnawImV3Vr521y6IyKBG6Kca7iymaA",
        'address': mapCharityAddress,
    });

    $.ajax({
        url: mapURL,
        method: "GET"
    }).done(function(googleResponse) {

        console.log(googleResponse);
        console.log("Lat: " + googleResponse.results[0].geometry.location.lat);
        myMapLat = googleResponse.results[0].geometry.location.lat;
        console.log("Lng: " + googleResponse.results[0].geometry.location.lng);
        myMapLng = googleResponse.results[0].geometry.location.lng;
        myMapLatLng = "{lat: " + myMapLat + ", lng: " + myMapLng + "}";
        console.log(myMapLatLng);
        //initMap(myMapLatLng);


        var colMapDiv = $('<img>');
        colMapDiv.addClass('col-sm-12 charityItem');
        colMapDiv.attr('id','charityMap');

        var imgMapURL = "";
        imgMapURL = 'https://maps.googleapis.com/maps/api/staticmap?';

        imgMapURL += $.param({
            'key': "AIzaSyCxobnawImV3Vr521y6IyKBG6Kca7iymaA",
            'center': mapCharityAddress,
            'zoom': "13",
            'size': "500x300",
            'maptype': "roadmap",
            });

        //imgMapURL += "&markers=color:green%7Clabel:S%7C";
        imgMapURL += "&markers=color:green%7Clabel:%7C";
        imgMapURL += myMapLat + "," + myMapLng;
        console.log (imgMapURL);

        colMapDiv.attr('src',imgMapURL);
        colMapDiv.attr('alt',mapCharityAddress);

        $("#charityMapDiv").append(colMapDiv);

    });
}

function presentModalMessage(msgTitle, msgPrompt){

    console.log("got this far");
    var messageTitle = "<h4 class='modal-title'>" + msgTitle + "</h4>";
    $("#mTitle").html(messageTitle);

    var messagePrompt = "<p>" + msgPrompt + "</p>";
    $("#mBody").html(messagePrompt);

    $("#modalMessage").modal();

}

$("#run-search").click(function(){
    firebaseKey = "";
    userName = "";
    userComment = "";
    userDonation = "";
    charitySearch();
});

$(document).on("click", "button.getDetail", function() {
    firebaseKey = "";
    userName = "";
    userComment = "";
    userDonation = "";
    getCharityDetail($(this).attr("data-index"));
});

$(document).on("click", "button.getSavedRecordDetail", function() {
    firebaseKey = $(this).attr("data-firebaseKey");
    userName = $(this).attr("data-userName");
    userComment = $(this).attr("data-userComment");
    userDonation = $(this).attr("data-userDonation");
    getCharityDetail($(this).attr("data-index"));
});

$(document).on("click", "button.saveDetail", function() {
    userName = "";
    userComment = "";
    userDonation = "";
    saveCharityListing($(this).attr("data-index"));
});

$(document).on("click", "button.getDeleteSavedRecord", function() {
    firebaseKey = $(this).attr("data-firebaseKey");
    console.log ("Deleting " + firebaseKey);
    deleteSavedRecord(firebaseKey);
}); 

$(document).on("click", "#btnSavedRecords", function() {
    // Remove the previous Saved Records panel
    $("#savedRecords").empty();
    var userToRetrieve = $("#retrieveUserRecordsInput").val();
    retrieveUserCharities(userToRetrieve);
});
