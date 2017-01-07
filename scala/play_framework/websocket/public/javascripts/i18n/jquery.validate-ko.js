$.validator.addMethod("minPrice", function(value, element, minPrice) {
  return parseInt(value.replace(/,/g, "")) >= minPrice;
}, '입력가능한 최소 금액은 {0} 입니다.');

$.validator.addMethod("maxPrice", function(value, element, maxPrice) {
  return parseInt(value.replace(/,/g, "")) <= maxPrice;
}, '입력가능한 최대 금액은 {0} 입니다.');

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
}, '유효한 전화번호를 입력해 주세요.');

$.validator.addMethod("phoneNumber", function(value, element) {
	return this.optional(element) || /[\d-]+$/.test(value);
}, '유효한 전화번호를 입력해 주세요.');


$.validator.addMethod("noKakao", function(value, element) {
	return value.indexOf("카카오") == -1 && value.toLowerCase().indexOf("kakao") == -1 && value.indexOf("관리자") == -1;
}, '카카오, kakao, 관리자 등은 사용할 수 없습니다.');

$.validator.addMethod("uuidAt", function(value, element) {
	return this.optional(element) || value[0] == '@';
}, '옐로아이디는 \'@\'로 시작해야 합니다.');

$.validator.addMethod("uuidLength", function(value, element) {
	return this.optional(element) || value.length >= 3;
}, '옐로아이디가 너무 짧습니다.');

$.validator.addMethod("uuidRegex", function(value, element) {
	return this.optional(element) || /^@[-_가-힣0-9a-z]+$/.test(value)
}, '옐로아이디는 한글, 숫자, 영문 소문자를 이용해 주세요.');

$.validator.addMethod("uuidUnique", function(value, element) {
	if( value.length >= 3 && value.indexOf("카카오") == -1 && value.toLowerCase().indexOf("kakao") == -1 && value.indexOf("관리자") == -1 && /^@[-_가-힣0-9a-z]+$/.test(value) ) {
		var isUuidUnique = JSON.parse($.ajax({
			    type: "GET",
			    url: '/json/uuid/'+ value,
			    async: false
			}).responseText);
		return !isUuidUnique.data;
	} else return true;
}, '이미 사용중인 아이디입니다.');

$.validator.addMethod("nameRegex", function(value, element) {
	return this.optional(element) || !(/[^-가-힣0-9a-zA-Z\s_)(]/.test(value))
}, '이름은 한글, 영문 대소문자를 이용해 주세요.');

$.validator.addMethod("urlRegex", function(value, element) {
	return this.optional(element) || /https?:\/\/(www\.)?[-a-zA-Z0-9@@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@@:%_\+.~#?&//=]*)/.test(value)
}, '올바른 사이트 URL 형식이 아닙니다.');

$.validator.addMethod("phoneRegex", function(value, element) {
	if (this.optional(element)) {
		return true;
	}
	var input = value.replace(/-/gi,'');
	return /^1[0-9]{7}$/.test(input) || /^(01[016789]{1}|02|0[3-9]{1}[0-9]{1})[0-9]{7,8}$/.test(input)
}, '올바른 전화번호 형식이 아닙니다.');


$.validator.addMethod("dateAfter", function(value, element, param) {
  /*
  var afterTime = new Date(value.replace(/-/g, "/")).getTime();
	var ret = this.optional(element);
	if(typeof param == "string") {
		ret |= afterTime >= new Date($(param).val().replace(/-/g, "/")).getTime();

	} else if(param[0]) {
		ret |= afterTime >= new Date($(param[0]).val().replace(/-/g, "/")).getTime();
		if(param[1]) {
			ret |= !this.depend(param[1], element);
		}
	}
	return ret;
	*/
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
}, '종료시간은 시작시간보다 빠를 수 없습니다.');

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
}, '옳바른 날짜를 입력하세요.');

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
}, '옳바른 날짜를 입력하세요.');

$.validator.addMethod("alphanumeric", function(value, element) {
    return this.optional(element) || /^[a-zA-Z0-9]+$/.test(value);
}, "알파벳 혹은 숫자만 입력가능합니다.");

$.validator.addMethod("regex", function(value, element, regexp) {
  var re = new RegExp(regexp);
  return this.optional(element) || re.test(value);
}, "잘못된 포맷입니다.");

jQuery.extend(jQuery.validator.messages, {
	required: "필수입력 항목 입니다.",
	url: "유효한 URL을 입력해 주세요.",
  date: "올바른 날자를 입력해 주세요.",
	number: "숫자만 입력해 주세요.",
	maxlength: $.validator.format("최대 입력 가능한 글자는 {0}자 입니다."),
	max: $.validator.format("{0} 보다 작은 수를 입력해 주세요."),
	min: $.validator.format("{0} 보다 큰 수를 입력해 주세요.")
});
