const CompanyMap = {
  initCompanyMap: () => {
    const hiddenPlaceLat = document.querySelector('.company-information__map__hidden-input__lat-default');
    const hiddenPlaceLng = document.querySelector('.company-information__map__hidden-input__lng-default');
    const markers = [];

    const markerContainer = document.querySelectorAll('.container-fluid .google-map-btn');

    if (markerContainer) {
      markerContainer.forEach((eachButton) => {
        let markerObj = {};
        markerObj = {
          lat: Number(eachButton.dataset.lat),
          lng: Number(eachButton.dataset.lng),
          title: eachButton.dataset.title,
          address: eachButton.dataset.address,
          gmurl: eachButton.dataset.gmurl,
        };
        markers.push(markerObj);
      });
    }
    // eslint-disable-next-line no-undef
    let map;
    if (document.getElementById('company_map') && hiddenPlaceLat && hiddenPlaceLng) {
      const mapCenter = {
        lat: Number(hiddenPlaceLat.value),
        lng: Number(hiddenPlaceLng.value),
      };
      // const placeName = placeNameHolder.value;
      map = new google.maps.Map(
        document.getElementById('company_map'), {
          zoom: 5,
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

      let markerCount = 0;
      let infowindow = new google.maps.InfoWindow({});
      const markersFinal = markers.map((location) => {
        const marker = new google.maps.Marker({
          position: location,
          map,
          icon: normalPin,
          optimized: false,
        });
        let contentString = '';

        infowindow.close();
        google.maps.event.addListener(marker, 'click', () => {
          contentString = `
            <div class="infowindow-wrapper">
              <div class="geo-pin-bubble" data-pin='+place.id+'>
                <div class="marker__header">
                  <span class="icon-home"></span>
                  <span>${location.title}</span>
                </div>
                <div class="marker__content">
                  <address>${location.address}</address>
                  <a class='google-map-btn marker-btn' href="${location.gmurl}" target="_blank">Google Map
                  <span class="icon-arrow-right"></span>
                  </a>
                </div>
              </div>
            </div>
          `;
          infowindow.close();
          infowindow = new google.maps.InfoWindow({
            content: contentString,
          });
          infowindow.open(map, marker);
        });
        return marker;
      });
      google.maps.event.trigger(markersFinal[0], 'click');
    }
  },
};
export default CompanyMap;
