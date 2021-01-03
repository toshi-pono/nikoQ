const apis = require("./apis");

// wc: window.webContent
// apiの受信を確認して，renderに指示を送る
const setupApiEvent = (wc) => {
  apis.on("display-message", (message) => {
    wc.send("display-message", message);
  });
  apis.on("not-login", () => {
    wc.send("loginStatus", { login: false, message: "" });
  });
};

module.exports = setupApiEvent;
