const { app, ipcMain } = require("electron");
const NikoQWindow = require("./main/createWindow");
const LoginWindow = require("./main/loginWindow");
const SettingWindow = require("./main/settingWindow");
const WebsocketEvent = require("./main/websocket/websocketEvent");
const AutoReconnectWebSocket = require("./main/websocket/websocket");
const apis = require("./main/api/apis");

class NikoQ {
  constructor() {
    this.mainWindow = null;
    this.loginWindow = null;
    this.settingWindow = null;
    this.websocket = null;
    this.websocketEvent = new WebsocketEvent();
    this.isLogin = false;
  }

  init() {
    this.initApp();
    this.initIPC();
  }

  initApp() {
    app.on("ready", () => {
      this.createNikoQWindow();
      this.mainWindow.hide();
      this.loginWindow.show();
      this.settingWindow.hide();
    });
    app.on("activate", () => {
      if (this.isLogin) {
        // ログイン済みの場合，設定と本体画面を表示
        if (
          this.mainWindow == null ||
          this.settingWindow == null ||
          this.loginWindow == null
        ) {
          this.createNikoQWindow();
        }
        this.loginWindow.hide();
        this.settingWindow.hide();
        this.mainWindow.show();
      } else {
        // ログインしていない場合，ログイン画面を表示
        if (
          this.mainWindow == null ||
          this.settingWindow == null ||
          this.loginWindow == null
        ) {
          this.createNikoQWindow();
        }
        this.loginWindow.show();
        this.settingWindow.hide();
        this.mainWindow.hide();
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
      this.loginWc.send("login-status", status);
      // ログイン成功だったらsetupへ
      console.log("login:", status);
      if (status == 204) this.setupUser();
    });
    // ログアウト処理
    ipcMain.on("logout", async () => {
      const status = await apis.postLogout();
      this.wc.send("logout-status", status);
      console.log("logout:", status);
      this.isLogin = false;
    });
    // 画面読み込み完了
    ipcMain.on("done-renderer-load", () => {
      // TODO: 保存しておいたcookieの読み込み
      this.setupUser();
    });
    ipcMain.on("change-LoginStatus", (event, status) => {
      this.isLogin = status;
      if (this.isLogin) {
        this.mainWindow.show();
        this.settingWindow.show();
        this.loginWindow.hide();
      } else {
        this.mainWindow.hide();
        this.settingWindow.hide();
        this.loginWindow.show();
      }
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
      this.isLogin = false;
      this.loginWc.send("login-status", 401);
      console.log("@setupUser:", "NotLogin");
    } else if (res.state == 200) {
      this.isLogin = true;
      this.setupWebsocket();
      // メイン画面切り替え
      this.loginWindow.hide();
      this.settingWindow.show();
      this.mainWindow.show();
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
    this.loginWindow = new LoginWindow();
    this.loginWindow.loadFile(`file://${__dirname}/login/index.html`);
    this.settingWindow = new SettingWindow();
    this.settingWindow.loadFile(`file://${__dirname}/setting/index.html`);
    this.websocketEvent.setMainWc(this.wc);
    this.websocketEvent.setLoginWc(this.loginWc);
  }

  get wc() {
    return this.mainWindow.window.webContents;
  }
  get loginWc() {
    return this.loginWindow.window.webContents;
  }
  get settingWc() {
    return this.settingWindow.window.webContents;
  }
}

new NikoQ().init();
