const fetch = require("electron-fetch").default;

// *** とりあえずテスト用 ***
const Cookie = require("../../cookie");
// ***********************

class Apis {
  constructor(basepath) {
    this.basepath = basepath;
    this.r_session = "";
  }
  setSession(value) {
    this.r_session = "r_session=" + value;
  }
  getMessage(messageId) {}
}

const apis = new Apis("https://q.trap.jp/api/v3");

// とりあえず
apis.setSession(Cookie);

module.exports = apis;
