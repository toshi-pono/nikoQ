const { BrowserWindow } = require("electron");
const path = require("path");

class LoginWindow {
  constructor() {
    this.window = null;
    this.isShown = false;
    this.createWindow();
    this.setWindowEvent();
  }
  createWindow() {
    this.window = new BrowserWindow({
      title: "nikoQ-login",
      hasShadow: false,
      width: 400,
      height: 300,

      webPreferences: {
        worldSafeExecuteJavaScript: true,
        nodeIntegration: false,
        contextIsolation: true,
        preload: path.resolve(__dirname, "../login/loginPreload.js"),
      },
    });
    // デベロッパーツール自動起動
    this.window.webContents.openDevTools();
  }
  hide() {
    this.window.hide();
    this.isShown = false;
  }
  show() {
    this.window.show();
    this.window.focus();
    this.isShown = true;
  }
  loadFile(url) {
    this.window.loadURL(url);
  }
  setWindowEvent() {
    this.window.on("close", (e) => {
      // 場合によってはアプリケーションの終了処理が必要かも？
      // preventしないで，appの終了処理にしたほうが自然説がある
      if (this.window.isVisible()) {
        e.preventDefault();
        this.hide();
      }
    });
    this.window.webContents.on("will-navigate", (e, url) => {
      e.preventDefault();
    });
  }
}

module.exports = LoginWindow;
