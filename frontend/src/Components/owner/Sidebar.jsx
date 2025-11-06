import React from "react";
import { assets, dummyUserData, ownerMenuLinks } from "../../assets/assets";
import { NavLink, useLocation } from "react-router-dom";

export default function Sidebar() {
  const user = dummyUserData;
  const location = useLocation();
  const [image, setImage] = React.useState("");
  const updateImage = async () => {
    user.image = URL.createObjectURL(image);
    setImage("");
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-8 w-12 md:w-60 border-r border-borderColor text-sm">
      <div className="group relative">
        <label htmlFor="image">
          <img
            src={
              image
                ? URL.createObjectURL(image)
                : user?.image ||
                  "data:image/png;base64,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"
            }
            alt=""
            className="h-9 md:h-14 w-9 md:w-14 rounded-full mx-auto"
          />
          <input
            type="file"
            id="image"
            accept="image/*"
            hidden
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div className="absolute hidden top-0 right-0 left-0 bottom-0 bg-black/10 rounded-full justify-center items-center group-hover:flex cursor-pointer">
            <img src={assets.edit_icon} alt="" />
          </div>
        </label>
      </div>
      {image && (
        <button
          onClick={updateImage}
          className="absolute top-0 right-0 flex p-2 gap-1 bg-primary/10 text-primary cursor-pointer "
        >
          Save <img src={assets.check_icon} width={13} alt="" />
        </button>
      )}
      <p className="mt-2 text-base max-md:hidden">
        {user?.name || "User Name"}
      </p>

      <div className="w-full">
        {ownerMenuLinks.map((link, index) => (
          <NavLink
            key={index}
            to={link.path}
            className={`relative flex items-center gap-2 w-full py-3 pl-4 first:mt-6 ${
              link.path === location.pathname
                ? "bg-primary/10 text-primary"
                : "text-gray-600"
            }`}
          >
            <img
              src={
                link.path === location.pathname
                  ? link.coloredIcon
                  : link.icon
              }
              alt=""
            />
            <span className="max-md:hidden ">{link.name} </span>
            <div
              className={`${
                link.path === location.pathname && "bg-primary"
              } w-1.5 h-8 rounded-l right-0 absolute `}
            ></div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}