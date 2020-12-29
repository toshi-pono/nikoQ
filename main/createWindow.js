const { app, BrowserWindow } = require("electron");

class TraqTimelineWindow {
  constructor() {
    this.window = null;
    this.isShown = false;
    this.createWindow();
    this.setWindowEvent();
  }
  createWindow() {
    this.window = new BrowserWindow({
      width: 800,
      height: 800,
      autoHideMenuBar: true,
      //fullscreen: true
    });
    // ウィンドウ最大化
    // this.window.setSimpleFullScreen(true)
    // デベロッパーツール自動起動
    // this.window.webContents.openDevTools();
  }
  loadFile(url) {
    this.window.loadURL(url);
  }

  hide() {
    this.window.hide();
    this.isShown = false;
  }
  show() {
    this.window.show();
    // this.window.focus();
    this.isShown = true;
  }
  setWindowEvent() {
    this.window.on("close", (e) => {
      if (this.window.isVisible()) {
        e.preventDefault();
        this.hide();
      }
    });
  }
}

module.exports = TraqTimelineWindow;
