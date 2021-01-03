const WebSocket = require("ws");
const websocketEvent = require("./websocketEvent");

class AutoReconnectWebSocket {
  constructor(url, protocols) {
    this.url = url;
    this.protocols = protocols;
  }
  _setupWs() {
    this._ws = new WebSocket(this.url, this.protocols);
    this._ws.on("open", () => {
      console.log("open");
      this.onTimelineStreaming();
    });
    this._ws.on("message", (data) => {
      websocketEvent(JSON.parse(data));
    });
  }

  // すべてのメッセージcreateイベントを受け取る設定を送信
  onTimelineStreaming() {
    console.log("timeline_streaming:on");
    this._ws.send("timeline_streaming:on");
  }

  connect() {
    this._setupWs();
  }
  get ws() {
    return this._ws;
  }
}

module.exports = AutoReconnectWebSocket;
