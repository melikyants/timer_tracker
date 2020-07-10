import { Request } from "express";
import { IResolvers } from "apollo-server-express";
import { IDatabase, User } from "../../../lib/types";
import { authorize } from "../../../lib/utils";
import { UserArgs } from "./types";

export const userResolvers: IResolvers = {
  Query: {
    user: async (
      _root: undefined,
      { id }: UserArgs,
      { db, req }: { db: IDatabase; req: Request }
    ): Promise<User> => {
      try {
        const user = await db.users.findOne({ _id: id });

        if (!user) {
          throw new Error("user can't be found");
        }

        const viewer = await authorize(db, req);

        if (viewer && viewer._id === user._id) {
          user.authorized = true;
        }

        return user;
      } catch (error) {
        throw new Error(`Failed to query user: ${error}`);
      }
    },
  },
  User: {
    id: (user: User): string => {
      return user._id;
    },
    // hasWallet: (user: User): boolean => {
    //   return Boolean(user.walletId);
    // },
  },
};
