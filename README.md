# CityScoop

##"One search to get it all"

> https://dyoder838.github.io/CityScoop/


CityScoop is an application that allows its users to consolidate information of various locations around the world. The application's functionality pulls its information from three APIs:

  - Teleport
  - Openweathermap
  - CovidTracking

The user will input a desired location by (city) and the application will populate the following information:

  - City name with it's corresponding image as well as the current population
  - Brief desription of location
  - A more in depth look at statistics relating to: Job/Salary, General education, Cost of living, Health/safety, Weather, and recreational activities

Each of the statistics listed above recieves a general score out of 10, in relation to other locations around the world. This score can be found on the far right side of the listed criteria.

cityScoop provides the user a means to make informed decisions on a move to move basis.

###Contributers:
  - Daniel Yoder - Git Master, Backend Development
  - Chris Sisson - Frontend Development
  - Nikolai Van Baak - Project Manager, Backend Development
  - Dexter Sage - Back End Development
  - Jack Solaro - Frontend Development


###Awards: "Peoples Choice", "Best Presentation"





#### Debug

Response objects are stored under the following variable names:

* *cityMain* // Top-level json with city name, population, and lat/lon
* *covidJSON* // Json containing covid data for the chosen state
* *uaDetails* // Urban Area "details" json
* *uaImages* // json containing free-to-use image links for city
* *uaSalary* // json with salary data for city
* *uaScores* // json with score data for city
* *weatherCityHistory* // Weather history for selected city
* *highLowTemps* // Highest and lowest temps for city this year
                
