let count = 0;
let settings = {
  displayMessage: {
    message: true,
    userOnline: true,
    userOffline: true,
  },
  messageView: {
    icon: true,
    displayName: true,
    id: true,
  },
};
window.onload = () => {
  initIPC();
  // レンダー側の準備完了をメインプロセスに伝える
  window.nikoQ.doneLoad();

  // メッセージを流すtest
  const button01 = document.getElementById("button01");
  button01.addEventListener("click", () => {}, false);
};

function initIPC() {
  window.nikoQ.displayMessage((message) => {
    console.log("displayMessage", message);
    if (settings.displayMessage.message) messageView(message);
  });
  window.nikoQ.userOnline((message) => {
    console.log("userOnline", message);
    if (settings.displayMessage.userOnline) onlineView(message);
  });
  window.nikoQ.userOffline((message) => {
    console.log("userOffline", message);
    if (settings.displayMessage.userOffline) offlineView(message);
  });
  window.nikoQ.loginStatus((status) => {
    console.log("login", status);
  });
  window.nikoQ.logoutStatus((status) => {
    console.log("logout", status);
  });
  window.nikoQ.elseMessage();
}

// メッセージを表示して動かす
function messageView(message) {
  let container = document.createElement("div");

  // 画面上に表示されるテキストを設定
  let text =
    message.user.displayName +
    " @" +
    message.user.name +
    "\n" +
    message.content;
  container.appendChild(document.createTextNode(text));
  moveMessage(container);
}

function onlineView(message) {
  let container = document.createElement("div");
  let text = "オンライン:" + message.displayName + " @" + message.name;
  container.appendChild(document.createTextNode(text));
  moveMessage(container);
}

function offlineView(message) {
  let container = document.createElement("div");
  let text = "オフライン:" + message.displayName + " @" + message.name;
  container.appendChild(document.createTextNode(text));
  moveMessage(container);
}

// メッセージのアニメーションを実行する
async function moveMessage(viewDOM) {
  viewDOM.id = "text" + count;
  count++;
  viewDOM.style.position = "fixed";
  viewDOM.style.whiteSpace = "nowrap";
  viewDOM.style.left = document.documentElement.clientWidth + "px";

  // 初期状態の縦方向の位置は画面の上端から下端の間に設定（ランダムな配置に）
  // todo: メッセージの縦を考慮してが画面外にめり込まないようにする
  // memo: 表示モードがいろいろあれば面白そう
  var random = Math.round(
    Math.random() * document.documentElement.clientHeight
  );
  viewDOM.style.top = random + "px";

  document.body.appendChild(viewDOM);

  // ライブラリを用いたテキスト移動のアニメーション： durationはアニメーションの時間、
  //        横方向の移動距離は「画面の横幅＋画面を流れるテキストの要素の横幅」
  await gsap.to("#" + viewDOM.id, {
    duration: 20,
    x: -1 * (document.documentElement.clientWidth + viewDOM.clientWidth),
  });
  // 画面上の移動終了後に削除
  viewDOM.parentNode.removeChild(viewDOM);
}
