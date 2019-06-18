import { Validation } from '../../../assets/scripts/bunnyjs/Validation';

const scheduleRequestForm = document.querySelector('form[name="scheduleRequestForm"]');
const modalRequestForm = {
  initScheduleRequestForm: () => {
    Validation.validateSection(scheduleRequestForm).then((result) => {
      if (result === true) {
        // scheduleRequestForm.submit();
      } else {
        // section invalid, result is array of invalid inputs
        result[0].focus();
      }
    });
  },
  submitFormScheduleRequest: () => {
    if (scheduleRequestForm) {
      const submitBtn = document.querySelector('#modalRequestForm .modal--btn-submit');
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault();
        modalRequestForm.initScheduleRequestForm(e);
      });
    }
  },
};

export default modalRequestForm;
