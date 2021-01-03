window.onload = () => {
  console.log(window.nikoQ.invokeTest());
  initIPC();
  window.nikoQ.initWebSocket();
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
