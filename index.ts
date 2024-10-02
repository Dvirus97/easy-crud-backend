import { createRouteInFile, FileRepository, RouteCreator } from "@easy-crud-backend";
import express, { Express } from "express";
// import cors from "cors";

const app = express();
// app.use(cors());
app.use(express.json());

createRouteInFile(app, "person");

class CustomRouter extends RouteCreator<any> {
  constructor(app: Express, type: string) {
    super(app, type, new FileRepository(type));
  }

  protected getAll_get(): void {
    this._router.get("/", (req, res) => {
      res.json([{ test: "this is test" }]);
    });
  }
}

new CustomRouter(app, "car");

app.listen(3010, () => {
  console.log("listening on http://localhost:3010");
});
