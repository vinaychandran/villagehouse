const PropertyCard = {
  showTooltipWhenHoverDetail() {
    const allPropertyDetailBtns = document.querySelectorAll('.property-card__rooms__list__detail');
    if (allPropertyDetailBtns.length > 0) {
      [].forEach.call(allPropertyDetailBtns, (eachPropertyDetailBtn) => {
        eachPropertyDetailBtn.addEventListener('mouseover', () => {
          if (eachPropertyDetailBtn.querySelector('p')) {
            const tooltipPara = eachPropertyDetailBtn.querySelector('p').innerHTML;
            const offsetTop = eachPropertyDetailBtn.getBoundingClientRect().top;
            const offsetLeft = eachPropertyDetailBtn.getBoundingClientRect().left;
            // PropertyCard.createPropertyCardToolTip(tooltipPara, offsetTop, offsetLeft);
            // eachPropertyDetailBtn.addEventListener('mouseout', () => {
            //   PropertyCard.deletePropertyCardToolTip();
            // });
          }
        });
      });
    }
  },
  createPropertyCardToolTip(text, offsetTop, offsetLeft) {
    const appendedChild = document.createElement('div');
    appendedChild.className = 'property-card-toolip';
    appendedChild.innerHTML = `<p>${text}</p>`;
    appendedChild.style.top = `${offsetTop}px`;
    appendedChild.style.left = `${offsetLeft + 150}px`;

    document.body.appendChild(appendedChild);
  },
  handleWidthOfRoomDetail: () => {
    const allPropertyDetailBtns = document.querySelectorAll('.property-card__rooms__list__detail');
    if (allPropertyDetailBtns.length > 0) {
      const parentOfBtn = document.querySelector('.property-card__rooms__list__detail').parentElement.parentElement;
      const parentWidth = parentOfBtn.offsetWidth - parseFloat(getComputedStyle(parentOfBtn).paddingLeft) - 1;
      [].forEach.call(allPropertyDetailBtns, (eachPropertyDetailBtn) => {
        eachPropertyDetailBtn.style.width = `${parentWidth}px`;
      });
    }
  },
  deletePropertyCardToolTip() {
    document.body.removeChild(document.querySelector('.property-card-toolip'));
  },
  modifyScrollBarPropertyCard: (elem) => {
    const propertyUnitCellWrappers = document.querySelectorAll(elem);
    if (propertyUnitCellWrappers) {
      propertyUnitCellWrappers.forEach((propertyUnitCellWrapper) => {
        const instanceOverlayUnitCell = OverlayScrollbars(propertyUnitCellWrapper, {
          scrollbars: {
            visibility: 'hidden',
            autoHide: 'leave',
          },
        });
      });
    }
  },
};

export default PropertyCard;
