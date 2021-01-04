const { net } = require("electron");
const EventEmitter = require("events").EventEmitter;

// *** とりあえずテスト用 ***
const Cookie = require("../../cookie");
// ***********************

class Apis {
  constructor(hostname, basepath) {
    this.hostname = hostname;
    this.basepath = basepath;
    this.r_session = "";
  }
  setSession(value) {
    this.r_session = "r_session=" + value;
  }
  getMessage(messageId) {}
}

const apis = new Apis("q.trap.jp", "/api/v3");

// とりあえず
apis.setSession(Cookie);

module.exports = apis;
