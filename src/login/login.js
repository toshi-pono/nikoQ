// loginStatus 204→　ログインしましたと表示する
// それ以外　→　IDまたはパスワードが間違っていますと表示する
// 初期状態 →　ログイン入力待ち

window.onload = () => {
  initIPC();
};

function initIPC() {
  window.nikoQ.loginStatus((status) => {
    console.log("login", status);
  });
}
