'use strict';

/** Helper function to generate a Google Maps directions URL */
function generateDirectionsURL(origin, destination) {
  const googleMapsUrlBase = 'https://www.google.com/maps/dir/?';
  const searchParams = new URLSearchParams('api=1');
  searchParams.append('origin', origin);
  const destinationParam = [];
  // Add title to destinationParam except in cases where Quick Builder set
  // the title to the first line of the address
  if (destination.title !== destination.address1) {
    destinationParam.push(destination.title);
  }
  destinationParam.push(destination.address1, destination.address2);
  searchParams.append('destination', destinationParam.join(','));
  return googleMapsUrlBase + searchParams.toString();
}

/**
 * Defines an instance of the Locator+ solution, to be instantiated
 * when the Maps library is loaded.
 */
function LocatorPlus(configuration) {
  const locator = this;

  locator.locations = configuration.locations || [];
  locator.capabilities = configuration.capabilities || {};

  const mapEl = document.getElementById('gmp-map');
  const panelEl = document.getElementById('locations-panel');
  locator.panelListEl = document.getElementById('locations-panel-list');
  const sectionNameEl =
      document.getElementById('location-results-section-name');
  const resultsContainerEl = document.getElementById('location-results-list');

  const itemsTemplate = Handlebars.compile(
      document.getElementById('locator-result-items-tmpl').innerHTML);

  locator.selectedLocationIdx = null;
  locator.userCountry = null;

  // Initialize the map -------------------------------------------------------
  locator.map = new google.maps.Map(mapEl, configuration.mapOptions);

  // Store selection.
  const selectResultItem = function(locationIdx, panToMarker, scrollToResult) {
    locator.selectedLocationIdx = locationIdx;
    for (let locationElem of resultsContainerEl.children) {
      locationElem.classList.remove('selected');
      if (getResultIndex(locationElem) === locator.selectedLocationIdx) {
        locationElem.classList.add('selected');
        if (scrollToResult) {
          panelEl.scrollTop = locationElem.offsetTop;
        }
      }
    }
    if (panToMarker && (locationIdx != null)) {
      locator.map.panTo(locator.locations[locationIdx].coords);
    }
  };

  // Create a marker for each location.
  const markers = locator.locations.map(function(location, index) {
    const marker = new google.maps.Marker({
      position: location.coords,
      map: locator.map,
      title: location.title,
    });
    marker.addListener('click', function() {
      selectResultItem(index, false, true);
    });
    return marker;
  });

  // Fit map to marker bounds.
  locator.updateBounds = function() {
    const bounds = new google.maps.LatLngBounds();
    for (let i = 0; i < markers.length; i++) {
      bounds.extend(markers[i].getPosition());
    }
    locator.map.fitBounds(bounds);
  };
  if (locator.locations.length) {
    locator.updateBounds();
  }

  // Render the results list --------------------------------------------------
  const getResultIndex = function(elem) {
    return parseInt(elem.getAttribute('data-location-index'));
  };

  locator.renderResultsList = function() {
    let locations = locator.locations.slice();
    for (let i = 0; i < locations.length; i++) {
      locations[i].index = i;
    }
    sectionNameEl.textContent = `All locations (${locations.length})`;
    const resultItemContext = {locations: locations};
    resultsContainerEl.innerHTML = itemsTemplate(resultItemContext);
    for (let item of resultsContainerEl.children) {
      const resultIndex = getResultIndex(item);
      if (resultIndex === locator.selectedLocationIdx) {
        item.classList.add('selected');
      }

      const resultSelectionHandler = function() {
        if (resultIndex !== locator.selectedLocationIdx) {
          selectResultItem(resultIndex, true, false);
        }
      };

      // Clicking anywhere on the item selects this location.
      // Additionally, create a button element to make this behavior
      // accessible under tab navigation.
      item.addEventListener('click', resultSelectionHandler);
      item.querySelector('.select-location')
          .addEventListener('click', function(e) {
            resultSelectionHandler();
            e.stopPropagation();
          });

      // Clicking the directions button will open Google Maps directions in a
      // new tab
      const origin = (locator.searchLocation != null) ?
          locator.searchLocation.location :
          '';
      const destination = locator.locations[resultIndex];
      const googleMapsUrl = generateDirectionsURL(origin, destination);
      item.querySelector('.directions-button')
          .setAttribute('href', googleMapsUrl);
    }
  };

  // Optional capability initialization --------------------------------------

  // Initial render of results -----------------------------------------------
  locator.renderResultsList();
}