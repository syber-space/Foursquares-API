// Global Variables
var _MainClass = null;
var _FourSquareApi = null;

$(document).ready(function () {
    _MainClass = new MainClass();
    _MainClass.InitializeMainClass();
});

//Main class having main functionalities of the page and controlling the code flow.
var MainClass = function myfunction() {
    // Current Class Global Variables
    this.CurrentUserLocation = null;

    //HTML elements
    this.$dvMain = $('#dvMain'),
    this.$txtNearBy = $("#txtNearBy"),
    this.$SearchHolder = $('[data-custom-attr="searchHolder"'),
    this.$txtSearchVenueByName = $("#txtSearchVenueByName"),
    this.$btnSearch = $("#btnSearch"),
    this.$dvVenuesListing = $("#dvVenuesListing"),
    this.$dvFilterItem = $("#dvFilterItem");
    this.$dvFilterPanel = $("#dvFilterPanel");
    this.$btnsExploreByCat = $('a[data-exploreByCat]');

    //Calling core functionalities like getting user current location, initializing FourSquareApi and binding listeners to controls on the page
    this.InitializeMainClass = function myfunction() {
        var _this = this;
        _this.GetCurrentUserLocation();
        _FourSquareApi = new FourSquareApi();
        _this.addListeners();
    }

    //Getting current location
    this.GetCurrentUserLocation = function () {
        var _this = this;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition($.proxy(_this.getPosition_OnSuccess, _this), $.proxy(_this.getPosition_OnError, _this));
        }
        else {
            alert('NR Geolocation not supported by browser! Must provide near by value in textbox');
        }
    }

    //success callback for geo location
    this.getPosition_OnSuccess = function (position) {
        var _this = this;
        _this.CurrentUserLocation = position.coords.latitude + ',' + position.coords.longitude;
    }

    //error callback for geo location
    this.getPosition_OnError = function (err) {
        console.warn('ERROR NR(' + err.code + '): ' + err.message);
    }

    //binding events to controls on page
    this.addListeners = function () {
        var _this = this;
        _this.$btnSearch.unbind('click').bind('click', $.proxy(_this.btnSearch_OnClick, _this));
        _this.$btnsExploreByCat.unbind('click').bind('click', $.proxy(_this.btnsExploreByCat_OnClick, _this));
    }

    //event handler for search button
    this.btnSearch_OnClick = function () {
        var _this = this;
        _FourSquareApi.GetVenues(_MainClass.CurrentUserLocation, _this.$txtNearBy.val(), _this.$txtSearchVenueByName.val());
        _FourSquareApi.GetCategories(_MainClass.CurrentUserLocation, _this.$txtNearBy.val());
    }

    this.btnsExploreByCat_OnClick = function (e) {
        var _this = this;
        _FourSquareApi.ExploreVenues(_MainClass.CurrentUserLocation, _this.$txtNearBy.val(), _this.$txtSearchVenueByName.val(), $(e.currentTarget).attr('data-exploreByCat'));
        _FourSquareApi.GetCategories(_MainClass.CurrentUserLocation, _this.$txtNearBy.val());
    }
}

var FourSquareApi = function () {
    //basic settings for calling four square API
    this.ClientID = 'FRY0DZWWRS3UWQCQK3G3XIUM051RZEYSJLHJJ1MA4Y1WVIQI',
    this.ClientSecret = 'KV4LIVR13A0YZZNWMLV13KKBRANXWMJXNDHBTAKKGIA2501G',
    this.vParam = '20131016',

    //this method gets venues against passed parameters 
    this.GetVenues = function (LatLong, Near, SearchByName, CategoryID) {
        var _this = this;
        var llOrnear = Near && Near != '' ? '&near=' + Near : LatLong && LatLong != '' ? '&ll=' + LatLong : '';
        var url = 'https://api.foursquare.com/v2/venues/search?'
            + '&client_id=' + _this.ClientID
            + '&client_secret=' + _this.ClientSecret
            + '&v=' + _this.vParam;
        if (llOrnear && llOrnear != '') {
            url += llOrnear;

            if (SearchByName && SearchByName != '')
                url += '&query=' + SearchByName;

            if (CategoryID && CategoryID != '')
                url += '&categoryId=' + CategoryID;

            $.ajax({
                url: url,
                success: _this.GetVenues_OnSuccess,
                failure: _this.GetVenues_OnFailure
            });
        } else {
            alert('Please provide the Location');
        }
    }

    //success callback for Get Venues, It populate the dvVenuesListing and show results on screen
    this.GetVenues_OnSuccess = function (data) {
        _MainClass.$dvVenuesListing.html('');
        if (!_MainClass.$SearchHolder.hasClass('SearchHolderAfterSearch'))
            _MainClass.$SearchHolder.addClass('SearchHolderAfterSearch');
        if (data.response.venues.length > 0) {
            $(data.response.venues).each(function (i, v) {
                var venueCard = "<div class='venueCard'>";
                venueCard += "<label class='VenueName'>" + v.name + "</label>"
                venueCard += "<label class='VenueAddress'>" + v.location.formattedAddress + "</label>"
                venueCard += "</div>";
                _MainClass.$dvVenuesListing.append(venueCard);
            });
        } else {
            _MainClass.$dvVenuesListing.append('<div>No Record Found.</div>');
        }
    }

    //success callback for Get Venues, It populate the dvVenuesListing and show results on screen
    this.GetVenues_OnFailure = function (res) {
        console.log('get venues failed to work properly');
    }

    //this method gets venues against passed parameters but it instead of searching explores places against categories
    this.ExploreVenues = function (LatLong, Near, SearchByName, Category) {
        var _this = this;
        var llOrnear = Near && Near != '' ? '&near=' + Near : LatLong && LatLong != '' ? '&ll=' + LatLong : '';
        var url = 'https://api.foursquare.com/v2/venues/explore?'
            + '&client_id=' + _this.ClientID
            + '&client_secret=' + _this.ClientSecret
            + '&v=' + _this.vParam;
        if (llOrnear && llOrnear != '') {
            url += llOrnear;

            if (SearchByName && SearchByName != '')
                url += '&query=' + SearchByName;

            if (Category && Category != '')
                url += '&section=' + Category;

            $.ajax({
                url: url,
                success: _this.ExploreVenues_OnSuccess,
                failure: _this.ExploreVenues_OnFailure
            });
        } else {
            alert('Please provide the Location');
        }
    }

    //success callback for Explore Venues, It populate the dvVenuesListing and show results on screen
    this.ExploreVenues_OnSuccess = function (data) {
        _MainClass.$dvVenuesListing.html('');
        if (!_MainClass.$SearchHolder.hasClass('SearchHolderAfterSearch'))
            _MainClass.$SearchHolder.addClass('SearchHolderAfterSearch');
        if (data.response.groups.length > 0) {
            $(data.response.groups).each(function (oi, ov) {
                $(ov.items).each(function (i, v) {
                    var venueCard = "<div class='venueCard'>";
                    if (v.venue && v.venue.name)
                        venueCard += "<label class='VenueName'>" + v.venue.name + "</label>";
                    if (v.venue && v.venue.location && v.venue.location.formattedAddress)
                        venueCard += "<label class='VenueAddress'>" + v.venue.location.formattedAddress + "</label>"
                    if (v.venue && v.venue.rating)
                        venueCard += "<br>Rating: <label class='VenueRating'>" + v.venue.rating + "</label>"
                    venueCard += "</div>";
                    _MainClass.$dvVenuesListing.append(venueCard);
                });
            });
        } else {
            _MainClass.$dvVenuesListing.append('<div>No Record Found.</div>');
        }
    }

    //success callback for Explore Venues, It populate the dvVenuesListing and show results on screen
    this.ExploreVenues_OnFailure = function (res) {
        console.log('get venues failed to work properly');
    }
    //this method gets categories against passed parameters
    this.GetCategories = function (LatLong, Near) {
        var _this = this;
        var llOrnear = Near && Near != '' ? '&near=' + Near : LatLong && LatLong != '' ? '&ll=' + LatLong : '';
        var url = 'https://api.foursquare.com/v2/venues/categories?'
            + '&client_id=' + _this.ClientID
            + '&client_secret=' + _this.ClientSecret
            + '&v=' + _this.vParam;
        if (llOrnear && llOrnear != '') {
            url += llOrnear;

            $.ajax({
                url: url,
                success: $.proxy(_this.GetCategories_OnSuccess, _this),
                failure: _this.GetCategories_OnFailure
            });
        }
    }

    //on success callback for categories, it populare the filters panel
    this.GetCategories_OnSuccess = function (data) {
        var _this = this;
        _MainClass.$dvFilterItem.html('');
        $(data.response.categories).each(function (i, v) {
            var categotyCard = "<div class='categoryCard'>";
            categotyCard += "<input type='hidden' data-custom-attr='catID' value='" + v.id + "'/>"
            categotyCard += "<label>" + v.name + "</label><br>"
            categotyCard += "</div>";
            _MainClass.$dvFilterItem.append(categotyCard);
        });
        if (data.response.categories.length > 0)
            _MainClass.$dvFilterPanel.show();

        $(".categoryCard").unbind('click').bind('click', $.proxy(_this.CategoryCard_OnClick, _this));
    }

    //on failure callback for categories
    this.GetCategories_OnFailure = function (res) {
        console.log('get venues failed to work properly');
    }

    //categories click event handler
    this.CategoryCard_OnClick = function (e) {
        var _this = this;
        var catID = $(e.currentTarget).find('input[data-custom-attr="catID"]').val();
        _this.GetVenues(_MainClass.CurrentUserLocation, _MainClass.$txtNearBy.val(), _MainClass.$txtSearchVenueByName.val(), catID);
    }
}