# Web Mapping Assignment Geog 487

## Course Context
* Professor: Rob Feick
* Group Number: 11
* Group Members: Nazifa Uddin, Gillian Cross, Gurdeep Tut, Giovanni Harvey

## The Company - 3GN Technology
- Is a company based in the clouds.
- We work on building Web based GIS Applications solutions for communities.
- The motto : `Just because something works, doesn’t mean it can’t be improved.` (Guess the reference)

### Applications
- `FloodPlains Mapped Huntsville` (Link to Application)[https://huntsville-proj.web.app/]
    - Files Last edited: February 16, 2021
    - Technologies used
        1. Google Firebase (Database and Hosting)
        2. ArcGIS Api For JavaScript 
        3. Leaflet Api
        4. Turf JS Api (For Advanced Spatial Analysis)
        5. Html, CSS, Javascript Libraries

#### FloodPlains Mapped Huntsville
- The purpose of this application was to empower the `Residents` and `Government` (Two User Groups) of Huntsville.
- This was done by allowing them to have a tool that incorporates `Volunteered Geographic Information and Participatory GIS processes`:
    1. Allow the users to add data on the map such as polygons, points, lines and metadata (incorporating VGI and PGIS).
    2. This data is saved in a NoSQL firebase database
    3. This data can be displayed to others who use this application
    4. Thus, these users can edit the metadata that is added to these features
    5. Government user group can then use this tool for further analysis (for eg. during a spring flood event to figure serverly affected areas)
- The tool also incorporated two Esri Services.
    1. `RouteTask` - To calculate the nearest bus stops to the users current location while avoiding barriers (for example lakes, rivers - the idea is that during flooding the water level would increase and the spread of the feature would be greater) -> `Route Locator`
    2. `Service Area` - To identify which user Volunteered Geographic information (points) fell within the Service area time frames of 5, 10, 15 minutes from any point on the map -> `Service Area`

### How to use the Two Services

##### Route Locator

- `Route Locator requires the user to allow the site to access their GPS`
- So if the user goes to the Route Locator tab and click on the `Click to Generate Route` button
- The popup for the site access to GPS location will show up if it is not already activated
- No the user just waits for the service to run
- The service will generate two points(You can click on the points for a popup) that follows a path which is the shortest route to the nearest bus stop in Huntsville from the user's current location
- This tab also generates the directions to get to this location

##### Service Area
- The Service area tool is only available to the `Government` user group
- For the service area tool the user has to double click on a location in the map extent
- It then generates 5, 10, 15 minutes service area from the location which was clicked
- If the government official was to look in the `Service Area` tab they would see all the points which fall within each service area
- For example 0-15 (means a 15 minutes service area)
- So all the points that lie in this 15 minute service area would be listed (the name, ID, Description and the date in which the points where created/last modified)


### Bugs
- Currently there is a bug with the Editor tool in the VGI application
- A way to target the object before it was visible on the map layer was not found
- Thus, a duplicate feature had to be created after the feature was added
- We were then able to add additional information such as the uuid was added to cross reference a point with the firebase database for CRUD functionalities



