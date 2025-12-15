import dotenv from 'dotenv';
dotenv.config();
//import mongoose
import mongoose from "mongoose";

//mongoose function connect
function connect() {
  mongoose
    .connect(process.env.DB_CONNECT)
    .then(() => console.log("Database is Connected"))
    .catch(err => console.log(err, "Database is not connected"));
}

//export
export default connect;