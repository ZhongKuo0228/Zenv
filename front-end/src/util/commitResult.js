export function commitPLpage() {
    //使用者關閉頁面後
    window.onbeforeunload = function () {
        const data = localStorage.getItem("code");
        console.log("saveData", data);

        // 发送数据到后台
        fetch("http://localhost:3001/api/1.0/PLcode/save", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: data }),
        });
    };
}
