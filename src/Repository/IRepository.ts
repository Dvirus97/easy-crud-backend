export interface IRepository<T> {
  get: (id: string) => Promise<T | undefined>;
  getAll: () => Promise<T[]>;
  update: (data: T) => Promise<boolean>;
  create: (data: T) => Promise<boolean>;
  delete: (id: string) => Promise<boolean>;
  clear: () => void;
}
