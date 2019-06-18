import { Validation } from '../../../assets/scripts/bunnyjs/Validation';

const loginForm = document.querySelector('form[name="loginForm"]');
const loginFormModal = {
  initLoginForm: () => {
    Validation.validateSection(loginForm).then((result) => {
      if (result === true) {
        // validation done
      } else {
        // section invalid, result is array of invalid inputs
        result[0].focus();
      }
    });
  },
  submitLoginForm: () => {
    if (loginForm) {
      const submitBtn = document.querySelector('#modalLogin .modal--btn-login');
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        loginFormModal.initLoginForm(e);
      });
    }
  },
};

export default loginFormModal;
