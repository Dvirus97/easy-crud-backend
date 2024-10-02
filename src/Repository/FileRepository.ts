import fs from "fs";
import { GUID } from "../GUID";
import { IBaseModel } from "../model";
import { IRepository } from "./IRepository";

const folder = "database";

export class FileManager<T = any> {
  constructor(private relativePath: string, private extension: string = ".json") {
    const folderExists = fs.existsSync("./" + folder);
    if (!folderExists) {
      fs.mkdirSync("./" + folder);
    }
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
  constructor(private fileName: string) {
    this.fileManager = new FileManager<T>("./" + folder + "/" + this.fileName);
  }

  fileManager: FileManager<T>;

  get(id: string) {
    const data: T[] = this.fileManager.load();
    return data.find((x) => x.id == id);
  }
  getAll() {
    return this.fileManager.load() as T[];
  }
  update(data: T) {
    const db = this.getAll();
    const index = db.findIndex((x) => x.id == data.id);
    if (index == -1) {
      return false;
    }
    data.version = (db[index].version ?? 0) + 1;
    db[index] = data;
    this.fileManager.save(db);
    return true;
  }
  create(data: T) {
    const db = this.getAll();
    if (data.id == null) {
      data.id = GUID.new();
    }
    data.version = 0;
    db.push(data);
    this.fileManager.save(db);
    return true;
  }
  delete(id: string) {
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
