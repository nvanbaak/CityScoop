// Get references to main page elements
const icon = document.querySelector('.icon');
const searchBar = document.getElementById("search-bar");

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
            
            // Run the search
            searchCities();
        }
    }
});


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

                //Population metrics
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Population");
                console.log("Population size: " + response.categories[1].data[0].float_value + " (millions)")
                var mileFloat = ((response.categories[1].data[1].float_value) / .386).toFixed(0)
                console.log("Population density: " + mileFloat + " /sq mile")
                console.log("******************************************");

                //Telescope Weather data?

                //Taxation
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Taxation");
                var salesTax = response.categories[18].data[3].percent_value
                console.log("Sales Tax: " + Math.floor((salesTax) * 100) + "%")
                console.log("******************************************");

                //Gn related crime and gun statistics
                console.log("******************************************");
                console.log("URBAN AREA / DETAILS / Safety");
                console.log("Gun-related deaths per 100,000 residents per year: " + response.categories[16].data[1].int_value)
                console.log("Gun Owners per 100 residents: " + response.categories[16].data[3].int_value)
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
}

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