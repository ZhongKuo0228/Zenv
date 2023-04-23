function timestamp() {
    const date = new Date();
    const taipeiOffset = 8 * 60; // UTC+8
    const utcOffset = date.getTimezoneOffset();
    const taipeiTime = new Date(date.getTime() + (taipeiOffset + utcOffset) * 60 * 1000);

    const year = taipeiTime.getFullYear();
    const month = String(taipeiTime.getMonth() + 1).padStart(2, "0");
    const day = String(taipeiTime.getDate()).padStart(2, "0");
    const hours = String(taipeiTime.getHours()).padStart(2, "0");
    const minutes = String(taipeiTime.getMinutes()).padStart(2, "0");
    const seconds = String(taipeiTime.getSeconds()).padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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

export { timestamp, timeFormat };
