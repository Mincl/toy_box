/* Korean initialisation for the jQuery calendar extension. */
/* Written by DaeKwon Kang (ncrash.dk@gmail.com). */
jQuery(function($){
	$.datepicker.regional['en'] = {
			dateFormat: 'yy.mm.dd',
			};
	$.datepicker.setDefaults($.datepicker.regional['en']);

	$.timeEntry.regional['en'] = {
		appendText: '',
		showSeconds: true,
		show24Hours: true,
		spinnerImage: null,
		useMouseWheel: false
	};
	$.timeEntry.setDefaults($.timeEntry.regional['en']);
});

$.validator.addMethod("phoneNumberList", function(value, element) {
    var phoneRegExp = new RegExp(/^01[016789][0-9]{7,8}$/);
    var items =  value.replace(/-/g, "").trim().split("\n");
    var message = "";
    var result = false;
    var error = 0;
    for(var i=0; i < items.length; i++) {
        if (phoneRegExp.test(items[i]) == false){
            if(message.length == 0){
                message = items[i];
            }
            error++;
        }else{
            result = true;
        }
    }
    if(error==0 && result == true){
        result = true;
    }
    else{
        result = false;
    }
    return this.optional(element) || result;
}, 'Invalid phone number list');

$.validator.addMethod("phoneNumber", function(value, element) {
    return this.optional(element) || /[\d-]+$/.test(value);
}, 'Invalid phone number');

$.validator.addMethod("dateAfter", function(value, element, param) {
    var ret = this.optional(element);
    if(typeof param == "string") {
        var vs = value.match(/(\d+)/g);
        var ps = ($(param).val()).match(/(\d+)/g);
        ret |= (new Date(vs[0], vs[1]-1, vs[2]) >= new Date(ps[0], ps[1]-1, ps[2]));
    } else if(param[0]) {
        var vs = value.match(/(\d+)/g);
        var ps = ($(param[0]).val()).match(/(\d+)/g);
        ret |= (new Date(vs[0], vs[1]-1, vs[2], vs[3], vs[4], vs[5]) >= new Date(ps[0], ps[1]-1, ps[2], ps[3], ps[4], ps[5]));
        if(param[1]) {
            ret |= !this.depend(param[1], element);
        }
    }
    return ret;
}, 'Invalid date');

$.validator.addMethod("maxDate", function(value, element, maxDate) {
    var inputTime = new Date(value).getTime();
    inputTime -= (inputTime%60000);
    var maxTime = typeof maxDate == "Date" ? maxDate.getTime() : new Date(maxDate).getTime();
    maxTime -= (maxTime%60000);

    return (inputTime <= maxTime);
}, 'Invalid date');

$.validator.addMethod("minDate", function(value, element, minDate) {
    var inputTime = new Date(value).getTime();
    inputTime -= (inputTime%60000);
    var minTime = typeof minDate == "Date" ? minDate.getTime() : new Date(minDate).getTime();
    minTime -= (minTime%60000);

    return (inputTime >= minTime);
}, 'Invalid date');
