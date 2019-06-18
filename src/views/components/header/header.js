const Header = {
  toggleLanguageDropDownDesktop: () => {
    const languageBtn = document.querySelector('#dropdownLanguageBtn');
    const languageList = document.querySelector('#dropdownLanguageList');
    if (languageBtn && languageList) {
      languageBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        languageList.classList.toggle('open-language');
      });
      document.querySelector('body').addEventListener('click', () => {
        if (languageList.classList.contains('open-language')) languageList.classList.remove('open-language');
      });
    }
  },
  handleClickHamburgerOpenNav: () => {
    const hamburgerBtn = document.querySelector('.navigation button.navigation__hamburger-btn');
    const navMain = document.querySelector('.navigation nav');
    if (hamburgerBtn && navMain) {
      hamburgerBtn.addEventListener('click', (evt) => {
        evt.preventDefault();
        evt.stopPropagation();
        navMain.classList.add('nav__is-open');
        document.querySelector('body').classList.add('body__is__nav-open');
        document.querySelector('html').classList.add('body__is__nav-open');
      });
    }
  },
  handleClickCloseNav: () => {
    const closeNavs = document.querySelectorAll('.navigation .navigation__close-button button, .navigation__layout');
    const navMain = document.querySelector('.navigation nav');
    if (closeNavs && navMain) {
      [].forEach.call(closeNavs, (closeNav) => {
        closeNav.addEventListener('click', (evt) => {
          evt.preventDefault();
          evt.stopPropagation();
          navMain.classList.remove('nav__is-open');
          document.querySelector('body').classList.remove('body__is__nav-open');
          document.querySelector('html').classList.remove('body__is__nav-open');
        });
      });
    }
  },
};
export default Header;
