function getTime(time) {
    let timeStr = String(time);
    return getDay(timeStr) + ' ' + getDate(timeStr);
}

function getDay(time) {
    let dayShort = time.substring(0, 3);
    switch (dayShort) {
        case 'Mon': return 'Poniedziałek';
        case 'Tue': return 'Wtorek';
        case 'Wed': return 'Środa';
        case 'Thu': return 'Czwartek';
        case 'Fri': return 'Piątek';
        case 'Sat': return 'Sobota';
        case 'Sun': return 'Niedziela';
        default: return 'Błąd';
    }
}

function getDate(time) {
    let day = time.substring(8, 10);
    let month = time.substring(4, 7);
    let year = time.substring(11, 15);
    switch (month) {
        case 'Jan': return year + '-01-' + day;
        case 'Feb': return year + '-02-' + day;
        case 'Mar': return year + '-03-' + day;
        case 'Apr': return year + '-04-' + day;
        case 'May': return year + '-05-' + day;
        case 'Jun': return year + '-06-' + day;
        case 'Jul': return year + '-07-' + day;
        case 'Aug': return year + '-08-' + day;
        case 'Sep': return year + '-09-' + day;
        case 'Oct': return year + '-10-' + day;
        case 'Nov': return year + '-11-' + day;
        case 'Dec': return year + '-12-' + day;
        default: return 'Błąd';
    }
}

module.exports = { getTime, getDate };