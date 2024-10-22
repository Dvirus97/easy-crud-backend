import { IBaseModel } from "../model";
import { IRepository } from "./IRepository";
import mongoose, { HydratedDocument, InferSchemaType, Model, ObtainSchemaGeneric } from "mongoose";
import { GUID } from "../GUID";

class MongoModel<T extends IBaseModel> implements IRepository<T> {
  constructor(
    private model: Model<
      InferSchemaType<any>,
      ObtainSchemaGeneric<any, "TQueryHelpers">,
      ObtainSchemaGeneric<any, "TInstanceMethods">,
      ObtainSchemaGeneric<any, "TVirtuals">,
      HydratedDocument<
        InferSchemaType<any>,
        ObtainSchemaGeneric<any, "TVirtuals"> & ObtainSchemaGeneric<any, "TInstanceMethods">,
        ObtainSchemaGeneric<any, "TQueryHelpers">
      >,
      any
    > &
      ObtainSchemaGeneric<any, "TStaticMethods">,
    private type: string
  ) {}

  async get(id: string) {
    return (await this.model.findById(id)) as T;
  }

  async getAll() {
    return (await this.model.find()) as T[];
  }

  async update<R extends Partial<T>>(data: R) {
    data.type ??= this.type;
    data.version ??= 0;
    data.version!++;
    try {
      const entity: any = await this.get(data.id!);
      await entity?.updateOne(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async create<R extends Partial<T>>(data: R) {
    data.type ??= this.type;
    data.version ??= 0;
    data.id ??= GUID.new();
    try {
      await this.model.create(data);
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async delete(id: string) {
    try {
      const entity: any = await this.get(id);
      await entity?.deleteOne();
      return true;
    } catch (error) {
      console.log(error);
      return false;
    }
  }
  async clear() {
    await this.model.deleteMany({});
  }
}

export class MongoDbFactory {
  //#region
  #schema?: mongoose.Schema<
    any,
    mongoose.Model<any, any, any, any, any, any>,
    {},
    {},
    {},
    {},
    {
      strict: false;
      toJSON: { virtuals: true }; // Include virtuals in JSON output
      toObject: { virtuals: true };
    },
    { _id?: string | null | undefined; type?: string | null | undefined; version?: string | null | undefined },
    mongoose.Document<
      unknown,
      {},
      mongoose.FlatRecord<{
        _id?: string | null | undefined;
        type?: string | null | undefined;
        version?: string | null | undefined;
      }>
    > &
      mongoose.FlatRecord<{
        _id?: string | null | undefined;
        type?: string | null | undefined;
        version?: string | null | undefined;
      }> &
      Required<{ _id: string | null }> & { __v?: number }
  >;
  //#endregion

  /**
   *
   * @param connectionString example: "mongodb://localhost:27017/myDb"
   */
  constructor(private connectionString: string) {
    mongoose.connect(connectionString);
    this.#initSchema();
  }

  #initSchema() {
    this.#schema = new mongoose.Schema(
      {
        _id: String,
        type: String,
        version: String,
      },
      {
        strict: false,
        toJSON: { virtuals: true }, // Include virtuals in JSON output
        toObject: { virtuals: true }, // Include virtuals in plain objects
      }
    );
    this.#schema
      .virtual("id")
      .get(function () {
        return this._id?.toString(); // Get _id as id
      })
      .set(function (id) {
        this._id = id; // Set _id when id is set
      });
  }

  createCollection(collectionName: string) {
    const model = mongoose.model(collectionName, this.#schema, collectionName);
    return new MongoModel(model, collectionName);
  }
}
