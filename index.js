const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");

class NikoQ {
  constructor() {
    this.mainWindow = null;
  }

  init() {
    this.initApp();
    this.initIPC();
  }

  initApp() {
    app.on("ready", () => {
      this.createNikoQWindow();
    });
    app.on("activate", () => {
      if (this.mainWindow == null) {
        this.createNikoQWindow();
      } else {
        this.mainWindow.show();
      }
    });
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
  }

  initIPC() {
    ipcMain.handle("invoke-test", (event, message) => {
      // message には 呼び出し元からのデータ ('ping') が入っている
      console.log(message);
      // renderer プロセスにデータを返す
      return "pong";
    });
  }

  createNikoQWindow() {
    this.mainWindow = new NikoQWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
  }
}

new NikoQ().init();
