"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteInMongoDb = exports.createRouteInFile = exports.createRoute = exports.chooseRepository = void 0;
const FileRepository_1 = require("./Repository/FileRepository");
const mongoRepository_1 = require("./Repository/mongoRepository");
const RouteCreator_1 = require("./RouteCreator");
let repositoryKind;
let mongoDb;
function chooseRepository(kind, options) {
    repositoryKind = kind;
    if (kind == "mongoDb") {
        if (!(options === null || options === void 0 ? void 0 : options.connectionString)) {
            throw new Error("You must specify a connectionString, example: chooseRepository('mongoDb', {connectionString: 'mongodb://localhost:27017/myDb'})");
        }
        mongoDb = new mongoRepository_1.MongoDbFactory(options === null || options === void 0 ? void 0 : options.connectionString);
    }
}
exports.chooseRepository = chooseRepository;
function createRoute(app, type) {
    if (!repositoryKind) {
        throw new Error("You must specify a repository, call 'chooseRepository()'");
    }
    if (repositoryKind === "mongoDb") {
        return new RouteCreator_1.RouteCreator(app, type, mongoDb.createCollection(type));
    }
    else if (repositoryKind === "files") {
        return createRouteInFile(app, type);
    }
}
exports.createRoute = createRoute;
function createRouteInFile(app, type) {
    return new RouteCreator_1.RouteCreator(app, type, new FileRepository_1.FileRepository(type));
}
exports.createRouteInFile = createRouteInFile;
/**
 *
 * @param app express app
 * @param type the type of the entity
 * @param connectionString example: mongodb://localhost:27017/myDb
 * @returns
 */
function createRouteInMongoDb(app, type, connectionString) {
    const db = new mongoRepository_1.MongoDbFactory(connectionString);
    return new RouteCreator_1.RouteCreator(app, type, db.createCollection(type));
}
exports.createRouteInMongoDb = createRouteInMongoDb;
