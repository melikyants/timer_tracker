import merge from "lodash.merge";
import { timerResolvers } from "./Timer";
import { projectResolver } from "./Project";
import { upworkViewerResolvers } from "./UpworkViewer";
import { viewerResolvers } from "./Viewer";
import { userResolvers } from "./User";

export const resolvers = merge(
  viewerResolvers,
  userResolvers,
  // upworkViewerResolvers,
  timerResolvers,
  projectResolver
);
