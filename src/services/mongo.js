import mongoose from "mongoose";

const ConnectWithMongo = async (url) => {
    await mongoose.connect(url);
}

export { ConnectWithMongo };