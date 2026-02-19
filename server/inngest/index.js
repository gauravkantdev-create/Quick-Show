import { Inngest } from "inngest";
import User from "../models/User.js";

// Create Inngest client
export const inngest = new Inngest({ id: "movie-ticket-booking" });

/* ===============================
   CREATE USER
=================================*/
const syncUserCreation = inngest.createFunction(
  { id: "sync-user-from-clerk" },
  { event: "clerk/user.created" },

  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data

      const userData = {
        _id: id,
        email: email_addresses?.[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
      }

      await User.create(userData)
      console.log("User created:", id)
    } catch (error) {
      console.error("Error creating user:", error.message)
      throw error
    }
  }
);

/* ===============================
   DELETE USER
=================================*/
const syncUserDeletion = inngest.createFunction(
  { id: "delete-user-with-clerk" },
  { event: "clerk/user.deleted" },

  async ({ event }) => {
    try {
      const { id } = event.data
      await User.findByIdAndDelete(id)
      console.log("User deleted:", id)
    } catch (error) {
      console.error("Error deleting user:", error.message)
      throw error
    }
  }
);

/* ===============================
   UPDATE USER
=================================*/
const syncUserUpdation = inngest.createFunction(
  { id: "update-user-with-clerk" },
  { event: "clerk/user.updated" },

  async ({ event }) => {
    try {
      const { id, first_name, last_name, email_addresses, image_url } = event.data

      const userData = {
        email: email_addresses?.[0]?.email_address,
        name: `${first_name || ""} ${last_name || ""}`.trim(),
        image: image_url,
      }

      await User.findByIdAndUpdate(id, userData)
      console.log("User updated:", id)
    } catch (error) {
      console.error("Error updating user:", error.message)
      throw error
    }
  }
);

/* ===============================
   EXPORT FUNCTIONS
=================================*/
export const functions = [
  syncUserCreation,
  syncUserDeletion,
  syncUserUpdation,
];
