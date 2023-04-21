function timestamp() {
    const date = new Date();
    const taipeiOffset = 8 * 60; // UTC+8
    const utcOffset = date.getTimezoneOffset();
    const taipeiTime = new Date(date.getTime() + (taipeiOffset + utcOffset) * 60 * 1000);
    return taipeiTime.toISOString().slice(0, 19).replace("T", " ");
}

function timeFormat(timestampString) {
    const timestamp = new Date(timestampString);

    const year = timestamp.getFullYear();
    const month = ("0" + (timestamp.getMonth() + 1)).slice(-2);
    const day = ("0" + timestamp.getDate()).slice(-2);
    const hours = ("0" + timestamp.getHours()).slice(-2);
    const minutes = ("0" + timestamp.getMinutes()).slice(-2);
    const seconds = ("0" + timestamp.getSeconds()).slice(-2);

    const formattedTimestamp = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    return formattedTimestamp; // Output: "2023-04-20 18:43:54"
}

function timestampWithDaysOffset(daysOffset) {
    const date = new Date();
    const taipeiOffset = 8 * 60; // UTC+8
    const utcOffset = date.getTimezoneOffset();
    const taipeiTime = new Date(date.getTime() + (taipeiOffset + utcOffset) * 60 * 1000);

    // 添加或减去指定的天数
    const daysInMilliseconds = daysOffset * 24 * 60 * 60 * 1000;
    const newTaipeiTime = new Date(taipeiTime.getTime() + daysInMilliseconds);

    return newTaipeiTime.toISOString().slice(0, 19).replace("T", " ");
}

export { timestamp, timeFormat, timestampWithDaysOffset };
