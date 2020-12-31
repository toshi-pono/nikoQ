const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("apis", {
  invokeTest: async () => {
    const data = await ipcRenderer.invoke("invoke-test", "ping");
    console.log(data);
    return data;
  },
});
