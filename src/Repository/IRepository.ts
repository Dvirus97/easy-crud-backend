export interface IRepository<T> {
  config?: () => void;
  get: (id: string) => T | undefined;
  getAll: () => T[];
  update: (data: T) => boolean;
  create: (data: T) => boolean;
  delete: (id: string) => boolean;
  clear: () => void;
}
