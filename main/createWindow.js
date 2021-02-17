const { BrowserWindow } = require("electron");
const path = require("path");

class NikoQWindow {
  constructor() {
    this.window = null;
    this.isShown = false;
    this.createWindow();
    this.setWindowEvent();
  }
  createWindow() {
    this.window = new BrowserWindow({
      title: "nikoQ",
      width: 800,
      height: 800,
      autoHideMenuBar: true,
      //fullscreen: true

      webPreferences: {
        // In Electron 12, the default will be changed to true.
        worldSafeExecuteJavaScript: true,
        // XSS対策としてnodeモジュールをレンダラープロセスで使えなくする
        nodeIntegration: false,
        //（Electron 11 から、デフォルト：falseが非推奨となった）
        contextIsolation: true,
        // レンダラープロセスに公開するAPIのファイル
        preload: path.resolve("./preload.js"),
      },
    });
    // ウィンドウ最大化
    // this.window.setSimpleFullScreen(true)
    // デベロッパーツール自動起動
    this.window.webContents.openDevTools();
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

module.exports = NikoQWindow;
