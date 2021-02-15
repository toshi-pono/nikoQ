const fetch = require("electron-fetch").default;

// *** とりあえずテスト用 ***
// const Cookie = require("../../cookie");
// ***********************

// TODO: Cookieを，Sessionを使った書き方にする
class Apis {
  constructor(basepath) {
    this.basepath = basepath;
    this.cookie = "";
    this.userList = null;
  }
  setSession(value) {
    this.cookie = value;
  }
  // メッセージの中身を取得
  async getMessage(messageId) {
    const res = await fetch(this.basepath + "/messages/" + messageId, {
      headers: {
        Cookie: this.cookie,
      },
    });
    const data = await res.json();
    const state = res.status;
    return { state, data };
  }

  // ユーザの詳細を取得 note:不要説がある
  async getUserDetail(userId) {
    const res = await fetch(this.basepath + "/users/" + userId, {
      headers: {
        Cookie: this.cookie,
      },
    });
    const data = await res.json();
    const state = res.status;
    return { state, data };
  }

  // 自分の詳細情報を取得
  async getMyDetail() {
    const res = await fetch(this.basepath + "/users/me", {
      headers: {
        Cookie: this.cookie,
      },
    });
    const data = await res.json();
    const state = res.status;
    return { state, data };
  }

  // ユーザー一覧（アクティブユーザーのみ）取得
  async getUsers() {
    const res = await fetch(this.basepath + "/users?include-suspended=false", {
      headers: {
        Cookie: this.cookie,
      },
    });
    const data = await res.json();
    const state = res.status;
    return { state, data };
  }

  // ユーザー情報を取得(詳細でない)
  async getUser(userId) {
    // キャッシュ
    if (this.userList == null) {
      const { state, data } = await this.getUsers();
      if (state == 401) return { state: 401, data: null }; // not login
      this.userList = data;
    }
    const res = this.userList.find((v) => v.id == userId);
    if (!res) return { state: 404, data: null };
    return { state: 200, data: res };
  }

  // ログイン処理
  // TODO:Cookie
  async postLogin(name, password) {
    const body = { name, password };
    const res = await fetch(this.basepath + "/login", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    this.setSession(res.headers.get("set-cookie"));
    return res.status;
  }

  // ログアウト処理
  async postLogout() {
    const res = await fetch(this.basepath + "/logout?all=false", {
      method: "Post",
      headers: {
        Cookie: this.cookie,
      },
    });
    return res.status;
  }
}

const apis = new Apis("https://q.trap.jp/api/v3");

// とりあえず
// apis.setSession(Cookie);

module.exports = apis;
