const { net } = require("electron");
const EventEmitter = require("events").EventEmitter;

// *** とりあえずテスト用 ***
const Cookie = require("../../cookie");
// ***********************

class Apis extends EventEmitter {
  constructor(hostname, basepath) {
    super();
    this.hostname = hostname;
    this.basepath = basepath;
    this.r_session = "";
  }
  setSession(value) {
    this.r_session = "r_session=" + value;
  }
  getMessage(messageId) {
    const request = net.request({
      method: "GET",
      protocol: "https:",
      hostname: this.hostname,
      path: this.basepath + "/messages/" + messageId,
      headers: {
        Cookie: this.r_session,
      },
    });

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
  test() {
    this.emit("display-message", "hello");
  }
}

const apis = new Apis("q.trap.jp", "/api/v3");

// とりあえず
apis.setSession(Cookie);

module.exports = apis;
