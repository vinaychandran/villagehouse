// import './assets/styles/_app.scss';
import Global from './views/components/global/global';
import Header from './views/components/header/header';
import Footer from './views/components/footer/footer';
import ShortListCard from './views/components/shortlist-card/shortlist-card';
import modalRequestForm from './views/components/modal-request-form/modal-request-form';
import PropertyCard from './views/components/property-card/property-card';
import AreaSearchSection from './views/components/area-search-section/area-search-section';
import searchResultDropDownFilter from './views/components/search-result-page__dropdown-filter/search-result-page__dropdown-filter';
import PropertyDetailSlider from './views/components/property-detail-page__slider-and-text/property-detail-page__slider-and-text';
import MapComponent from './views/components/map-component/map-component';
import areaSearchAutocomplete from './views/components/area-search-autocomplete/area-search-autocomplete';
import PropertyMap from './views/components/property-detail-page__properties-map/property-detail-page__properties-map';
import BuildingDetailBlock from './views/components/building-detail-block/building-detail-block';
import SiblingBarHeader from './views/components/sibling-bar-header/sibling-bar-header';
import FaqBanner from './views/components/faq-banner/faq-banner';
import SearchResultSectionDataAreaComponent from './views/components/search-result-section-data-area/search-result-section-data-area';
import CompanyMap from './views/components/company-information/company-information';
import LoginModal from './views/components/login-modal/login-modal';
import 'tippy.js/dist/tippy.css';
import LoginWithNote from './views/components/login-with-note/login-with-note';

require('normalize.css');
require('slick-carousel');
require('slick-carousel/slick/slick.css');
require('slick-carousel/slick/slick-theme.css');
require('magnific-popup');
require('magnific-popup/dist/magnific-popup.css');
require('jquery-touchswipe');

$(() => {
  LoginWithNote.applyCalendar();
  Global.ClickPropertyHeartIcon();
  Global.initMicroModal();
  Global.initBunnyValidationFormConfig();
  Global.clickContactUsWithTime('.header__top-row__contact-info__detail__number, .contact-info__callback, .rental-support a, .campaign-telephone__block-info__number__link');
  Global.closeMicroModalManualy('modalCallBackForm', '.modal-phone__callback__overlay', '.modal-phone__callback__overlay__btn-close', '.modal-phone__callback__overlay__btn-close');
  Header.toggleLanguageDropDownDesktop();
  Header.handleClickHamburgerOpenNav();
  Header.handleClickCloseNav();
  Footer.submitFormScheduleCallback();
  ShortListCard.initShortListSlider('.shortlist-card', '.shortlist-card__item', 3, 1);
  ShortListCard.initShortListSlider('#near-properties__slider', '.property-card', 2, 1);
  modalRequestForm.submitFormScheduleRequest();
  PropertyCard.showTooltipWhenHoverDetail();
  if (document.querySelector('section.filter-dropdown')) {
    searchResultDropDownFilter.toggleDropdownFilter();
    searchResultDropDownFilter.checkAllDropdown();
  }
  SearchResultSectionDataAreaComponent.initTextLanguageForSearchResultSection();
  MapComponent.initGoogleMap();
  // MapComponent.locationHandler();
  MapComponent.toggleSearchResultMap('.map-component__switch-container__btn--toggle-result', '.map-component', false);
  MapComponent.toggleSearchResultMap('.map-component__switch-container__btn--toggle-map', '.map-component', true);
  MapComponent.toggleSearchResultMap('.map-component__map-container .ic-arrow-back', '.map-component', false);
  MapComponent.toggleSearchResultMap('.map-component__map-container .ic-arrow-next', '.map-component', true);
  MapComponent.toggleSearchResultMap('.switch-container-mobile__btn--toggle-result', '.map-component', false);
  MapComponent.toggleSearchResultMap('.switch-container-mobile__btn--toggle-map', '.map-component', true);
  PropertyMap.initPropertyMap();
  PropertyMap.initUnitMap();
  CompanyMap.initCompanyMap();
  SiblingBarHeader.stickySiblingBarHeader();
  FaqBanner.initYoutubeApi();
  FaqBanner.toggleTimestampList();
  MapComponent.clickOnAreaBreadcrumb('.area-breadcrumb .area-breadcrumb__content__link-area');
  SearchResultSectionDataAreaComponent.initScrollResultData();
  areaSearchAutocomplete.handleKeyDown('.autocomplete-input');
  LoginModal.submitLoginForm();
});

$(document).ready(() => {
  Global.lazyLoad();
  AreaSearchSection.BindModalToAreaTrainlineBtn();
  BuildingDetailBlock.initSlickSlier('.building-block__room-block__content__slider');
  areaSearchAutocomplete.autocompleteSearchButton('.area-search__search-block button, .search-result-section-search-area__filter button');
  if (window.$zopim) {
    $zopim(() => {
      $zopim.livechat.setOnChatStart(() => {
        dataLayer = dataLayer || [];
        dataLayer.push({
          event: 'zendeskChat',
          ZendeskChat: 'zendeskChatStarted',
        });
      });
    });
  }
});

$(window).on('resize', () => {
  setTimeout(() => {
    // PropertyCard.handleWidthOfRoomDetail();
    MapComponent.removeAreaSearchResultFixBodyWhenResize('.map-component');
    Global.lazyLoad();
  }, 250);
});

window.addEventListener('scroll', () => {
  SiblingBarHeader.stickySiblingBarHeader();
});

window.onYouTubePlayerAPIReady = () => {
  const fagVideo = document.querySelector('#faq-video');
  if (fagVideo) {
    const player = new YT.Player('faq-video', {
      height: '530',
      width: '940',
      videoId: fagVideo.dataset.videoId,
      host: 'https://www.youtube.com',
      playerVars: {
        autoplay: 0, modestbranding: 1, showinfo: 0, rel: 0, cc_load_policy: 1,
      },
      events: {
        onReady: FaqBanner.onPlayerReady,
        onStateChange: FaqBanner.onPlayerStateChange,
      },
    });
    FaqBanner.addClickTimeStampList(player);
  }
};

window.onload = () => {
  // PropertyCard.handleWidthOfRoomDetail();
  PropertyCard.modifyScrollBarPropertyCard('.near-properties__content .property-card .property-card__rooms__list');
  PropertyDetailSlider.initSlider('.property-detail__image-slider', '.property-detail__thumnail-slider');
  Global.initImageMagnific('.propery-details__buildings__content__props__room-image a', 'image');
};

window.addLocationAutoComplete = areaSearchAutocomplete.addLocationAutoComplete;
