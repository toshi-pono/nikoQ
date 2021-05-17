const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nikoQ", {
  login: (username, password) => {
    ipcRenderer.send("login", username, password);
  },
  loginStatus: (listener) => {
    ipcRenderer.on("login-status", (event, state) => listener(state));
  },
  changeStatus: (status) => {
    ipcRenderer.send("change-LoginStatus", status);
  },
});
