import dot = require("dotenv");
dot.config();

import express, { Application } from "express";
import { ApolloServer } from "apollo-server-express";

import { typeDefs, resolvers } from "./graphql";
import { connectDatabase } from "./database";
// import { schema } from './graphql_schema'

const mount = async (app: Application) => {
  const db = await connectDatabase();

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => ({ db, req, res }),
  });

  server.applyMiddleware({
    app,
    path: "/api",
  });

  app.listen(process.env.PORT);
  console.log(`[app] : http://localhost:${process.env.PORT}`);
};

mount(express());
