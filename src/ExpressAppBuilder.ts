import express from "express";
import cors from "cors";

export class ExpressAppBuilder {
  private app = express();

  build() {
    return this.app;
  }

  withJson() {
    this.app.use(express.json());
    return this;
  }
  withStatic(path: string) {
    this.app.use(express.static(path));
    return this;
  }
  withAnyCors() {
    this.app.use(cors());
    return this;
  }
}
