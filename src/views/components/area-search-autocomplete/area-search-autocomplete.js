let propertyMaxCountGlobal = 3;
const areaTrainlineInputElm = document.querySelector('.autocomplete-input');
const autoCompleteListElm = document.querySelector('.autocomplete-list');
let currentFocus = -1;

const areaSearchAutocomplete = {
  autocompleteSearchButton: (buttonClasses) => {
    const allSearchBtn = document.querySelectorAll(buttonClasses);
    if (allSearchBtn) {
      allSearchBtn.forEach((eachButton) => {
        eachButton.addEventListener('click', (evt) => {
          evt.preventDefault();
          // check if element is visible
          if (autoCompleteListElm.offsetWidth > 0 && autoCompleteListElm.offsetHeight > 0) {
            window.location.href = autoCompleteListElm.querySelector('a').href;
          }
        });
      });
    }
  },
  addLocationAutoComplete: (inputText, propertyMaxCount = 3) => {
    propertyMaxCountGlobal = propertyMaxCount;
    if (areaTrainlineInputElm) {
      const allLocationGetByGoogle = document.querySelectorAll('.autocomplete-list .is-location');
      if (allLocationGetByGoogle.length < propertyMaxCountGlobal) {
        areaSearchAutocomplete.getPlacesPredictions(inputText);
      }
    }
  },
  getPlacesPredictions: (inputText) => {
    const autocompleteService = new google.maps.places.AutocompleteService();
    autocompleteService.getPlacePredictions({
      input: inputText,
      componentRestrictions: { country: 'JP' },
      types: ['(cities)'],
    }, areaSearchAutocomplete.displaySuggestions);
  },
  displaySuggestions: (predictions, status) => {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      return false;
    }
    const geocoder = new google.maps.Geocoder();
    const allLocationGetByGoogle = document.querySelectorAll('.autocomplete-list .is-location');
    for (let i = 0; i < (propertyMaxCountGlobal - allLocationGetByGoogle.length); i++) {
      if (predictions[i]) {
        geocoder.geocode({ placeId: predictions[i].place_id }, (results, geocodeStatus) => {
          if (geocodeStatus === google.maps.GeocoderStatus.OK) {
            const locationElm = document.createElement('a');
            locationElm.className = 'is-location';
            locationElm.dataset.location = predictions[i].description;
            locationElm.innerHTML = `<span><strong>${predictions[i].description}</strong></span>`;
            const placeLat = results[0].geometry.location.lat();
            const placeLong = results[0].geometry.location.lng();
            if (window.location.href.indexOf('/search-results/') !== -1) {
              locationElm.href = `?lat=${placeLat.toString()}&log=${placeLong.toString()}`;
            } else {
              locationElm.href = `search-results/?lat=${placeLat.toString()}&log=${placeLong.toString()}`;
            }
            autoCompleteListElm.appendChild(locationElm);
          }
        });
      }
    }
  },
  handleKeyDown: (autocompleteInputClass) => {
    const allInputs = document.querySelectorAll(autocompleteInputClass);
    allInputs.forEach((eachInput) => {
      eachInput.addEventListener('keydown', (evt) => {
        const autoCompleteListWrapper = document.querySelector('.autocomplete-list');
        if (getComputedStyle(autoCompleteListWrapper).display !== 'none') {
          areaSearchAutocomplete.handleEvtKeyDown(evt, autoCompleteListWrapper);
        }
      });
    });
  },
  handleEvtKeyDown: (evt, autoCompleteListWrapper) => {
    const allOptions = autoCompleteListWrapper.querySelectorAll('a');
    switch (evt.keyCode) {
      // up
      case 38:
        if (currentFocus === 0) {
          currentFocus = allOptions.length - 1;
        } else {
          currentFocus--;
        }
        break;
        // down
      case 40:
        if (currentFocus === allOptions.length - 1) {
          currentFocus = 0;
        } else {
          currentFocus++;
        }
        break;
        // enter
      case 13:
        window.location.href = allOptions[currentFocus].href;
        break;
      default:
        break;
    }
    areaSearchAutocomplete.updateCurrentFocus(allOptions);
  },
  updateCurrentFocus: (allOptions) => {
    allOptions.forEach((eachLink) => {
      if (eachLink) {
        eachLink.classList.remove('is-on-focus');
      }
    });
    if (currentFocus >= 0 && currentFocus < allOptions.length) {
      allOptions[currentFocus].classList.add('is-on-focus');
    }
  },
};

export default areaSearchAutocomplete;
