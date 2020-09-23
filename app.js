//initial variables
const icon = document.querySelector('.icon');
const searchBar = document.querySelector('input');
const filterListDiv = document.querySelector('.filter-list-div');
const filter = document.querySelector('.filter');
const filterArray = [1, 2, 3];



//adding classes


//append initial variables to DOM



//dynamic search bar
icon.addEventListener('click', function(){
    searchBar.classList.toggle('active');
    let testItems = document.querySelectorAll('.test');
    for(let i =0; i < filterArray.length; i++){
        testItems[i].classList.toggle('hide');
    }
});


//function to initiate search using 'Enter' key
searchBar.addEventListener('keypress', function(e){
    if(e.key === 'Enter'){
        //code to search
    }
});


//populate filters
for(let i = 0; i < filterArray.length; i++){
    //create list elements for each index: filterArray
    let filterItems = document.createElement('li');
    filterItems.setAttribute('class', 'test waves-effect waves-light btn hide')
    filterItems.textContent = filterArray[i];
    filter.appendChild(filterItems);
}






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
            
            console.log("THE STATE ABBREVIATION IS: " + abbreviateState(response.full_name));
            
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
