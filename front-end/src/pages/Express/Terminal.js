// import React, { useEffect, useRef } from "react";
// import { Terminal } from "xterm";
// import { FitAddon } from "xterm-addon-fit";
// import { AttachAddon } from "xterm-addon-attach";
// import "xterm/css/xterm.css";

// const TerminalComponent = (props) => {
//     const terminalRef = useRef(null);
//     const terminalObj = useRef(null);
//     const fitAddon = useRef(null);

//     useEffect(() => {
//         terminalObj.current = new Terminal();
//         fitAddon.current = new FitAddon();

//         terminalObj.current.loadAddon(fitAddon.current);
//         terminalObj.current.open(terminalRef.current);
//         fitAddon.current.fit();

//         // 設置與後端終端互動的 WebSocket 連接
//         const socketUrl = "wss://your-websocket-url"; // 替換為您的 WebSocket URL
//         const socket = new WebSocket(socketUrl);
//         socket.onopen = () => {
//             const attachAddon = new AttachAddon(socket);
//             terminalObj.current.loadAddon(attachAddon);
//         };

//         return () => {
//             terminalObj.current.dispose();
//             socket.close();
//         };
//     }, []);

//     // 給終端機添加點擊事件，使其獲得焦點
//     const handleClick = () => {
//         terminalObj.current.focus();
//     };

//     return <div ref={terminalRef} onClick={handleClick} style={{ width: "100%", height: "100%" }} />;
// };

// export default TerminalComponent;
