function timestamp() {
    const date = new Date();
    const taipeiOffset = 8 * 60; // UTC+8
    const utcOffset = date.getTimezoneOffset();
    const taipeiTime = new Date(date.getTime() + (taipeiOffset + utcOffset) * 60 * 1000);
    return taipeiTime.toISOString().slice(0, 19).replace("T", " ");
}

function showTime(timestamp) {
    return (cleanDateString = dateString.replace("T", " ").replace("Z", ""));
}

export { timestamp, showTime };
