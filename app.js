
// Search Button functionality
$("#search-button").on("click", function(event) {
    event.preventDefault();

    // Grab city name from input bar
    var cityName = $("#search-bar").val();

    // Create query URL
    var queryURL = "https://api.teleport.org/api/cities/?search=" + cityName;
    
    // var queryURL = "https://api.teleport.org/api/urban-areas/" + cityName + "/cities/";


    $.ajax({
        url:queryURL,
        method:"GET"
    }).then( function(response) {

        console.log(response);
    
    })

})