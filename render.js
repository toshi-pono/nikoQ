window.onload = () => {
  initIPC();
  //window.nikoQ.initWebSocket();
  window.nikoQ.doneLoad();
};

function initIPC() {
  window.nikoQ.displayMessage((message) => {
    console.log(message);
  });
  window.nikoQ.loginStatus((status) => {
    console.log(status);
  });
  window.nikoQ.logoutStatus((status) => {
    console.log(status);
  });
}
