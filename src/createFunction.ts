import { IBaseModel } from "./model";
import { FileRepository } from "./Repository/FileRepository";
import { MongoDbFactory } from "./Repository/mongoRepository";
import { RouteCreator } from "./RouteCreator";
import { Express } from "express";

let repositoryKind: "mongoDb" | "files" | undefined;
let mongoDb: MongoDbFactory;

export function chooseRepository(
  kind: "mongoDb" | "files",
  options?: {
    connectionString?: string;
  }
) {
  repositoryKind = kind;
  if (kind == "mongoDb") {
    if (!options?.connectionString) {
      throw new Error(
        "You must specify a connectionString, example: chooseRepository('mongoDb', {connectionString: 'mongodb://localhost:27017/myDb'})"
      );
    }
    mongoDb = new MongoDbFactory(options?.connectionString);
  }
}

export function createRoute(app: Express, type: string) {
  if (!repositoryKind) {
    throw new Error("You must specify a repository, call 'chooseRepository()'");
  }
  if (repositoryKind === "mongoDb") {
    return new RouteCreator(app, type, mongoDb.createCollection(type));
  } else if (repositoryKind === "files") {
    return createRouteInFile(app, type);
  }
}

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
