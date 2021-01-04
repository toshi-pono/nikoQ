const fetch = require("electron-fetch").default;

// *** とりあえずテスト用 ***
const Cookie = require("../../cookie");
// ***********************

// TODO: Cookieを，Sessionを使った書き方にする
class Apis {
  constructor(basepath) {
    this.basepath = basepath;
    this.r_session = "";
  }
  setSession(value) {
    this.r_session = "r_session=" + value;
  }
  // メッセージの中身を取得
  async getMessage(messageId) {
    const res = await fetch(this.basepath + "/messages/" + messageId, {
      headers: {
        Cookie: this.r_session,
      },
    });
    const data = await res.json();
    const state = res.status;
    return { state, data };
  }

  // ユーザの詳細を取得
  async getUser(userId) {
    const res = await fetch(this.basepath + "/users/" + userId, {
      headers: {
        Cookie: this.r_session,
      },
    });
    const data = await res.json();
    const state = res.status;
    return { state, data };
  }

  // ログイン処理
  async postLogin(username, password) {
    const body = { username: username, password: password };
    const res = await fetch(this.basepath + "/login", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    console.log(res);
    return res.status;
  }

  // ログアウト処理
  async postLogout() {
    const res = await fetch(this.basepath + "/logout?all=false", {
      headers: {
        Cookie: this.r_session,
      },
    });
    console.log(res);
    return res.status;
  }
}

const apis = new Apis("https://q.trap.jp/api/v3");

// とりあえず
apis.setSession(Cookie);

module.exports = apis;
