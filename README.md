# easy-crud-backend

> https://github.com/Dvirus97/easy-crud-backend

This package help create fast basic curd api.

The package build on express.

use RouteCreator class to create new Route.

etch route contain few endpoints
|method| route | function |
|-| ------------------ | ------------------- |
| get | /one/id | getOne_get() |
| get | /all | getAll_get() |
| post | /one | addOne_post() |
| put | /one/id | updateOne_put() |
| put | /many | updateMany_put() |
| delete | /one/id | deleteOne_delete() |
| delete | /all | deleteAll_delete() |

you can extend this class and change the logic.

### example to simple usage

```ts
import { createRouteInFile, RouteCreator, ExpressAppBuilder } from "easy-crud-backend";

const PORT = 3010;
const app = express();

// this is an alias to "new RouteCreator()"
createRouteInFile(app, "person");
// this is the explicit way
new RouteCreator(app, "car", new FileRepository("car"));

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
```

Use `ExpressAppBuilder` class for easy settings

```ts
const app = new ExpressAppBuilder().withAnyCors().withJson().withStatic("/public").build();
```

you can also extend this class and change the logic

```ts
class CustomRouter extends RouteCreator<any> {
  constructor(type: string) {
    super(app, type, new FileRepository(type));
  }

  protected override getAll_get(): void {
    this.router.get("/", (req, res) => {
      res.json([{ test: "this is test" }]);
    });
  }
}

new CustomRouter(app, "person");
```

if you want to create a new endpoint you need to call the method in the constructor

```ts
class CustomRouter extends RouteCreator<any> {
  constructor(type: string) {
    super(app, type, new FileRepository(type));
    this.createMany();
  }

  createMany() {
    this.router.post("/many", (req, res) => {
      // logic...
    });
  }
}
```

---

# Other things in this package

### IBaseModel

base type of this package

```ts
export type IBaseModel = {
  id: string;
  type: string;
  version?: number;
};
```

all entities must have an `id` and a `type` property.
in the FileRepository i take care of the `version` property. each time an entity is changed, the `version` is incremented

---

### IRepository

this is an interface that represent the basic operations that you want to perform with database

implement this interface to create a repository and pass it as an argument to the constructor of `RouteCreator`

```ts
class MongoRepo implements IRepository<any> {
  get(id: string) {}
  getAll() {}
  update(data: any) {}
  create(data: any) {}
  delete(id: string) {}
  clear() {}
}
```

---

### FileManager

```ts
// const fileManager = new FileManager<type>("./path/to/file", ".extension");
const fileManager = new FileManager<any>("./package"); // extension defaults to ".json"

// read the content of the file
const data = fileManager.load();
// override the content of the file
fileManager.save(data);

// check if a path exists
if (!fileManager.exists("./model")) {
  // create folder
  fileManager.makeFolder("./model");
}
```

---

### GUID.new()

create new GUID id with this function

```ts
const id = GUID.new();
```
