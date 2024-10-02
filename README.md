# easy-crud-backend

> https://github.com/Dvirus97/easy-crud-backend

This package help create past basic curd api.

The package build on express.

use RouteCreator class to create new Route.

etch route contain few endpoints

- get/id: getOne_get();
- get: getAll_get();
- post: addOne_post();
- put/id: updateOne_put();
- put: updateMany_put();
- delete/id: deleteOne_delete();
- delete: deleteAll_delete();

you can extend this class and change the logic.

### example to simple usage

in this example the

```ts
import { createRouteInFile, RouteCreator, ExpressAppBuilder } from "easy-crud-backend";

const PORT = 3010;
const app = new ExpressAppBuilder().withAnyCors().withJson().build();

// this is an alias to "new RouteCreator()"
createRouteInFile(app, "person");
// this is the explicit way
new RouteCreator(app, "car", new FileRepository("car"));

app.listen(PORT, () => {
  console.log("listening on http://localhost:" + PORT);
});
```

you can also extend this class and change the logic

```ts
class CustomRouter extends RouteCreator<any> {
  constructor(type: string) {
    super(app, type, new FileRepository(type));
  }

  protected override getAll_get(): void {
    this._router.get("/", (req, res) => {
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
    this._router.post("/many", (req, res) => {
      // logic...
    });
  }
}
```
