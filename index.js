const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");
const AutoReconnectWebSocket = require("./main/websocket");
const wsEvent = require("./main/wsEvent");

// *** とりあえずテスト用 ***
const Cookie = require("./cookie");
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
    ipcMain.handle("invoke-test", (event, message) => {
      // message には 呼び出し元からのデータ ('ping') が入っている
      console.log(message);
      // renderer プロセスにデータを返す
      return "pong";
    });

    ipcMain.on("init-websocket", () => {
      this.initWebsocket();
    });
  }

  initWebsocket() {
    console.log("init-websocket");
    this.websocket = new AutoReconnectWebSocket("wss://q.trap.jp/api/v3/ws", {
      headers: {
        Cookie: "r_session=" + Cookie,
      },
    });
    this.websocket.connect();
    this.websocket.on("message", async (data) => {
      const message = await wsEvent(data);
      // Renderプロセスへ表示するメッセージを送信する
      this.mainWindow.window.webContents.send("display-message", message);
    });
  }

  createNikoQWindow() {
    this.mainWindow = new NikoQWindow();
    this.mainWindow.loadFile(`file://${__dirname}/index.html`);
  }
}

new NikoQ().init();
