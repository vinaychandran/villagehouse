import MapComponent from '../map-component/map-component';

const filterDropdownElm = document.querySelector('section.filter-dropdown');
const roomTypeArr = [];
const roomSizeArr = [];
const roomRentArr = [];
const roomOptionArr = {
  Elevator: false,
  Parking: false,
  Pet: false,
  Available: false,
  CombineCondition: true,
};

const searchResultDropDownFilter = {
  toggleDropdownFilter: () => {
    const allFilterBtnElms = filterDropdownElm.querySelectorAll('button.filter-dropdown__btn');
    [].forEach.call(allFilterBtnElms, (filterBtnElm) => {
      filterBtnElm.addEventListener('click', (evt) => {
        evt.stopPropagation();
        const filterDropdownWrapperElm = filterBtnElm.parentElement;
        // remove open-dropdown class on all wrappers
        document.querySelectorAll('.filter-dropdown__wrapper').forEach((eachFilterDropdown) => {
          if (eachFilterDropdown !== filterDropdownWrapperElm) {
            eachFilterDropdown.classList.remove('open-dropdown');
          }
        });
        // add to current
        return filterDropdownWrapperElm.classList.contains('open-dropdown') ? filterDropdownWrapperElm.classList.remove('open-dropdown') : filterDropdownWrapperElm.classList.add('open-dropdown');
      });
    });
    document.querySelectorAll('.filter-dropdown__wrapper ul').forEach((eachUl) => {
      eachUl.addEventListener('click', evt => evt.stopPropagation());
    });
    document.querySelector('body').addEventListener('click', () => document.querySelectorAll('.filter-dropdown__wrapper').forEach(eachFilterDropdown => eachFilterDropdown.classList.remove('open-dropdown')));
    document.querySelectorAll('.filter-dropdown__wrapper ul').forEach(ulElm => searchResultDropDownFilter.checkDropDownHasValue(ulElm));
  },
  checkDropDownHasValue: (ulElm) => {
    const wrapper = ulElm.parentElement;
    const allBtns = ulElm.querySelectorAll('input');
    allBtns.forEach((eachButton) => {
      eachButton.addEventListener('click', (evt) => {
        if (searchResultDropDownFilter.isHasValue(ulElm)) {
          wrapper.classList.add('has-value');
          if (ulElm.id === 'filterDropdownOptionsList') {
            searchResultDropDownFilter.changeTextOptions(ulElm);
          }
        } else {
          wrapper.classList.remove('has-value');
          if (ulElm.id === 'filterDropdownOptionsList') {
            searchResultDropDownFilter.changeTextOptions(ulElm);
          }
        }
      });
    });
  },
  changeTextOptions: (ulElm) => {
    const optionsButton = document.querySelector('#filterDropdownOptionsBtn');
    const optionText = document.querySelector('#optionText');
    const optionMultipleText = document.querySelector('#optionMultipleText');
    if (searchResultDropDownFilter.isHasOneValue(ulElm)) {
      const currentCheckedInput = ulElm.querySelector('input[type="checkbox"]:checked');
      optionsButton.innerHTML = `${currentCheckedInput.dataset.value}<span class="icon-arrow"></span>`;
    } else if (searchResultDropDownFilter.isHasMultipleValue(ulElm)) {
      optionsButton.innerHTML = `${optionMultipleText.value}<span class="icon-arrow"></span>`;
    } else {
      optionsButton.innerHTML = `${optionText.value}<span class="icon-arrow"></span>`;
    }
  },
  checkAllDropdown: () => {
    const allCheckAllBtnElm = document.querySelectorAll('.filter-dropdown__wrapper a');
    allCheckAllBtnElm.forEach((eachCheckAllBtn) => {
      eachCheckAllBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        const ulElm = eachCheckAllBtn.parentElement.parentElement;
        const allInput = ulElm.querySelectorAll('input[type="checkbox"]');
        if (searchResultDropDownFilter.isCheckAll(ulElm)) {
          ulElm.parentElement.classList.remove('has-value');
          allInput.forEach((eachInput) => {
            eachInput.checked = false;
            searchResultDropDownFilter.fillDataToFilterArray(eachInput);
          });
          if (ulElm.id === 'filterDropdownOptionsList') {
            searchResultDropDownFilter.changeTextOptions(ulElm);
          }

          searchResultDropDownFilter.storeCondtionForSearch();
        } else {
          ulElm.parentElement.classList.add('has-value');
          allInput.forEach((eachInput) => {
            eachInput.checked = true;
            searchResultDropDownFilter.fillDataToFilterArray(eachInput);
          });
          if (ulElm.id === 'filterDropdownOptionsList') {
            searchResultDropDownFilter.changeTextOptions(ulElm);
          }

          searchResultDropDownFilter.storeCondtionForSearch();
        }
      });
    });
  },
  isCheckAll: (ulElm) => {
    const allInputs = ulElm.querySelectorAll('input[type="checkbox"]');
    let numberOfCheckedInput = 0;
    allInputs.forEach((eachInput) => {
      if (eachInput.checked === true) {
        numberOfCheckedInput += 1;
      }
    });
    return allInputs.length === numberOfCheckedInput;
  },
  isHasValue: (ulElm) => {
    const allInputs = ulElm.querySelectorAll('input[type="checkbox"]');
    let numberOfCheckedInput = 0;
    allInputs.forEach((eachInput) => {
      if (eachInput.checked === true) {
        numberOfCheckedInput += 1;
      }
      searchResultDropDownFilter.fillDataToFilterArray(eachInput);
    });
    searchResultDropDownFilter.storeCondtionForSearch();

    return numberOfCheckedInput > 0;
  },
  numberOfCheckedInput: (ulElm) => {
    const allInputs = ulElm.querySelectorAll('input[type="checkbox"]');
    let numberOfCheckedInput = 0;
    allInputs.forEach((eachInput) => {
      if (eachInput.checked === true) {
        numberOfCheckedInput += 1;
      }
    });
    return numberOfCheckedInput;
  },
  isHasOneValue: (ulElm) => {
    const numberOfCheckedInput = searchResultDropDownFilter.numberOfCheckedInput(ulElm);
    return numberOfCheckedInput === 1;
  },
  isHasMultipleValue: (ulElm) => {
    const numberOfCheckedInput = searchResultDropDownFilter.numberOfCheckedInput(ulElm);
    return numberOfCheckedInput > 1;
  },
  fillDataToFilterArray: (eachInput) => {
    if (eachInput.checked === true) {
      switch (eachInput.dataset.checkboxType) {
        case 'roomTypes':
          if (roomTypeArr.indexOf(eachInput.dataset.value) === -1) {
            roomTypeArr.push(eachInput.dataset.value);
          }
          break;
        case 'roomSizes':
          if (roomSizeArr.indexOf(eachInput.dataset.value) === -1) {
            roomSizeArr.push(eachInput.dataset.value);
          }
          break;
        case 'roomPrices':
          if (roomRentArr.indexOf(eachInput.dataset.value) === -1) {
            roomRentArr.push(eachInput.dataset.value);
          }
          break;
        default:
          break;
      }
    } else {
      switch (eachInput.dataset.checkboxType) {
        case 'roomTypes':
          if (roomTypeArr.indexOf(eachInput.dataset.value) > -1) {
            roomTypeArr.splice(roomTypeArr.indexOf(eachInput.dataset.value), 1);
          }
          break;
        case 'roomSizes':
          if (roomSizeArr.indexOf(eachInput.dataset.value) > -1) {
            roomSizeArr.splice(roomSizeArr.indexOf(eachInput.dataset.value), 1);
          }
          break;
        case 'roomPrices':
          if (roomRentArr.indexOf(eachInput.dataset.value) > -1) {
            roomRentArr.splice(roomRentArr.indexOf(eachInput.dataset.value), 1);
          }
          break;
        default:
          break;
      }
    }
    roomOptionArr.Elevator = document.querySelector('input[type="checkbox"][name="optionElevator"]').checked;
    roomOptionArr.Parking = document.querySelector('input[type="checkbox"][name="optionsParking"]').checked;
    roomOptionArr.Pet = document.querySelector('input[type="checkbox"][name="optionsPet"]').checked;
    roomOptionArr.Available = document.querySelector('input[type="checkbox"][name="optionsAvailable"]').checked;
  },

  storeCondtionForSearch: () => {
    const searchCondition = JSON.parse(localStorage.getItem('SearchCondition'));
    searchCondition.roomTypes = roomTypeArr;
    searchCondition.roomSizes = roomSizeArr;
    searchCondition.roomPrices = roomRentArr;
    searchCondition.roomOptionArr = roomOptionArr;
    localStorage.setItem('SearchCondition', JSON.stringify(searchCondition));

    MapComponent.reInitGoogleMap(searchCondition);
  },
};

export default searchResultDropDownFilter;
