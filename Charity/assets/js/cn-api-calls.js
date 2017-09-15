var url = "";
var detailEIN = "";
var detailURL = "";

url = "https://api.data.charitynavigator.org/v2/Organizations?";

url += $.param({
    'app_id': "5e08aab6",
    'app_key': "0c71a6ac17b03675853b689acc2f37ee",
    // For this example, I'll select only rated charities in the 75219 Zip Code:
    'rated': "true",
    'zip': "75219",
});
    
console.log ("Search URL: " + url);

$.ajax({
    url: url,
    method: "GET"
    }).done(function(response) {
        console.log(response);

        // Now, I'll arbitrarily pick the first record. This will actually be 
        // whatever the user selects. Saving its ein for use in getting the details
        detailEIN = response[0].ein;
        console.log ("==================================");
        console.log("Search results");
        console.log ("Selected for detail: " + detailEIN);
        console.log ("Charity Name: " + response[0].charityName);
        console.log("Category: " + response[0].category.categoryName);
        console.log("Cause: " + response[1].cause.causeName);
        console.log("Charity Navigator Page: " + response[0].charityNavigatorURL);
        console.log ("==================================");
});

// Build the URL for the second API call, this one for getting the
// charity's detailed data. Note that I hard-coded it's value here because
// due to the multiple asynchronous calls, it doesn't exist yet when THIS
// URL gets built. This will be a separate call, anyway. It wouldn't run
// until the user after the user gets their initial search results
// and hits the Show Details button for a specific charity.
detailURL = "https://api.data.charitynavigator.org/v2/Organizations/";
detailEIN = "650628064"
detailURL += detailEIN + "?";

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
        console.log("Detail results");
        console.log ("Charity tagLine: " + responseDetail.tagLine);
        console.log("Mission Statement: " + responseDetail.mission);
        console.log("Charity Navigator Rating (0-4): " + responseDetail.currentRating.rating);

        console.log ("==================================");
});
