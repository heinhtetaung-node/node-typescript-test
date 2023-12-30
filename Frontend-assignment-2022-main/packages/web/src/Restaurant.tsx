import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import noImg from "./images/no-image.png";
import { useParams } from "react-router";
import Dialog from "./Dialog";

function App() {
  const { id } = useParams() as any;
  const [restaurant, setRestaurant] = useState<any>();
  const [fullOpen, setFullOpen] = useState<boolean>(false);
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(0);
  const [detailMenu, setDetailMenu] = useState<any>();
  const tabs = ["All", "Popular", "Promotions"];

  const getDatas = async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/restaurants/${id}/menus`
      );
      if (response.status !== 200) {
        return history.push("/");
      }
      const data = await response.json();
      setRestaurant(data);
    } catch (err) {
      console.log(err);
      return history.push("/");
    }
  };
  useEffect(() => {
    getDatas();
  }, [id]);

  const filterResult = (menus: any[]) => {
    switch (activeTab) {
      case 1:
        return menus.sort((a, b) => b.sold - a.sold).slice(0, 10);
      case 2:
        return menus.filter((menu: any) => menu.discountedPercent > 0);
      default:
        return menus.sort((a, b) => b.sold - a.sold) ?? [];
    }
  };

  const handleOpenDetail = async (menuName: string, menu: any) => {
    const response = await fetch(
      `${import.meta.env.VITE_API_URL}/restaurants/${id}/menus/${menuName}/full`
    );
    if (response.status !== 200) {
      alert("cannot open detail");
      return;
    }
    const data = await response.json();
    setFullOpen(true);
    setDetailMenu({
      ...menu,
      largeImage: data.largeImage,
      options: data.options,
    });
  };

  if (!restaurant?.id) return <></>;

  return (
    <div>
      <Dialog
        dataTestId="full-dialog"
        isOpen={fullOpen}
        closeDialog={() => setFullOpen(false)}
      >
        <img
          src={detailMenu?.largeImage}
          className="-mt-3 w-full md:mt-4 md:ml-0 mb-4"
        />
        <div className="p-3">
          <h1>{detailMenu?.name}</h1>
          {detailMenu?.name && <PriceDetail menu={detailMenu} />}
          <div className="w-full flex">
            <span>Today Available : {detailMenu?.totalInStock}</span>,
            <span>Today Order : {detailMenu?.sold}</span>
          </div>

          {detailMenu?.options.map((option: any) => {
            return (
              <div>
                <span>{option.label}</span>
                <ul>
                  {option.choices.map((choice: any) => {
                    return (
                      <li>
                        <input type="radio" name="label" />
                        &nbsp;
                        {choice.label}
                      </li>
                    );
                  })}
                </ul>
              </div>
            );
          })}
          <div
            className={`${
              detailMenu?.discountedPercent > 0 && "p-1"
            } w-auto bg-red-600 z-40 absolute top-6 left-0 rounded-sm text-sm font-semibold  text-white`}
          >
            {detailMenu?.discountedPercent > 0 && (
              <span>-{detailMenu.discountedPercent}% Promotion</span>
            )}
          </div>
        </div>
      </Dialog>
      <a href="/">
        <h2 className="text-3xl text-blue-500 my-3">&#x2190;</h2>
      </a>
      <h1 className="text-xl font-semibold">{restaurant?.name}</h1>
      <h2 className="text-lg ">
        Opening Time - {restaurant?.activeTimePeriod?.open} ~{" "}
        {restaurant?.activeTimePeriod?.close}
      </h2>
      <br />
      <img src={restaurant?.coverImage} />
      <br />

      <div className="flex">
        {tabs.map((tab, i) => {
          return (
            <span
              className={`${
                i === activeTab
                  ? "bg-green-500 text-white "
                  : "bg-slate-200 text-slate-500 "
              } cursor-pointer p-1 text-sm bp-1 rounded-2xl px-2 m-1 min-w-12 text-center`}
              onClick={() => setActiveTab(i)}
            >
              {tab}
            </span>
          );
        })}
      </div>
      <br />
      {filterResult(restaurant?.menus).map((menu: any) => {
        return (
          <>
            <div
              className="w-full flex relative cursor-pointer"
              onClick={() => handleOpenDetail(menu.name, menu)}
            >
              <div
                className={`${
                  menu.discountedPercent > 0 && "p-1"
                } w-auto bg-red-600 z-40 absolute top-2 rounded-sm text-xs font-semibold  text-white`}
              >
                {menu.discountedPercent > 0 && (
                  <span>-{menu.discountedPercent}%</span>
                )}
              </div>
              <img
                src={menu.thumbnailImage ?? noImg}
                className="bg-gray-200 w-28 h-28 m-1"
              />
              <div className="p-4 pt-0 flex flex-col">
                <span>{menu.name}</span>
                <PriceDetail menu={menu} />
                {/* <span>Discount: {menu.discountedPercent}</span> */}
                <span>Today Available : {menu.totalInStock}</span>
                <span>Today Order : {menu.sold}</span>
              </div>
            </div>
            <hr className="mt-3 mb-8" />
          </>
        );
      })}
    </div>
  );
}

const PriceDetail = ({ menu }: { menu: any }) => (
  <div>
    Price:{" "}
    <span className={`${menu.discountedPercent > 0 && "line-through"}`}>
      {menu.fullPrice}บาท
    </span>
    {menu.discountedPercent > 0 &&
      ` ${menu.fullPrice - (menu.fullPrice / 100) * menu.discountedPercent}บาท`}
  </div>
);

export default App;
