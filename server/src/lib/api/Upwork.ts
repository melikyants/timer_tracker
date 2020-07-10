// import  upworkApiD from "./upwork.d.ts";
import UpworkApi from "upwork-api";
import Search from "upwork-api/lib/routers/jobs/search.js";
import Auth from "upwork-api/lib/routers/auth";
// import debug from "upwork-api/lib/debug";
import rl from "readline";
import { resolve } from "path";
import crypto from "crypto";
// import { OAuth } from "oauth-1.0a";

const config = {
  consumerKey: process.env.UPWORK_CONSUMER_KEY,
  consumerSecret: process.env.UPWORK_CONSUMER_SECRET,
  debug: true,
};

const api = new UpworkApi(config);
const callbackUrl = "http://localhost:9777/user";

interface AuthArgs {
  error: string;
  url: string;
  requestToken: string;
  requestTokenSecret: string;
  accessToken: string | undefined;
  accessSecret: string | undefined;
}

// const upwork = OAuth({
//   consumer: { key: config.consumerKey, secret: config.consumerSecret },
//   signature_method: "HMAC-SHA1",
//   hash_function(base_string, key) {
//     return crypto.createHmac("sha1", key).update(base_string).digest("base64");
//   },
// });

// const request_data = {
//   url: 'https://api.twitter.com/1/statuses/update.json?include_entities=true',
//   method: 'POST',
//   data: { status: 'Hello Ladies + Gentlemen, a signed OAuth request!' },
// }

let requestTokenG = "";
console.log("requestTokenG", requestTokenG);
let requestTokenSecretG = "";
// let accessTokenG = "";
// let accessTokenSecretG = "";

export const Upwork = {
  authUrl: () => {
    return new Promise(function (resolve, reject) {
      return api.getAuthorizationUrl(
        callbackUrl,
        (
          error: string,
          url: string,
          requestToken: string,
          requestTokenSecret: string
        ) => {
          if (error)
            throw new Error("can not get authorization url, error: " + error);
          // this.debug(requestToken, "got a request token");
          // debug(requestTokenSecret, "got a request token secret");
          // Authorize application
          console.log("requestTokenSecret", requestTokenSecret);
          console.log("requestToken", requestToken);
          console.log("url", url);
          console.log("error", error);
          const loginUrl = `${url}&oauth_token_secret=${requestTokenSecret}`;
          requestTokenG = requestToken;
          requestTokenSecretG = requestTokenSecret;

          resolve(loginUrl);
        }
      );
    });
  },
  getAccessToken: (verifier: string) => {
    return new Promise(function (resolve, reject) {
      api.getAccessToken(
        requestTokenG,
        requestTokenSecretG,
        verifier,
        function (error: any, accessToken: any, accessTokenSecret: any) {
          if (error) throw new Error(error);
          const tokens = {
            accessToken,
            accessTokenSecret,
          };
          resolve(tokens);
        }
      );
    });
  },
  setCredentials: (tokens: any) => {
    console.log("tokens", tokens);
    api.setAccessToken(tokens.accessToken, tokens.accessTokenSecret, function (
      error: any,
      args: any
    ) {
      console.log("args", args);
    });
  },
  getUserInfo: () => {
    const auth = new Auth.Auth(api);
    return new Promise(function (resolve, reject) {
      auth.getUserInfo(function (error: any, data: any) {
        console.log("data", data);
        console.log("error", error);
        console.log(data);
        resolve(data);
      });
    });
  },
  connect: async (verifier: string) => {
    console.log("verifier", verifier);
    const tokens: any = await Upwork.getAccessToken(verifier);
    console.log("tokens", tokens);

    Upwork.setCredentials(tokens);

    // const data = await Upwork.getUserInfo()
    return { tokens };
  },
  searchJobs: async (params: any, tokens: any) => {
    await Upwork.setCredentials(tokens);
    const jobs = new Search.Search(api);
    return new Promise((resolve, reject) => {
      jobs.find(params, function (error: any, data: any) {
        console.log("error", error);
        resolve(data);
      });
    });
  },
};

// import UpworkApi from "upwork-api"; // use if package is installed via npm
//  , Auth = require('../lib/routers/auth').Auth // uncomment to use inside current package/sources
// , Auth = require('upwork-api/lib/routers/auth').Auth // use if package is installed via npm
// , rl = require('readline');
