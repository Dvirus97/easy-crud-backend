import fs from "fs";
import { GUID } from "../GUID";
import { IBaseModel } from "../model";
import { IRepository } from "./IRepository";

// const folder = "database";

export class FileManager<T = any> {
  constructor(private relativePath: string, private extension: string = ".json") {}

  exists(path: string) {
    return fs.existsSync(path);
  }
  makeFolder(path: string) {
    fs.mkdirSync(path);
  }
  load() {
    try {
      const data = fs.readFileSync(this.relativePath + this.extension, "utf8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  save(data: T[]) {
    fs.writeFileSync(this.relativePath + this.extension, JSON.stringify(data, null, 2));
  }
}

export class FileRepository<T extends IBaseModel = IBaseModel> implements IRepository<T> {
  constructor(fileName: string) {
    const folder = "./database";
    this.fileManager = new FileManager<T>(folder + "/" + fileName);
    if (!this.fileManager.exists(folder)) {
      this.fileManager.makeFolder(folder);
    }
  }

  fileManager: FileManager<T>;

  async get(id: string) {
    const data: T[] = await this.getAll();
    return data.find((x) => x.id == id);
  }
  async getAll() {
    return this.fileManager.load() as T[];
  }
  async update(data: T) {
    const db = await this.getAll();
    const index = db.findIndex((x) => x.id == data.id);
    if (index == -1) {
      return false;
    }
    data.version = (db[index].version ?? 0) + 1;
    db[index] = data;
    this.fileManager.save(db);
    return true;
  }
  async create(data: T) {
    const db = await this.getAll();
    data.id ??= GUID.new();
    data.version ??= 0;
    db.push(data);
    this.fileManager.save(db);
    return true;
  }
  async delete(id: string) {
    const db = await this.getAll();
    const index = db.findIndex((x) => x.id == id);
    if (index == -1) {
      return false;
    }
    db.splice(index, 1);
    this.fileManager.save(db);
    return true;
  }
  async clear() {
    this.fileManager.save([]);
  }
}
