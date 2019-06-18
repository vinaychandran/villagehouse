import MicroModal from '../../../micromodal';
import SearchResultMapSVG from '../search-result-map-svg/search-result-map-svg';
import Global from '../global/global';
import HandleTrainlineSearchModal from '../getTrainlineData/handleTrainlineData';
import HandleAreaSearchModal from '../getAreaData/handleAreaData';
import getAreaData from '../getAreaData/getAreaData';
import getTrainlineData from '../getTrainlineData/getTrainlineData';

const level = {
  toLevel1: 'toLevel1',
  toLevel2: 'toLevel2',
  toLevel3: 'toLevel3',
  toLevel4: 'toLevel4',
};

const dataGettingType = {
  Area: 'Area',
  Trainline: 'Trainline',
};

let isApiCalled = false;
let RegionAreaData = {};
let RegionTrainlineData = {};
let myIntervalLoading = {};
let currentBtnClicked = {};

const modalOptions = { awaitCloseAnimation: true };

const AreaSearchSection = {
  initAreaTrainlineModal: (isAllowed) => {
    if (isApiCalled === false && isAllowed) {
      Promise.all([
        getAreaData.getDataList(),
        getTrainlineData.getDataList(level.toLevel1),
      ]).then((values) => {
        isApiCalled = true;
        AreaSearchSection.handleExecutionModal(null, values[0], values[1]);
      });
    }
  },
  BindModalToAreaTrainlineBtn: () => {
    const allBtns = document.querySelectorAll('#areaSearchBtn, #trainlineSearchBtn');
    const isSearchResultPage = document.querySelector('.search-result__page .search-result-section-search-area');
    if (isSearchResultPage) {
      AreaSearchSection.initAreaTrainlineModal(false);
    } else {
      AreaSearchSection.initAreaTrainlineModal(true);
    }
    if (allBtns) {
      allBtns.forEach((eachButton) => {
        eachButton.addEventListener('click', (evt) => {
          evt.preventDefault();
          AreaSearchSection.BindCloseModalToBtnAndOverLay();
          currentBtnClicked = eachButton;
          AreaSearchSection.handleExecutionModal(eachButton, RegionAreaData, RegionTrainlineData);
          // }
        });
      });
    }
  },
  handleExecutionModal: (eachButton, areaData, trainlineData) => {
    RegionAreaData = areaData;
    RegionTrainlineData = trainlineData;
    if (currentBtnClicked) {
      document.querySelector('.area-search-result-map').innerHTML = '';
      if (eachButton) {
        Global.fixBodyScrollWhenOpenModal();
        MicroModal.show('areaSearchModal', modalOptions);
      }
      if (!isApiCalled) {
        myIntervalLoading = setInterval(AreaSearchSection.initAreaTrainlineModal(true), 200);
      } else {
        clearInterval(myIntervalLoading);
        const dataArea = document.querySelector('.modal--search .modal__container.modal--search__container');
        if (dataArea) {
          dataArea.classList.remove('.is-still-loading');
        }
        if (currentBtnClicked.id === 'trainlineSearchBtn') {
          SearchResultMapSVG.initSvgMap(dataGettingType.Trainline, trainlineData);
          HandleTrainlineSearchModal.toLevel(level.toLevel1, null, trainlineData);
        } else if (currentBtnClicked.id === 'areaSearchBtn') {
          SearchResultMapSVG.initSvgMap(dataGettingType.Area, areaData);
          HandleAreaSearchModal.toLevel(level.toLevel1, null, areaData, areaData);
        }
      }
    }
  },
  BindCloseModalToBtnAndOverLay: () => {
    const allBtns = document.querySelectorAll('.modal--search__overlay, .icon-modal-closeBtn, .modal--search__closeBtn');
    [].forEach.call(allBtns, (eachBtn) => {
      eachBtn.addEventListener('click', (evt) => {
        evt.stopPropagation();
        if (evt.target.classList.contains('modal--search__overlay') || evt.target.classList.contains('icon-modal-closeBtn') || evt.target.classList.contains('modal--search__closeBtn')) {
          evt.preventDefault();
          MicroModal.close();
          Global.removefixBodyScrollWhenCloseModal();
        }
      });
    });
  },
};

export default AreaSearchSection;
