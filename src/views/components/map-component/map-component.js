import Global from '../global/global';
import SearchResultSectionDataAreaComponent from '../search-result-section-data-area/search-result-section-data-area';

let numberDrawGoogleMapCalled = 0;
let defaultZoomLevel = 5;
let defaultCenter;
let map;
let mapBound;
let canBeScrolLTop = false;
let textPropertyDetailButton = '';

const MapComponent = {
  initGoogleMap: () => {
    const apiHiddenInput = document.querySelector('.search-result__page .search-result-hidden-input');
    if (apiHiddenInput && apiHiddenInput.value) {
      const mapDataUrl = apiHiddenInput.value;
      let mapApi = '';
      const langkey = Global.getSiteLanguage();
      const isQueryStringPresent = Global.isQueryStringPresent('type');
      let searchCondition = {};
      localStorage.setItem('is-map-touch', false);
      localStorage.setItem('SearchCondition', JSON.stringify(searchCondition));
      if (isQueryStringPresent) {
        const apiDest = Global.mapApiContainer('SearchProperties');
        const searchType = Global.getParameterByName('type');
        let searchCode = Global.getParameterByNameSearchCode('codes');
        const searchPrefectureCode = Global.getParameterByName('prefectureCode');
        const searchName = Global.getParameterByName('name');
        if (searchCode) {
          searchCode = searchCode.split('+');
        } else {
          searchCode = null;
        }
        searchCondition = {
          type: searchType,
          codes: searchCode,
          prefectureCode: searchPrefectureCode,
          name: searchName,
        };
        localStorage.setItem('SearchCondition', JSON.stringify(searchCondition));
        mapApi = `${mapDataUrl}${apiDest}${langkey}`;
      } else {
        const apiDest = Global.mapApiContainer('GetAllPropertiesForMap');
        localStorage.setItem('SearchCondition', JSON.stringify(searchCondition));
        mapApi = `${mapDataUrl}${apiDest}${langkey}`;
        localStorage.setItem('is-map-touch', true);
      }
      numberDrawGoogleMapCalled = 0;
      MapComponent.drawGoogleMap(mapApi, searchCondition);
    }
  },
  reInitGoogleMap: (searchCondition) => {
    const isMapTouch = JSON.parse(localStorage.getItem('is-map-touch'));
    const apiHiddenInput = document.querySelector('.search-result__page .search-result-hidden-input');

    if (apiHiddenInput && apiHiddenInput.value) {
      const mapDataUrl = apiHiddenInput.value;
      let mapApi = '';
      const langkey = Global.getSiteLanguage();
      if (isMapTouch) {
        const apiDest = Global.mapApiContainer('GetAllPropertiesForMap');
        mapApi = `${mapDataUrl}${apiDest}${langkey}`;
      } else {
        const apiDest = Global.mapApiContainer('SearchProperties');
        mapApi = `${mapDataUrl}${apiDest}${langkey}`;
      }
      numberDrawGoogleMapCalled += 1;
      MapComponent.drawGoogleMap(mapApi, searchCondition);
    }
  },

  drawGoogleMap: (mapApi, searchCondition, maxZoom) => {
    let returnMapMarkerJson = null;
    Global.requestDataFromUrlPost(mapApi, searchCondition).then((returnData) => {
      const isQueryStringPresent = Global.isQueryStringPresent('type');
      if (!isQueryStringPresent) {
        MapComponent.initFullWidthMap('.map-component');
      }
      if (!returnData.IsError) {
        if (Global.isJson(returnData)) {
          returnMapMarkerJson = JSON.parse(returnData).data;
        } else {
          returnMapMarkerJson = returnData.data;
        }
        let allMarkerID = [];
        let mapCenter;
        const isFromAutoCompleteMap = Global.isQueryStringPresent('log');

        if (isFromAutoCompleteMap && !defaultCenter) {
          const tempLat = Global.getParameterByName('lat');
          const tempLong = Global.getParameterByName('log');
          mapCenter = {
            lat: Number(tempLat),
            lng: Number(tempLong),
          };
          const zoomLevelHolder = document.querySelector('#defaultLocationZoom');
          defaultZoomLevel = zoomLevelHolder && zoomLevelHolder.value !== '' ? Number(zoomLevelHolder.value) : 11;
        } else if (!defaultCenter) {
          mapCenter = {
            lat: 35.501133,
            lng: 134.235091,
          };
        } else {
          mapCenter = defaultCenter;
        }

        // eslint-disable-next-line no-undef
        if (document.getElementById('map')) {
          map = new google.maps.Map(
            document.getElementById('map'), {
              zoom: defaultZoomLevel,
              center: mapCenter,
              disableDefaultUI: true,
              zoomControl: true,
              maxZoom,
            },
          );
          const normalPinUrl = '../../../assets/images/pin-off.png';
          const selectedPinUrl = '../../../assets/images/pin-on.png';
          /* eslint-disable no-undef */
          const normalPin = {
            url: normalPinUrl,
            // This marker is 32 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 20).
            anchor: new google.maps.Point(16, 20),
          };
          /* eslint-disable no-undef */
          const selectedPin = {
            url: selectedPinUrl,
            // This marker is 32 pixels wide by 32 pixels high.
            scaledSize: new google.maps.Size(32, 32),
            origin: new google.maps.Point(0, 0),
            // The anchor for this image is the base of the flagpole at (0, 20).
            anchor: new google.maps.Point(16, 20),
          };
          let infowindow = new google.maps.InfoWindow({
          // content: contentString,
          });

          const bounds = new google.maps.LatLngBounds();
          const markers = returnMapMarkerJson.map((location) => {
            const marker = new google.maps.Marker({
              position: location,
              icon: normalPin,
              optimized: false,
              id: location.id,
            });
            bounds.extend(new google.maps.LatLng(location.lat, location.lng));
            google.maps.event.addListener(marker, 'click', () => {
              const langKey = document.documentElement.lang;
              const apiHiddenInput = document.querySelector('.search-result__page .search-result-hidden-input');
              const apiDest = Global.mapApiContainer();
              const markerDetailApiUrl = `${apiHiddenInput.value}${apiDest}${langKey}`;
              const markerID = {
                propertyIdList: marker.id.toString(),
              };
              Global.getDataFromUrlPost(markerDetailApiUrl, markerID).then((returnDetail) => {
                const [dataMarkerDetails] = returnDetail.data;
                const propertyDetailButton = document.querySelector('#textPropertyDetailButton');
                textPropertyDetailButton = SearchResultSectionDataAreaComponent.setTextForProperty(propertyDetailButton);
                const contentString = `
              <div class="geo-pin-bubble" data-pin='+place.id+'>
              <div class = 'geo-marker-thumb' style='background-image:url("${dataMarkerDetails.FeatureImage}")'></div>
              <h2>${dataMarkerDetails.PropertyName}</h2>
              <strong> ¥40,000 〜 ¥53,000 </strong>
              <address>
                <span class="icon-location"></span>
                ${dataMarkerDetails.Address}
              </address>
              <a class='property-details' href="${dataMarkerDetails.PropertyUrl}" target="_blank">${textPropertyDetailButton}</a>
              </div>
              </div>`;
                infowindow.close();
                infowindow = new google.maps.InfoWindow({
                  content: contentString,
                });
                infowindow.open(map, marker);
                marker.setIcon(selectedPin);
                SearchResultSectionDataAreaComponent.hightLightProperty(marker.id.toString());
              });
            });
            google.maps.event.addListener(infowindow, 'closeclick', () => {
              marker.setIcon(normalPin);
            });
            google.maps.event.addListener(marker, 'closeclick', () => {
              marker.setIcon(normalPin);
            });
            allMarkerID.push(location.id);
            return marker;
          });

          if (numberDrawGoogleMapCalled === 0) {
            if (!isFromAutoCompleteMap) {
              map.setCenter(bounds.getCenter());
              map.fitBounds(bounds);
            } else {
              google.maps.event.addListener(map, 'bounds_changed', () => {
                mapBound = map.getBounds();
                allMarkerID = [];
                [].forEach.call(markers, (marker) => {
                  if (mapBound.contains(marker.getPosition())) {
                    allMarkerID.push(marker.id);
                  }
                });
                localStorage.setItem('Visible-marker', JSON.stringify(allMarkerID));
                SearchResultSectionDataAreaComponent.initSearchResultData(true);
                google.maps.event.clearListeners(map, 'bounds_changed');
              });
            }
          }

          if (numberDrawGoogleMapCalled > 0) {
            allMarkerID = [];
            [].forEach.call(markers, (marker) => {
              if (mapBound.contains(marker.getPosition())) {
                allMarkerID.push(marker.id);
              }
            });
          }
          localStorage.setItem('Visible-marker', JSON.stringify(allMarkerID));
          SearchResultSectionDataAreaComponent.initSearchResultData(true);

          map.addListener('center_changed', () => {
            defaultCenter = map.getCenter();
            mapBound = map.getBounds();
          });

          if (Global.isDeviceMobile()) {
            MapComponent.handleEventGoogleMap(searchCondition, markers, normalPin, infowindow);
          } else {
            google.maps.event.addListenerOnce(map, 'mousemove', () => {
              MapComponent.handleEventGoogleMap(searchCondition, markers, normalPin, infowindow);
            });
          }
          const mcOptions = {
            styles: [{
              url: '../../../assets/images/m1.png',
              width: 56,
              height: 56,
              fontFamily: 'Arial, sans-serif',
              textSize: 11,
              textWeight: 'bold',
              textColor: 'white',
            }],
          };
          // eslint-disable-next-line no-undef
          const markerCluster = new MarkerClusterer(
            map,
            markers,
            mcOptions,
          );
        }
      }
    });
  },

  toggleSearchResultMap: (elemClicked, mapHolder, isShowMap) => {
    const elem = document.querySelector(elemClicked);
    // const self = elemClicked;
    const mapContainer = document.querySelector(mapHolder);
    const arrBtnHide = document.querySelectorAll('.btn-hide-map');
    const arrBtnShow = document.querySelectorAll('.btn-show-map');
    const windowBody = document.querySelector('body');

    if (elem && arrBtnHide && arrBtnShow && mapContainer) {
      elem.addEventListener('click', (evt) => {
        evt.preventDefault();
        if (isShowMap) {
          mapContainer.classList.add('full-width');
          [].forEach.call(arrBtnHide, (eachElem) => {
            const self = eachElem;
            self.classList.add('in-active');
          });
          [].forEach.call(arrBtnShow, (eachElem) => {
            const self = eachElem;
            self.classList.remove('in-active');
          });
          canBeScrolLTop = true;

          if (window.innerWidth < 992) {
            windowBody.classList.add('map-open');
          } else {
            windowBody.classList.remove('map-open');
          }
        } else {
          if (canBeScrolLTop) {
            $('html, body').animate({ scrollTop: 0 });
          }
          canBeScrolLTop = false;
          mapContainer.classList.remove('full-width');
          [].forEach.call(arrBtnShow, (eachElem) => {
            const self = eachElem;
            self.classList.add('in-active');
          });
          [].forEach.call(arrBtnHide, (eachElem) => {
            const self = eachElem;
            self.classList.remove('in-active');
          });
          windowBody.classList.remove('map-open');
        }
      });
    }
  },

  removeAreaSearchResultFixBodyWhenResize: (mapHolder) => {
    const mapContainer = document.querySelector(mapHolder);
    const windowBody = document.querySelector('body');
    if (mapContainer && mapContainer.classList.contains('full-width')) {
      if (window.innerWidth > 991) {
        windowBody.classList.remove('map-open');
      } else {
        windowBody.classList.add('map-open');
      }
    }
  },

  clickOnAreaBreadcrumb: (breadCrumb) => {
    const areaBreadCrumbs = document.querySelectorAll(breadCrumb);
    areaBreadCrumbs.forEach((area) => {
      const self = area;
      area.addEventListener('click', () => {
        let mapApi = '';
        const langkey = Global.getSiteLanguage();
        const apiDest = Global.mapApiContainer('SearchProperties');
        const searchType = self.dataset.type;
        const searchCode = self.dataset.code;
        const searchCondition = JSON.parse(localStorage.getItem('SearchCondition'));
        searchCondition.type = searchType;
        searchCondition.codes = searchCode.split('+');
        const apiHiddenInput = document.querySelector('.search-result__page .search-result-hidden-input');
        localStorage.setItem('SearchCondition', JSON.stringify(searchCondition));
        mapApi = `${apiHiddenInput.value}${apiDest}${langkey}`;
        numberDrawGoogleMapCalled = 0;
        localStorage.setItem('is-map-touch', false);
        MapComponent.drawGoogleMap(mapApi, searchCondition, 13);
      });
    });
  },

  handleEventGoogleMap: (searchCondition, markers, normalPin, infowindow) => {
    map.addListener('dragend', () => {
      const allVisibleMarkerArray = [];
      const isMapTouch = JSON.parse(localStorage.getItem('is-map-touch'));
      defaultZoomLevel = map.getZoom();
      if (isMapTouch === false) {
        localStorage.setItem('is-map-touch', true);
        defaultCenter = map.getCenter();
        mapBound = map.getBounds();
        MapComponent.reInitGoogleMap(searchCondition);
      }
      infowindow.close();
      [].forEach.call(markers, (marker) => {
        marker.setIcon(normalPin);
        if (map.getBounds().contains(marker.getPosition())) {
          allVisibleMarkerArray.push(marker.id);
        }
      });
      localStorage.setItem('Visible-marker', JSON.stringify(allVisibleMarkerArray));
      SearchResultSectionDataAreaComponent.initSearchResultData(true);
    });
    map.addListener('zoom_changed', () => {
      const allVisibleMarkerArray = [];
      const isMapTouch = JSON.parse(localStorage.getItem('is-map-touch'));
      defaultZoomLevel = map.getZoom();
      if (isMapTouch === false && numberDrawGoogleMapCalled > 0) {
        localStorage.setItem('is-map-touch', true);
        defaultCenter = map.getCenter();
        mapBound = map.getBounds();
        MapComponent.reInitGoogleMap(searchCondition);
      }
      [].forEach.call(markers, (marker) => {
        if (map.getBounds().contains(marker.getPosition())) {
          allVisibleMarkerArray.push(marker.id);
        }
      });
      localStorage.setItem('Visible-marker', JSON.stringify(allVisibleMarkerArray));
      SearchResultSectionDataAreaComponent.initSearchResultData(true);
      numberDrawGoogleMapCalled += 1;
    });
  },

  initFullWidthMap: (mapHolder) => {
    const mapContainer = document.querySelector(mapHolder);
    const arrBtnHide = document.querySelectorAll('.btn-hide-map');
    const arrBtnShow = document.querySelectorAll('.btn-show-map');

    if (mapContainer && arrBtnHide && arrBtnShow) {
      // setTimeout(() => {
      mapContainer.classList.add('full-width');
      [].forEach.call(arrBtnHide, (eachElem) => {
        const self = eachElem;
        self.classList.add('in-active');
      });
      [].forEach.call(arrBtnShow, (eachElem) => {
        const self = eachElem;
        self.classList.remove('in-active');
      });
      // }, 800);
    }
  },
};
export default MapComponent;
