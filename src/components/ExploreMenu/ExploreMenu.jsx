import React, { useRef } from "react";
import { categories } from "../../assets/assets";
import "./ExploreMenu.css";

const ExploreMenu = ({ category, setCategory }) => {
  const menuRef = useRef(null);

  console.log("ExploreMenu - current category:", category);

  const scrollLeft = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: -200,
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (menuRef.current) {
      menuRef.current.scrollBy({
        left: 200,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="explore-menu position-relative">
      <h1 className="d-flex align-items-center justify-content-between">
        Your Health Starts Here
        <div className="d-flex gap-2">
          <i
            className="bi bi-arrow-left-circle scroll-icon"
            onClick={scrollLeft}
            role="button"
          ></i>
          <i
            className="bi bi-arrow-right-circle scroll-icon"
            onClick={scrollRight}
            role="button"
          ></i>
        </div>
      </h1>

      <p>All Your Medicines, One Trusted Place.</p>

      <div
        className="d-flex gap-4 overflow-auto explore-menu-list"
        ref={menuRef}
      >
        {categories.map((item, index) => (
          <div
            key={index}
            className={`text-center explore-menu-list-item ${
              item.category === category ? "active" : ""
            }`}
            onClick={() => {
              console.log("Clicked category:", item.category);
              const newCategory = category === item.category ? "All" : item.category;
              console.log("Setting category to:", newCategory);
              setCategory(newCategory);
            }}
            style={{ cursor: "pointer" }}
          >
            <img
              src={item.icon}
              alt={item.category}
              className={
                item.category === category
                  ? "rounded-circle active"
                  : "rounded-circle"
              }
              height={128}
              width={128}
            />
            <p className="mt-2 fw-bold">{item.category}</p>
          </div>
        ))}
      </div>

      <hr />
    </div>
  );
};

export default ExploreMenu;