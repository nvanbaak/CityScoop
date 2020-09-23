
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
    
            console.log("******************************************");
            console.log("CITY");
            console.log("******************************************");
            console.log(response);
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
                
                console.log("******************************************");
                console.log("URBAN AREA / IMAGES");
                console.log("******************************************");
                console.log(response);
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

        })
    })

})