/**
 * Created by lenny on 14. 3. 21..
 */

function refinePhoneNumber(phoneNumber, msgDiv) {
    if (!phoneNumber.match(/^(01[016789])-{0,1}([0-9]{3,4})-{0,1}([0-9]{4})$/)) {
        var msg = "휴대폰 번호 형식이 올바르지 않습니다. 010-1234-5678 혹은 01012345678의 형태로 입력해 주세요.";
        $("#" + msgDiv).css("color", "#f00");
        $("#" + msgDiv).html(msg);
        $("#" + msgDiv).show();
        return null;
    }
    return phoneNumber.replace(/^(01[016789])-{0,1}([0-9]{3,4})-{0,1}([0-9]{4})$/, "$1-$2-$3");
}