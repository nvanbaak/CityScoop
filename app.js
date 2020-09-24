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
            $(".city-name").text(response.name);


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

                // SALARY PANEL

                // Grab salary data
                var salaryData = response.salaries;
                
                // Create an option for each job title

                var dropdown = $("#dropdown1")

                for (i in salaryData) {
                    
                    console.log(salaryData[i].job.title);
                    // Create option
                    // var newJob = $("<option>",{"value":salaryData[i].job.title});


                }


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
            break;
    }
}
