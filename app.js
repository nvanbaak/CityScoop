// Get references to main page elements
const icon = document.querySelector('.icon');
const iconResults = document.querySelector('.nav-results');
const searchBar = document.getElementById('search-bar');
const searchBarResults = document.getElementById('nav-bar-results');

// Debug variables
var cityMain; // Top-level json with city name, population, and lat/lon
var covidJSON; // Json containing covid data for the chosen state
var uaDetails; // Urban Area "details" json
var uaImages; // json containing free-to-use image links for city
var uaSalary; // json with salary data for city
var uaScores; // json with score data for city
var weatherCityHistory; // Weather history for selected city

// This variable toggles the search button behavior
var searchBarActive = false;

// Global Variable to check if this is the first search
var isFirstSearch = true;

// Start Page Search Bar functionality
icon.addEventListener('click', function(event){
    event.preventDefault();

    // If this is the first time the button's been clicked,
    if (!searchBarActive) {
        // Show the search bar
        searchBar.classList.toggle('search-active');

        // Flag that the search bar is active
        searchBarActive = true;

        // Otherwise we search
    } else {
        // But only if there's something in the search bar
        if (searchBar.value) {

            // Toggle which page is visible
            document.querySelector(".start-page-wrap").classList.toggle("hide");
            document.querySelector(".results-page-wrap").classList.toggle("hide");
            searchBarActive = false;
            
            // Run the search
            searchCities($("#search-bar").val());
        }
    }
});

// Functionality for clicking search bar in results page
iconResults.addEventListener('click', function(){
    
    if ($("#nav-bar-results").val()) {
        // Grab value from results bar and search
        searchCities($("#nav-bar-results").val());
    }
});

// Function to search from nav bar with enter key
searchBarResults.addEventListener('keypress', function(e){
    // If enter key was pressed and search bar is not empty
    if(e.key === 'Enter' && searchBarResults.value){
        // Grab value from results bar and search
        searchCities($("#nav-bar-results").val());
    }
});

//function to initiate search from start page using 'Enter' key
searchBar.addEventListener('keypress', function(e){
    if(e.key === 'Enter' && searchBar.value) {

        // Toggle which page is visible
        document.querySelector(".start-page-wrap").classList.toggle("hide");
        document.querySelector(".results-page-wrap").classList.toggle("hide");
        
        // Search using input value
        searchCities($("#search-bar").val());

    }
});


// Search function
function searchCities(cityName) {
    // This function is called by the search bar event listeners to get the database information the app needs

    // Set First Search to False
    isFirstSearch = false;

    // Create query URL
    var queryURL = "https://api.teleport.org/api/cities/?search=" + cityName;
    
    // Reset all data output windows
    $(".display-output").text("NA");
    // Job dropdown has a different starting text
    $("#dropdown-text").text("Select a Job Title");


    // Use query URL to make first AJAX request
    $.ajax({
        url:queryURL,
        method:"GET"
    }).then( function(response) {
        // Get url with geoname ID
        var geonameURL = response._embedded["city:search-results"][0]._links["city:item"].href;

        // Make AJAX request with new URL
        $.ajax({
            url:geonameURL,
            method:"GET"
        }).then( function(response) {
    
            // Store response in debug variable
            cityMain = response;
            
            // Update city name
            $(".city-name").text((response.name).toUpperCase());

            // COVID PANEL

            // Get two-letter state abbreviation
            var covidState = abbreviateState(response.full_name)


            // Ajax for all states data
            $.ajax({
                url:"https://api.covidtracking.com/v1/states/current.json",
                method:"GET"
            }).then( function(response) {
                // running through all states and only return the state that the inputted city is within
                var stateIndex = -1;

                for (i = 0; i < 55; i++){
                    if (response[i].state===covidState){
                        stateIndex = i;
                    }
                }
                
                // Store covid data in debug variable
                covidObj = response[stateIndex];

                // If we got a valid state code
                if (stateIndex >= 0) {

                    // Date modified
                    if (response[stateIndex].datemodified) {
                        $("#covid-update-date").text(parseDate(response[stateIndex].dateModified));
                    }

                    if (response[stateIndex].total) {

                        // Covid test total (sanitized)
                        $(".covid-test-total").text(sanitize(response[stateIndex].total,5));
                    }
                    
                    if (response[stateIndex].positive) {
                    
                        // Positive covid cases
                        $(".covid-pos-cases").text(sanitize(response[stateIndex].positive,4));
                    }
                        
                    if (response[stateIndex].negative) {
                        // Negative covid cases
                        $(".covid-neg-cases").text(sanitize(response[stateIndex].negative,4));
                    }
                        
                    if (response[stateIndex].positive && response[stateIndex].negative) {

                        // Percent of tests that come back positive
                        var covPercent = response[stateIndex].positive / (response[stateIndex].positive + response[stateIndex].negative);
                        covPercent = (covPercent * 100).toFixed(2);
                        
                        $(".covid-percent").text(covPercent + "%")
                    }
                    
                    if (response[stateIndex].hospitalizedCurrently) {   
                        // Number hospitalized
                        $(".covid-hosp").text(response[stateIndex].hospitalizedCurrently);
                    }
                    
                    if (response[stateIndex].deathConfirmed) {

                        $(".covid-total-deaths").text(response[stateIndex].deathConfirmed);
                    }
                    
                } else {
                    
                    // Write error message
                    $("#covid-update-date").text("(covid data not available outside of US)")

                }
            })
            
            // Get url for urban areas
            var urbanURL = response._links["city:urban_area"].href;
            
            // Urban area "details" pull
            $.ajax({
                url:`${urbanURL+"details"}`,
                method:"GET"
            }).then( function(response) {
                
                // Save json to debug variable
                uaDetails = response;

                console.log(response)

                // Healthcare related data
                $(".health-cost").text(Math.floor(response.categories[7].data[0].float_value * 10) + "/10");
                $(".health-quality").text(Math.floor(response.categories[7].data[3].float_value * 10) + "/10");
                $(".life-exp").text(Math.floor(response.categories[7].data[1].float_value));
                
                // Leisure/Culture data
                $(".culture-art").text(response.categories[4].data[1].int_value);
                $(".culture-movies").text(response.categories[4].data[3].int_value);
                $(".culture-concerts").text(response.categories[4].data[7].int_value);
                $(".cult-hist").text(response.categories[4].data[9].int_value);
                $(".cult-museums").text(response.categories[4].data[11].int_value);
                $(".cult-perform").text(response.categories[4].data[13].int_value);
                $(".cult-sports").text(response.categories[4].data[15].int_value);
                $(".cult-zoos").text(response.categories[4].data[17].int_value)

                // Population metrics
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Population");
                console.log("Population size: " + response.categories[1].data[0].float_value + " (millions)")
                var mileFloat = ((response.categories[1].data[1].float_value) / .386).toFixed(0)
                console.log("Population density: " + mileFloat + " /sq mile")
                console.log("******************************************");

                // Rent
                $(".rent-low").text("$" + sanitize(response.categories[8].data[2].currency_dollar_value,2));
                $(".rent-med").text("$" + sanitize(response.categories[8].data[1].currency_dollar_value,2));
                $(".rent-high").text("$" + sanitize(response.categories[8].data[0].currency_dollar_value,2));

                // Taxation
                var salesTax = response.categories[18].data[3].percent_value;
                if (salesTax) {
                    $(".sales-tax").text(Math.floor((salesTax) * 100) + "%")
                }

                // Crime and gun statistics
                $(".gun-death").text(Math.floor(response.categories[16].data[1].int_value));
                $(".gun-own").text(Math.floor(response.categories[16].data[3].int_value)); 
                $(".crime-rate").text(Math.floor(response.categories[16].data[0].float_value * 10) + "/10");

                // Climate stats
                $(".average-day-length").text(response.categories[2].data[0].float_value);
                $(".average-clear-days").text(response.categories[2].data[1].float_value);

                //Education Statistics 
                $(".math-high").text(Math.floor((response.categories[6].data[1].percent_value) * 100) + "%")
                $(".math-low").text(Math.floor((response.categories[6].data[2].percent_value) * 100) + "%")
                $(".math-mean").text((response.categories[6].data[3].float_value).toFixed(0))
                $(".reading-high").text(Math.floor((response.categories[6].data[4].percent_value) * 100) + "%")
                $(".reading-low").text(Math.floor((response.categories[6].data[5].percent_value) * 100) + "%")
                $(".reading-mean").text((response.categories[6].data[6].float_value).toFixed(0))
                $(".science-high").text(Math.floor((response.categories[6].data[7].percent_value) * 100) + "%")
                $(".science-low").text(Math.floor((response.categories[6].data[8].percent_value) * 100) + "%")
                $(".science-mean").text((response.categories[6].data[9].float_value).toFixed(0))
                $(".math-ranking").text(response.categories[6].data[10].int_value)
                $(".reading-ranking").text(response.categories[6].data[13].int_value)
                $(".science-ranking").text(response.categories[6].data[14].int_value)
                $(".happy-students").text(Math.floor((response.categories[6].data[0].percent_value) * 100) + "%")
                $(".university-ranking").text(response.categories[6].data[17].int_value)
                $(".university").text(response.categories[6].data[16].string_value)

                //Cost of living statistics
                var applePound = ((response.categories[3].data[1].currency_dollar_value) * .45).toFixed(2)
                var taxiCost = (response.categories[3].data[9].currency_dollar_value / 0.621).toFixed(2);

                $(".apple-cost").text("$" + applePound);
                $(".loaf-cost").text("$" + response.categories[3].data[2].currency_dollar_value.toFixed(2));
                $(".beer-cost").text("$" + response.categories[3].data[6].currency_dollar_value.toFixed(2));
                $(".cappuccino-cost").text("$" + response.categories[3].data[3].currency_dollar_value.toFixed(2));
                $(".restuarant-cost").text("$" + response.categories[3].data[8].currency_dollar_value.toFixed(2));
                $(".movieTicket-cost").text("$" + response.categories[3].data[4].currency_dollar_value.toFixed(2));
                $(".gym-cost").text("$" + response.categories[3].data[5].currency_dollar_value);
                $(".publicTransport-cost").text("$" + response.categories[3].data[7].currency_dollar_value);
                $(".taxi-cost").text("$" + taxiCost);
            })
            
            // Urban area "images" pull
            $.ajax({
                url:`${urbanURL+"images"}`,
                method:"GET"
            }).then( function(response) {

                // Save to debug variable
                uaImages = response;

                heroImg = response.photos[0].image.web; 
                $(".hero-image").css("background-image", `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImg})`);
            })
            
            
            // Urban area "salaries" pull
            $.ajax({
                url:`${urbanURL+"salaries"}`,
                method:"GET"
            }).then( function(response) {

                // Save to debug variable
                uaSalary = response;

                // SALARY PANEL

                // Grab salary data
                var salaryData = response.salaries;
                
                // Create an option for each job title
                var dropdown = $("#dropdown1")

                for (i in salaryData) {
                    // Create option
                    var newLink = $("<a>",{"data-salary-index":i}).text(salaryData[i].job.title);
                    // Append to list element
                    var newListEl = $("<li>").append(newLink);
                    // Append list element to list
                    dropdown.append(newListEl);
                }

                // Dropdown responds to clicking one of the options
                dropdown.on("click", function(event) {

                    // Only fire if we're clicking on a link icon
                    if ( event.target.matches("a") ) {

                        // Get the data index from the target element
                        var sIndex = event.target.dataset.salaryIndex;

                        // Parse salary data for 25th %ile
                        var salary25 = sanitize(salaryData[sIndex].salary_percentiles.percentile_25,4);

                        // Update display
                        $(".salary-25").text("$" + salary25);
                        
                        // Parse salary data for 50th %ile
                        var salary50 = sanitize(salaryData[sIndex].salary_percentiles.percentile_50,4);

                        // Update display
                        $(".salary-50").text("$" + salary50);
                        
                        // Parse salary data for 75th %ile
                        var salary75 = sanitize(salaryData[sIndex].salary_percentiles.percentile_75,4);

                        // Update display
                        $(".salary-75").text("$" + salary75);

                        // Update dropdown text
                        $("#dropdown-text").text(salaryData[sIndex].job.title)
                    };
                });
            })
            
            // Urban area "scores" pull

            $.ajax({
                url:`${urbanURL+"scores"}`,
                method:"GET"
            }).then( function(response) {
                
                //Job & Salary update
                //get ID of Job & Salary score
                let jobSalaryScore = $('#salary-score');
                //set job and salary value on DOM
                jobSalaryScore.text(response.categories[11].score_out_of_10.toFixed(1));
                jobSalaryScore.addClass(applyScoreFormatting(jobSalaryScore, response.categories[11].score_out_of_10.toFixed(1)));


                //education score update
                //get ID of education score
                let educationScore = $('#education-score');
                //set education value on DOM
                educationScore.text(response.categories[9].score_out_of_10.toFixed(1));
                educationScore.addClass(applyScoreFormatting(educationScore, response.categories[9].score_out_of_10.toFixed(1)));

                //cost of living score update
                //get ID of cost of living score
                let costOfLiving = $('#cost-of-living-score');
                //set cost of living value on DOM
                costOfLiving.text(response.categories[1].score_out_of_10.toFixed(1));
                costOfLiving.addClass(applyScoreFormatting(costOfLiving, response.categories[1].score_out_of_10.toFixed(1)));

                //health score update
                //get ID of health score
                let healthScore = $('#health-score');
                //set education value on DOM
                healthScore.text(response.categories[8].score_out_of_10.toFixed(1));
                healthScore.addClass(applyScoreFormatting(healthScore, response.categories[8].score_out_of_10.toFixed(1)));

                //Safety score update
                //get ID of Safety score
                let safetyScore = $('#safety-score');
                //set weather score value on DOM
                safetyScore.text(response.categories[7].score_out_of_10.toFixed(1));
                safetyScore.addClass(applyScoreFormatting(safetyScore, response.categories[7].score_out_of_10.toFixed(1)));

                //weather score update
                //get ID of weather score
                let weatherScore = $('#weather-score');
                //set weather score value on DOM
                weatherScore.text(response.categories[16].score_out_of_10.toFixed(1));
                weatherScore.addClass(applyScoreFormatting(weatherScore, response.categories[16].score_out_of_10.toFixed(1)));

                //culture and leisure score update
                //get ID of culture score
                let cultureScore = $('#culture-score');
                //set education value on DOM
                cultureScore.text(response.categories[14].score_out_of_10.toFixed(1));
                cultureScore.addClass(applyScoreFormatting(cultureScore, response.categories[14].score_out_of_10.toFixed(1)));

                
                // Save to debug variable
                uaScores = response;

                // Update the Basic Info Summary
                var res = response.summary.split("</p>");
                $("#city-summary").html(res[0] + "</p>");

                
            })
        
        // ----------------------------------------- wx api ----------------------------------------------------------

            // Openweathermap charges for information going back more than a week - for now, we are going back 5 days and simulating extrapolation for a year.
            
            // The openweathermap API end points require a unix date range to search for historic weather data. 
            // Today's Unix date - divide the current time by 1000 to produce the unix number and round down to ten digits.
            var unixDateNow = Math.floor(new Date().getTime() / 1000);
            // This gives the unix date 5 days ago - 5 days * 86400 seconds a day.
            var unixFiveDayAgo = unixDateNow - (5 * 86400);
            // This gives the unix date 30 days ago.
            var unixMonthAgo = unixDateNow - (30 * 86400);
               //console.log("unix date: ", unixDateNow);
               //console.log("unix a month ago:", unixMonthAgo);
            
            // This retrieves the city id number, latitude, and longitude from teleport API in parent ajax.
            //console.log("data check on current city", response);
            var cityId = response.geoname_id;
            var lat = response.location.latlon.latitude;
            var lon = response.location.latlon.longitude;
                //console.log("lat:", lat);
                //console.log("lon:", lon);
                //console.log("city id", cityId);
                   
                // --------------------------------URLs with end points for openweathermap API ------------------------------ 

            // Openweathermap url for history going back to a specific day, within the last five days - the free api has a time span limit of 5 days
            var oneWeekHistory = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+ lat +"&lon="+ lon +"&dt="+ unixFiveDayAgo +"&units=imperial&appid=cf54ce47ff5608fa5caf5b89772775c4";
            
            // Openweathermap url for history going back a specified amount of time - can produce a range of times - this is not a free service, the example here is for proof of concept.
            var cityHistory = "http://history.openweathermap.org/data/2.5/history/city?id="+ cityId +"&type=hour&start="+ unixDateNow +"&end="+ unixMonthAgo +"&appid=cf54ce47ff5608fa5caf5b89772775c4";
            
            // Ask url for history data

            $.ajax({
                url: oneWeekHistory,
                method:"GET"
            }).then( function(urlCityHistoryMain) {
            
                // Save to debug variable
                weatherCityHistory = urlCityHistoryMain;

            });


            
            // High / Low temp history 
            $.ajax({
                url: oneWeekHistory,
                method:"GET"
            }).then( function(urlCityHistory) {
                    
                //console.log("wx city history response: " , urlCityHistory);
            // This is to determine minimum and maximum temps for the year * again, proof of concept, this is only doing it for a week ago today. 
                var tempArr = urlCityHistory.hourly;
          
                // Isolate the temperature array and extract the portion we need
                for(var i = 0; i < tempArr.length; i++){
                    tempArr[i] = tempArr[i].temp
                }
                
                // Use these variables to identify the largest and smallest temps in the array
                var highestTemp = Math.max.apply(Math, tempArr);
                var lowestTemp = Math.min.apply(Math, tempArr);
                    
                // Yearly high average, and Yearly low average rounded down || Populate the appropriate elements in DOM
                $(".average-high-temp").text(Math.floor(highestTemp));
                $(".average-low-temp").text(Math.floor(lowestTemp) -8);
                          
                // Save to debug variable
                highLowTemps = {
                    high:highestTemp,
                    low:lowestTemp
                }
                
            });
                   
        });

    });

};


function resetSearch() {
}


// Apply Formatting Class to Score Elements Function
function applyScoreFormatting(element, score){
    element.removeClass("badge-red badge-green badge-yellow")
    
    switch (true) {
        case score < 3:
            return "badge-red";
        case score < 7:
            return "badge-yellow";
        case score <= 10:
            return "badge-green";
        default: "badge-red";
    }
}

//function to abbreviate state
function abbreviateState(fullname) {
    // Takes a string where the state is the second in a comma-separated list of locations and returns the two-letter abbreviation for that state
    
    // Split the string into component locations
    fullname = fullname.split(",")
    // Grab the state and remove excess whitespace
    stateName = fullname[1].trim();

    // Based on string, return the correct abbreviation
    switch(stateName) {
        case "Alabama":
            return	"AL";
        case "Alaska":
            return "AK";
        case "Arizona":
            return "AZ";
        case "Arkansas":
            return "AR";
        case "California":
            return "CA";
        case "Colorado":
            return "CO";
        case "Connecticut":
            return "CT";
        case "Delaware":
            return "DE";
        case "Washington, D.C.":
            return "DC";
        case "Florida":
            return "FL";
        case "Georgia":
            return "GA";
        case "Hawaii":
            return "HI";
        case "Idaho":
            return "ID";
        case "Illinois":
            return "IL";
        case "Indiana":
            return "IN";
        case "Iowa":
            return "IA";
        case "Kansas":
            return "KS";
        case "Kentucky":
            return "KY";
        case "Louisiana":
            return "LA";
        case "Maine":
            return "ME";
        case "Maryland":
            return "MD";
        case "Massachusetts":
            return "MA";
        case "Michigan":
            return "MI";
        case "Minnesota":
            return "MN";
        case "Mississippi":
            return "MS";
        case "Missouri":
            return "MO";
        case "Montana":
            return "MT";
        case "Nebraska":
            return "NE";
        case "Nevada":
            return "NV";
        case "New Hampshire":
            return "NH";
        case "New Jersey":
            return "NJ";
        case "New Mexico":
            return "NM";
        case "New York":
            return "NY";
        case "North Carolina":
            return "NC";
        case "North Dakota":
            return "ND";
        case "Ohio":
            return "OH";
        case "Oklahoma":
            return "OK";
        case "Oregon":
            return "OR";
        case "Pennsylvania":
            return "PA";
        case "Rhode Island":
            return "RI";
        case "South Carolina":
            return "SC";
        case "South Dakota":
            return "SD";
        case "Tennessee":
            return "TN";
        case "Texas":
            return "TX";
        case "Utah":
            return "UT";
        case "Vermont":
            return "VT";
        case "Virginia":
            return "VA";
        case "Washington":
            return "WA";
        case "West Virginia":
            return "WV";
        case "Wisconsin":
            return "WI";
        case "Wyoming":
            return "WY";
        default:
            return "NO-GO";
    }
};



function sanitize(num,round) {
    // Sanitize takes ugly large numbers and translates them into lovely round numbers with comma separators

    return insertCommasIntoNumbers(roundToPreDecimal(num,round));

}

function roundToTenThousand(num) {
    // This function rounds the given number to the nearest ten thousands
    return Math.round(num / 1000) * 1000
}

function roundToPreDecimal(num, dec) {
    // rounds to the specified digit (e.g. entering 2 means the tens place will be the last non-zero number)

    // Generate order of magnitude
    var order = 10**(dec-1);

    return Math.round(num / order) * order;

}



function insertCommasIntoNumbers(num) {
    // This function takes a number and inserts commas every three digits

    var oldNum = num.toString();
    var transitionNum = "";
    var newNum = "";
    var numIndex = 0;

    // Run through each digit of the number in reverse (so starting with the ones digit)
    for (i = oldNum.length-1; i > -1; i--) {

        transitionNum = transitionNum + oldNum[i];

        // Count up
        numIndex++;
        // If this is the third number add a comma and reset
        // We also don't adda comma if this is the first number in the string
        if (numIndex === 3 && i > 0) {
            transitionNum += ",";
            numIndex = 0;
        }
    }

    // Then reverse the transition number to get the final result
    for (i = transitionNum.length-1; i > -1; i--) {
        newNum += transitionNum[i];
    }

    // Return number
    return newNum;
}

function parseDate(uglyDate) {
    // parseDate takes a date of form YYYY-MM-DD.... and translates it into something user-friendly

    var newYear = "";
    var newMonth = "";
    var newDay = "";

    // Grab the information from the ugly date
    for (i = 0; i < uglyDate.length; i++) {
        
        // First four numbers assumed to be the year
        if (i < 4) {
            newYear += uglyDate[i];
        } else if (4 < i && i < 7) {
            // Next is month
            newMonth += uglyDate[i];
        } else if (7 < i && i < 10){
            // Day last
            newDay += uglyDate[i];
        }
    }

    // Translate the month into words
    switch (newMonth) {
        case "01":
            newMonth = "January";
            break;
        case "02":
            newMonth = "February";
            break;
        case "03":
            newMonth = "March";
            break;
        case "04":
            newMonth = "April";
            break;
        case "05":
            newMonth = "May";
            break;
        case "06":
            newMonth = "June";
            break;
        case "07":
            newMonth = "July";
            break;
        case "08":
            newMonth = "August";
            break;
        case "09":
            newMonth = "September";
            break;
        case "10":
            newMonth = "October";
            break;
        case "11":
            newMonth = "Novembet";
            break;
        case "12":
            newMonth = "December";
            break;
        default:
            newMonth = "Write your congressmional representative, this isn't a real month";
            break;
    }

    return newMonth + " " + newDay + ", " + newYear;

}