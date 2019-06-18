import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import OverlayScrollbars from 'overlayscrollbars/js/OverlayScrollbars';
import 'overlayscrollbars/css/OverlayScrollbars.css';
import Global from '../global/global';
import PropertyCard from '../property-card/property-card';
import AreaSearchSection from '../area-search-section/area-search-section';

let numberOfUpdatedProperty = 10;
let isDataLoaded = false;
let numberOfFunctionCalled = 0;
let instanceAreaScrollBar;
let textPropertyDetailButton = '';
let textComingSoon = '';
let textAvailable = '';
let textUnavailable = '';
let textElevator = '';
// let textHandicap = '';
let textParking = '';
let textPet = '';
let isFirstTimeLoadDetails = true;

const SearchResultSectionDataAreaComponent = {
  setTextForProperty: textField => (textField ? textField.value : ''),
  initTextLanguageForSearchResultSection: () => {
    const propertyDetailButton = document.querySelector('#textPropertyDetailButton');
    const comingSoon = document.querySelector('#textComingSoon');
    const available = document.querySelector('#textAvailable');
    const unavailable = document.querySelector('#textUnavailable');
    const elevator = document.querySelector('#textElevator');
    // const handicap = document.querySelector('#textHandicap');
    const parking = document.querySelector('#textParking');
    const pet = document.querySelector('#textPet');
    textPropertyDetailButton = SearchResultSectionDataAreaComponent.setTextForProperty(propertyDetailButton);
    textComingSoon = SearchResultSectionDataAreaComponent.setTextForProperty(comingSoon);
    textAvailable = SearchResultSectionDataAreaComponent.setTextForProperty(available);
    textUnavailable = SearchResultSectionDataAreaComponent.setTextForProperty(unavailable);
    textElevator = SearchResultSectionDataAreaComponent.setTextForProperty(elevator);
    // textHandicap = SearchResultSectionDataAreaComponent.setTextForProperty(handicap);
    textParking = SearchResultSectionDataAreaComponent.setTextForProperty(parking);
    textPet = SearchResultSectionDataAreaComponent.setTextForProperty(pet);
  },
  initScrollResultData: () => {
    const loadmoreBtn = document.querySelector('.search-result-section-data-area .property-card__list__load-more-btn');
    if (loadmoreBtn) {
      SearchResultSectionDataAreaComponent.loadMorePropertyDetails(loadmoreBtn);
    }
  },
  initSearchResultData: (isMapReach = false, isHightLight = false) => {
    if (isMapReach) {
      numberOfUpdatedProperty = 10;
    }
    let properties = localStorage.getItem('Visible-marker');
    const langKey = document.documentElement.lang;
    const apiHiddenInput = document.querySelector('.search-result__page .search-result-hidden-input');
    const apiDest = Global.mapApiContainer('GetPropertiesDetail');
    const loadmoreBtn = document.querySelector('.search-result-section-data-area .property-card__list__load-more-btn');
    const displayNumber = numberOfUpdatedProperty;
    const geoLoadingProperty = document.querySelector('.search-result-section-data-area .geo-loading-properties');
    const propertyListTemplate = document.querySelector('.search-result-section-data-area .property-card__list__wrapper');
    const geoNotFoundProperty = document.querySelector('.search-result-section-data-area .geo-not-found');
    if (properties
      && apiHiddenInput
      && loadmoreBtn
      && geoLoadingProperty
      && propertyListTemplate
      && geoNotFoundProperty) {
      properties = JSON.parse(properties);
      const searchCondition = JSON.parse(localStorage.getItem('SearchCondition'));
      if (properties.length <= displayNumber) {
        loadmoreBtn.classList.add('hide');
      } else {
        loadmoreBtn.classList.remove('hide');
      }
      const numberOfLoadedProperty = isMapReach ? 0 : propertyListTemplate.querySelectorAll('.property-card').length;
      searchCondition.propertyIdList = properties.slice(numberOfLoadedProperty, displayNumber).toString();
      const mapDataUrl = `${apiHiddenInput.value}${apiDest}${langKey}`;
      isDataLoaded = true;
      geoLoadingProperty.classList.remove('hide-when-map-loaded');
      propertyListTemplate.classList.add('hide-when-map-loaded');
      geoNotFoundProperty.classList.add('is-has-geo');
      Global.getDataFromUrlPost(mapDataUrl, searchCondition).then((returnData) => {
        isDataLoaded = false;
        geoLoadingProperty.classList.add('hide-when-map-loaded');
        SearchResultSectionDataAreaComponent.updateSearchResultData(returnData.data, isMapReach, isHightLight);
        const productIdArrTemp = [];
        for (let i = 0; i < 3; i += 1) {
          if (returnData.data) {
            if (returnData.data.length < i + 1) {
              break;
            }
            productIdArrTemp.push(returnData.data[i].PropertyId.toLowerCase());
          }
        }
        if (isFirstTimeLoadDetails && productIdArrTemp.length > 0) {
          dataLayer = dataLayer || [];
          dataLayer.push({
            event: 'searchResults',
            crto: {
              email: '',
              ProductIDList: productIdArrTemp,
            },
          });
        }
        isFirstTimeLoadDetails = false;
        if (instanceAreaScrollBar && isMapReach) {
          instanceAreaScrollBar.scroll(0);
        }
        const componentWrapper = document.querySelector('.search-result-section-data-area .property-card__list__wrapper');
        if (componentWrapper && numberOfUpdatedProperty <= 10 && numberOfFunctionCalled === 0) {
          instanceAreaScrollBar = OverlayScrollbars(componentWrapper, {
            callbacks: {
              onScrollStop: () => {
                SearchResultSectionDataAreaComponent.checkForNewContent('.search-result-section-data-area .property-card__list__wrapper .os-viewport', ' .property-card:last-child');
              },
            },
          });
        }
        numberOfFunctionCalled += 1;
        AreaSearchSection.initAreaTrainlineModal(true);
      });
    }
  },
  hightLightProperty: (markerClickedId) => {
    const properties = JSON.parse(localStorage.getItem('Visible-marker'));
    properties.sort((x, y) => (x === markerClickedId ? -1 : y === markerClickedId ? 1 : 0));
    localStorage.setItem('Visible-marker', JSON.stringify(properties));
    SearchResultSectionDataAreaComponent.initSearchResultData(true, true);
  },
  updateSearchResultData: (data, isMapReach, isHightLight = false) => {
    const propertyListTemplate = document.querySelector('.search-result-section-data-area .property-card__list__wrapper');
    const geoNotFoundProperty = document.querySelector('.search-result-section-data-area .geo-not-found');
    if (propertyListTemplate && geoNotFoundProperty) {
      if (data) {
        geoNotFoundProperty.classList.add('is-has-geo');
        propertyListTemplate.classList.remove('hide-when-map-loaded');
        localStorage.setItem('Property-data', JSON.stringify(data));
        SearchResultSectionDataAreaComponent.cookedSearchResultHtmlContent(isMapReach, isHightLight);
      } else {
        geoNotFoundProperty.classList.remove('is-has-geo');
        propertyListTemplate.classList.add('hide-when-map-loaded');
      }
    }
  },

  cookedSearchResultHtmlContent: (isMapReach, isHightLight = false) => {
    let propertyListWrapper;
    let propertyListWrapperAfterFirstInit;
    const propertyListWrapperBeforeFirstInit = document.querySelector('.search-result-section-data-area .property-card__list__wrapper');
    let propertyDataInnerHtml = '';
    let data = localStorage.getItem('Property-data');
    if (propertyListWrapperBeforeFirstInit && data) {
      data = JSON.parse(data);
      if (numberOfUpdatedProperty <= 10 && numberOfFunctionCalled === 0) {
        propertyListWrapper = propertyListWrapperBeforeFirstInit;
      } else {
        propertyListWrapperAfterFirstInit = document.querySelector('.search-result-section-data-area .property-card__list__wrapper .os-content');
        propertyListWrapper = propertyListWrapperAfterFirstInit;
      }
      if (isMapReach) {
        propertyListWrapper.innerHTML = '';
      }
      data.forEach((property) => {
        let eachPropertyInnerHTML = '';
        const propertyCardClass = `property-card ${(isHightLight === true && data.indexOf(property) === 0) ? 'is-hightlight' : ''}`;
        if (isMapReach) {
          eachPropertyInnerHTML += `<div class="${propertyCardClass}">`;
        }
        const eachProperty = document.createElement('div');
        eachProperty.className = propertyCardClass;
        eachPropertyInnerHTML += `<div class="property-card__geo-info">
            <div class="property-card__geo-info__image">`;
        if (property.IsInShortList) {
          eachPropertyInnerHTML += `<span class="for-shortlist-icon is-selected" property-id="${property.IdForShortList}"></span>`;
        } else {
          eachPropertyInnerHTML += `<span class="for-shortlist-icon" property-id="${property.IdForShortList}"></span>`;
        }
        eachPropertyInnerHTML += `<img class="lazy" data-src="${property.FeatureImage}">
            </div>
            <h2 class="property-card__geo-info__location">${property.PropertyName}</h2>
            <div class="property-card__geo-info__address"><span class="icon-location"></span><span>${property.Address}</span></div>
            <div class="property-card__geo-info__units">`;
        if (property.Elevator) {
          eachPropertyInnerHTML += `<div class="tippy-icon icon-elevator" data-tippy-content="${textElevator}" data-tippy-arrow="true" data-tippy-placement="bottom" tabindex="0"></div>`;
        }
        if (property.Parking) {
          eachPropertyInnerHTML += `<div class="tippy-icon icon-car" data-tippy-content="${textParking}" data-tippy-arrow="true" data-tippy-placement="bottom" tabindex="0"></div>`;
        }
        if (property.Pet) {
          eachPropertyInnerHTML += `<div class="tippy-icon icon-pet" data-tippy-content="${textPet}" data-tippy-arrow="true" data-tippy-placement="bottom" tabindex="0"></div>`;
        }
        if (!property.Elevator && !property.Pet && !property.Parking) {
          eachPropertyInnerHTML += '<div class="tippy-icon icon-car icon-hidden" tabindex="0"></div>';
        }
        // if (property.Status) {
        //   eachPropertyInnerHTML += `<div class="property-card__geo-info__status is--available">${textAvailable}</div>`;
        // } else {
        //   eachPropertyInnerHTML += `<div class="property-card__geo-info__status is--coming-soon">${textComingSoon}</div>`;
        // }
        if (property.Status === 'A') {
          eachPropertyInnerHTML += `<div class="property-card__geo-info__status is--available">${textAvailable}</div>`;
        } else if (property.Status === 'U') {
          eachPropertyInnerHTML += `<div class="property-card__geo-info__status is--unavailable">${textUnavailable}</div>`;
        } else {
          eachPropertyInnerHTML += `<div class="property-card__geo-info__status is--coming-soon">${textComingSoon}</div>`;
        }
        eachPropertyInnerHTML += `
            </div>
          </div>
          <div class="property-card__rooms">
            <div class="property-card__rooms__list">
          `;
        property.Units.forEach((unit) => {
          if (unit.Rent && unit.Rent.length > 0) {
            eachPropertyInnerHTML += `
            <a class="property-card__rooms__list__detail" href="${unit.Url}" target="_blank">
              <strong>${unit.RoomType} / ${unit.RoomSize}m²</strong><span>${unit.Rent}</span>
            </a>
            `;
          } else {
            eachPropertyInnerHTML += `
            <a class="property-card__rooms__list__detail" href="${unit.Url}" target="_blank">
              <strong class="show__unavailable">${unit.RoomType} / ${unit.RoomSize}m²</strong>
            </a>
            `;
          }
        });
        eachPropertyInnerHTML += `
          </div> 
          <a class="property-card__rooms__detail-link" href="${property.PropertyUrl}" target="_blank">${textPropertyDetailButton}</a>
        </div>`;
        if (isMapReach) {
          eachPropertyInnerHTML += '</div>';
          propertyDataInnerHtml += eachPropertyInnerHTML;
        } else {
          eachProperty.innerHTML = eachPropertyInnerHTML;
          propertyListWrapper.appendChild(eachProperty);
        }
      });

      if (isMapReach) {
        propertyListWrapper.innerHTML += propertyDataInnerHtml;
      }

      tippy(document.querySelectorAll('.property-card__list .property-card .property-card__geo-info__units .tippy-icon'));
      // PropertyCard.handleWidthOfRoomDetail();
      PropertyCard.modifyScrollBarPropertyCard('.search-result-section-data-area .property-card__list__wrapper .property-card .property-card__rooms__list');
      Global.ClickPropertyHeartIcon();
      Global.lazyLoad();
    }
  },

  checkForNewContent: (wrapperDiv, lastElementDiv) => {
    const wrapperHasScroll = document.querySelector(wrapperDiv);
    const lastElementScrollTo = document.querySelector(wrapperDiv + lastElementDiv);
    let properties = localStorage.getItem('Visible-marker');
    if (wrapperHasScroll && lastElementScrollTo && properties) {
      properties = JSON.parse(properties);
      const wrapperHasScrollOffSet = wrapperHasScroll.scrollTop + wrapperHasScroll.clientHeight + wrapperHasScroll.offsetTop;
      const lastElementScrollToOffSet = lastElementScrollTo.offsetTop + lastElementScrollTo.clientHeight;
      if (wrapperHasScrollOffSet >= lastElementScrollToOffSet - 10) {
        if (numberOfUpdatedProperty < properties.length && !isDataLoaded) {
          numberOfUpdatedProperty += 10;
          SearchResultSectionDataAreaComponent.initSearchResultData();
        }
      }
    }
  },

  loadMorePropertyDetails: (btn) => {
    btn.addEventListener('click', () => {
      numberOfUpdatedProperty += 10;
      SearchResultSectionDataAreaComponent.initSearchResultData();
    });
  },
};

export default SearchResultSectionDataAreaComponent;
