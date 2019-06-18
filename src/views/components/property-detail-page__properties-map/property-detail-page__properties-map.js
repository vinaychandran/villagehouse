const PropertyMap = {
  initPropertyMap: () => {
    const hiddenImageLink = document.querySelector('.property-detail__map__hidden-input__image');
    const hiddenPlaceLat = document.querySelector('.property-detail__map__hidden-input__lat');
    const hiddenPlaceLng = document.querySelector('.property-detail__map__hidden-input__lng');
    const hiddenPlaceAddress = document.querySelector('.property-detail__map__hidden-input__address');
    const placeNameHolder = document.querySelector('.property-detail__preview .property-detail__title h2');

    // eslint-disable-next-line no-undef
    let map;
    if (document.getElementById('property_map') && hiddenPlaceLat && hiddenPlaceLng && placeNameHolder) {
      const mapCenter = {
        lat: Number(hiddenPlaceLat.value),
        lng: Number(hiddenPlaceLng.value),
      };

      const placeName = placeNameHolder.textContent || placeNameHolder.innerText;

      map = new google.maps.Map(
        document.getElementById('property_map'), {
          zoom: 14,
          center: mapCenter,
        },
      );
      const normalPinUrl = '../../../assets/images/pin-off.png';
      /* eslint-disable no-undef */
      const normalPin = {
        url: normalPinUrl,
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 20),
      };
      const marker = new google.maps.Marker({
        position: mapCenter,
        map,
        icon: normalPin,
        optimized: false,
      });
      const contentString = `
        <div class="infowindow-wrapper">
        <div class="geo-pin-bubble" data-pin='+place.id+'>
        <div class = 'geo-marker-thumb' style='background-image:url("${hiddenImageLink.value}")'></div>
        <h2> ${placeName} </h2>
        <address>
          <span class="icon-location"></span>
          ${hiddenPlaceAddress.value}
        </address>
        </div>
        </div>
        </div>`;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      infowindow.open(map, marker);
      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    }
  },
  initUnitMap: () => {
    const hiddenImageLink = document.querySelector('.property-detail__map__hidden-input__image');
    const hiddenPlaceLat = document.querySelector('.property-detail__map__hidden-input__lat');
    const hiddenPlaceLng = document.querySelector('.property-detail__map__hidden-input__lng');
    const hiddenPlaceAddress = document.querySelector('.property-detail__map__hidden-input__address');
    const hiddenPlacePropertyURL = document.querySelector('.property-detail__map__hidden-input__property-url');
    const hiddenUnitPrice = document.querySelector('.property-detail__map__hidden-input__unit-price');
    const placeNameHolder = document.querySelector('.sibling-header__sticky-header .sibling-header__sticky-header__content h2');
    const unitListWrapper = document.querySelectorAll('.sibling-header__sticky-header .sibling-header__sticky-header__content .sibling-header__sticky-header__units-list .unit-sibling');

    // eslint-disable-next-line no-undef
    let map;
    if (document.getElementById('unit_map') && hiddenPlaceLat && hiddenPlaceLng && placeNameHolder && hiddenPlacePropertyURL && hiddenUnitPrice && unitListWrapper) {
      const mapCenter = {
        lat: Number(hiddenPlaceLat.value),
        lng: Number(hiddenPlaceLng.value),
      };

      const placeName = placeNameHolder.textContent || placeNameHolder.innerText;

      map = new google.maps.Map(
        document.getElementById('unit_map'), {
          zoom: 14,
          center: mapCenter,
        },
      );
      const normalPinUrl = '../../../assets/images/pin-off.png';
      /* eslint-disable no-undef */
      const normalPin = {
        url: normalPinUrl,
        scaledSize: new google.maps.Size(32, 32),
        origin: new google.maps.Point(0, 0),
        anchor: new google.maps.Point(16, 20),
      };
      const marker = new google.maps.Marker({
        position: mapCenter,
        map,
        icon: normalPin,
        optimized: false,
      });
      let contentString = `
        <div class="infowindow-wrapper">
        <div class="geo-pin-bubble" data-pin='+place.id+'>
        <div class = 'geo-marker-thumb' style='background-image:url("${hiddenImageLink.value}")'></div>
        <h2> ${placeName} </h2>
        <address>
          <span class="icon-location"></span>
          ${hiddenPlaceAddress.value}
        </address>
        <p class="unit-price">${hiddenUnitPrice.value}</p>`;
      if (unitListWrapper.length > 1) {
        contentString += `
          <a class='property-details' href="${hiddenPlacePropertyURL.value}" target="_blank">Property Details</a>`;
      } else {
        contentString += '';
      }
      contentString += `
        </div>
        </div>
        </div>`;
      const infowindow = new google.maps.InfoWindow({
        content: contentString,
      });
      infowindow.open(map, marker);
      google.maps.event.addListener(marker, 'click', () => {
        infowindow.open(map, marker);
      });
    }
  },
};
export default PropertyMap;
