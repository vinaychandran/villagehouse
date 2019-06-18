/* eslint-disable prefer-destructuring */
const breakpoint = {
  sm: 768,
};
const paddingTopInitStickyLocation = window.innerWidth < breakpoint.sm ? 10 : 15;
const SiblingBarHeader = {
  stickySiblingBarHeader: () => {
    const siblingWrapper = document.querySelector('.sibling-header');
    const siblingStickyHeader = document.querySelector('.sibling-header__sticky-header');
    const stickyLocation = document.querySelector('.sibling-header .sibling-header__sticky-location');
    if (siblingStickyHeader) {
      if (window.pageYOffset + siblingStickyHeader.offsetHeight - paddingTopInitStickyLocation >= siblingWrapper.offsetTop) {
        if (!siblingStickyHeader.classList.contains('is-sticky')) {
          siblingStickyHeader.classList.add('is-sticky');
          stickyLocation.style.paddingTop = `${siblingStickyHeader.offsetHeight + paddingTopInitStickyLocation}px`;
        }
      } else {
        siblingStickyHeader.classList.remove('is-sticky');
        stickyLocation.style.paddingTop = `${paddingTopInitStickyLocation}px`;
      }
    }
  },
};

export default SiblingBarHeader;
