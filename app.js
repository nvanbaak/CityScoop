// Get references to main page elements
const icon = document.querySelector('.icon');
const searchBar = document.getElementById("search-bar");
const filterListDiv = document.querySelector('.filter-list-div');
const filter = document.querySelector('.filter');
const filterArray = [1, 2, 3];

// Populate filters
for(let i = 0; i < filterArray.length; i++) {

    // Create list elements for each index: filterArray
    let filterItems = document.createElement('li');
    filterItems.setAttribute('class', 'filterArg waves-effect waves-light btn');
    filterItems.textContent = filterArray[i];

    // Append to filter list
    filter.appendChild(filterItems);
}

// This variable toggles the search button behavior
var searchBarActive = false;

// Dynamic search bar
icon.addEventListener('click', function(event){
    event.preventDefault();

    // If this is the first time the button's been clicked,
    if (!searchBarActive) {
        // Show the search bar
        searchBar.classList.toggle('active');

        // Toggle hide on filter items
        filter.classList.remove('hide');

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
            
            console.log("THE STATE ABBREVIATION IS: " + abbreviateState(response.full_name));

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
                        //returning specific data about the state's COVID status
                        console.log("Data quality grade: " + response[i].dataQualityGrade)
                        console.log("Negative cases: " + response[i].negative)
                        console.log("Positive cases: " + response[i].positive)
                        console.log("Total test cases: " + response[i].total)
                        console.log("Total Deaths Confirmed: " + response[i].deathConfirmed)
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
                
                console.log("******************************************");
                console.log("URBAN AREA / SALARIES");
                console.log("******************************************");
                console.log(response);
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
            break;
    }
}
