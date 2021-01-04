const apis = require("../api/apis");

class WebsocketEvent {
  constructor() {
    this._wc = null;
    // "all" | "none" | "message"
    // all: message_created, message_eddit ,user(on,off)line
    // message: message_created, message_eddit
    this.streaming = "all";
  }
  async event(message) {
    if (this._wc == null) return;
    switch (message.type) {
      case "MESSAGE_CREATED":
        // 新規メッセージ投稿
        // memo: メッセージの中身・チャンネル名・送信者名を取得→整形してイベント名と内容を返す
        const { state, data } = await apis.getMessage(message.body.id);
        this._wc.send("display-message", data);
        break;

      default:
        this._wc.send("display-message", message);
        break;
    }
  }
  setWebContents(wc) {
    this._wc = wc;
  }
}

module.exports = WebsocketEvent;
