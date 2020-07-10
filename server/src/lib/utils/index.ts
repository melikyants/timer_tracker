import { Request } from "express";
import { IDatabase, User } from "../types";

export const authorize = async (
  db: IDatabase,
  req: Request
): Promise<User | null> => {
  const token = req.get("X-CSRF-TOKEN");
  console.log("X-CSRF-TOKEN token", token);
  console.log("req.signedCookies.viewer", req.signedCookies.viewer);
  const viewer = await db.users.findOne({
    _id: req.signedCookies.viewer,
    tokenGoogle: token,
  });

  return viewer;
};
