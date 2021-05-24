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
    channel: true,
  },
};
window.onload = () => {
  initIPC();
  // レンダー側の準備完了をメインプロセスに伝える
  window.nikoQ.doneLoad();

  // メッセージを流すtest
  const button01 = document.getElementById("button01");
  button01.addEventListener(
    "click",
    () => {
      let msg = {
        content: "テストメッセージ",
        user: {
          bot: false,
          displayName: "とし",
          iconFileId: "4dfbf211-f4e5-4c4d-9ae4-bbc4bc1a0b03",
          id: "060db77b-1d04-4686-a5ec-15c960159646",
          name: "toshi00",
          state: 1,
          updatedAt: "2020-05-03T15:21:58.152941Z",
        },
      };
      messageView(msg);
    },
    false
  );
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
  window.nikoQ.logoutStatus((status) => {
    console.log("logout", status);
  });
  window.nikoQ.elseMessage();
}

// メッセージを表示して動かす
function messageView(message) {
  let container = document.createElement("div");
  container.appendChild(createMessageHeader(message.user));
  container.appendChild(createMessage(message.content));
  moveMessage(container);
}

function onlineView(message) {
  moveMessage(createUserStatus(message, "IN"));
}

function offlineView(message) {
  moveMessage(createUserStatus(message, "OUT"));
}

// メッセージに必要な要素たち
// header
function createMessageHeader(user) {
  let div = document.createElement("div");
  div.classList.add("messageHeader");
  if (settings.messageView.icon)
    div.appendChild(createUserIcon(user.iconFileId));
  if (settings.messageView.displayName)
    div.appendChild(createDisplayName(user.displayName));
  if (settings.messageView.id) div.appendChild(createName(user.name));
  return div;
}
// icon画像
function createUserIcon(iconFileId) {
  let img = document.createElement("img");
  img.setAttribute("src", "https://q.trap.jp/api/v3/files/" + iconFileId);
  img.classList.add("userIcon");
  return img;
}
// displayName
function createDisplayName(name) {
  let p = document.createElement("p");
  const text = document.createTextNode(name);
  p.appendChild(text);
  p.classList.add("displayName");
  return p;
}
// name
function createName(name) {
  let p = document.createElement("p");
  const text = document.createTextNode("@" + name);
  p.appendChild(text);
  p.classList.add("name");
  return p;
}
// message
function createMessage(content) {
  let p = document.createElement("p");
  const text = document.createTextNode(content);
  p.appendChild(text);
  p.classList.add("message");
  return p;
}
// userStatus
function createUserStatus(user, text) {
  let div = document.createElement("div");
  div.classList.add("userStatusContainer");

  // ステータスメッセージの作成
  let status = document.createElement("p");
  status.classList.add("userStatusMessage");
  const statusText = document.createTextNode(text + ":");
  status.appendChild(statusText);
  div.appendChild(status);

  // 名前部分の作成
  if (settings.messageView.icon)
    div.appendChild(createUserIcon(user.iconFileId));
  if (settings.messageView.displayName)
    div.appendChild(createDisplayName(user.displayName));
  if (settings.messageView.id) div.appendChild(createName(user.name));

  return div;
}

// メッセージのアニメーションを実行する
async function moveMessage(viewDOM) {
  viewDOM.id = "text" + count;
  count++;
  viewDOM.style.position = "fixed";
  viewDOM.style.whiteSpace = "nowrap";
  viewDOM.style.left = document.documentElement.clientWidth + "px";

  // 初期状態の縦方向の位置は画面の上端から下端の間に設定（ランダムな配置に）
  // memo: 表示モードがいろいろあれば面白そう
  document.body.appendChild(viewDOM);
  var random = Math.round(
    Math.random() *
      (document.documentElement.clientHeight - viewDOM.clientHeight)
  );
  viewDOM.style.top = random + "px";

  // ライブラリを用いたテキスト移動のアニメーション： durationはアニメーションの時間、
  //        横方向の移動距離は「画面の横幅＋画面を流れるテキストの要素の横幅」
  await gsap.to("#" + viewDOM.id, {
    duration: 20,
    x: -1 * (document.documentElement.clientWidth + viewDOM.clientWidth),
  });
  // 画面上の移動終了後に削除
  viewDOM.parentNode.removeChild(viewDOM);
}
