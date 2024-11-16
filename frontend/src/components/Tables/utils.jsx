let newDate = new Date();
export function getCurrentDate(separator = ".") {
    let date = newDate.getDate();
    let month = newDate.getMonth() + 1;
    let year = newDate.getFullYear();
    return `${date}${separator}${month < 10 ? `0${month}` : `${month}`
        }${separator}${year}`;
}

export function getCurrentTime(separator = ":"){
    var hours = newDate.getHours();
    var minutes = newDate.getMinutes();
    return `${hours}${separator}${minutes}`
}
