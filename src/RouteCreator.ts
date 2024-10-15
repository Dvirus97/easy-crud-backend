import { FileRepository } from "./Repository/FileRepository";
import { IRepository } from "./Repository/IRepository";
import express, { Express } from "express";
import { IBaseModel } from "./model";

export function createRouteInFile(app: Express, type: string) {
  return new RouteCreator(app, type, new FileRepository<IBaseModel>(type));
}

export class RouteCreator<T extends IBaseModel> {
  protected _router = express.Router();

  constructor(app: Express, type: string, private repo: IRepository<T>) {
    this.getOne_get();
    this.getAll_get();
    this.addOne_post();
    this.updateOne_put();
    this.updateMany_put();
    this.deleteOne_delete();
    this.deleteAll_delete();

    app.use("/" + type, this._router);
  }

  protected getOne_get() {
    this._router.get("/one/:id", (req, res) => {
      const data = this.repo.get(req.params.id);
      res.json(data);
    });
  }
  protected getAll_get() {
    this._router.get("/all", (req, res) => {
      const data = this.repo.getAll();
      res.json(data);
    });
  }

  protected addOne_post() {
    this._router.post("/one", (req, res) => {
      const newData = req.body as T;
      this.repo.create(newData);
      res.json({ message: "Data added successfully", id: newData.id });
    });
  }

  protected updateOne_put() {
    this._router.put("/one/:id", (req, res) => {
      const id = req.params.id;
      const updatedData = req.body as T;

      const success = this.repo.update({ ...updatedData, id });
      if (success) {
        res.json({ message: "Data updated successfully", id });
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    });
  }

  protected updateMany_put() {
    this._router.put("/many", (req, res) => {
      const updates: T[] = req.body; // Array of update objects
      let count = 0;
      for (const update of updates) {
        const success = this.repo.update(update);
        if (success) {
          count++;
        }
      }
      if (count > 0) {
        res.json({ message: `${count} data items updated successfully` });
      } else {
        res.status(404).json({ message: "No data items found to update" });
      }
    });
  }

  protected deleteOne_delete() {
    this._router.delete("/one/:id", (req, res) => {
      const id = req.params.id;
      const success = this.repo.delete(id);
      if (success) {
        res.json({ message: "Data deleted successfully" });
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    });
  }
  protected deleteAll_delete() {
    this._router.delete("/all", (req, res) => {
      this.repo.clear();
      res.json({ message: "All Data deleted successfully" });
    });
  }
}
