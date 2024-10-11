"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileRepository = exports.FileManager = void 0;
const fs_1 = __importDefault(require("fs"));
const GUID_1 = require("../GUID");
// const folder = "database";
class FileManager {
    constructor(relativePath, extension = ".json") {
        this.relativePath = relativePath;
        this.extension = extension;
    }
    exists(path) {
        return fs_1.default.existsSync(path);
    }
    makeFolder(path) {
        fs_1.default.mkdirSync(path);
    }
    load() {
        try {
            const data = fs_1.default.readFileSync(this.relativePath + this.extension, "utf8");
            return JSON.parse(data);
        }
        catch (err) {
            return [];
        }
    }
    save(data) {
        fs_1.default.writeFileSync(this.relativePath + this.extension, JSON.stringify(data, null, 2));
    }
}
exports.FileManager = FileManager;
class FileRepository {
    constructor(fileName) {
        this.fileName = fileName;
        const folder = "./database";
        this.fileManager = new FileManager(folder + "/" + this.fileName);
        if (!this.fileManager.exists(folder)) {
            this.fileManager.makeFolder(folder);
        }
    }
    get(id) {
        const data = this.fileManager.load();
        return data.find((x) => x.id == id);
    }
    getAll() {
        return this.fileManager.load();
    }
    update(data) {
        var _a;
        const db = this.getAll();
        const index = db.findIndex((x) => x.id == data.id);
        if (index == -1) {
            return false;
        }
        data.version = ((_a = db[index].version) !== null && _a !== void 0 ? _a : 0) + 1;
        db[index] = data;
        this.fileManager.save(db);
        return true;
    }
    create(data) {
        const db = this.getAll();
        if (!data.id) {
            data.id = GUID_1.GUID.new();
        }
        data.version = 0;
        db.push(data);
        this.fileManager.save(db);
        return true;
    }
    delete(id) {
        const db = this.getAll();
        const index = db.findIndex((x) => x.id == id);
        if (index == -1) {
            return false;
        }
        db.splice(index, 1);
        this.fileManager.save(db);
        return true;
    }
    clear() {
        this.fileManager.save([]);
    }
}
exports.FileRepository = FileRepository;
