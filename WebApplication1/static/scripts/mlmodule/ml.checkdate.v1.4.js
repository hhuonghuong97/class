Date.prototype.ddmmyyyy = function () {
    var mm = this.getMonth() + 1; // getMonth() is zero-based
    var dd = this.getDate();

    return [
        (dd > 9 ? '' : '0') + dd,
        (mm > 9 ? '' : '0') + mm, this.getFullYear()
    ].join('/');
};

String.prototype.getDateByString = String.prototype.getDateByString || function () {
    if(this.indexOf("/")!=-1){
        var parts = this.split("/");
    }else{
        var parts = this.split("-");
    }
    var bookingDate = new Date(parseInt(parts[2], 10),parseInt(parts[1], 10) - 1,parseInt(parts[0], 10));
    return bookingDate;
}
function getDayAndTime(day,time) {
    var parts = time.split(":");
    return new Date(day.getFullYear(),day.getMonth(),day.getDate(),parseInt(parts[0], 10),parseInt(parts[1], 10),0)
};
//time milisecond to date
String.prototype.toDateObject = String.prototype.toDateObject || function (splitDate) {
    try {
        if (splitDate) {
            if (splitDate == "/") {
                let dateParam = this.split(/[\s/:]/)
                dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
                return new Date(...dateParam)
            } else {
                if (splitDate == "-") {
                    let dateParam = this.split(/[\s-:]/)
                    dateParam[1] = (parseInt(dateParam[1], 10) - 1).toString()
                    return new Date(...dateParam)
                }
            }
        }
        var number = new Number(this);
        return new Date(this);
    } catch (e) {
        return new Date();
    }
}

//time milisecond to date
Number.prototype.toDateObject = String.prototype.toDateObject || function () {
    try {
        return new Date(this);
    } catch (e) {
        return new Date();
    }
}

Date.prototype.format = function (pattent) {
    var dd = /dd/g;
    var MM = /MM/g;
    var yyyy = /yyyy/g;
    var YYYY = /YYYY/g;
    var M = /M/g;
    var yy = /yy/g;
    var YY = /YY/g;
    var HH = /HH/g;
    var hh = /hh/g;
    var mm = /mm/g;
    var ss = /ss/g;
    var tt = /tt/g;


    var date = (this.getDate() > 9 ? "" : "0") + this.getDate();
    pattent = pattent.replace(dd, date);
    var month = this.getMonth() + 1; // getMonth() is zero-based
    month = (month > 9 ? "" : "0") + month;
    pattent = pattent.replace(MM, month);
    pattent = pattent.replace(M, month);
    var year = this.getFullYear();
    pattent = pattent.replace(YYYY, year);
    pattent = pattent.replace(yyyy, year);
    var _year = (year + "").substring(2);
    pattent = pattent.replace(yy, _year);
    pattent = pattent.replace(YY, _year);

    var hour = this.getHours();
    pattent = pattent.replace(hh, hour);
    hour = (hour > 9 ? "" : "0") + hour;
    pattent = pattent.replace(HH, hour);

    var minute = this.getMinutes();
    minute = (minute > 9 ? "" : "0") + minute;
    pattent = pattent.replace(mm, minute);

    var second= this.getSeconds();
    second = (second> 9 ? "" : "0") + second;
    pattent = pattent.replace(ss, second);

    var _tt = this.getHours()>12?"PM":"AM";
    pattent = pattent.replace(tt, _tt);
    return pattent;

};


Date.prototype.getAge = function () {
    var date = new Date();
    if (date.getFullYear() < this.getFullYear())
        return 0;
    if (date.getFullYear() === this.getFullYear())
        return 1;
    return date.getFullYear() - this.getFullYear();
};

(function ($) {
    jQuery.fn.extend({
        checkDate: function (o) {
            var selector = this.filter("input");
            var callback, maxdate, mindate;
            if (o != undefined) {
                callback = o.callback;
                maxdate = o.maxdate;
                mindate = o.minDate;
            }
            selector.on("blur", function () {
                fixDate($(this), callback, maxdate, mindate);
            });
            return this;
        }
    });

    jQuery.fn.extend({
        checkdate: jQuery.fn.checkDate
    });

})(jQuery);

function checkLeapYear(_day, _month, _year) {
    day = parseInt(_day);
    month = parseInt(_month);
    year = parseInt(_year);
    if ((year % 4 === 0 && year % 100 !== 0 && year % 400 !== 0) || (year % 100 === 0 && year % 400 === 0)) {
        if (month == 2 && month > 29)
            return false;
        return true;
    } else {
        if (month == 2 && day > 28)
            return false;
    }
    return true;
}
function fixDate(selector, callback, max_Date, min_Date) {
    try {
        if (selector.val().trim() === "")
            return;
        var text = selector.val().trim();
        var _date = new Date(text);
        var invalid = true;
        if (_date == "Invalid Date" || text.length <= 10) {
            var year = new Date().getFullYear();
            var date = "";
            if (text.length === 4) {
                selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" + year);
                return fixDate(selector, callback, max_Date, min_Date);
            } else if (text.length === 5) {
                selector.val(text[0] + text[1] + "/" + text[3] + text[4] + "/" + year);
                return fixDate(selector, callback, max_Date, min_Date);
            } else if (text.length === 6) {
                var year = new Date().getFullYear();
                if (parseInt(year.toString().substr(-2)) < parseInt(text[4] + text[5])) {
                    selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" + (parseInt(year.toString().substr(0, 2)) - 1) + text[4] + text[5]);
                    return fixDate(selector, callback, max_Date, min_Date);
                } else {
                    selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" + year.toString().substr(0, 2) + text[4] + text[5]);
                    return fixDate(selector, callback, max_Date, min_Date);
                }
            } else if (text.length === 8) {
                if (text.indexOf("/") != -1) {
                    selector.val(text.replace(/\//g, ''));
                    return fixDate(selector, callback, max_Date, min_Date);
                } else {
                    selector.val(text[0] + text[1] + "/" + text[2] + text[3] + "/" +
                        text[4] +
                        text[5] +
                        text[6] +
                        text[7]);

                    return fixDate(selector, callback, max_Date, min_Date);
                }
            } else if (text.length === 10) {
                invalid = checkLeapYear(text[0] +
                    text[1],
                    text[3] +
                    text[4],
                    text[6] +
                    text[7] +
                    text[8] +
                    text[9]);

                date = text[3] +
                    text[4] +
                    "/" +
                    text[0] +
                    text[1] +
                    "/" +
                    text[6] +
                    text[7] +
                    text[8] +
                    text[9];
            }
            else if (text.length === 7) {
                date = "";
            }

            else {
                var temp = text.split("/");
                selector.val(temp[0][0] + temp[0][1] + "/" + temp[1][0] + temp[1][1] + "/" +
                    temp[2][0] +
                    temp[2][1] +
                    temp[2][2] +
                    temp[2][3]);
                return fixDate(selector, callback, max_Date, min_Date);
            }

            var _date = new Date(date);
            if (_date == "Invalid Date" || !invalid) {
                selector.val("");
                alertSmallBox("Vui lòng nhập đúng định dạng ngày", error);
            } else {
                if (min_Date != undefined && _date < min_Date) {
                    selector.val("");
                    alertSmallBox("Vui lòng nhập ngày lớn hơn " + min_Date.ddmmyyyy(), error);
                    return;
                }
                if (max_Date != undefined && _date > max_Date) {
                    selector.val("");
                    alertSmallBox("Vui lòng nhập ngày nhỏ hơn " + max_Date.ddmmyyyy(), error);
                    return;
                }
                selector.val(_date.ddmmyyyy());
                if (callback != undefined)
                    callback();
            }
        } else {
            if (min_Date != undefined && _date < min_Date) {
                selector.val("");
                alertSmallBox("Vui lòng nhập ngày lớn hơn " + min_Date.ddmmyyyy(), error);
                return;
            }
            if (max_Date != undefined && _date > max_Date) {
                selector.val("");
                alertSmallBox("Vui lòng nhập ngày nhỏ hơn " + max_Date.ddmmyyyy(), error);
                return;
            }
            selector.val(_date.ddmmyyyy());
            if (callback != undefined)
                callback();
        }
    } catch (e) {
        selector.val("");
        alertSmallBox("THÔNG BÁO", "Vui lòng nhập đúng định dạng ngày ", "error");
    }
}
String.prototype.getPostTime = String.prototype.getPostTime || function () {
    try {
        var date10Day = 86400 * 10;
        var dateOneDay = 86400;
        var dateOneHour = 3600;
        var dateOneMinute = 60;
        var dateDayName = " ngày trước";
        var dateHourName = " giờ trước";
        var dateMinuteName = " phút trước";
        var dateJustNowName = " vừa xong";

        var _this = parseFloat(this + "");
        var time = "";
        var date = new Date();
        date.setTime(_this);
        var now = new Date().getTime();
        var totalTimeDiff = (now - _this) / 1000;
        if (totalTimeDiff > date10Day) {
            return date.format("dd-MM-yyyy HH:mm:ss");
        }
        if (totalTimeDiff > dateOneDay) {
            var day = parseInt((totalTimeDiff / dateOneDay) + "");
            return day + dateDayName;
        }
        if (totalTimeDiff > dateOneHour) {
            var hour = parseInt((totalTimeDiff / dateOneHour) + "");
            return hour + dateHourName;
        }
        if (totalTimeDiff > dateOneMinute) {
            var minute = parseInt((totalTimeDiff / dateOneMinute) + "");
            return minute + dateMinuteName;
        }
        else
            return dateJustNowName;
    } catch (e) {
        return "";
    }
}

Number.prototype.getPostTime = String.prototype.getPostTime || function () {
    return (this+"").getPostTime();
}