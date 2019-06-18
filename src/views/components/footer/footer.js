import { Validation } from '../../../assets/scripts/bunnyjs/Validation';

// const scheduleCallBackForm = document.forms['#scheduleCallBackForm'];
const scheduleCallBackForm = document.querySelector('form[name="scheduleCallBackForm"]');
const Footer = {
  initScheduleCallbackForm: () => {
    Validation.validateSection(scheduleCallBackForm).then((result) => {
      if (result === true) {
        // scheduleCallBackForm.submit();
      } else {
        // section invalid, result is array of invalid inputs
        result[0].focus();
      }
    });
  },
  submitFormScheduleCallback: () => {
    const submitBtn = document.querySelector('#modalCallBackForm .modal--btn-submit');
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault();
      Footer.initScheduleCallbackForm(e);
    });
  },
};
export default Footer;
