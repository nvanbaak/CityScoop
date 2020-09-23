
// Search Button functionality
$("#search-button").on("click", function(event) {
    event.preventDefault();

    var cityName = $("#search-bar").val();

    console.log(cityName);

})