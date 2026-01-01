import React, { use, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { assets, dummyCarData } from "../assets/assets";
import Loader from "../Components/Loader";
import { useAppContext } from "../Context/AppContext";
import toast from "react-hot-toast";

export default function CarDetails() {
  const { id } = useParams();

  const {cars ,axios , pickupDate, setPickupDate, returnDate, setReturnDate  } =useAppContext()
  const navigate = useNavigate();
  const currency = import.meta.env.VITE_CURRENCY;

  const [car, setCar] = useState(null);

  const handleSubmit = async(e) => {
    e.preventDefault();
    try {
     const {data} =  await axios.post("/api/bookings/create",{car:id,pickupDate,returnDate})
     if(data.success)
     {
      toast.success(data.message)
      navigate("/my-bookings")
     }
     else{
        toast.error(data.message)
     }
    } catch (error) {
        toast.error(error.message)
    }
  }

  useEffect(() => {
    setCar(cars.find((car) => (car._id = id)));
  }, [id,cars]);
  return car ? (
    <div className="px-6 md:px-16 lg:px-24 xl:px-32 mt-16">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 mb-6 text-gray-600  cursor-pointer "
      >
        <img
          src={assets.arrow_icon}
          alt=""
          className="rotate-180 opacity-65 "
        />
        Back to All cars
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 ">
        {/* left :car image and details */}

        <div className="lg:col-span-2">
          <img
            src={car.image}
            className="w-full h-auto md:max-h-100 object-cover rounded-xl mb-6 shadow-md "
            alt=""
          />
          <div className="space-y-6 ">
            <div className="">
              <h1 className="text-3xl font-bold ">
                {car.brand} {car.model}
              </h1>
              <p className="text-gray-500 text-lg ">
                {car.category} {car.year}
              </p>
            </div>
            <hr className="border-borderColor my-6 " />
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 ">
              {[
                {
                  icon: assets.users_icon,
                  text: `${car.seating_capacity} Seats `,
                },
                { icon: assets.fuel_icon, text: car.fuel_type },
                { icon: assets.car_icon, text: car.transmission },
                { icon: assets.location_icon, text: car.location },
              ].map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex flex-col items-center bg-light p-4 rounded-lg "
                >
                  <img src={icon} alt="" className="h-5 mb-2 " />
                  {text}
                </div>
              ))}
            </div>
            {/* {description } */}
            <div className="">
              <h1 className="text-xl font-medium mb-3 ">Description</h1>
              <p className="text-gray-500">{car.description}</p>
            </div>

            {/* features */}

            <div className="text-xl font-medium mb-3 ">Features</div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {[
                "360 Camera",
                "Bluetooth",
                "Remote Start",
                "Sunroof",
                "USB Port",
              ].map((feature) => (
                <li key={feature} className="flex items-center text-gray-500 ">
                  <img src={assets.check_icon} alt="" className="h-4 mr-2 " />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* right : Booking form  */}
        <form onSubmit={handleSubmit}
          action=""
          className="shadow-lg h-max sticky top-18 rounded-xl p-6 space-y-6 text-gray-500"
        >
          <p className="flex items-center justify-between text-2xl font-bold text-gray-800">
            {currency} {car.pricePerDay}{" "}
            <span className="text-gray-500 font-normal">/day</span>
          </p>

          <hr className="border-borderColor my-6 text-gray-500" />

          <div className="flex flex-col gap-2">
            <label htmlFor="pickup-date" className="text-gray-500">
              Pick Up
            </label>
            <input
            value={pickupDate}
            onChange={(e)=>setPickupDate(e.target.value)}
              type="date"
              id="pickup-date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              min={new Date().toISOString().split("T")[0]}
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="return-date" className="text-gray-500">
              Return Date
            </label>
            <input
            value={returnDate}
            onChange={(e)=>setReturnDate(e.target.value)}
              type="date"
              id="return-date"
              className="border border-borderColor px-3 py-2 rounded-lg"
              required
            />
          </div>

          <button className="w-full bg-primary text-white my-2 py-3 rounded-lg font-medium hover:bg-primaryDark transition-colors">
            Book Now
          </button>

          <p>No credit card required to reserve</p>
        </form>
      </div>
    </div>
  ) : (
    <Loader />
  );
}
