import mongoose, { connect } from "mongoose";

const config = {
  isConnected: 0,
};

export const connectDb = async () => {
  if (config.isConnected) return;

  try {
    const { connection } = await mongoose.connect(process.env.MONGO_DB_URL);

    config.isConnected = connection.readyState;
    console.log("DB connected with host ", connection.host);
  } catch (error) {
    console.log("Failed to connect with database");
    console.log(error);
  }
};
