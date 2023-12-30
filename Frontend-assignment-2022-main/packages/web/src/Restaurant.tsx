import { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import noImg from "./images/no-image.png";
import { useParams } from "react-router";

function App() {
  const { id } = useParams() as any;
  const [restaurant, setRestaurant] = useState<any>();
  const history = useHistory();

  const getDatas = async () => {
    try {
      const response = await fetch(
        "http://localhost:3001/restaurants/" + id + "/menus"
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

  if (!restaurant?.id) return <></>;

  return (
    <div className="bg-red-600 w-full h-full">
      <a href="/">
        <h2>&#x2190;</h2>
      </a>
      <h1 className="text-green-400">{restaurant?.name}</h1>
      <br />
      <img src={restaurant?.coverImage} />
      <br />
      <h2>
        Opening Time {restaurant?.activeTimePeriod?.open} ~{" "}
        {restaurant?.activeTimePeriod?.close}
      </h2>
      <br />
      {restaurant?.menus?.map((menu: any) => {
        return (
          <div>
            <img
              src={menu.thumbnailImage ?? noImg}
              width={100}
              style={{ background: "#f7f7f7" }}
            />
            <span>{menu.name}</span>
            <span>Price: {menu.fullPrice}</span>
            <span>Discount: {menu.discountedPercent}</span>
            <span>Available : {menu.totalInStock - menu.sold}</span>
            <hr />
          </div>
        );
      })}
    </div>
  );
}

export default App;
