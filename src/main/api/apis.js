const fetch = require("electron-fetch").default;
const { session } = require("electron");
const setCookie = require("set-cookie-parser");

// TODO: Cookieを，Sessionを使った書き方にする　← なぜかできなかった
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
  // TODO:Cookieの保存
  async postLogin(name, password) {
    const body = { name, password };
    const res = await fetch(this.basepath + "/login", {
      method: "Post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    const splitCookieHeaders = setCookie.splitCookiesString(
      res.headers.get("Set-Cookie")
    );
    const cookies = setCookie.parse(splitCookieHeaders);
    for (let i = 0; i < cookies.length; i++) {
      const setCookie = {
        url: "https://q.trap.jp/",
        name: cookies[i].name,
        value: cookies[i].value,
        secure: true,
      };
      session.defaultSession.cookies.set(setCookie).then(
        () => {},
        (error) => {
          console.error(error);
        }
      );
    }
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

  // sessionからクッキーの読み込み
  loadCookie() {
    session.defaultSession.cookies
      .get({ url: "https://q.trap.jp/" })
      .then((cookies) => {
        let cookie = "";
        for (let i = 0; i < cookies.length; i++) {
          cookie += cookies[i].name + "=" + cookies[i].value + ";";
        }
        this.setSession(cookie);
      })
      .catch((error) => {
        console.log(error);
      });
  }
}

const apis = new Apis("https://q.trap.jp/api/v3");

module.exports = apis;
