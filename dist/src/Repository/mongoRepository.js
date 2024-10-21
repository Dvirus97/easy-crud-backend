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
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _MongoDbFactory_instances, _MongoDbFactory_schema, _MongoDbFactory_initSchema;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MongoDbFactory = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const GUID_1 = require("../GUID");
class MongoModel {
    constructor(model, type) {
        this.model = model;
        this.type = type;
    }
    get(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.model.findById(id));
        });
    }
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log("getAll");
            return (yield this.model.find());
        });
    }
    update(data) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = data.type) !== null && _a !== void 0 ? _a : (data.type = this.type);
            (_b = data.version) !== null && _b !== void 0 ? _b : (data.version = 0);
            data.version++;
            try {
                const entity = yield this.get(data.id);
                yield (entity === null || entity === void 0 ? void 0 : entity.updateOne(data));
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    create(data) {
        var _a, _b, _c;
        return __awaiter(this, void 0, void 0, function* () {
            (_a = data.type) !== null && _a !== void 0 ? _a : (data.type = this.type);
            (_b = data.version) !== null && _b !== void 0 ? _b : (data.version = 0);
            (_c = data.id) !== null && _c !== void 0 ? _c : (data.id = GUID_1.GUID.new());
            // (data as any)._id = data.id;
            console.log(data);
            try {
                yield this.model.create(data);
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.get(id);
                yield (entity === null || entity === void 0 ? void 0 : entity.deleteOne());
                return true;
            }
            catch (error) {
                console.log(error);
                return false;
            }
        });
    }
    clear() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.deleteMany({});
        });
    }
}
class MongoDbFactory {
    //#endregion
    /**
     *
     * @param connectionString example: "mongodb://localhost:27017/myDb"
     */
    constructor(connectionString) {
        this.connectionString = connectionString;
        _MongoDbFactory_instances.add(this);
        //#region
        _MongoDbFactory_schema.set(this, void 0);
        mongoose_1.default.connect(connectionString);
        __classPrivateFieldGet(this, _MongoDbFactory_instances, "m", _MongoDbFactory_initSchema).call(this);
    }
    createCollection(collectionName) {
        const model = mongoose_1.default.model(collectionName, __classPrivateFieldGet(this, _MongoDbFactory_schema, "f"), collectionName);
        return new MongoModel(model, collectionName);
    }
}
exports.MongoDbFactory = MongoDbFactory;
_MongoDbFactory_schema = new WeakMap(), _MongoDbFactory_instances = new WeakSet(), _MongoDbFactory_initSchema = function _MongoDbFactory_initSchema() {
    __classPrivateFieldSet(this, _MongoDbFactory_schema, new mongoose_1.default.Schema({
        _id: String,
        type: String,
        version: String,
    }, {
        strict: false,
        toJSON: { virtuals: true },
        toObject: { virtuals: true }, // Include virtuals in plain objects
    }), "f");
    __classPrivateFieldGet(this, _MongoDbFactory_schema, "f")
        .virtual("id")
        .get(function () {
        var _a;
        return (_a = this._id) === null || _a === void 0 ? void 0 : _a.toString(); // Get _id as id
    })
        .set(function (id) {
        this._id = id; // Set _id when id is set
    });
};
