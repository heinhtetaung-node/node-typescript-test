import express, { Application, Request } from "express";
import NodeCache from "node-cache";
import dotenv from "dotenv";
import {
  getRestaurant,
  getRestaurantMenu,
  getRestaurantMenus,
} from "./repositories/RestaurantRepository";

dotenv.config();

export const apiCache = new NodeCache();
apiCache.flushAll();

const app: Application = express();
const port = 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => res.send("LINE MAN Wongnai Frontend Assignment"));

interface RestaurantRequest {
  id: number;
}
app.get("/restaurants/:id", async (req: Request<RestaurantRequest>, res) => {
  const id = req.params.id;
  const { status, data } = await getRestaurant(id);
  return res.status(status).send(data);
});

interface RestaurantMenusRequest {
  restaurantId: number;
}
app.get(
  "/restaurants/:restaurantId/menus",
  async (req: Request<RestaurantMenusRequest>, res) => {
    const { restaurantId } = req.params;
    const { status, data } = await getRestaurantMenus(restaurantId);
    return res.status(status).send(data);
  }
);

interface RestaurantMenuRequest extends RestaurantMenusRequest {
  menuName: string;
  type: "short" | "full";
}
app.get(
  "/restaurants/:restaurantId/menus/:menuName/:type",
  async (req: Request<RestaurantMenuRequest>, res) => {
    const { restaurantId, menuName, type } = req.params;
    const { status, data } = await getRestaurantMenu(
      restaurantId,
      menuName,
      type
    );
    return res.status(status).send(data);
  }
);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error) {
  console.error(`Error occured: ${(error as Error).message}`);
}

export default app;
