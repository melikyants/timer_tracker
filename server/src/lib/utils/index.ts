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

interface Pagination {
  after: string;
  pageSize: number;
  results: any;
  getCursor?: (item: any) => null;
}

export const paginateResults = ({
  after: cursor,
  pageSize = 3,
  results,
  // can pass in a function to calculate an item's cursor
  getCursor = () => null,
}: Pagination): [] | any[] => {
  if (pageSize < 1) return [];

  if (!cursor) return results.slice(0, pageSize);
  // console.log("results", results);
  const cursorIndex = results.findIndex((item: any) => {
    // if an item has a `cursor` on it, use that, otherwise try to generate one

    const itemCursor = item._id ? item._id.toString() : getCursor(item);

    // if there's still not a cursor, return false by default
    return itemCursor ? cursor === itemCursor : false;
  });

  return cursorIndex >= 0
    ? cursorIndex === results.length - 1 // don't let us overflow
      ? []
      : results.slice(
          cursorIndex + 1,
          Math.min(results.length, cursorIndex + 1 + pageSize)
        )
    : results.slice(0, pageSize);
};
