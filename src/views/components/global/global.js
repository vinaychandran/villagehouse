import OverlayScrollbars from 'overlayscrollbars/js/OverlayScrollbars';
import { Validation } from '../../../assets/scripts/bunnyjs/Validation';
import LazyLoad from '../../../assets/scripts/vanilla-lazyload/lazyload';
import MicroModal from '../../../micromodal';
import 'overlayscrollbars/css/OverlayScrollbars.css';

// Convert foreach to support IE11
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = function (callback, thisArg) {
    thisArg = thisArg || window;
    for (let i = 0; i < this.length; i++) {
      callback.call(thisArg, this[i], i, this);
    }
  };
}

const Global = {
  lazyLoad: (thresDistance) => {
    const distance = thresDistance || 0;
    const myLazyLoad = new LazyLoad({
      elements_selector: '.lazy',
      threshold: distance,
      callback_enter: (element) => {
        element.classList.add('loaded');
      },
    });
    myLazyLoad.update();
  },
  ClickPropertyHeartIcon: () => {
    const allPropertyHeartIcons = document.querySelectorAll('.for-shortlist-icon');
    if (allPropertyHeartIcons) {
      [].forEach.call(allPropertyHeartIcons, (eachPropertyHeartIcon) => {
        eachPropertyHeartIcon.addEventListener('click', () => {
          if (eachPropertyHeartIcon.classList.contains('is-selected')) {
            Global.decreaseShortList();
            eachPropertyHeartIcon.classList.remove('is-selected');
          } else {
            Global.increaseShortlist();
            eachPropertyHeartIcon.classList.add('is-selected');
          }
        });
      });
    }
  },

  increaseShortlist: () => {
    const shortlistElm = document.querySelector('.shortlist');
    const shortlistNumberElm = shortlistElm.querySelector('span');

    if (!shortlistNumberElm) {
      shortlistElm.innerHTML += '<span class="shortlist-number">1</span>';
      shortlistElm.querySelector('span').style.backgroundImage = 'url("../../../assets/images/heart-selected.svg")';
    } else {
      shortlistNumberElm.innerHTML = parseInt(shortlistNumberElm.innerHTML, 10) + 1;
    }
  },

  decreaseShortList: () => {
    const shortlistElm = document.querySelector('.shortlist');
    const shortlistNumberElm = shortlistElm.querySelector('span');

    if (shortlistNumberElm.innerHTML === '1') {
      shortlistElm.removeChild(shortlistNumberElm);
    } else {
      shortlistNumberElm.innerHTML = parseInt(shortlistNumberElm.innerHTML, 10) - 1;
    }
  },

  fixBodyScrollWhenOpenModal: () => {
    document.querySelector('body').classList.add('modal-open');
  },

  removefixBodyScrollWhenCloseModal: () => {
    document.querySelector('body').classList.remove('modal-open');
  },

  initMicroModal: () => {
    MicroModal.init({
      onShow: () => {
        Global.fixBodyScrollWhenOpenModal();
      },
      onClose: () => Global.removefixBodyScrollWhenCloseModal(),
      awaitCloseAnimation: true,
    });
  },

  closeMicroModalManualy: (modal, overlayBtns, closeBtn, closeBtnWrapper) => {
    const tempClass = `${overlayBtns}, ${closeBtn}, ${closeBtnWrapper}`;
    const allBtns = document.querySelectorAll(tempClass);

    if (allBtns) {
      [].forEach.call(allBtns, (eachBtn) => {
        eachBtn.addEventListener('click', (evt) => {
          if (evt.target.classList.contains(overlayBtns.replace('.', '')) || evt.target.classList.contains(overlayBtns.replace('.', '')) || evt.target.classList.contains(closeBtnWrapper.replace('.', ''))) {
            evt.preventDefault();
            MicroModal.close(modal);
            Global.removefixBodyScrollWhenCloseModal();
          }
        });
      });
    }
  },

  initBunnyValidationFormConfig: () => {
    Validation.lang = {
      emailRegex: document.querySelector('#emailRegexFormMsg').value,
      email: document.querySelector('#emailRegexFormMsg').value,
      required: document.querySelector('#requiredFormMsg').value,
      phoneRegex: document.querySelector('#phoneRegexFormMsg').value,
      twoByteCharRegex: document.querySelector('#twoByteCharRegexFormMsg').value,
    };
    Validation.validators.emailRegex = (input) => {
      const emailRegex = new Promise((valid, invalid) => {
        if (input.hasAttribute('emailRegex')) {
          if (Global.isValidEmail(input.value)) {
            valid();
          } else {
            invalid();
          }
        } else {
          valid();
        }
      });
      return emailRegex;
    };
    Validation.validators.phoneRegex = (input) => {
      const phoneRegex = new Promise((valid, invalid) => {
        if (input.hasAttribute('phoneRegex')) {
          if (Global.isValidPhone(input.value)) {
            valid();
          } else {
            invalid();
          }
        } else {
          valid();
        }
      });
      return phoneRegex;
    };

    // Validation 2byte character function
    Validation.validators.twoByteCharRegex = (input) => {
      const twoByteRegex = new Promise((valid, invalid) => {
        if (input.hasAttribute('twoByteRegex')) {
          if (Global.isValid2ByteCharacters(input.value) === 1) {
            valid();
          } else {
            invalid();
          }
        } else {
          valid();
        }
      });
      return twoByteRegex;
    };
  },

  // Check format email
  isValidEmail: (email) => {
    const re = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i;
    return re.test(email);
  },

  // Check format of phone number
  isValidPhone: (phone) => {
    const format = /^[+]?(\d{1,2})?[\s.-]?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/
    return format.test(phone);
  },

  // Check 2 Bytes Character for Name and Date JP
  isValid2ByteCharacters: (char) => {
    const encodeValue = new TextEncoder().encode(char).length;
    const inputLength = char.length;
    const processedValue = encodeValue / inputLength;
    let result;
    if (processedValue === 3) {
      console.log('Good');
      result = 1;
    } else {
      console.log('Bad');
      result = 2;
    }
    return result;
  },

  clickContactUsWithTime(allClassBtns) {
    const allBtns = document.querySelectorAll(allClassBtns);
    if (allBtns.length > 0) {
      [].forEach.call(allBtns, (eachBtn) => {
        if (eachBtn) {
          eachBtn.addEventListener('click', (evt) => {
            if (window.innerWidth > 768) {
              evt.preventDefault();
              MicroModal.show('modalCallBackForm');
              Global.fixBodyScrollWhenOpenModal();
            } else if (window.innerWidth <= 768) {
              if (!Global.isOnWorkingHour()) {
                evt.preventDefault();
                MicroModal.show('modalCallBackForm');
                Global.fixBodyScrollWhenOpenModal();
                $('.mobileCallback').removeClass('mobileCallback');
              } else {
                Global.additionFuncInWorkingHours();
              }
            }
          });
        }
      });
    }
  },
  additionFuncInWorkingHours() {
    const fromPropId = $('#hidPropId').val();
    if (fromPropId !== undefined && fromPropId !== '') {
      const productList = [];
      productList.push({ id: fromPropId, price: '1', quantity: '1' });
      dataLayer = dataLayer || [];
      dataLayer.push({
        event: 'conversion',
        PageType: 'TransactionPage',
        email: '',
        ProductTransactionProducts: productList,
        TransactionID: Math.floor(Math.random() * 99999999999),
      });
    }
  },
  isOnWorkingHour() {
    const startValue = document.querySelector('#sdfStartWorkingHour').value;
    const endValue = document.querySelector('#sdfStopWorkingHour').value;

    // japan timezone +9 GMT
    const startTime = Global.getCurrentDateByTimeZone(+9);
    startTime.setHours(parseInt(startValue.split(':')[0], 10));
    startTime.setMinutes(parseInt(startValue.split(':')[1], 10));

    const endTime = Global.getCurrentDateByTimeZone(+9);
    endTime.setHours(parseInt(endValue.split(':')[0], 10));
    endTime.setMinutes(parseInt(endValue.split(':')[1], 10));

    // new Date in japan
    const currentTimeJapan = Global.getCurrentDateByTimeZone(+9);

    return (currentTimeJapan > startTime && currentTimeJapan < endTime);
  },
  getCurrentDateByTimeZone(timezone) {
    const currentDateLocale = new Date();
    const utc = currentDateLocale.getTime() + currentDateLocale.getTimezoneOffset() * 60000;
    return new Date(utc + (3600000 * timezone));
  },
  isJson: (str) => {
    try {
      JSON.parse(str);
    } catch (e) {
      return false;
    }
    return true;
  },
  requestDateFromUrl: url => new Promise((resolve) => {
    const xhrHttp = new XMLHttpRequest();
    xhrHttp.open('GET', url, true);
    xhrHttp.responseType = 'json';
    xhrHttp.onreadystatechange = () => {
      if (xhrHttp.readyState === 4 && xhrHttp.status === 200) {
        let httpResponse = xhrHttp.response;
        if (Global.isJson(xhrHttp.response)) {
          httpResponse = JSON.parse(xhrHttp.response);
        } else {
          httpResponse = xhrHttp.response;
        }
        resolve(httpResponse);
      }
    };
    xhrHttp.send();
  }),
  getDataFromUrl: async (url) => {
    const dataResult = await Global.requestDateFromUrl(url);
    return dataResult;
  },
  requestDataFromUrlWithHeader: (url, header) => new Promise((resolve) => {
    const xhrHttp = new XMLHttpRequest();
    xhrHttp.open('GET', url, true);
    xhrHttp.responseType = 'json';
    xhrHttp.onreadystatechange = () => {
      if ((xhrHttp.readyState === 4 && xhrHttp.status === 200)
          || xhrHttp.readyState === XMLHttpRequest.DONE) {
        let httpResponse = xhrHttp.response;
        if (Global.isJson(xhrHttp.response)) {
          httpResponse = JSON.parse(xhrHttp.response);
        } else {
          httpResponse = xhrHttp.response;
        }
        resolve(httpResponse);
      }
    };
    xhrHttp.setRequestHeader('secret-key', header);
    xhrHttp.send();
  }),
  getDataFromUrlWithHeader: async (url, header) => {
    const dataResult = await Global.requestDataFromUrlWithHeader(url, header);
    return dataResult;
  },
  requestDataFromUrlPost: (url, data) => new Promise((resolve) => {
    const xhrHttp = new XMLHttpRequest();
    const jsonData = JSON.stringify(data);
    xhrHttp.open('POST', url, true);
    xhrHttp.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    xhrHttp.responseType = 'json';
    xhrHttp.onload = () => {
      if (xhrHttp.readyState === 4 && xhrHttp.status === 200) {
        let httpResponse = xhrHttp.response;
        if (Global.isJson(xhrHttp.response)) {
          httpResponse = JSON.parse(xhrHttp.response);
        } else {
          httpResponse = xhrHttp.response;
        }
        resolve(httpResponse);
      }
    };
    xhrHttp.send(jsonData);
  }),
  getDataFromUrlPost: async (url, data) => {
    const dataResult = await Global.requestDataFromUrlPost(url, data);
    return dataResult;
  },
  initImageMagnific: (imageContainer, magnificType) => {
    $(imageContainer).magnificPopup({
      type: magnificType,
      closeOnContentClick: true,
      image: {
        verticalFit: true,
      },
      callbacks: {
        open: () => {
          setTimeout(() => {
            const magnificPopup = $.magnificPopup.instance;
            $('.mfp-container').swipe({
              swipeLeft: function (event, direction, distance, duration, fingerCount) {
                console.log("swipe right");
                magnificPopup.next();
              },
              swipeRight:function(event, direction, distance, duration, fingerCount) {
                console.log("swipe left");
                magnificPopup.prev();
              },
            });
          }, 500);
        },
        beforeClose: () => {
          $('.mfp-container').swipe('destroy');
        },
      },
    });
  },
  mapApiContainer: (key) => {
    let apiURL = '';
    switch (key) {
      case 'GetAllPropertiesForMap':
        apiURL = 'GetAllPropertiesForMap?sc_lang=';
        break;
      case 'SearchProperties':
        apiURL = 'SearchProperties?sc_lang=';
        break;
      default:
        apiURL = 'GetPropertiesDetail?sc_lang=';
    }
    return apiURL;
  },
  isQueryStringPresent: (field) => {
    const url = window.location.href;
    if (url.indexOf(`?${field}=`) !== -1) { return true; }
    if (url.indexOf(`&${field}=`) !== -1) { return true; }
    return false;
  },
  getParameterByName: (name) => {
    const url = window.location.href;
    let paramName = '';
    paramName = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${paramName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
  },
  getParameterByNameSearchCode: (name) => {
    const url = window.location.href;
    let paramName = '';
    paramName = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp(`[?&]${paramName}(=([^&#]*)|&|#|$)`);
    const results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2]);
  },
  getSiteLanguage: () => document.documentElement.lang,
  isDeviceMobile: () => {
    if (navigator.userAgent.match(/Android/i)
    || navigator.userAgent.match(/webOS/i)
    || navigator.userAgent.match(/iPhone/i)
    || navigator.userAgent.match(/iPad/i)
    || navigator.userAgent.match(/iPod/i)
    || navigator.userAgent.match(/BlackBerry/i)
    || navigator.userAgent.match(/Windows Phone/i)
    || window.innerWidth <= 992
    ) {
      return true;
    }
    return false;
  },
  initCustomScrollbarForComponent: (wrapper) => {
    const componentWrapper = document.querySelector(wrapper);
    if (componentWrapper) {
      OverlayScrollbars(componentWrapper, { });
    }
  },
};

export default Global;
