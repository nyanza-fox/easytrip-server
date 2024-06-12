import { InsertOneResult } from "mongodb";
import { db } from "../lib/mongodb";

import type { User, UserInput } from "../types/user";

type UserModel = {
  findAll: () => Promise<User[]>;
  register: (payload: UserInput) => Promise<InsertOneResult>;
  getUserByEmail: (email: string) => Promise<User>;
};

const userModel: UserModel = {
  findAll: async () => {
    const users = (await db.collection("users").find().toArray()) as User[];

    return users;
  },
  register: async (payload: UserInput) => {
    const users = await db.collection("users").insertOne(payload);

    return users;
  },
  getUserByEmail: async (email: string) => {
    const user = (await db
      .collection("users")
      .findOne({ email: email })) as User;

    return user;
  },
};

export default userModel;
