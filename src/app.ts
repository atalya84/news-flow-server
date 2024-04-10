import authRoute from "./routes/auth_routes";
import express, { Express } from "express";
import mongoose from "mongoose";

const initApp = (): Promise<Express> => {
    const promise = new Promise<Express>((resolve) => {
      const db = mongoose.connection;
      db.once("open", () => console.log("Connected to Database"));
      db.on("error", (error) => console.error(error));
      const url = process.env.DB_URL;
      mongoose.connect(url!, {
          useNewUrlParser: true,
          useUnifiedTopology: true,
      } as any).then(() => {
        const app = express();
        app.use(cors())
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        app.use((req, res, next) => {
          res.header("Access-Control-Allow-Origin", "*");
          res.header("Access-Control-Allow-Methods", "*");
          res.header("Access-Control-Allow-Headers", "*");
          res.header("Access-Control-Allow-Credentials", "true");
          next();
        })
        app.use("/auth", authRoute);
        resolve(app);
      });
    });
    return promise;
  };
  
  export default initApp;