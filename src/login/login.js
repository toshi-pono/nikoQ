// TODO:ログイン後のステータステキストをなんとかする

window.onload = () => {
  initIPC();

  document.getElementById("info").style.visibility = "hidden";
  document.getElementById("submit").addEventListener("click", () => {
    // ログイン
    const name = document.getElementById("name").value;
    const password = document.getElementById("password").value;
    window.nikoQ.login(name, password);
  });
};

function initIPC() {
  window.nikoQ.loginStatus((status) => {
    // console.log("login", status);
    if (status == 204) {
      document.getElementById("info").style.visibility = "visible";
    } else {
      document.getElementById("info").style.visibility = "hidden";
    }
  });
}
