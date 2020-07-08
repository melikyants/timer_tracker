import merge from "lodash.merge";
import { timerResolvers } from "./Timer";
import { projectResolver } from "./Project";
import { upworkViewerResolvers } from "./UpworkViewer";

export const resolvers = merge(
  upworkViewerResolvers,
  timerResolvers,
  projectResolver
);
