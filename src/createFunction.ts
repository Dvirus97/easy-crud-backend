import { IBaseModel } from "./model";
import { FileRepository } from "./Repository/FileRepository";
import { MongoDbFactory } from "./Repository/mongoRepository";
import { RouteCreator } from "./RouteCreator";
import { Express } from "express";

export function createRouteInFile(app: Express, type: string) {
  return new RouteCreator(app, type, new FileRepository<IBaseModel>(type));
}

/**
 *
 * @param app express app
 * @param type the type of the entity
 * @param connectionString example: mongodb://localhost:27017/myDb
 * @returns
 */
export function createRouteInMongoDb(app: Express, type: string, connectionString: string) {
  const db = new MongoDbFactory(connectionString);
  return new RouteCreator(app, type, db.createCollection(type));
}
