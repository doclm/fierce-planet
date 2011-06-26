/*
 * Utility methods
 */


var FiercePlanet = FiercePlanet || {};


/**
 * Always send the authenticity_token with ajax
 */
$(document).ajaxSend(function(event, request, settings) {
    if ( settings.type == 'post' ) {
        settings.data = (settings.data ? settings.data + "&" : "")
            + "authenticity_token=" + encodeURIComponent( AUTH_TOKEN );
    }
});

/**
 * Handle zoom, as best as possible
 */
$(function(){
    $().zoom(function(direction){
        switch(direction) {
            case 1:
                FiercePlanet.externalZoomLevel *= 1.2;
                break;
            case -1:
                FiercePlanet.externalZoomLevel /= 1.2;
                break;
            case 0:
                FiercePlanet.externalZoomLevel = 1;
                break;
            }
    });
});

FiercePlanet.checkInteger = function(value) {
    return Math.floor(value);
};

/**
 * Gets a property from local storage, and sets this on the settings dialog
 * @param property
 */
FiercePlanet.getAndRetrieveProperty = function(property) {
    if ($('#' + property + 'Input')[0] != undefined) {
        if (localStorage[property] == "true") {
            this[property] = true;
            $('#' + property + 'Input')[0].checked = true;
        }
    }
};

/**
 * Sets a property local storage based on values in the settings dialog
 * @param property
 */
FiercePlanet.setAndStoreProperty = function(property) {
    if ($("#" + property + "Input")[0] != undefined) {
        var propertyInputValue = $("#" + property + "Input")[0].checked;
        this[property] = propertyInputValue;
        localStorage[property] = propertyInputValue;
    }
};

/**
 * Gets all properties from local storage, and sets them on the settings dialog
 */
FiercePlanet.getAndRetrieveProperties = function() {
    FiercePlanet.getAndRetrieveProperty('noticesVisible');
    FiercePlanet.getAndRetrieveProperty('scrollingImageVisible');
    FiercePlanet.getAndRetrieveProperty('catastrophesVisible');
    FiercePlanet.getAndRetrieveProperty('agentsCanCommunicate');

    FiercePlanet.getAndRetrieveProperty('godMode');
    FiercePlanet.getAndRetrieveProperty('invisiblePath');
    FiercePlanet.getAndRetrieveProperty('agentTracing');
    FiercePlanet.getAndRetrieveProperty('recording');
    FiercePlanet.getAndRetrieveProperty('rivalsVisible');
    FiercePlanet.getAndRetrieveProperty('predatorsVisible');
    FiercePlanet.getAndRetrieveProperty('tilesMutable');
    FiercePlanet.getAndRetrieveProperty('soundsPlayable');
    FiercePlanet.getAndRetrieveProperty('backgroundIconsVisible');
    FiercePlanet.getAndRetrieveProperty('resourcesInTension');
    FiercePlanet.getAndRetrieveProperty('resourceBonus');
    FiercePlanet.getAndRetrieveProperty('applyGeneralHealth');
    FiercePlanet.getAndRetrieveProperty('ignoreResourceBalance');
};

/**
 * Sets all properties on settings dialog, and stores property values in local storage
 */
FiercePlanet.setAndStoreProperties = function() {
    FiercePlanet.setAndStoreProperty('scrollingImageVisible');
    FiercePlanet.setAndStoreProperty('noticesVisible');
    FiercePlanet.setAndStoreProperty('catastrophesVisible');
    FiercePlanet.setAndStoreProperty('agentsCanCommunicate');

    FiercePlanet.setAndStoreProperty('godMode');
    FiercePlanet.setAndStoreProperty('invisiblePath');
    FiercePlanet.setAndStoreProperty('agentTracing');
    FiercePlanet.setAndStoreProperty('recording');
    FiercePlanet.setAndStoreProperty('rivalsVisible');
    FiercePlanet.setAndStoreProperty('predatorsVisible');
    FiercePlanet.setAndStoreProperty('tilesMutable');
    FiercePlanet.setAndStoreProperty('soundsPlayable');
    FiercePlanet.setAndStoreProperty('backgroundIconsVisible');
    FiercePlanet.setAndStoreProperty('resourcesInTension');
    FiercePlanet.setAndStoreProperty('resourceBonus');
    FiercePlanet.setAndStoreProperty('applyGeneralHealth');
    FiercePlanet.setAndStoreProperty('ignoreResourceBalance');

    FiercePlanet.restartLevel();
};

/**
 * Sourced from: http://stackoverflow.com/questions/1267283/how-can-i-create-a-zerofilled-value-using-javascript/1267338#1267338
 * @param number
 * @param width
 */
FiercePlanet.zeroFill = function ( number, width ){
  width -= number.toString().length;
  if ( width > 0 ) {
    return new Array( width + (/\./.test( number ) ? 2 : 1) ).join( '0' ) + number;
  }
  return number;
}