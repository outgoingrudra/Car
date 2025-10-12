import React, { useEffect } from "react";
import { assets, dummyMyBookingsData } from "../assets/assets";
import Title from "../Components/Title";

export default function MyBookings() {
  const [bookings, setBookings] = React.useState([]);

  const fetchBookings = async () => {
    setBookings(dummyMyBookingsData);
  };

  useEffect(() => {
    fetchBookings();
  }, []);
  return (
    <div className="px-6 md:px-16 lg:px-24  xl:px-32  2xl:px-48  mt-16  text-sm max-w-7xl">
      <Title
        title="My Bookings "
        subTitle=" View and manage your all car bookings "
      />

      <div className="">
        {bookings.map((booking, index) => (
          <div
            className="grid grid-cols-1 md:grid-cols-4  gap-6 p-6 border border-borderColor rounded-lg mt-5 first:mt-12 "
            key={index}
          >
            {/* car image and info */}

            <div className="md:col-span-1">
              <div className="rounded-md overflow-hidden mb-3 ">
                <img
                  src={booking.car.image}
                  alt=""
                  className="w-full h-auto aspect-video object-cover"
                />
              </div>
              <p className="text-lg font-medium mt-2 ">
                {booking.car.brand} {booking.car.model}
              </p>
              <p className="text-gray-500">
                {booking.car.year} . {booking.car.category} .{" "}
                {booking.car.location}
              </p>
            </div>
            {/* booking info */}
            <div className="md:col-span-2 ">
              <div className="flex items-center gap-2 ">
                <p className="px-3 py-1.5 bg-light rounded">
                  {" "}
                  Booking #{index + 1}
                </p>
                <p
                  className={`px-3 py-1  text-xs  rounded-full  ${
                    booking.status == "confirmed"
                      ? "bg-green-400/15 text-green-600"
                      : "bg-red-400/15 text-red-600"
                  } `}
                >
                  {" "}
                  {booking.status}{" "}
                </p>
              </div>
              <div className="flex items-start gap-2 mt-3">
                <img
                  src={assets.calendar_icon_colored}
                  className="w-4 h-4 mt-1"
                  alt=""
                />

                <div className="">
                  <p className=" text-gray-500">Rental Period</p>
                  <p className="">
                    {booking.pickupDate("T")[0]} to {booking.returnDate("T")[0]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
