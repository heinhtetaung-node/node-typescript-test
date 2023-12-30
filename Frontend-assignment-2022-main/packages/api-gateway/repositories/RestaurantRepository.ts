import handleGetRequest from "../funcs/handleGetRequest";

export const apiBaseUrl = () => process.env.API_BASE_URL + "/restaurants/";

export const getRestaurant = (id: number) =>
  handleGetRequest(`${apiBaseUrl()}${id}.json`);

export const getRestaurantMenu = (
  restaurantId: number,
  menuName: string,
  type: "short" | "full"
) =>
  handleGetRequest(
    `${apiBaseUrl()}${restaurantId}/menus/${menuName}/${type}.json`
  );

export type MenuShort = {
  name: string;
  fullPrice: number;
  discountedPercent: number;
  totalInStock: number;
  sold: number;
};

export const getRandomItem = (items: any[]) => {
  return items[Math.floor(Math.random() * items.length)];
};

export const addDiscountToRandomItems = (menuShort: MenuShort) => {
  if (getRandomItem([true, false, false])) {
    menuShort.discountedPercent = getRandomItem([10, 15, 20]);
  }
  return menuShort;
};

export const addPopularToRandomItems = (menuShort: MenuShort) => {
  menuShort.sold = getRandomItem([
    menuShort.sold,
    100 + getRandomItem([10, 15, 20]),
  ]);
  return menuShort;
};

export const getRestaurantMenus = async (id: number) => {
  const { data, status } = await getRestaurant(id);
  if (status !== 200) return { data, status };
  data.menus = await Promise.all(
    data.menus.map(async (menuName: string) => {
      const { data: menuShort } = await getRestaurantMenu(
        id,
        menuName,
        "short"
      );
      return addPopularToRandomItems(addDiscountToRandomItems(menuShort));
    })
  );
  return { data, status };
};
