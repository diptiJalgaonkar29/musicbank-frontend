import React from "react";
import "./BasketPopup.css";
import { useSelector } from "react-redux";

const BasketPopup = ({ history }) => {
  const { tracksInDownloadBasket } = useSelector(
    (state) => state.downloadBasket
  );

  const showHideBasketPopup = (display) => {
    display = document.getElementById("basket_nav").matches(":hover")
      ? "block"
      : tracksInDownloadBasket.length == 0
      ? "none"
      : display;
    document.getElementById("basketPopup_container").style.display = display;
  };

  return (
    <section
      className="basketPopup_container"
      id="basketPopup_container"
      onMouseEnter={() => showHideBasketPopup("block")}
      onMouseLeave={() => showHideBasketPopup("none")}
    >
      <p className="basketPopup_header">Your Cart</p>
      <p className="basketPopup_subheader">
        {tracksInDownloadBasket?.length} items
      </p>
      <section className="basket_track_container">
        {tracksInDownloadBasket?.map((track, i) => {
          return (
            <section className="basket_track_item" key={`basket_popup_'${i}`}>
              <span className="basket_track_name">
                {track?.track_name || "-"}
              </span>
              <span className="basket_track_type">
                {track?.audio_type || "-"}
              </span>
            </section>
          );
        })}
      </section>
      {/* <Link to="/basket" style={{ textDecoration: "none" }}> */}
      <button
        className="basketPopup_checkout_btn"
        onClick={() => {
          document.getElementById("basketPopup_container").style.display =
            "none";
          navigate("/basket");
        }}
      >
        Check Out
      </button>
      {/* </Link> */}
    </section>
  );
};

export default BasketPopup;
