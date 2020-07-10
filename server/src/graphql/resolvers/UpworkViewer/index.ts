import crypto from "crypto";
import { Request, Response } from "express";
import { IResolvers } from "apollo-server-express";
import { Upwork } from "../../../lib/api";
import { Viewer } from "../../../lib/types";
import { IDatabase } from "../../../lib/types";

// import { LogInArgs, ConnectStripeArgs } from "./types";

const cookieOptions = {
  httpOnly: true,
  sameSite: true,
  signed: true,
  secure: process.env.NODE_ENV === "development" ? false : true,
};

const logInViaUpwork = async (
  verifier: string,
  token: string,
  db: IDatabase,
  res: Response
): Promise<any> => {
  try {
    const user = await Upwork.logIn(verifier);
    console.log("user", user);

    if (!user) {
      throw new Error("Upwork login error");
    }

    const userId = "000001";
    const viewer = {
      _id: userId,
      token,
    };

    res.cookie("viewerUpwork", userId, {
      ...cookieOptions,
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    return viewer;
  } catch (error) {
    throw new Error(`coudlnt login to upwork ${error}`);
  }
};

const logInViaCookieUpwork = async (
  token: string,
  db: IDatabase,
  req: Request,
  res: Response
): Promise<any> => {
  // const updateRes = await db.users.findOneAndUpdate(
  //   { _id: req.signedCookies.viewer },
  //   { $set: { token } },
  //   { returnOriginal: false }
  // );

  console.log("--logInViaCookieUpwork- token", token);
  // let viewer = updateRes.value;
  const userId = "000001";
  const viewer = {
    _id: userId,
    token,
  };
  if (!viewer) {
    res.clearCookie("viewerUpwork", cookieOptions);
  }

  return viewer;
};
interface Job {
  id: string;
  title: string;
  snippet: string;
}
interface SearchJobArgs {
  params: {
    q: string;
    skills: string[];
    paging: string;
  };
  filterCountries: string[];
}

export const upworkViewerResolvers: IResolvers = {
  Query: {
    authUrl: async (
      _root: undefined,
      {},
      { db, req, res }: { db: IDatabase; req: Request; res: Response }
    ): Promise<any> => {
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
      const getJobs: any = await Upwork.searchJobs(params);
      console.log("params", params);
      console.log("filterCountries", filterCountries);

      console.log("total jobs:", getJobs.jobs.length);

      const filterJobsByCountries = getJobs.jobs.filter((job: any) => {
        console.log("job", job);
        const index = filterCountries.findIndex(
          (country) => country === job.client.country
        );
        console.log("index", index);
        if (index > -1) {
          return;
        }
        return job;
      });

      const jobs = filterJobsByCountries.map((job: any) => {
        console.log("job", job.client);
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

      console.log("jobs", jobs);
      console.log("after filter job length:", jobs.length);
      return jobs;
    },
  },
  Mutation: {
    logInUpwork: async (
      _root: undefined,
      { input }: any,
      { db, req, res }: { db: IDatabase; req: Request; res: Response }
    ): Promise<Viewer> => {
      try {
        const verifier = input ? input.code : null;
        const token = crypto.randomBytes(16).toString("hex");

        const viewer: any = verifier
          ? await logInViaUpwork(verifier, token, db, res)
          : await logInViaCookieUpwork(token, db, req, res);
        console.log("viewer", viewer);

        if (!viewer) {
          return { didRequest: true };
        }

        return {
          _id: "000001",
          token: token,
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
        res.clearCookie("viewerUpwork", cookieOptions);
        return { didRequest: true };
      } catch (error) {
        throw new Error(`Failed to log out: ${error}`);
      }
    },
  },
  ViewerUpwork: {
    id: (viewer: Viewer): string | undefined => {
      return viewer._id;
    },
  },
};
