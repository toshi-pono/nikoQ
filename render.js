import "secret.js";
import { myname, mypassword } from "./secret";

window.onload = () => {
  initIPC();
  //window.nikoQ.initWebSocket();
  window.nikoQ.doneLoad();
  // test
  // window.nikoQ.login(myname, mypassword);
};

function initIPC() {
  window.nikoQ.displayMessage((message) => {
    console.log(message);
  });
  window.nikoQ.loginStatus((status) => {
    console.log("login", status);
  });
  window.nikoQ.logoutStatus((status) => {
    console.log("logout", status);
  });
}
