import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Title from "../../Components/owner/Title";
import { assets, cityList } from "../../assets/assets";
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import OwnerSkeleton, { InlineSpinner } from "../../Components/owner/OwnerSkeleton";

const emptyCar = { brand: "", model: "", year: "", pricePerDay: "", category: "", transmission: "", fuel_type: "", seating_capacity: "", location: "", description: "" };
const choices = {
  category: ["Sedan", "SUV", "VAN"],
  transmission: ["Automatic", "Manual", "Semi-Manual"],
  fuel_type: ["Gas", "Diesel", "Petrol", "Electric", "Hybrid"],
  location: cityList
};

export default function AddCar() {
  const { id } = useParams();
  const { axios, currency, fetchCars, navigate } = useAppContext();
  const [car, setCar] = useState(emptyCar);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const fileInput = useRef(null);

  useEffect(() => {
    let active = true;
    setImage(null);
    setError("");
    if (!id) { setCar(emptyCar); setExistingImage(""); setLoading(false); return; }
    setLoading(true);
    axios.get(`/api/owner/cars/${id}`).then(({ data }) => {
      if (!active) return;
      if (!data.success) throw new Error(data.message);
      setCar(Object.fromEntries(Object.keys(emptyCar).map((key) => [key, data.car[key]])));
      setExistingImage(data.car.image);
    }).catch((err) => { if (active) setError(err.response?.data?.message || err.message); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [id, axios]);

  useEffect(() => {
    if (!image) { setPreview(""); return; }
    const url = URL.createObjectURL(image);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [image]);

  const save = async (event) => {
    event.preventDefault();
    if (saving) return;
    if (!id && !image) { toast.error("Choose a car photo"); return; }
    setSaving(true);
    try {
      const body = new FormData();
      if (image) body.append("image", image);
      body.append("carData", JSON.stringify(car));
      const { data } = id ? await axios.patch(`/api/owner/cars/${id}`, body) : await axios.post("/api/owner/add-car", body);
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      await fetchCars();
      if (id) navigate("/owner/manage-cars");
      else { setCar(emptyCar); setImage(null); if (fileInput.current) fileInput.current.value = ""; }
    } catch (err) { toast.error(err.response?.data?.message || err.message); }
    finally { setSaving(false); }
  };

  if (loading) return <div className="flex-1 px-4 py-10 md:px-10"><Title title="Edit Car" subTitle="Loading your listing details." /><div className="mt-6"><OwnerSkeleton variant="form" label="Loading car details" /></div></div>;
  if (error) return <div className="p-10"><p role="alert">{error}</p><Link to="/owner/manage-cars" className="text-primary">Back to cars</Link></div>;
  const inputClass = "mt-1 w-full rounded-md border border-borderColor bg-white px-3 py-2 outline-primary";
  const fields = [
    ["brand", "Brand", "text"], ["model", "Model", "text"],
    ["year", "Year", "number", { min: 1886, max: new Date().getFullYear() + 1 }],
    ["pricePerDay", `Daily price (${currency})`, "number", { min: 1, max: 1000000, step: "0.01" }],
    ["category", "Category"], ["transmission", "Transmission"], ["fuel_type", "Fuel type"],
    ["seating_capacity", "Seats", "number", { min: 1, max: 50 }], ["location", "Pickup location"]
  ];
  return <div className="flex-1 px-4 py-10 md:px-10">
    <Title title={id ? "Edit Car" : "Add New Car"} subTitle={id ? "Update the listing. Existing booking totals stay the same." : "Add your car's details and a photo to start accepting reservations."} />
    <form onSubmit={save} className="mt-6 max-w-2xl space-y-5 text-sm text-gray-600">
      <fieldset disabled={saving} className="space-y-5">
        <div className="flex flex-wrap items-center gap-4">
          <img src={preview || existingImage || assets.upload_icon} alt="Car preview" className="h-28 w-44 rounded-lg bg-gray-50 object-contain" />
          <label className="block">{id ? "Replace photo (optional)" : "Car photo"}
            <input ref={fileInput} type="file" accept="image/jpeg,image/png,image/webp" className="mt-2 block max-w-full" onChange={(event) => {
              const file = event.target.files[0];
              if (file && (file.size > 5 * 1024 * 1024 || !["image/jpeg", "image/png", "image/webp"].includes(file.type))) {
                toast.error("Choose a JPG, PNG or WebP image up to 5 MB"); event.target.value = ""; return;
              }
              setImage(file || null);
            }} />
            <span className="text-xs text-gray-400">JPG, PNG or WebP · up to 5 MB</span>
          </label>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          {fields.map(([key, label, type, constraints]) => <label key={key} className="block">{label}
            {choices[key] ? <select required className={inputClass} value={car[key]} onChange={(e) => setCar({ ...car, [key]: e.target.value })}>
              <option value="">Select {label.toLowerCase()}</option>
              {car[key] && !choices[key].includes(car[key]) && <option value={car[key]}>{car[key]}</option>}
              {choices[key].map((value) => <option key={value} value={value}>{value}</option>)}
            </select> : <input required type={type} {...constraints} maxLength={type === "text" ? 120 : undefined} className={inputClass} value={car[key]} onChange={(e) => setCar({ ...car, [key]: e.target.value })} />}
          </label>)}
        </div>
        <label className="block">Description<textarea required maxLength={3000} rows={5} className={inputClass} value={car.description} onChange={(e) => setCar({ ...car, description: e.target.value })} /></label>
        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:gap-4">
          <button type="submit" disabled={saving} aria-busy={saving} className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-sm transition-colors hover:bg-primary-dull focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary disabled:cursor-wait disabled:opacity-70 sm:w-auto sm:min-w-[220px]">
            {saving ? <InlineSpinner /> : <img src={assets.tick_icon} alt="" className="h-5 w-5" />}
            {saving ? "Saving your car..." : id ? "Save changes" : "List your car"}
          </button>
          <Link to="/owner/manage-cars" className="inline-flex min-h-12 items-center justify-center rounded-lg px-5 text-sm font-medium text-gray-600 hover:bg-slate-50">Cancel</Link>
        </div>
      </fieldset>
    </form>
  </div>;
}
