import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { assets } from "../../assets/assets";
import Title from "../../Components/owner/Title";
import OwnerSkeleton, { InlineSpinner } from "../../Components/owner/OwnerSkeleton";
import { useAppContext } from "../../Context/AppContext";

export default function ManageCars() {
  const { isOwner, axios, currency } = useAppContext();
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(null);

  const fetchOwnerCars = useCallback(async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError("");
    try {
      const { data } = await axios.get("/api/owner/cars");
      if (!data.success) throw new Error(data.message || "Could not load cars");
      setCars(data.cars);
    } catch (err) { setError(err.response?.data?.message || err.message); }
    finally { setLoading(false); }
  }, [axios]);

  useEffect(() => { if (isOwner) fetchOwnerCars(); }, [isOwner, fetchOwnerCars]);

  const updateCar = async (carId, action) => {
    if (busy) return;
    if (action === "delete-car" && !window.confirm("Delete this car listing?")) return;
    setBusy({ id: carId, action });
    try {
      const { data } = await axios.post(`/api/owner/${action}`, { carId });
      if (!data.success) throw new Error(data.message || "Could not update car");
      toast.success(data.message);
      await fetchOwnerCars(false);
    } catch (err) { toast.error(err.response?.data?.message || err.message); }
    finally { setBusy(null); }
  };

  const actionClass = "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600 transition-colors hover:border-blue-200 hover:bg-blue-50 hover:text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-50";
  return <div className="w-full min-w-0 px-4 py-10 md:px-10">
    <Title title="Manage Cars" subTitle="Update your listings and manage car availability." />
    <div className="mt-6 max-w-5xl">
      {loading ? <OwnerSkeleton label="Loading your cars" /> : error ? <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-6"><p>{error}</p><button onClick={() => fetchOwnerCars()} className="mt-3 font-medium text-primary">Try again</button></div>
        : cars.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 px-6 py-16 text-center"><img src={assets.carIconColored} alt="" className="mx-auto mb-4 h-10 w-10 opacity-60" /><h2 className="text-lg font-semibold text-gray-800">Your garage is empty</h2><p className="mt-2 text-sm text-gray-500">Add your first car to start receiving booking requests.</p><Link to="/owner/add-car" className="mt-5 inline-flex min-h-11 items-center rounded-lg bg-primary px-5 font-medium text-white">Add a car</Link></div>
        : <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
          <table className="w-full border-collapse text-left text-sm text-gray-600">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-gray-500"><tr>
              <th scope="col" className="px-5 py-4 font-semibold">Car</th>
              <th scope="col" className="px-4 py-4 font-semibold max-lg:hidden">Category</th>
              <th scope="col" className="px-4 py-4 font-semibold">Daily price</th>
              <th scope="col" className="px-4 py-4 font-semibold max-md:hidden">Status</th>
              <th scope="col" className="px-5 py-4 text-right font-semibold">Actions</th>
            </tr></thead>
            <tbody>{cars.map((car) => <tr key={car._id} className="border-b border-slate-100 last:border-b-0 hover:bg-slate-50/60">
              <td className="px-5 py-4 align-middle"><div className="flex min-w-[190px] items-center gap-3">
                <img src={car.image} alt="" className="h-12 w-16 shrink-0 rounded-lg bg-slate-100 object-cover" />
                <div><p className="font-semibold text-gray-800">{car.brand} {car.model}</p><p className="mt-1 text-xs text-gray-500">{car.seating_capacity} seats · {car.transmission}</p></div>
              </div></td>
              <td className="px-4 py-4 align-middle max-lg:hidden">{car.category}</td>
              <td className="whitespace-nowrap px-4 py-4 align-middle font-medium text-gray-800">{currency}{car.pricePerDay}</td>
              <td className="px-4 py-4 align-middle max-md:hidden"><span className={`inline-flex whitespace-nowrap rounded-full px-3 py-1 text-xs font-medium ${car.isAvailable ? "bg-emerald-50 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>{car.isAvailable ? "Available" : "Unavailable"}</span></td>
              <td className="px-5 py-4 align-middle"><div className="flex items-center justify-end gap-2">
                <Link to={`/owner/edit-car/${car._id}`} title="Edit listing" aria-label={`Edit ${car.brand} ${car.model}`} className={actionClass}><ActionIcon type="edit" /></Link>
                <button type="button" disabled={Boolean(busy)} title={car.isAvailable ? "Make unavailable" : "Make available"} aria-label={`${car.isAvailable ? "Make unavailable" : "Make available"}: ${car.brand} ${car.model}`} className={actionClass} onClick={() => updateCar(car._id, "toggle-car")}>
                  {busy?.id === car._id && busy.action === "toggle-car" ? <InlineSpinner /> : <ActionIcon type={car.isAvailable ? "hide" : "show"} />}
                </button>
                <button type="button" disabled={Boolean(busy)} title="Delete listing" aria-label={`Delete ${car.brand} ${car.model}`} className={`${actionClass} hover:!border-red-200 hover:!bg-red-50 hover:!text-red-600`} onClick={() => updateCar(car._id, "delete-car")}>
                  {busy?.id === car._id && busy.action === "delete-car" ? <InlineSpinner /> : <ActionIcon type="delete" />}
                </button>
              </div></td>
            </tr>)}</tbody>
          </table>
        </div>}
    </div>
  </div>;
}

function ActionIcon({ type }) {
  const paths = {
    edit: <><path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L9 17l-4 1 1-4Z"/></>,
    show: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"/><circle cx="12" cy="12" r="3"/></>,
    hide: <><path d="M3 3l18 18"/><path d="M10.6 5.1A11 11 0 0 1 12 5c6.5 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8.1 2 12 2 12s3.5 7 10 7a10 10 0 0 0 4.2-.9"/><path d="M10 10a3 3 0 0 0 4 4"/></>,
    delete: <><path d="M3 6h18M8 6V4h8v2m3 0-1 14H6L5 6"/><path d="M10 10v6m4-6v6"/></>
  };
  return <svg aria-hidden="true" width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[type]}</svg>;
}
