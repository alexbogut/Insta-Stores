// import { createRequestHandler } from "@remix-run/vercel";
// import * as build from "@remix-run/dev/server-build";

// export default createRequestHandler({ build, mode: process.env.NODE_ENV });

const PrismaClient = require("@prisma/client").PrismaClient;
const prisma = new PrismaClient();
const express = require("express");
const expressGraphQL = require("express-graphql").graphqlHTTP;
const {
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
  GraphQLInt,
  GraphQLNonNull,
} = require("graphql");
const app = express();

// const users = [
//   { id: 1, name: "Alex" },
//   { id: 2, name: "Gabi" },
//   { id: 3, name: "Pat" },
// ];

// const items = [
//   { id: 1, name: "Harry Potter and the Chamber of Secrets", userId: 1 },
//   { id: 2, name: "Harry Potter and the Prisoner of Azkaban", userId: 1 },
//   { id: 3, name: "Harry Potter and the Goblet of Fire", userId: 1 },
//   { id: 4, name: "The Fellowship of the Ring", userId: 2 },
//   { id: 5, name: "The Two Towers", userId: 2 },
//   { id: 6, name: "The Return of the King", userId: 2 },
//   { id: 7, name: "The Way of Shadows", userId: 3 },
//   { id: 8, name: "Beyond the Shadows", userId: 3 },
// ];

const itemType = new GraphQLObjectType({
  name: "item",
  description: "This represents a item written by an user",
  fields: () => ({
    id: { type: GraphQLNonNull(GraphQLInt) },
    name: { type: GraphQLNonNull(GraphQLString) },
    userId: { type: GraphQLNonNull(GraphQLInt) },
    user: {
      type: userType,
      resolve: (item) => {
        return users.find((user) => user.id === item.userId);
      },
    },
  }),
});

const userType = new GraphQLObjectType({
  name: "user",
  description: "This represents a user of a item",
  fields: () => ({
    email: { type: GraphQLNonNull(GraphQLString) },
    password: { type: GraphQLNonNull(GraphQLString) },
    items: {
      type: new GraphQLList(itemType),
      resolve: (user) => {
        return items.filter((item) => item.userId === user.id);
      },
    },
  }),
});

const RootQueryType = new GraphQLObjectType({
  name: "Query",
  description: "Root Query",
  fields: () => ({
    item: {
      type: itemType,
      description: "A Single item",
      args: {
        id: { type: GraphQLInt },
      },
      resolve: (parent, args) => items.find((item) => item.id === args.id),
    },
    items: {
      type: new GraphQLList(itemType),
      description: "List of All items",
      resolve: () => items,
    },
    users: {
      type: new GraphQLList(userType),
      description: "List of All users",
      resolve: async () => {
        const user = await prisma.user.findMany()
        console.log(user)
        return user
      }
    },
      user: {
        type: userType,
        description: "A Single user",
        args: {
          id: { type: GraphQLInt },
        },
        resolve: (parent, args) => users.find((user) => user.id === args.id),
      },
    }
  ),
});

const RootMutationType = new GraphQLObjectType({
  name: "Mutation",
  description: "Root Mutation",
  fields: () => ({
    additem: {
      type: itemType,
      description: "Add a item",
      args: {
        name: { type: GraphQLNonNull(GraphQLString) },
        userId: { type: GraphQLNonNull(GraphQLInt) },
      },
      resolve: (parent, args) => {
        const item = {
          id: items.length + 1,
          name: args.name,
          userId: args.userId,
        };
        items.push(item);
        return item;
      },
    },
    adduser: {
      type: userType,
      description: "Add a user",
      args: {
        email: { type: GraphQLNonNull(GraphQLString) },
        password: { type: GraphQLNonNull(GraphQLString) }
      },
      resolve: async (parent, args) => {
        const user = await prisma.user.create({
          data: {
            email: args.email,
            password: args.password,
          },
        });
        return user;
      },
    },
  }),
});

const schema = new GraphQLSchema({
  query: RootQueryType,
  mutation: RootMutationType,
});

app.use(
  "/graphql",
  expressGraphQL({
    schema: schema,
    graphiql: true,
  })
);
app.listen(5000, () => console.log("Server Running"));