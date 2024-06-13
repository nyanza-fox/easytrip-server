import { InsertOneResult, UpdateResult } from "mongodb";
import { db } from "../lib/mongodb";

import type { ProfileInput, User, UserInput } from "../types/user";

type UserModel = {
  findAll: () => Promise<User[]>;
  register: (payload: UserInput) => Promise<InsertOneResult>;
  getUserByEmail: (email: string) => Promise<User>;
  updateProfile: (
    payload: ProfileInput,
    email: string
  ) => Promise<UpdateResult>;
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
  updateProfile: async (payload: ProfileInput, email: string) => {
    const existingUser = await db.collection("users").findOne({ email: email });

    if (!existingUser) {
      throw new Error("User not found");
    }

    const updatedProfile = { ...existingUser.profile, ...payload };

    const updatedUser = await db
      .collection("users")
      .updateOne({ email: email }, { $set: { profile: updatedProfile } });
    return updatedUser;
  },
};

export default userModel;
