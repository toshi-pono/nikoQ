const { app } = require("electron");
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

  initIPC() {}

  createNikoQWindow() {
    this.mainWindow = new NikoQWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
  }
}

new NikoQ().init();
