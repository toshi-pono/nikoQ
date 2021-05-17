const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("nikoQ", {
  changeStatus: (status) => {
    ipcRenderer.send("change-LoginStatus", status);
  },
});
