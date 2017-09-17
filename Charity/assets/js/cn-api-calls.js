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

function charitySearch() {

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

    // If there's already a Charity Detail Panel, get rid of it
    $("#detailWell").empty();

    $("#charityDetail1Div").empty();
    $("#charityDetail2Div").empty();
    $("#charityDetail3Div").empty();
    // Build the URL for the second API call, this one for getting the
    // charity's detailed data. 

    var detailURL = "";
    detailURL = "https://api.data.charitynavigator.org/v2/Organizations/";
    detailURL += charityEIN + "?";

    detailURL += $.param({
        'app_id': "5e08aab6",
        'app_key': "0c71a6ac17b03675853b689acc2f37ee",
        });

    console.log ("Detail Request URL: " + detailURL);
    // Performing GET requests to the Charity Navigator API and logging the responses to the console
    $.ajax({
        url: detailURL,
        method: "GET"
        }).done(function(responseDetail) {
            console.log(responseDetail);
            console.log ("==================================");

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

            col2Div.html("<a href='" + responseDetail.charityNavigatorURL + "' target='_blank'>" + 
                responseDetail.charityName + "</a>");
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

            var colBlankAddrDiv = $('<div>');
            colBlankAddrDiv.addClass('col-sm-1 charityItem');         
            newCharityListingDiv2.append(colBlankAddrDiv);
            var colBlankAddrLabelDiv = $('<div>');
            colBlankAddrLabelDiv.addClass('col-sm-1 charityItem');         
            newCharityListingLabelDiv2.append(colBlankAddrLabelDiv);

            // The charity's address
            var colAddressDiv = $('<div>');
            colAddressDiv.addClass('col-sm-4 charityItem'); 
            if(responseDetail.hasOwnProperty('mailingAddress')){
                colAddressDiv.text(responseDetail.mailingAddress.streetAddress1 + " " + 
                responseDetail.mailingAddress.city + ", " + 
                responseDetail.mailingAddress.stateOrProvince + 
                " " + responseDetail.mailingAddress.postalCode);
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
            formHTML = "<form id='userNameInputForm'>";
            formHTML += "<label for='userNameInput'>User Name:</label>";
            formHTML += "<input type='text' class='form-control' id='userNameInput'>";
            formHTML += "</form>";

            var colUserName = $('<div>');
            colUserName.addClass('col-sm-3 charityItem');
            colUserName.html(formHTML);
            userDataDiv.append(colUserName);

            formHTML = "<form id='userDonationInputForm'>";
            formHTML += "<label for='userDonationInput'>Amount:</label>";
            formHTML += "<input type='text' class='form-control' id='userDonationInput'>";
            formHTML += "</form>";

            var colUserDonation = $('<div>');
            colUserDonation.addClass('col-sm-2 charityItem');
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

            // Roll up the panel div into the panel detailWell div on the main page
            $("#detailWell").append(charityDetailPanel);
    });
}

function saveCharityListing(ein){
    //const database = firebase.database();
    //const userRecRef = database.ref().child('testing').val();
    var dataRef = firebase.database();

    dataRef.ref().push({
        userName: $("#userNameInput").val(),
        charityEIN: ein,
        userComment: $("#userCommentInput").val(),
        userDonation: $("#userDonationInput").val(),
        dateAdded: firebase.database.ServerValue.TIMESTAMP
    });
}

$("#run-search").click(function(){
    charitySearch();
});

$(document).on("click", "button.getDetail", function() {
    getCharityDetail($(this).attr("data-index"));
});

$(document).on("click", "button.saveDetail", function() {
    saveCharityListing($(this).attr("data-index"));
});

// function retrieveUserCharities(){
 
// var dataRef = firebase.database();

//     // dataRef.ref().push({
//     //     userName: $("#userNameInput").val(),
//     //     charityEIN: ein,
//     //     userComment: $("#charityCommentInput").val(),
//     //     userDonation: $("#charityDonationInput").val(),
//     //     dateAdded: firebase.database.ServerValue.TIMESTAMP
//     // });

//     // Find all dinosaurs whose height is exactly 25 meters.
//     var userDataRef = firebase.database().ref();
//     userDataRef.orderByChild("userName").equalTo("David").on("child_added", function(gotcha) {
//     console.log(gotcha.);    
// }