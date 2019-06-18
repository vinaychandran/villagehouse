import SearchResultMapSVG from '../search-result-map-svg/search-result-map-svg';
import getAreaData from './getAreaData';

const seachAreaContainer = document.querySelector('#areaSearchModal .modal__container');
const searchAreaModalHeader = seachAreaContainer ? seachAreaContainer.querySelector('.modal--search__header__title ul') : '';
const searchAreaModalContent = seachAreaContainer ? seachAreaContainer.querySelector('.modal--search__content') : '';

const level = {
  toLevel1: 'toLevel1',
  toLevel2: 'toLevel2',
  toLevel3: 'toLevel3',
};

const dataGettingType = {
  Area: 'Area',
  Trainline: 'Trainline',
};

let prefectureCode = '';
let districtsTitle = '';

const HandleAreaSearchModal = {
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
  getHTMLContent: (levelTogo, objectKey = '', objectValue, objectHasWard) => {
    const allDistrictText = document.querySelector('#allDistrictorLineText');
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
            <label for="area-search-result-${objectValue[childObject].id}" data-object-id="${objectValue[childObject].id}" data-object-value="${objectValue[childObject].PrefectureName}" data-object-prefecture-id="${objectValue[childObject].code}">
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
        <div class= "modal--search__content__all-districts">
          <input id="area-search-result-all" type="checkbox" name="area-search-result-all" value="all"><label for="area-search-result-all">${allDistrictText.value} ${objectKey}</label>
        </div>
      `;
      if (objectHasWard && objectHasWard.length > 0) {
        Object.keys(objectHasWard).forEach((childObject) => {
          // if (objectHasWard[childObject].count > 0) {
          HTMLappendedContent += `
              <div class="modal--search__content__list-title">
              ${objectHasWard[childObject].CityName}
            `;
          HTMLappendedContent += '</div>';
          const wardList = objectHasWard[childObject].wards;
          // console.log(wardList);
          HTMLappendedContent += `
            <ul class="modal--search__content__list">
          `;
          Object.keys(wardList).forEach((ward) => {
            HTMLappendedContent += `
                <li>
                  <input id="area-search-result-${wardList[ward].id}" type="checkbox" name="area-search-result-${wardList[ward].id}" value="${wardList[ward].WardName}" data-object-code="${wardList[ward].code}"><label for="area-search-result-${wardList[ward].id}" data-object-id="${wardList[ward].id}" data-object-value="${wardList[ward].WardName}"><span class="modal--search__content__list__name">${wardList[ward].WardName}</span><span class="modal--search__content__list__count">(${wardList[ward].count})</span></label>
                </li>
              `;
          });
          HTMLappendedContent += '</ul>';
          // }
        });
        HTMLappendedContent += `
          <div class="modal--search__content__list-title">
          ${districtsTitle}
          </div>
        `;
      }
      HTMLappendedContent += `
        <ul class="modal--search__content__list">
      `;
      Object.keys(objectValue).forEach((childObject) => {
        if (objectValue[childObject].count > 0) {
          HTMLappendedContent += `
            <li>
              <input id="area-search-result-${objectValue[childObject].id}" type="checkbox" name="area-search-result-${objectValue[childObject].id}" value="${objectValue[childObject].CityName}" data-object-code="${objectValue[childObject].code}"><label for="area-search-result-${objectValue[childObject].id}" data-object-id="${objectValue[childObject].id}" data-object-value="${objectValue[childObject].CityName}"><span class="modal--search__content__list__name">${objectValue[childObject].CityName}</span><span class="modal--search__content__list__count">(${objectValue[childObject].count})</span></label>
            </li>
          `;
        }
      });
      HTMLappendedContent += '</ul>';
    }
    return HTMLappendedContent;
  },
  appendHTMLContent: (levelTogo, objectKey, objectValue, objectHasWard) => {
    searchAreaModalContent.innerHTML = '';
    searchAreaModalContent.innerHTML = HandleAreaSearchModal.getHTMLContent(levelTogo, objectKey, objectValue, objectHasWard);
  },
  appendHTMLHeader: (levelTogo, clickedLabel) => {
    searchAreaModalHeader.innerHTML = HandleAreaSearchModal.getHTMLHeader(levelTogo, clickedLabel);
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
    }
    return HTMLappendedHeader;
  },
  bindClickButtonHeader: (RegionData) => {
    const searchAreaModalHeaderBtn = searchAreaModalHeader.querySelectorAll('li span:not([class^="icon-"])');
    for (let i = 0; i < searchAreaModalHeaderBtn.length - 1; i++) {
      searchAreaModalHeaderBtn[i].addEventListener('click', () => {
        const levelTogo = i === 0 ? level.toLevel1 : level.toLevel2;
        HandleAreaSearchModal.toLevel(levelTogo, searchAreaModalHeaderBtn[i], RegionData, RegionData);
      });
    }
  },
  handleLevel: (levelTogo, clickedLabel, dataList, RegionData) => {
    const clickedLabelText = clickedLabel ? clickedLabel.dataset.objectValue : '';
    // reinit map in level 1
    if (levelTogo === level.toLevel1) {
      document.querySelector('.area-search-result-map').innerHTML = '';
      SearchResultMapSVG.initSvgMap(dataGettingType.Area, RegionData);
    }
    HandleAreaSearchModal.appendHTMLHeader(levelTogo, clickedLabel);
    HandleAreaSearchModal.bindClickButtonHeader(RegionData);
    // get data on next level
    let objectValueNextLevel = {};
    let objectValueWard = {};
    prefectureCode = '';
    districtsTitle = RegionData.OtherDistricts;
    if (levelTogo === level.toLevel1) {
      objectValueNextLevel = dataList.Regions;
      HandleAreaSearchModal.appendHTMLContent(levelTogo, clickedLabelText, objectValueNextLevel);
      HandleAreaSearchModal.bindClickButtonToNextLevel(level.toLevel2, dataList, RegionData);
    } else if (levelTogo === level.toLevel2) {
      objectValueNextLevel = HandleAreaSearchModal.valueOfPropertyInObjectWithAPropertyHasValue(
        dataList.Regions,
        'RegionName',
        clickedLabelText,
        'prefecture',
      );
      HandleAreaSearchModal.appendHTMLContent(levelTogo, clickedLabelText, objectValueNextLevel);
      HandleAreaSearchModal.bindClickButtonToNextLevel(level.toLevel3, objectValueNextLevel, RegionData);
    } else if (levelTogo === level.toLevel3) {
      objectValueNextLevel = HandleAreaSearchModal.valueOfPropertyInObjectWithAPropertyHasValue(
        dataList,
        'PrefectureName',
        clickedLabelText,
        'city',
      );
      objectValueWard = HandleAreaSearchModal.valueOfPropertyInObjectWithAPropertyHasValue(
        dataList,
        'PrefectureName',
        clickedLabelText,
        'cityWithWard',
      );
      prefectureCode = clickedLabel ? clickedLabel.dataset.objectPrefectureId : '';
      HandleAreaSearchModal.appendHTMLContent(levelTogo, clickedLabelText, objectValueNextLevel, objectValueWard);
      HandleAreaSearchModal.handleClickCheckboxOnLastLevel(RegionData.CitySearchUrl);
    }
  },
  valueOfPropertyInObjectWithAPropertyHasValue: (theBigArray, givenkey, givenValue, returnKey) => {
    for (let i = 0; i < theBigArray.length; i++) {
      if (theBigArray[i][givenkey] === givenValue) {
        return theBigArray[i][returnKey];
      }
    }
  },
  handleClickCheckboxOnLastLevel: (url) => {
    const checkallInput = searchAreaModalContent.querySelector('.modal--search__content__all-districts input[type="checkbox"]');
    const allCheckBoxs = searchAreaModalContent.querySelectorAll('ul input[type="checkbox"]');
    HandleAreaSearchModal.handleCheckAll(url);
    [].forEach.call(allCheckBoxs, (eachCheckBox) => {
      eachCheckBox.addEventListener('click', () => {
        if (HandleAreaSearchModal.isCheckAtLeastOne()) {
          seachAreaContainer.classList.add('is-checked-done');
          HandleAreaSearchModal.changeUrlSearchSubmitBtn(url);
        } else {
          HandleAreaSearchModal.removeUrlSubmitBtn();
          seachAreaContainer.classList.remove('is-checked-done');
        }
        if (HandleAreaSearchModal.isCheckedAll()) {
          checkallInput.checked = true;
          seachAreaContainer.classList.add('is-checked-done');
        } else {
          checkallInput.checked = false;
        }
      });
    });
  },
  handleCheckAll: (url) => {
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
        if (HandleAreaSearchModal.isCheckAtLeastOne()) {
          seachAreaContainer.classList.add('is-checked-done');
          HandleAreaSearchModal.changeUrlSearchSubmitBtn(url);
        } else {
          seachAreaContainer.classList.remove('is-checked-done');
          HandleAreaSearchModal.removeUrlSubmitBtn();
        }
      });
    });
  },
  removeUrlSubmitBtn: () => {
    const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
    submitBtn.href = '';
  },
  changeUrlSearchSubmitBtn: (url) => {
    const submitBtn = document.querySelector('#areaSearchModal .modal--search__submit-btn');
    const allCheckedInputs = document.querySelectorAll('#areaSearchModal input[type="checkbox"]:not(#area-search-result-all):checked');
    let checkAllUrl = '';
    const codeList = [];
    if (HandleAreaSearchModal.isCheckedAll()) {
      checkAllUrl = url.replace('City', 'Prefecture');
      codeList.push(prefectureCode);
    } else {
      checkAllUrl = url;
      for (let i = 0; i < allCheckedInputs.length; i++) {
        codeList.push(allCheckedInputs[i].dataset.objectCode);
      }
    }
    submitBtn.href = checkAllUrl + codeList.join('+');
  },
  changeContainerClassAndAttrs: (levelTogo, prefId = '') => {
    let additionClass = '';
    if (levelTogo === level.toLevel1) {
      additionClass = 'level1';
    } else if (levelTogo === level.toLevel2) {
      additionClass = 'level2';
    } else if (levelTogo === level.toLevel3) {
      additionClass = 'level3';
      seachAreaContainer.dataset.prefId = prefId;
    }
    seachAreaContainer.classList.remove('is-still-loading');
    seachAreaContainer.classList.add(`is-${additionClass}`);
  },
  toLevel: (levelTogo, clickedLabel, dataList, RegionData = {}) => {
    if (levelTogo === level.toLevel1 || levelTogo === level.toLevel2) {
      HandleAreaSearchModal.changeContainerClassAndAttrs(levelTogo);
    } else if (levelTogo === level.toLevel3) {
      HandleAreaSearchModal.changeContainerClassAndAttrs(levelTogo, clickedLabel.dataset.objectId);
    }
    HandleAreaSearchModal.handleLevel(levelTogo, clickedLabel, dataList, RegionData);
  },
  bindClickButtonToNextLevel: (levelTogo, dataList = {}, RegionData) => {
    const allLabelButtons = searchAreaModalContent.querySelectorAll('.modal--search__content__list label');
    [].forEach.call(allLabelButtons, (eachLabel) => {
      eachLabel.addEventListener('click', () => {
        HandleAreaSearchModal.toLevel(levelTogo, eachLabel, dataList, RegionData);
      });
    });
  },
};

export default HandleAreaSearchModal;
