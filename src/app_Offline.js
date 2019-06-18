// import './assets/styles/_app.scss';
import Global from './views/components/global/global';
import Header from './views/components/header/header';
import Footer from './views/components/footer/footer';
import modalRequestForm from './views/components/modal-request-form/modal-request-form';
import 'tippy.js/dist/tippy.css';

require('normalize.css');
require('magnific-popup');
require('magnific-popup/dist/magnific-popup.css');
require('jquery-touchswipe');

$(() => {
  Global.initMicroModal();
  Global.initBunnyValidationFormConfig();
  Global.clickContactUsWithTime('.header__top-row__contact-info__detail__number, .contact-info__callback, .rental-support a, .campaign-telephone__block-info__number__link');
  Global.closeMicroModalManualy('modalCallBackForm', '.modal-phone__callback__overlay', '.modal-phone__callback__overlay__btn-close', '.modal-phone__callback__overlay__btn-close');
  Header.toggleLanguageDropDownDesktop();
  Header.handleClickHamburgerOpenNav();
  Header.handleClickCloseNav();
  Footer.submitFormScheduleCallback();
  modalRequestForm.submitFormScheduleRequest();
});

$(document).ready(() => {
  Global.lazyLoad();
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
    Global.lazyLoad();
  }, 250);
});

window.addEventListener('scroll', () => {
});

window.onload = () => {
};
