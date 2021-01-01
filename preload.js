const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nikoQ", {
  invokeTest: async () => {
    const data = await ipcRenderer.invoke("invoke-test", "ping");
    console.log(data);
    return data;
  },
  initWebSocket: () => {
    ipcRenderer.send("init-websocket");
  },
  displayMessage: (listener) => {
    ipcRenderer.on("display-message", (event, arg) => listener(arg));
  },
});
