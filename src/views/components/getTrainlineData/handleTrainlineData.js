/* eslint-disable no-nested-ternary */
import SearchResultMapSVG from '../search-result-map-svg/search-result-map-svg';
import getTrainlineData from './getTrainlineData';

const seachAreaContainer = document.querySelector('#areaSearchModal .modal__container');
const searchAreaModalHeader = seachAreaContainer ? seachAreaContainer.querySelector('.modal--search__header__title ul') : '';
const searchAreaModalContent = seachAreaContainer ? seachAreaContainer.querySelector('.modal--search__content') : '';

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

let trainlineCode = '';

const HandleTrainlineSearchModal = {
  getHTMLContent: (levelTogo, objectKey = '', objectValue) => {
    const allLineText = document.querySelector('#allDistrictorLineText');
    let HTMLappendedContent = '';
    if (levelTogo === level.toLevel1) {
      HTMLappendedContent = '<ul class="modal--search__content__list">';
      Object.keys(objectValue).forEach((childObject) => {
        if (objectValue[childObject].count > 0) {
          HTMLappendedContent += `
            <li>
              <label for="area-search-result-${objectValue[childObject].id}" data-object-value=${objectValue[childObject].RegionName} data-object-id=${objectValue[childObject].id}>
                <span class="modal--search__content__list__name">${objectValue[childObject].RegionName}</span><span class="modal--search__content__list__count">(${objectValue[childObject].count})</span>
              </label>
            </li>
          `;
        }
      });
      HTMLappendedContent += '</ul>';
    }
    if (levelTogo === level.toLevel2) {
      HTMLappendedContent = `
        <div class="modal--search__content__title"><span>${objectKey}</span></div>
          <ul class="modal--search__content__list">
      `;
      Object.keys(objectValue).forEach((childObject) => {
        if (objectValue[childObject].count > 0) {
          HTMLappendedContent += `
          <li>
            <label for="area-search-result-${objectValue[childObject].id}" data-object-id="${objectValue[childObject].id}" data-object-value="${objectValue[childObject].PrefectureName}">
              <span class="modal--search__content__list__name">${objectValue[childObject].PrefectureName}</span><span class="modal--search__content__list__count">(${objectValue[childObject].count})</span>
            </label>
          </li>
        `;
        }
      });
      HTMLappendedContent += '</ul>';
    }
    if (levelTogo === level.toLevel3) {
      HTMLappendedContent += `
        <div class="modal--search__content__title"><span>${objectKey}</span></div>
      `;
      HTMLappendedContent += `
        <ul class="modal--search__content__list">
      `;
      Object.keys(objectValue).forEach((childObject) => {
        if (objectValue[childObject].count > 0) {
          HTMLappendedContent += `
          <li>
            <input id="area-search-result-${objectValue[childObject].id}" type="checkbox" name="area-search-result-${objectValue[childObject].id}" value="${objectValue[childObject].TrainLineName}" data-object-code="${objectValue[childObject].code}">
            <label data-object-id="${objectValue[childObject].id}" data-object-value="${objectValue[childObject].TrainLineName}" data-object-key="${objectValue[childObject].code}">
              <span class="modal--search__content__list__name">${objectValue[childObject].TrainLineName}</span><span class="modal--search__content__list__count">(${objectValue[childObject].count})
              </span>
            </label>
          </li>
        `;
        }
      });
      HTMLappendedContent += '</ul>';
    }
    if (levelTogo === level.toLevel4) {
      HTMLappendedContent += `
        <div class="modal--search__content__title"><span>${objectKey}</span></div>
        <div class="modal--search__content__all-districts">
          <input id="area-search-result-all" type="checkbox" name="area-search-result-all" value="all"><label for="area-search-result-all">${allLineText.value} ${objectKey}</label>
        </div>
        <ul class="modal--search__content__list">
      `;
      Object.keys(objectValue).forEach((childObject) => {
        if (objectValue[childObject].count > 0) {
          HTMLappendedContent += `
          <li>
            <input id="area-search-result-${objectValue[childObject].id}" type="checkbox" name="area-search-result-${objectValue[childObject].id}" value="${objectValue[childObject].TrainStationName}" data-object-code="${objectValue[childObject].code}"><label for="area-search-result-${objectValue[childObject].id}" data-object-id="${objectValue[childObject].id}" data-object-value="${objectValue[childObject].TrainStationName}" data-object-code="${objectValue[childObject].code}"><span class="modal--search__content__list__name">${objectValue[childObject].TrainStationName}</span><span class="modal--search__content__list__count">(${objectValue[childObject].count})</span></label>
          </li>
        `;
        }
      });
    }
    return HTMLappendedContent;
  },
  appendHTMLContent: (levelTogo, objectKey, objectValue) => {
    searchAreaModalContent.innerHTML = '';
    searchAreaModalContent.innerHTML = HandleTrainlineSearchModal.getHTMLContent(levelTogo, objectKey, objectValue);
  },
  appendHTMLHeader: (levelTogo, clickedLabel) => {
    searchAreaModalHeader.innerHTML = HandleTrainlineSearchModal.getHTMLHeader(levelTogo, clickedLabel);
  },
  getHTMLHeader: (levelTogo, clickedLabel) => {
    const searchAreaModalHeaderBtn = searchAreaModalHeader.querySelectorAll('li span:not([class^="icon-"])');
    const clickedLabelText = clickedLabel ? clickedLabel.dataset.objectValue : '';
    const areaAllText = document.querySelector('#allAreaText');
    let HTMLappendedHeader = '';
    if (levelTogo === level.toLevel1) {
      HTMLappendedHeader = `<li><span>${areaAllText.value}</span></li>`;
      searchAreaModalHeader.innerHTML = '';
    } else if (levelTogo === level.toLevel2) {
      HTMLappendedHeader = `
        <li><span>${areaAllText.value}</span></li>
        <li><span class="icon-arrow-right"></span><span data-object-id="${clickedLabel.dataset.objectId}" data-object-value="${clickedLabel.dataset.objectValue}">${clickedLabelText}</span></li>
      `;
      searchAreaModalHeader.innerHTML = '';
    } else if (levelTogo === level.toLevel3) {
      HTMLappendedHeader = `
        <li><span>${areaAllText.value}</span></li>
        <li><span class="icon-arrow-right"></span><span data-object-id="${searchAreaModalHeaderBtn[1].dataset.objectId}" data-object-value="${searchAreaModalHeaderBtn[1].dataset.objectValue}">${searchAreaModalHeaderBtn[1].innerHTML}</span></li>
        <li><span class="icon-arrow-right"></span><span data-object-id="${clickedLabel.dataset.objectId}" data-object-value="${clickedLabel.dataset.objectValue}">${clickedLabelText}</span></li>
      `;
      searchAreaModalHeader.innerHTML = '';
    } else if (levelTogo === level.toLevel4) {
      HTMLappendedHeader = `${searchAreaModalHeader.innerHTML}<li><span class="icon-arrow-right"></span><span data-object-id="${clickedLabel.dataset.objectId}" data-object-value="${clickedLabel.dataset.objectValue}">${clickedLabelText}</span></li>`;
    }
    return HTMLappendedHeader;
  },
  changeContainerClassAndAttrs: (levelTogo, prefId = '', trainLineId = '') => {
    let additionClass = '';
    switch (levelTogo) {
      case level.toLevel1:
        additionClass = 'level1';
        break;
      case level.toLevel2:
        additionClass = 'level2';
        break;
      case level.toLevel3:
        additionClass = 'level3';
        break;
      case level.toLevel4:
        additionClass = 'level4';
        break;
      default:
        break;
    }
    seachAreaContainer.dataset.prefId = prefId;
    seachAreaContainer.dataset.trainLineId = trainLineId;
    // const modalClass = `modal__container modal--search__container is-${additionClass} modal--search__container--trainline`;
    seachAreaContainer.classList.remove('is-still-loading');
    seachAreaContainer.classList.add(`is-${additionClass}`);
  },
  bindClickButtonHeader: (RegionData) => {
    const searchAreaModalHeaderBtn = searchAreaModalHeader.querySelectorAll('li span:not([class^="icon-"])');
    searchAreaModalHeaderBtn[0].addEventListener('click', () => {
      HandleTrainlineSearchModal.handleLevel(level.toLevel1, searchAreaModalHeaderBtn[0], RegionData, RegionData);
    });
    if (searchAreaModalHeaderBtn[1]) {
      searchAreaModalHeaderBtn[1].addEventListener('click', () => {
        HandleTrainlineSearchModal.handleLevel(level.toLevel2, searchAreaModalHeaderBtn[1], RegionData, RegionData);
      });
    }
    if (searchAreaModalHeaderBtn[2]) {
      searchAreaModalHeaderBtn[2].addEventListener('click', () => {
        getTrainlineData.getDataList(
          level.toLevel3,
          seachAreaContainer.dataset.prefId,
          seachAreaContainer.dataset.trainLineId,
        ).then((dataList) => {
          HandleTrainlineSearchModal.handleLevel(level.toLevel3, searchAreaModalHeaderBtn[2], dataList, RegionData);
        });
      });
    }
  },
  handleLevel: (levelTogo, clickedLabel, dataList, RegionData) => {
    const objectValue = clickedLabel ? clickedLabel.dataset.objectValue : '';
    trainlineCode = '';
    const {
      toLevel1,
      toLevel2,
      toLevel3,
      toLevel4,
    } = level;
    const preId = seachAreaContainer.dataset.prefId ? seachAreaContainer.dataset.prefId : '';
    const objectId = clickedLabel ? clickedLabel.dataset.objectId : '';
    if (levelTogo === toLevel1 || levelTogo === toLevel2) {
      HandleTrainlineSearchModal.changeContainerClassAndAttrs(levelTogo);
    } else if (levelTogo === toLevel3) {
      HandleTrainlineSearchModal.changeContainerClassAndAttrs(levelTogo, objectId);
    } else if (levelTogo === toLevel4) {
      HandleTrainlineSearchModal.changeContainerClassAndAttrs(levelTogo, preId, objectId);
    }
    if (levelTogo === toLevel1) {
      document.querySelector('.area-search-result-map').innerHTML = '';
      SearchResultMapSVG.initSvgMap(dataGettingType.Trainline, RegionData);
    }
    HandleTrainlineSearchModal.appendHTMLHeader(levelTogo, clickedLabel);
    HandleTrainlineSearchModal.bindClickButtonHeader(RegionData);
    let dataCurrentLevel = {};
    let nextLevel = {};
    switch (levelTogo) {
      case toLevel1:
        dataCurrentLevel = RegionData.Regions;
        nextLevel = toLevel2;
        break;
      case toLevel2:
        dataCurrentLevel = HandleTrainlineSearchModal.valueOfKeyInObjectWithAKeyHasValue(
          RegionData.Regions,
          'RegionName',
          objectValue,
          'prefecture',
        );
        nextLevel = toLevel3;
        break;
      case toLevel3:
        dataCurrentLevel = dataList.trainLine;
        nextLevel = toLevel4;
        break;
      case toLevel4:
        dataCurrentLevel = dataList.trainStation;
        break;
      default:
        break;
    }
    HandleTrainlineSearchModal.appendHTMLContent(levelTogo, objectValue, dataCurrentLevel);
    HandleTrainlineSearchModal.bindClickButtonToNextLevel(nextLevel, RegionData);
    if (levelTogo === toLevel3) {
      HandleTrainlineSearchModal.handleClickCheckboxTrainlineOnLevel3(levelTogo, dataList.Url);
    } else if (levelTogo === toLevel4) {
      const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
      submitBtn.href = '';
      HandleTrainlineSearchModal.handleClickCheckboxLastLevel(levelTogo, dataList.Url, dataList.SearchAllUrl);
    }
  },
  valueOfKeyInObjectWithAKeyHasValue: (theBigArray, givenkey, givenValue, returnKey) => {
    for (let i = 0; i < theBigArray.length; i++) {
      if (theBigArray[i][givenkey] === givenValue) {
        return theBigArray[i][returnKey];
      }
    }
  },
  changeUrlSearchSubmitBtn: (levelTogo, url, urlAll = null) => {
    const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
    const allCheckedInput = document.querySelectorAll('#areaSearchModal input[type="checkbox"]:not(#area-search-result-all):checked');
    const codeList = [];
    let checkAllUrl = '';
    if (HandleTrainlineSearchModal.isCheckedAll() && levelTogo === level.toLevel4) {
      submitBtn.href = urlAll;
    } else {
      checkAllUrl = url;
      for (let i = 0; i < allCheckedInput.length; i++) {
        codeList.push(allCheckedInput[i].dataset.objectCode);
      }
      submitBtn.href = checkAllUrl + codeList.join('+');
    }
  },
  handleClickCheckboxTrainlineOnLevel3: (levelTogo, url) => {
    const allCheckBoxs = searchAreaModalContent.querySelectorAll('ul input[type="checkbox"]');
    [].forEach.call(allCheckBoxs, (eachCheckBox) => {
      eachCheckBox.addEventListener('click', () => {
        if (HandleTrainlineSearchModal.isCheckAtLeastOne()) {
          seachAreaContainer.classList.add('is-checked-done');
          HandleTrainlineSearchModal.changeUrlSearchSubmitBtn(levelTogo, url);
        } else {
          const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
          submitBtn.href = '';
          seachAreaContainer.classList.remove('is-checked-done');
        }
      });
    });
  },
  handleClickCheckboxLastLevel: (levelTogo, url, urlAll) => {
    const checkallInput = searchAreaModalContent.querySelector('.modal--search__content__all-districts input[type="checkbox"]');
    HandleTrainlineSearchModal.checkAll(levelTogo, url, urlAll);
    const allInputButAll = searchAreaModalContent.querySelectorAll('ul input[type="checkbox"], ul label');
    [].forEach.call(allInputButAll, (eachInput) => {
      eachInput.addEventListener('click', () => {
        if (HandleTrainlineSearchModal.isCheckAtLeastOne()) {
          seachAreaContainer.classList.add('is-checked-done');
          HandleTrainlineSearchModal.changeUrlSearchSubmitBtn(levelTogo, url, urlAll);
        } else {
          const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
          submitBtn.href = '';
          seachAreaContainer.classList.remove('is-checked-done');
        }
        if (HandleTrainlineSearchModal.isCheckedAll()) {
          checkallInput.checked = true;
        } else {
          checkallInput.checked = false;
        }
      });
    });
  },
  checkAll: (levelTogo, url, urlAll = null) => {
    const checkallBtns = searchAreaModalContent.querySelectorAll('.modal--search__content__all-districts input, .modal--search__content__all-districts label');
    [].forEach.call(checkallBtns, (eachCheckAllBtn) => {
      eachCheckAllBtn.addEventListener('click', () => {
        const allInputs = searchAreaModalContent.querySelectorAll('ul input[type="checkbox"]');
        [].forEach.call(allInputs, (eachInput) => {
          if (document.querySelector('.modal--search__content__all-districts input').checked === true) {
            eachInput.checked = true;
          } else {
            eachInput.checked = false;
          }
        });
        if (HandleTrainlineSearchModal.isCheckAtLeastOne()) {
          seachAreaContainer.classList.add('is-checked-done');
          HandleTrainlineSearchModal.changeUrlSearchSubmitBtn(levelTogo, url, urlAll);
        } else {
          const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
          submitBtn.href = '';
          seachAreaContainer.classList.remove('is-checked-done');
        }
      });
    });
  },
  isCheckAtLeastOne: () => {
    const allInputButAll = searchAreaModalContent.querySelectorAll('ul input[type="checkbox"]');
    let checkedNumber = 0;
    [].forEach.call(allInputButAll, (eachInput) => {
      if (eachInput.checked === true) { checkedNumber += 1; }
    });
    return checkedNumber > 0;
  },
  isCheckedAll: () => {
    const allInputButAll = searchAreaModalContent.querySelectorAll('ul input[type="checkbox"]');
    let checkedNumber = 0;
    [].forEach.call(allInputButAll, (eachInput) => {
      if (eachInput.checked === true) { checkedNumber += 1; }
    });
    return allInputButAll.length === checkedNumber;
  },
  toLevel: (levelTogo, clickedLabel, RegionData) => {
    const trainLineId = clickedLabel ? clickedLabel.dataset.objectKey : '';
    const objectId = clickedLabel ? clickedLabel.dataset.objectId : '';
    if (levelTogo === level.toLevel1 || levelTogo === level.toLevel2) {
      HandleTrainlineSearchModal.handleLevel(levelTogo, clickedLabel, RegionData, RegionData);
    } else {
      if (trainLineId) {
        trainlineCode = trainLineId;
      }
      if (levelTogo === level.toLevel3) {
        getTrainlineData.getDataList(levelTogo, objectId).then((dataList) => {
          HandleTrainlineSearchModal.handleLevel(levelTogo, clickedLabel, dataList, RegionData);
        });
      } else if (levelTogo === level.toLevel4) {
        getTrainlineData.getDataList(levelTogo, seachAreaContainer.dataset.prefId, objectId).then((dataList) => {
          HandleTrainlineSearchModal.handleLevel(levelTogo, clickedLabel, dataList, RegionData);
        });
      }
    }
  },
  bindClickButtonToNextLevel: (levelTogo, RegionData) => {
    const allLabelButtons = searchAreaModalContent.querySelectorAll('.modal--search__content__list label');
    [].forEach.call(allLabelButtons, (eachLabel) => {
      eachLabel.addEventListener('click', () => {
        HandleTrainlineSearchModal.toLevel(levelTogo, eachLabel, RegionData);
      });
    });
  },
};

export default HandleTrainlineSearchModal;
