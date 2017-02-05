Technologies used for development:
1) HTML5
2) jQuery
3) Bootstrap
4) FourSquare API

How it works:

This project,Search Venues, takes the Name of the place by the user and returns the Recommended and popular places near by the location entered. This process is executed when the user enters the Name of a place and hits the Submit button.  

The Search Venues Page, has a Search Panel on the top mid of the screen and filters by categories on the left side of the page. Whereas the results of the desired location are shown on the right side of the page. 
 (This name based search is done by hitting venues/search on foursquare API as per foursquare documentation.)

To get nearby places it is necessary either to allow browser to know users’ current location or to provide a nearby value in Near By field.

If user clicks on categories on left side of the page, filtered places as per selected category and entered values in nearby and venue name, are show on the right side of the page.

Below the search box user is shown square boxes, clicking on those boxes will show user places of those categories. (This category based search is done by hitting venues/explore on foursquare API as per foursquare documentation.) 

Currently, if the venue is searched via providing the Category then the results show the ratings as well, but not when the venue is search without the category selection. Update of this feature is forthcoming. 

Limitations faced during development:
1)	Images/photos of places are not shown because photos links provided by foursquare API were broken and showing errors. Searched and brain stromed for the solution but could not find any useful solution for now. 

This module is a read-only subset of the full Foursquare API, but further capability, (adding, posting, updating,images and links display etc), is forthcoming based on further request. 
