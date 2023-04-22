function stopService(serverName) {
    console.log("服務關閉");
    // 在這裡關閉你的服務
    clearTimeout(timers[serverName]);
    delete timers[serverName];
}

function closeServer(serverName) {
    const timerId = serverName;
    timers[timerId] = setTimeout(() => {
        stopService(timerId);
    }, 30 * 60 * 1000); // 30 分鐘 = 30 * 60 * 1000 毫秒
}

function cancelTimer(serverName) {
    if (timers[serverName]) {
        clearTimeout(timers[serverName]);
        delete timers[serverName];
        console.log("計時器已取消:", serverName);
    } else {
        console.log("找不到計時器:", serverName);
    }
}
