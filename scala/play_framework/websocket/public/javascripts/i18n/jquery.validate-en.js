$.validator.addMethod("minPrice", function(value, element, minPrice) {
  return parseInt(value.replace(/,/g, "")) >= minPrice;
}, 'Please insert bigger than {0}');

$.validator.addMethod("maxPrice", function(value, element, maxPrice) {
  return parseInt(value.replace(/,/g, "")) <= maxPrice;
}, 'Please insert smaller than {0}');

$.validator.addMethod("phoneNumberList", function(value, element) {
	var phoneRegExp = new RegExp(/^01[016789][0-9]{7,8}$/);
	var items =  value.replace(/-/g, "").trim().split("\n");
	var message = "";
	var result = false;
	var error = 0;
	for(var i=0; i < items.length; i++) {
		if (phoneRegExp.test(items[i].trim()) == false){
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
}, 'Please insert valid phone number.');

$.validator.addMethod("phoneNumber", function(value, element) {
	return this.optional(element) || /[\d-]+$/.test(value);
}, 'Please insert valid phone number.');

$.validator.addMethod("dateAfter", function(value, element, param) {
	var ret = this.optional(element);
	if(typeof param=="string") {
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
}, 'Start time has to be set earlier than end time.');

var SECONDS_PER_DAY = 24*60*60*1000;
var SECONDS_PER_HOUR = 60*60*1000;
var SECONDS_PER_MINUTE = 60*1000;

$.validator.addMethod("maxDate", function(value, element, _maxDate) {
    var inputDate = value.length == 13 ? Date.parseDate(value.substr(0, 10), 'Y-m-d').setHours(parseInt(value.substr(11, 2))) : Date.parseDate(value.substr(0, 10), 'Y-m-d');
    var maxDate = typeof _maxDate == "Date" ? _maxDate : new Date(_maxDate);

    if(value.length == 10) { // yyyy-MM-dd or yyyy/MM/dd
        maxDate.setHours(0);
        maxDate.setMinutes(0);
        maxDate.setSeconds(0);
        maxDate.setMilliseconds(0);

    } else if(value.length == 13) { // yyyy-MM-dd HH
        maxDate.setMinutes(0);
        maxDate.setSeconds(0);
        maxDate.setMilliseconds(0);

    } else { // yyyy-MM-dd HH:mm
        maxDate.setSeconds(0);
        maxDate.setMilliseconds(0);
    }

    return (inputDate.getTime() <= maxDate.getTime());
}, 'Invalid date');

$.validator.addMethod("minDate", function(value, element, _minDate) {
    var inputDate = value.length == 13 ? Date.parseDate(value.substr(0, 10), 'Y-m-d').setHours(parseInt(value.substr(11, 2))) : Date.parseDate(value.substr(0, 10), 'Y-m-d');
    var minDate = typeof _minDate == "Date" ? _minDate : new Date(_minDate);

    if(value.length == 10) { // yyyy-MM-dd or yyyy/MM/dd
        minDate.setHours(0);
        minDate.setMinutes(0);
        minDate.setSeconds(0);
        minDate.setMilliseconds(0);

    } else if(value.length == 13) { // yyyy-MM-dd HH
        minDate.setMinutes(0);
        minDate.setSeconds(0);
        minDate.setMilliseconds(0);

    } else { // yyyy-MM-dd HH:mm
        minDate.setSeconds(0);
        minDate.setMilliseconds(0);
    }

    return (inputDate.getTime() >= minDate.getTime());
}, 'Invalid date');

$.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "Must contain only letters, numbers");

$.validator.addMethod("regex", function(value, element, regexp) {
  var re = new RegExp(regexp);
  return this.optional(element) || re.test(value);
}, "Please check your input.");

jQuery.extend(jQuery.validator.messages, {
	url: "Please insert valid URL.",
	number: "Please insert only numbers.",
	maxlength: $.validator.format("Maximum number of characters are {0}."),
	max: $.validator.format("Please insert a smaller number than {0}."),
	min: $.validator.format("Please insert a larger number than {0}.")
});
