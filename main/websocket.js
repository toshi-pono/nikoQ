const WebSocket = require("ws");
const EventEmitter = require("events").EventEmitter;

class AutoReconnectWebSocket extends EventEmitter {
  constructor(url, protocols) {
    super();
    this.url = url;
    this.protocols = protocols;
  }
  _setupWs() {
    this._ws = new WebSocket(this.url, this.protocols);
    this._ws.on("open", () => {
      console.log("open");
      this.onTimelineStreaming();
    });

    // this._ws.on("message", (data) => {
    //   console.log(data);
    //   this.emit("message", data);
    // });
  }
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
