
// Search Button functionality
$("#search-button").on("click", function(event) {
    event.preventDefault();

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
    
            console.log(response);
        
            // Get url for urban areas
            var urbanURL = response._links["city:urban_area"].href;

            // Lord have mercy, it's AJAX number 3
            $.ajax({
                url:urbanURL,
                method:"GET"
            }).then( function(response) {
        
                console.log(response);
            
    
    
            })
        })

        //var to get the state from the previous ajax requests
        var covidState = "WA"

        // Query URL for the covid data
        var covidURL = "https://api.covidtracking.com/v1/states/current.json" 


        // Ajax for all states data
        $.ajax({
            url:covidURL,
            method:"GET"
        }).then( function(response) {
            // running through all states and only return the state that the inputted city is within
            for (i = 0; i < 55; i++){
                if (response[i].state.indexOf("WA")!==-1){
                    //returning specific data about the state's COVID status
                    console.log(response)
                    console.log("Data quality grade: " + response[i].dataQualityGrade)
                    console.log("Negative cases: " + response[i].negative)
                    console.log("Positive cases: " + response[i].positive)
                    console.log("Total test cases: " + response[i].total)
                    console.log("Total Deaths Confirmed: " + response[i].deathConfirmed)
                }};
        })

    })


})