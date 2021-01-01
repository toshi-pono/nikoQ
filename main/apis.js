const { net } = require("electron");

// *** とりあえずテスト用 ***
const Cookie = require("./cookie");
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
  getMessage(messageId) {
    // HACK:うまく動かない cookie周りが原因か？
    const request = net.request({
      method: "GET",
      protocol: "https:",
      hostname: this.hostname,
      path: this.basepath + "/messages/" + messageId,
    });
    request.setHeader("Cookie", this.session);
    request.on("response", (response) => {
      console.log(`STATUS: ${response.statusCode}`);
      console.log(`HEADERS: ${JSON.stringify(response.headers)}`);
      response.on("data", (chunk) => {
        console.log(`BODY: ${chunk}`);
      });
      response.on("end", () => {
        console.log("No more data in response.");
      });
    });
    request.end();
  }
}

const apis = new Apis("q.trap.jp", "/api/v3");
apis.setSession(Cookie);

module.exports = apis;
