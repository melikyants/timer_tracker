import crypto from "crypto";
import { Request, Response } from "express";
import { IResolvers } from "apollo-server-express";
import { Google, Upwork } from "../../../lib/api";
import { Viewer, IDatabase, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { LogInArgs, ConnectUpworkArgs, SearchJobArgs, Job } from "./types";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const logInViaGoogle = async (
  code: string,
  token: string,
  db: IDatabase,
  res: Response
): Promise<User | undefined> => {
  const { user } = await Google.logIn(code);

  if (!user) {
    throw new Error("Google login error");
  }

  // Name/Photo/Email Lists
  const userNamesList = user.names && user.names.length ? user.names : null;
  const userPhotosList = user.photos && user.photos.length ? user.photos : null;
  const userEmailsList =
    user.emailAddresses && user.emailAddresses.length
      ? user.emailAddresses
      : null;

  // User Display Name
  const userName = userNamesList ? userNamesList[0].displayName : null;

  // User Id
  const userId =
    userNamesList &&
    userNamesList[0].metadata &&
    userNamesList[0].metadata.source
      ? userNamesList[0].metadata.source.id
      : null;

  // User Avatar
  const userAvatar =
    userPhotosList && userPhotosList[0].url ? userPhotosList[0].url : null;

  // User Email
  const userEmail =
    userEmailsList && userEmailsList[0].value ? userEmailsList[0].value : null;

  if (!userId || !userName || !userAvatar || !userEmail) {
    throw new Error("Google login error");
  }

  const updateRes = await db.users.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: userName,
        avatar: userAvatar,
        contact: userEmail,
        tokenGoogle: token,
      },
    },
    { returnOriginal: false }
  );

  let viewer = updateRes.value;

  if (!viewer) {
    const insertResult = await db.users.insertOne({
      _id: userId,
      name: userName,
      avatar: userAvatar,
      contact: userEmail,
      tokenGoogle: token,
      tokenUpwork: "",
      tokenUpworkSecret: "",
    });

    viewer = insertResult.ops[0];
  }

  res.cookie("viewer", userId, {
    ...cookieOptions,
    maxAge: 365 * 24 * 60 * 60 * 1000,
  });

  return viewer;
};

const logInViaCookie = async (
  token: string,
  db: IDatabase,
  req: Request,
  res: Response
): Promise<User | undefined> => {
  const updateRes = await db.users.findOneAndUpdate(
    { _id: req.signedCookies.viewer },
    { $set: { tokenGoogle: token } },
    { returnOriginal: false }
  );

  const viewer = updateRes.value;

  if (!viewer) {
    res.clearCookie("viewer", cookieOptions);
  }

  return viewer;
};

export const viewerResolvers: IResolvers = {
  Query: {
    authUrl: (): string => {
      try {
        return Google.authUrl;
      } catch (error) {
        throw new Error(`Failed to query Google Auth Url: ${error}`);
      }
    },
    authUrlUpwork: async (): Promise<string> => {
      try {
        const getUrl: any = await Upwork.authUrl();
        console.log("getUrl", getUrl);
        return getUrl;
      } catch (error) {
        throw new Error(`Failed to query Upwork Auth Url: ${error}`);
      }
    },
    searchJobs: async (
      _root: undefined,
      { params, filterCountries }: SearchJobArgs,
      { db, req, res }: { db: IDatabase; req: Request; res: Response }
    ): Promise<any> => {
      try {
        const viewer = await authorize(db, req);
        console.log("viewer", viewer);
        const tokens = {
          accessToken: viewer?.tokenUpwork,
          accessTokenSecret: viewer?.tokenUpworkSecret,
        };
        const getJobs: any = await Upwork.searchJobs(params, tokens);
        // console.log("params", params);
        // console.log("filterCountries", filterCountries);

        console.log("total jobs:", getJobs.jobs.length);

        const filterJobsByCountries = getJobs.jobs.filter((job: any) => {
          // console.log("job", job);
          const index = filterCountries.findIndex(
            (country) => country === job.client.country
          );
          // console.log("index", index);
          if (index > -1) {
            return;
          }
          return job;
        });

        const jobs = filterJobsByCountries.map((job: any) => {
          // console.log("job", job.client);
          const temp: { [key: string]: string } = {};
          temp["id"] = job.id;
          temp["title"] = job.title;
          temp["snippet"] = job.snippet;
          temp["category"] = job.category2;
          temp["subcategory"] = job.subcategory2;
          temp["skills"] = job.skills;
          temp["type"] = job.job_type;
          temp["budget"] = job.budget;
          temp["duration"] = job.duration;
          temp["workload"] = job.workload;
          temp["status"] = job.job_status;
          temp["date_created"] = job.date_created; //: '2020-07-08T21:55:22+0000',
          temp["url"] = job.url; //: 'http://www.upwork.com/jobs/~013dea26bddbf85c09',
          temp["client"] = job.client;
          return temp;
        });

        // console.log("jobs", jobs);
        console.log("after filter job length:", jobs.length);
        return jobs;
      } catch (error) {
        throw new Error(`coudlnt fetch jobs ${error}`);
      }
    },
  },
  Mutation: {
    logIn: async (
      _root: undefined,
      { input }: LogInArgs,
      { db, req, res }: { db: IDatabase; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        const code = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");

        const viewer: User | undefined = code
          ? await logInViaGoogle(code, token, db, res)
          : await logInViaCookie(token, db, req, res);

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: viewer._id,
          avatar: viewer.avatar,
          tokenGoogle: viewer.tokenGoogle,
          tokenUpwork: viewer.tokenUpwork,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOut: (
      _root: undefined,
      _args: {},
      { res }: { res: Response }
    ): Viewer => {
      try {
        res.clearCookie("viewer", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },

    connectUpwork: async (
      _root: undefined,
      { input }: ConnectUpworkArgs,
      { db, req, res }: { db: IDatabase; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        console.log("input", input);
        let viewer = await authorize(db, req);
        console.log("viewer", viewer);

        if (!viewer) {
          throw new Error("viewer cannot be found");
        }

        const upwork = await Upwork.connect(input.verifier);
        if (!upwork) {
          throw new Error("upwork grant error");
        }
        console.log("upwork", upwork);

        const updateRes = await db.users.findOneAndUpdate(
          { _id: viewer._id },
          {
            $set: {
              tokenUpwork: upwork.tokens.accessToken,
              tokenUpworkSecret: upwork.tokens.accessTokenSecret,
            },
          },
          { returnOriginal: false }
        );

        if (!updateRes.value) {
          throw new Error("viewer could not be updated");
        }

        viewer = updateRes.value;

        // const token = crypto.randomBytes(16).toString("hex");

        return {
          _id: viewer._id,
          tokenGoogle: viewer.tokenGoogle,
          tokenUpwork: viewer.tokenUpwork,
          avatar: viewer.avatar,
          didRequest: true,
        };
      } catch (error) {
        throw new Error(`Failed to log in: ${error}`);
      }
    },
    logOutUpwork: (
      _root: undefined,
      _args: {},
      { res }: { res: Response }
    ): Viewer => {
      try {
        // res.clearCookie("viewer", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
  },
  Viewer: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
    // hasWallet: (viewer: Viewer): boolean | undefined => {
    //   return viewer.walletId ? true : undefined;
    // },
  },
};
