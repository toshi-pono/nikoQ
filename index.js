const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");
const AutoReconnectWebSocket = require("./main/websocket/websocket");
const setupApiEvent = require("./main/api/apiEvent");

// *** とりあえずテスト用 ***
const Cookie = require("./cookie");
const apis = require("./main/api/apis");
// ***********************

class NikoQ {
  constructor() {
    this.mainWindow = null;
    this.websocket = null;
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
    ipcMain.on("init-websocket", () => {
      this.setupWebsocket();
    });
    ipcMain.on("login", (event, username, password) => {
      // ログイン処理
    });
    ipcMain.on("logout", () => {
      // ログアウト処理
    });
    ipcMain.on("done-renderer-load", () => {
      // this.setupWebsocket();
      apis.test();
    });
  }

  setupWebsocket() {
    console.log("init-websocket");
    this.websocket = new AutoReconnectWebSocket("wss://q.trap.jp/api/v3/ws", {
      headers: {
        Cookie: "r_session=" + Cookie,
      },
    });
    this.websocket.connect();
  }

  // APIレスポンス後の処理を設定（renderへ送信する）
  // WARN: 画面が作り直されたとき
  setupApiEvent() {
    setupApiEvent(this.wc);
  }

  createNikoQWindow() {
    this.mainWindow = new NikoQWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
    this.setupApiEvent();
  }

  get wc() {
    return this.mainWindow.window.webContents;
  }
}

new NikoQ().init();
