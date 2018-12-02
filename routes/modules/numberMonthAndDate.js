
var numberMonthAndDate = function(astring) {
    var date, month, year;
    var date1, month1;

    month = astring.split("/")[0];
    date = astring.split("/")[1];
    year = parseInt(astring.split("/")[2], 10);
    if (date.split("")[0] === '0') {
        date1 = parseInt(date.split("")[1], 10);
    } else {
        date1 = parseInt(date);
    }
    switch (month) {
        case '01':
            month1 = 1;
            break;
        case '02':
            month1 = 2;
            break;
        case '03':
            month1 = 3;
            break;
        case '04':
            month1 = 4;
            break;
        case '05':
            month1 = 5;
            break;
        case '06':
            month1 = 6;
            break;
        case '07':
            month1 = 7;
            break;
        case '08':
            month1 = 8;
            break;
        case '09':
            month1 = 9;
            break;
        case '10':
            month1 = 10;
            break;
        case '11':
            month1 = 11;
            break;
        case '12':
            month1 = 12;
    }
    return {month1: month1, date1: date1, year1: year};
}

module.exports = {numberMonthAndDate};