const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");
const AutoReconnectWebSocket = require("./main/websocket");

// *** とりあえずテスト用 ***
const Cookie = require("./cookie");
// ***********************

class NikoQ {
  constructor() {
    this.mainWindow = null;
    this.websocket = null;
    this.websocketEvent = null;
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
  }

  setupWebsocket() {
    console.log("init-websocket");
    this.websocket = new AutoReconnectWebSocket("wss://q.trap.jp/api/v3/ws", {
      headers: {
        Cookie: "r_session=" + Cookie,
      },
    });
    this.websocket.connect();
    this.websocket.on("message", async (data) => {
      // websocketからメッセージが届いたときの処理
    });
  }

  createNikoQWindow() {
    this.mainWindow = new NikoQWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
  }
}

new NikoQ().init();
