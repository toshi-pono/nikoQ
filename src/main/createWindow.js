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
      hasShadow: false,
      width: 800,
      height: 800,
      autoHideMenuBar: true,
      // frame: false,
      // transparent: true,
      alwaysOnTop: true,

      webPreferences: {
        // In Electron 12, the default will be changed to true.
        worldSafeExecuteJavaScript: true,
        // XSS対策としてnodeモジュールをレンダラープロセスで使えなくする
        nodeIntegration: false,
        //（Electron 11 から、デフォルト：falseが非推奨となった）
        contextIsolation: true,
        // レンダラープロセスに公開するAPIのファイル
        preload: path.resolve(__dirname, "../message/preload.js"),
      },
    });
    // ウィンドウ最大化
    // this.window.setSimpleFullScreen(true);
    // this.window.setIgnoreMouseEvents(true);
    // デベロッパーツール
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
    // BUG:ここを消すか，windowがないときにWebsocketEventのメッセージを送らない処理をする必要がある
    this.window.on("close", (e) => {
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

module.exports = NikoQWindow;
