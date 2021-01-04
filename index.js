const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");
const WebsocketEvent = require("./main/websocket/websocketEvent");
const AutoReconnectWebSocket = require("./main/websocket/websocket");

// *** とりあえずテスト用 ***
const Cookie = require("./cookie");
// ***********************

class NikoQ {
  constructor() {
    this.mainWindow = null;
    this.websocket = null;
    this.websocketEvent = new WebsocketEvent();
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
      this.setupWebsocket();
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
    this.websocket.ws.on("message", async (data) => {
      console.log("WS: Message Come");
      this.websocketEvent.event(JSON.parse(data));
    });
  }

  createNikoQWindow() {
    this.mainWindow = new NikoQWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
    this.websocketEvent.setWebContents(this.mainWindow.window.webContents);
  }

  get wc() {
    return this.mainWindow.window.webContents;
  }
}

new NikoQ().init();
