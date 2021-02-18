const { app, ipcMain, session } = require("electron");
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
    // 今は使ってない
    ipcMain.on("init-websocket", () => {
      this.setupWebsocket();
    });
    // ログイン処理
    ipcMain.on("login", async (event, username, password) => {
      const status = await apis.postLogin(username, password);
      this.wc.send("login-status", status);
      // ログイン成功だったらsetupへ
      console.log("login:", status);
      if (status == 204) this.setupUser();
    });
    // ログアウト処理
    ipcMain.on("logout", async () => {
      const status = await apis.postLogout();
      this.wc.send("logout-status", status);
      console.log("logout:", status);
    });
    // 画面読み込み完了
    ipcMain.on("done-renderer-load", () => {
      // TODO: cookieの載せ方を改良する
      const setCookie = {
        url: "https://q.trap.jp/",
        name: "r_session",
        value: Cookie.coo,
        sameSite: "strict",
        secure: true,
      };
      session.defaultSession.cookies.set(setCookie).then(
        () => {
          // success
          console.log("set-cookie");
        },
        (error) => {
          console.error(error);
        }
      );
      this.setupUser();
    });

    // **** test ********
    // render側から送信した"test" に対して反応する．
    ipcMain.on("test", async () => {
      const res = await apis.getMessage("02345017-f51e-413e-a896-f182c92bfe47");
      console.log(res);
    });
    // *******************
  }

  async setupUser() {
    // ログイン情報，ユーザー詳細取得
    const res = await apis.getMyDetail();
    if (res.state == 401) {
      // 再ログインを要求
      this.wc.send("login-status", 401);
      console.log("@setupUser:", "NotLogin");
    } else if (res.state == 200) {
      this.setupWebsocket();
    } else {
      // TODO: たぶんなんらかのエラー
    }
  }

  setupWebsocket() {
    console.log("init-websocket");
    // websocketの通信時，electronのcookieは送信されてないので，自分で設定して送信する
    // HACK: sessionのイベントで通信前にheaderをいじれたかも？
    this.websocket = new AutoReconnectWebSocket("wss://q.trap.jp/api/v3/ws", {
      headers: {
        Cookie: apis.cookie,
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
    this.mainWindow.loadFile(`file://${__dirname}/message/index.html`);
    this.websocketEvent.setWebContents(this.wc);
  }

  get wc() {
    return this.mainWindow.window.webContents;
  }
}

new NikoQ().init();
