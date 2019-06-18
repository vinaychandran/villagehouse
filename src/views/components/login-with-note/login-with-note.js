
const LoginWithNote = {
    calendar: (el, inc, desc) => {
      if($(el).length) {
        let increaseBtn = $(el).parent().find(inc),
            decreaseBtn = $(el).parent().find(desc),
            firstValue = $(el).find('option').first().attr('value'),
            lastValue = $(el).find('option').last().attr('value');
            
        if(firstValue === '') {
            firstValue = $(el).find('option').eq(1).attr('value')
        }   
        if(increaseBtn.length) {
            increaseBtn.click(() => {
                let currentValue = $(el).val();
            lastValue = $(el).find('option').last().attr('value');
                if(currentValue === '' || currentValue === lastValue)
                    return;    
                let option = $(el).find('option[value="'+currentValue+'"]');
                $(el).val(option.next().attr('value'));
            });
        } 
        if(decreaseBtn.length) {
            decreaseBtn.click(() => {
                let currentValue = $(el).val();
                if(currentValue === '' || currentValue === firstValue)
                    return;
                let option = $(el).find('option[value="'+currentValue+'"]');
                $(el).val(option.prev().attr('value'));  
            });
        }       
      }
    },
    applyCalendar: () => {
        LoginWithNote.calendar('.calendar-date','.increase','.decrease');
        LoginWithNote.calendar('.calendar-month','.increase','.decrease');
        LoginWithNote.calendar('.calendar-year','.increase','.decrease');
    }
};

export default LoginWithNote;