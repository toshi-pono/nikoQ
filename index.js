const { app } = require("electron");
const traqTimelineWindow = require("./main/createWindow");

class TraQTimeLine {
  constructor() {
    this.mainWindow = null;
  }

  init() {
    this.initApp();
    this.initIPC();
  }

  initApp() {
    app.on("ready", () => {
      this.createTraqWindow();
    });
    app.on("activate", () => {
      if (this.mainWindow == null) {
        this.createTraqWindow();
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

  createTraqWindow() {
    this.mainWindow = new traqTimelineWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
  }
}

new TraQTimeLine().init();
