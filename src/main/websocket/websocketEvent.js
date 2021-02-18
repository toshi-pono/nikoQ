const apis = require("../api/apis");

class WebsocketEvent {
  constructor() {
    this._wc = null;
    this._loginWc = null;
  }
  async event(message) {
    if (this._wc == null) return;
    switch (message.type) {
      case "MESSAGE_CREATED": {
        // 新規メッセージ投稿
        // memo: メッセージの中身・チャンネル名・送信者名を取得→整形してイベント名と内容を返す
        // TODO: チャンネル名？
        const messageRes = await apis.getMessage(message.body.id);
        if (!this.isLogin(messageRes.state)) return;
        const userRes = await apis.getUser(messageRes.data.userId);
        if (!this.isLogin(userRes.state)) return;
        this._wc.send("display-message", {
          content: messageRes.data.content,
          user: userRes.data,
        });
        break;
      }
      case "USER_ONLINE": {
        const userRes = await apis.getUser(message.body.id);
        if (!this.isLogin(userRes.state)) return;
        this._wc.send("user-online", userRes.data);
        break;
      }
      case "USER_OFFLINE": {
        const userRes = await apis.getUser(message.body.id);
        if (!this.isLogin(userRes.state)) return;
        this._wc.send("user-offline", userRes.data);
        break;
      }
      default:
        // とりあえず
        this._wc.send("else-message", message);
        break;
    }
  }
  setMainWc(wc) {
    this._wc = wc;
  }
  setLoginWc(wc) {
    this._loginWc = wc;
  }
  isLogin(state) {
    if (state == 401) {
      this._loginWc.send("login-status", 401);
      return false;
    }
    return true;
  }
}

module.exports = WebsocketEvent;
