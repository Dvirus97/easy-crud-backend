"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RouteCreator = void 0;
const express_1 = __importDefault(require("express"));
class RouteCreator {
    constructor(app, type, repo) {
        this.repo = repo;
        this.router = express_1.default.Router();
        this.getOne_get();
        this.getAll_get();
        this.addOne_post();
        this.updateOne_put();
        this.updateMany_put();
        this.deleteOne_delete();
        this.deleteAll_delete();
        app.use("/" + type, this.router);
    }
    getOne_get() {
        this.router.get("/one/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repo.get(req.params.id);
            res.json(data);
        }));
    }
    getAll_get() {
        this.router.get("/all", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const data = yield this.repo.getAll();
            res.json(data);
        }));
    }
    addOne_post() {
        this.router.post("/one", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const newData = req.body;
            yield this.repo.create(newData);
            res.json({ message: "Data added successfully", id: newData.id });
        }));
    }
    updateOne_put() {
        this.router.put("/one/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const updatedData = req.body;
            const success = yield this.repo.update(Object.assign(Object.assign({}, updatedData), { id }));
            if (success) {
                res.json({ message: "Data updated successfully", id });
            }
            else {
                res.status(404).json({ message: "Data not found" });
            }
        }));
    }
    updateMany_put() {
        this.router.put("/many", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const updates = req.body; // Array of update objects
            let count = 0;
            for (const update of updates) {
                const success = yield this.repo.update(update);
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
        }));
    }
    deleteOne_delete() {
        this.router.delete("/one/:id", (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = req.params.id;
            const success = yield this.repo.delete(id);
            if (success) {
                res.json({ message: "Data deleted successfully" });
            }
            else {
                res.status(404).json({ message: "Data not found" });
            }
        }));
    }
    deleteAll_delete() {
        this.router.delete("/all", (req, res) => __awaiter(this, void 0, void 0, function* () {
            yield this.repo.clear();
            res.json({ message: "All Data deleted successfully" });
        }));
    }
}
exports.RouteCreator = RouteCreator;
