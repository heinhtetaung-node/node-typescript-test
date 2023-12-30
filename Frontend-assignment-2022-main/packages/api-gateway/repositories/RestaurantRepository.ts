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
      return menuShort;
    })
  );
  return { data, status };
};
