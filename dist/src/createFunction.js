"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createRouteInMongoDb = exports.createRouteInFile = void 0;
const FileRepository_1 = require("./Repository/FileRepository");
const mongoRepository_1 = require("./Repository/mongoRepository");
const RouteCreator_1 = require("./RouteCreator");
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
