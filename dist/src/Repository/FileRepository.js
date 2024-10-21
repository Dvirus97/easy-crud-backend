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
        const folder = "./database";
        this.fileManager = new FileManager(folder + "/" + fileName);
        if (!this.fileManager.exists(folder)) {
            this.fileManager.makeFolder(folder);
        }
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = yield this.getAll();
            return data.find((x) => x.id == id);
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.fileManager.load();
        });
    }
    update(data) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getAll();
            const index = db.findIndex((x) => x.id == data.id);
            if (index == -1) {
                return false;
            }
            data.version = ((_a = db[index].version) !== null && _a !== void 0 ? _a : 0) + 1;
            db[index] = data;
            this.fileManager.save(db);
            return true;
        });
    }
    create(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getAll();
            (_a = data.id) !== null && _a !== void 0 ? _a : (data.id = GUID_1.GUID.new());
            (_b = data.version) !== null && _b !== void 0 ? _b : (data.version = 0);
            db.push(data);
            this.fileManager.save(db);
            return true;
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const db = yield this.getAll();
            const index = db.findIndex((x) => x.id == id);
            if (index == -1) {
                return false;
            }
            db.splice(index, 1);
            this.fileManager.save(db);
            return true;
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            this.fileManager.save([]);
        });
    }
}
exports.FileRepository = FileRepository;
