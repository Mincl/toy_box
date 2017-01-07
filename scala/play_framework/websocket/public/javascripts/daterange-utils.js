function setCalendar(startAt, endAt, pickerObj, target) {
    var startAtStr = dateSep(startAt, '.');
    var endAtStr = dateSep(endAt, '.');
    target.html(startAtStr + ' - ' + endAtStr);
    pickerObj.setStartDate(startAtStr);
    pickerObj.setEndDate(endAtStr);
}

function dateSep(date, sep) {
    return date.getFullYear() + sep + paddingNum(date.getMonth() + 1) + sep + paddingNum(date.getDate());
    function paddingNum(num) {
        if(num >= 10)
            return num;
        return "0"+num;
    }
}

function cloneDateToYmd(momentDate) {
  return new Date(momentDate._d.getFullYear(), momentDate._d.getMonth(), momentDate._d.getDate())
}

function rangePickerOptions() {
    return {
        startDate: moment().subtract('days', 29),
        endDate: moment(),
        minDate: '2012.01.01',
        buttonClasses: 'bn',
        applyClass: 'bn_type2 em',
        cancelClass: 'bn_type2',
        format: 'YYYY.MM.DD',
        locale: {
          applyLabel: '적용',
          cancelLabel: '취소',
          fromLabel: '',
          toLabel: '',
          daysOfWeek: ['일', '월', '화', '수', '목', '금', '토'],
          monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
          firstDay: 1
        }
      };
}
