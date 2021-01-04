const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nikoQ", {
  doneLoad: () => {
    ipcRenderer.send("done-renderer-load");
  },
  initWebSocket: () => {
    ipcRenderer.send("init-websocket");
  },
  displayMessage: (listener) => {
    ipcRenderer.on("display-message", (event, arg) => listener(arg));
  },
  login: (username, password) => {
    ipcRenderer.send("login", username, password);
  },
  loginStatus: (listener) => {
    ipcRenderer.on("login-status", (event, state) => listener(state));
  },
  logout: () => {
    ipcRenderer.send("logout");
  },
  logoutStatus: (listener) => {
    ipcRenderer.on("logout-status", (event, state) => listener(state));
  },
});
