const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");
const WebsocketEvent = require("./main/websocket/websocketEvent");
const AutoReconnectWebSocket = require("./main/websocket/websocket");
const apis = require("./main/api/apis");

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
      // 今は使ってない
      this.setupWebsocket();
    });
    ipcMain.on("login", async (event, username, password) => {
      // ログイン処理
      const status = await apis.postLogin(username, password);
      this.wc.send("login-status", status);
    });
    ipcMain.on("logout", async () => {
      // ログアウト処理
      const status = await apis.postLogout();
      this.wc.send("logout-status", status);
    });
    ipcMain.on("done-renderer-load", () => {
      // 画面読み込み完了
      this.setupWebsocket();
    });
    // **** test ********
    ipcMain.on("test", async () => {
      const res = await apis.getUser("00443589-4489-48c9-baf6-ea2a5c2e4fe3");
      console.log(res);
    });
    // *******************
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
