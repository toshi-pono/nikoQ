window.onload = () => {
  initIPC();
  window.nikoQ.doneLoad();
  console.log("ok");
  // test
  // window.nikoQ.login(myname, mypassword);
  // window.nikoQ.test();
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
