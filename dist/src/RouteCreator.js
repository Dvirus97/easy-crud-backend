"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteCreator = exports.createRouteInFile = void 0;
const FileRepository_1 = require("./Repository/FileRepository");
const express_1 = __importDefault(require("express"));
function createRouteInFile(app, type) {
    return new RouteCreator(app, type, new FileRepository_1.FileRepository(type));
}
exports.createRouteInFile = createRouteInFile;
class RouteCreator {
    constructor(app, type, repo) {
        this.repo = repo;
        this._router = express_1.default.Router();
        this.getOne_get();
        this.getAll_get();
        this.addOne_post();
        this.updateOne_put();
        this.updateMany_put();
        this.deleteOne_delete();
        this.deleteAll_delete();
        app.use("/" + type, this._router);
    }
    getOne_get() {
        this._router.get("/one/:id", (req, res) => {
            const data = this.repo.get(req.params.id);
            res.json(data);
        });
    }
    getAll_get() {
        this._router.get("/all", (req, res) => {
            const data = this.repo.getAll();
            res.json(data);
        });
    }
    addOne_post() {
        this._router.post("/one", (req, res) => {
            const newData = req.body;
            this.repo.create(newData);
            res.json({ message: "Data added successfully", id: newData.id });
        });
    }
    updateOne_put() {
        this._router.put("/one/:id", (req, res) => {
            const id = req.params.id;
            const updatedData = req.body;
            const success = this.repo.update(Object.assign(Object.assign({}, updatedData), { id }));
            if (success) {
                res.json({ message: "Data updated successfully", id });
            }
            else {
                res.status(404).json({ message: "Data not found" });
            }
        });
    }
    updateMany_put() {
        this._router.put("/many", (req, res) => {
            const updates = req.body; // Array of update objects
            let count = 0;
            for (const update of updates) {
                const success = this.repo.update(update);
                if (success) {
                    count++;
                }
            }
            if (count > 0) {
                res.json({ message: `${count} data items updated successfully` });
            }
            else {
                res.status(404).json({ message: "No data items found to update" });
            }
        });
    }
    deleteOne_delete() {
        this._router.delete("/one/:id", (req, res) => {
            const id = req.params.id;
            const success = this.repo.delete(id);
            if (success) {
                res.json({ message: "Data deleted successfully" });
            }
            else {
                res.status(404).json({ message: "Data not found" });
            }
        });
    }
    deleteAll_delete() {
        this._router.delete("/all", (req, res) => {
            this.repo.clear();
            res.json({ message: "All Data deleted successfully" });
        });
    }
}
exports.RouteCreator = RouteCreator;
