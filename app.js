// Get references to main page elements
const icon = document.querySelector('.icon');
const iconResults = document.querySelector('.nav-results');
const searchBar = document.getElementById('search-bar');
const searchBarResults = document.getElementById('nav-bar-results');

// This variable toggles the search button behavior
var searchBarActive = false;

// Dynamic search bar
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
            searchCities();
        }
    }
});


iconResults.addEventListener('click', function(){
    if (!searchBarActive){
        searchCitiesResults();
    }
});


// Search function
function searchCities() {
    // This function is called by the search bar event listeners to get the database information the app needs

    // Grab city name from input bar
    var cityName = $("#search-bar").val();

    // Create query URL
    var queryURL = "https://api.teleport.org/api/cities/?search=" + cityName;
    
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
    
            console.log("******************************************");
            console.log("CITY");
            console.log("******************************************");
            console.log(response);
            
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
                for (i = 0; i < 55; i++){
                    if (response[i].state===covidState){
                        stateIndex = i;
                    }};

                // Date modified
                $("#covid-update-date").text(parseDate(response[stateIndex].dateModified));
                
                // Covid test total (sanitized)
                $(".covid-test-total").text(sanitize(response[stateIndex].total,5));
                
                // Positive covid cases
                $(".covid-pos-cases").text(sanitize(response[stateIndex].positive,4));
                
                // Negative covid cases
                $(".covid-neg-cases").text(sanitize(response[stateIndex].negative,4));
                
                // Percent of tests that come back positive
                var covPercent = response[stateIndex].positive / (response[stateIndex].positive + response[stateIndex].negative);
                covPercent = (covPercent * 100).toFixed(2);

                $(".covid-percent").text(covPercent + "%")
                
                // Number hospitalized
                $(".covid-hosp").text(response[stateIndex].hospitalizedCurrently);
                
                $(".covid-total-deaths").text(response[stateIndex].deathConfirmed);

            })
            
            // Get url for urban areas
            var urbanURL = response._links["city:urban_area"].href;
            
            // Urban area "details" pull
            $.ajax({
                url:`${urbanURL+"details"}`,
                method:"GET"
            }).then( function(response) {
                
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS");
                console.log("******************************************");
                console.log(response);

                // Healthcare related data

                // Healthcare cost
                $(".health-cost").text(Math.floor(response.categories[7].data[0].float_value * 10) + "/10");
                
                // Healthcare Quality
                $(".health-quality").text(Math.floor(response.categories[7].data[3].float_value * 10) + "/10");
                
                // Life Expectancy
                $(".life-exp").text(Math.floor(response.categories[7].data[1].float_value));
                
                //Leisure/Culture data
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Culture-Leisure");

                // Number of art galleries
                $(".culture-art").text(response.categories[4].data[1].int_value);
                
                // Number of cinemas
                $(".culture-movies").text(response.categories[4].data[3].int_value);
                
                // Number of concerts
                $(".culture-concerts").text(response.categories[4].data[7].int_value);

                $(".cult-hist").text(response.categories[4].data[9].int_value);

                $(".cult-museums").text(response.categories[4].data[11].int_value);

                $(".cult-perform").text(response.categories[4].data[13].int_value);

                $(".cult-sports").text(response.categories[4].data[15].int_value);

                $(".cult-zoos").text(response.categories[4].data[17].int_value)

                //Traffic data
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Traffic");
                console.log("******************************************");

                //Population metrics
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Population");
                console.log("Population size: " + response.categories[1].data[0].float_value + " (millions)")
                var mileFloat = ((response.categories[1].data[1].float_value) / .386).toFixed(0)
                console.log("Population density: " + mileFloat + " /sq mile")
                console.log("******************************************");

                // Telescope Weather data?

                // Rent
                $(".rent-low").text(response.categories[8].data[2].currency_dollar_value);
                $(".rent-med").text(response.categories[8].data[1].currency_dollar_value);
                $(".rent-high").text(response.categories[8].data[0].currency_dollar_value);

                // Taxation
                var salesTax = response.categories[18].data[3].percent_value
                $(".income-tax").text("Sales Tax: " + Math.floor((salesTax) * 100) + "%")

                //Gun related crime and gun statistics
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Safety");
                console.log("Gun-related deaths per 100,000 residents per year: " + response.categories[16].data[1].int_value)
                console.log("Gun Owners per 100 residents: " + response.categories[16].data[3].int_value)
                console.log("******************************************");

                //Cost of living statistics
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / COST OF LIVING");
                var applePound = ((response.categories[3].data[1].currency_dollar_value) * .45).toFixed(2)
                console.log("Price of a pound of apples: " + applePound)
                console.log("Price of a loaf of bread: " + response.categories[3].data[2].currency_dollar_value)
                console.log("Price of a beer: " + response.categories[3].data[6].currency_dollar_value)
                console.log("Price of a cappuccino: " + response.categories[3].data[3].currency_dollar_value)
                console.log("Price of a meal at a restuarant: " + response.categories[3].data[10].currency_dollar_value)
                console.log("Price of a movie ticket: " + response.categories[3].data[4].currency_dollar_value)
                console.log("Price of a gym membership: " + response.categories[3].data[5].currency_dollar_value)
                console.log("Price of a public transport per month: " + response.categories[3].data[7].currency_dollar_value)
                console.log("Price of a taxi fare: " + response.categories[3].data[9].currency_dollar_value)
                console.log("******************************************");
               
            })
            
            // Urban area "images" pull
            $.ajax({
                url:`${urbanURL+"images"}`,
                method:"GET"
            }).then( function(response) {

                heroImg = response.photos[0].image.web; 
                $(".hero-image").css("background-image", `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImg})`);
            })
            
            
            // Urban area "salaries" pull
            $.ajax({
                url:`${urbanURL+"salaries"}`,
                method:"GET"
            }).then( function(response) {

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

                // Dropdown reponds to clicking one of the options
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
                    };
                });
            })
            
            // Urban area "scores" pull
            $.ajax({
                url:`${urbanURL+"scores"}`,
                method:"GET"
            }).then( function(response) {
                
                console.log("******************************************");
                console.log("URBAN AREA / SCORES");
                console.log("******************************************");
                console.log(response);
            })
        
        // ----------------------------------------- wx api ----------------------------------------------------------

            // Openweathermap charges for information going back more than a week - for now, we are going back 5 days and simulating extrapolation for a year.
            
            // The openweathermap API end points require a unix date range to search for historic weather data. 
            // Today's Unix date - divide the current time by 1000 to produce the unix number and round down to ten digits.
            var unixDateNow = Math.floor(new Date().getTime() / 1000)
            // This gives the unix date 5 days ago - 5 days * 86400 seconds a day.
            var unixFiveDayAgo = unixDateNow - (5 * 86400)
            // This gives the unix date 30 days ago.
            var unixMonthAgo = unixDateNow - (30 * 86400)
                console.log("unix date: ", unixDateNow) 
                console.log("unix a month ago:", unixMonthAgo)
            
            // This retrieves the city id number, latitude, and longitude from teleport API in parent ajax.
            console.log("data check on current city", response)
            var cityId = response.geoname_id
            var lat = response.location.latlon.latitude
            var lon = response.location.latlon.longitude
                console.log("lat:", lat)
                console.log("lon:", lon)
                console.log("city id", cityId)
                   
                // --------------------------------URLs with end points for openweathermap API ------------------------------ 

            // Openweathermap url for history going back to a specific day, within the last five days - the free api has a time span limit of 5 days
            var oneWeekHistory = "https://api.openweathermap.org/data/2.5/onecall/timemachine?lat="+ lat +"&lon="+ lon +"&dt="+ unixFiveDayAgo +"&units=imperial&appid=cf54ce47ff5608fa5caf5b89772775c4";
            
            // Openweathermap url for history going back a specified amount of time - can produce a range of times - this is not a free service, the example here is for proof of concept.
            var cityHistory = "http://history.openweathermap.org/data/2.5/history/city?id="+ cityId +"&type=hour&start="+ unixDateNow +"&end="+ unixMonthAgo +"&appid=cf54ce47ff5608fa5caf5b89772775c4";
            
            // Ask url for history data
            $.ajax({
                url: oneWeekHistory,
                method:"GET"
            }).then( function(urlCityHistory) {
                    
                console.log("wx city history response: " , urlCityHistory);
            // This is to determine minimum and maximum temps for the year * again, proof of concept, this is only doing it for a week ago today. 
                var tempArr = urlCityHistory.hourly;
                    console.log("temp array for temps", tempArr);
               
                // Isolate the temperature array and extract the portion we need
                for(var i = 0; i < tempArr.length; i++){
                    tempArr[i] = tempArr[i].temp
                }
                
                // Use these variables to identify the largest and smallest temps in the array
                var highestTemp = Math.max.apply(Math, tempArr);
                    console.log("highest temp recorded", highestTemp);
               
                    var lowestTemp = Math.min.apply(Math, tempArr);
                    console.log("lowest temp recorded", lowestTemp);
                
                // Yearly high average, and Yearly low average || Populate the appropriate elements in DOM
                var highTempEl =  document.querySelector("#data-containers > div:nth-child(2) > div.row.center > div:nth-child(3) > p.p-medium");
                var lowTempEl = document.querySelector("#data-containers > div:nth-child(2) > div.row.center > div:nth-child(4) > p.p-medium");

                highTempEl.innerHTML = Math.floor(highestTemp) ;
                lowTempEl.innerHTML = Math.floor(lowestTemp) -8;
            
            // This is to determine average rainfall for the period selected - nearly the same method as above 
                
            });
                   
        });

    });

};


//Functionality for results page search bar
function searchCitiesResults() {
    // This function is called by the search bar event listeners to get the database information the app needs

    // Grab city name from input bar
    var cityName = $("#nav-bar-results").val();

    // Create query URL
    var queryURL = "https://api.teleport.org/api/cities/?search=" + cityName;
    
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
    
            console.log("******************************************");
            console.log("CITY");
            console.log("******************************************");
            console.log(response);
            
            // Update city name
            $(".city-name").text((response.name).toUpperCase());

            //var to get the state from the previous ajax requests
            var covidState =  abbreviateState(response.full_name)

            // Ajax for all states data
            $.ajax({
                url:"https://api.covidtracking.com/v1/states/current.json",
                method:"GET"
            }).then( function(response) {
                // running through all states and only return the state that the inputted city is within
                for (i = 0; i < 55; i++){
                    if (response[i].state===covidState){

                        console.log("******************************************");
                        console.log("COVID DATA BY STATE");
                        console.log("******************************************");
                        console.log(response);

                        console.log("Last date updated: " + response[i].dateModified);
                        console.log("Curently Hospitalized cases: " + response[i].hospitalizedCurrently);
                        console.log("Total test cases: " + response[i].total);
                        console.log("Negative cases: " + response[i].negative);
                        console.log("Positive cases: " + response[i].positive);
                        console.log("Total Deaths Confirmed: " + response[i].deathConfirmed);
                    }};
            })
            
            // Get url for urban areas
            var urbanURL = response._links["city:urban_area"].href;
            
            // Urban area "details" pull
            $.ajax({
                url:`${urbanURL+"details"}`,
                method:"GET"
            }).then( function(response) {
                
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS");
                console.log("******************************************");
                console.log(response);

                //Healthcare related data
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Healthcare");
                console.log("Healthcare Cost: " + response.categories[7].data[0].float_value)
                //The life-expectincy is a national number and doesn't change per city (recomend removing)
                console.log("Life-Expectancy: " + response.categories[7].data[1].float_value)
                console.log("Healthcare Quality: " + response.categories[7].data[3].float_value)
                
                
                console.log("******************************************");

                //Leisure/Culture data
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Culture-Leisure");
                console.log("Art Galleries: " + response.categories[4].data[1].int_value)
                console.log("Cinemas: " + response.categories[4].data[3].int_value)
                console.log("Concerts: " + response.categories[4].data[7].int_value)
                console.log("Historical Sites: " + response.categories[4].data[9].int_value)
                console.log("Museums: " + response.categories[4].data[11].int_value)
                console.log("Performing Arts: " + response.categories[4].data[13].int_value)
                console.log("Sports Venue: " + response.categories[4].data[15].int_value)
                console.log("Zoos: " + response.categories[4].data[17].int_value)
                console.log("******************************************");

                //Traffic data
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Traffic");
                console.log("******************************************");
               
            })
            
            // Urban area "images" pull
            $.ajax({
                url:`${urbanURL+"images"}`,
                method:"GET"
            }).then( function(response) {

                heroImg = response.photos[0].image.web; 
                $(".hero-image").css("background-image", `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${heroImg})`);
            })
            
            
            // Urban area "salaries" pull
            $.ajax({
                url:`${urbanURL+"salaries"}`,
                method:"GET"
            }).then( function(response) {

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

                // Dropdown reponds to clicking one of the options
                dropdown.on("click", function(event) {

                    // Only fire if we're clicking on a link icon
                    if ( event.target.matches("a") ) {

                        // Get the data index from the target element
                        var sIndex = event.target.dataset.salaryIndex;

                        // Parse salary data for 25th %ile
                        var salary25 = roundToTenThousand(salaryData[sIndex].salary_percentiles.percentile_25);
                        salary25 = insertCommasIntoNumbers(salary25);

                        // Update display
                        $(".salary-25").text("$" + salary25);
                        
                        // Parse salary data for 50th %ile
                        var salary50 = roundToTenThousand(salaryData[sIndex].salary_percentiles.percentile_50);
                        salary50 = insertCommasIntoNumbers(salary50);

                        // Update display
                        $(".salary-50").text("$" + salary50);
                        
                        // Parse salary data for 75th %ile
                        var salary75 = roundToTenThousand(salaryData[sIndex].salary_percentiles.percentile_75);
                        salary75 = insertCommasIntoNumbers(salary75);

                        // Update display
                        $(".salary-75").text("$" + salary75);
                    };
                });
            })
            
            // Urban area "scores" pull
            $.ajax({
                url:`${urbanURL+"scores"}`,
                method:"GET"
            }).then( function(response) {
                
                console.log("******************************************");
                console.log("URBAN AREA / SCORES");
                console.log("******************************************");
                console.log(response);
            })
        })
    })
}





//select which search bar runs AJAX request
if (searchBarActive = false){
    //function to initiate 'results' page search bar using 'Enter' key
searchBarResults.addEventListener('keypress', function(e){
    if(e.key === 'Enter' && searchBarResults.value){
        searchCitiesResults();
        console.log(nav-bar-results);
    }
});
} else {
//function to initiate search using 'Enter' key
searchBar.addEventListener('keypress', function(e){
    if(e.key === 'Enter' && searchBar.value) {

        // Toggle which page is visible
        document.querySelector(".start-page-wrap").classList.toggle("hide");
        document.querySelector(".results-page-wrap").classList.toggle("hide");
        

        // Search
        searchCities();

    }
});
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