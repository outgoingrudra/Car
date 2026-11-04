import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";

export default function AccountSettings() {
  const { user, token, axios, setUser } = useAppContext();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [busy, setBusy] = useState("");
  useEffect(() => { if (user) { setName(user.name); setEmail(user.email); } }, [user]);
  useEffect(() => { if (!image) { setPreview(""); return; } const url = URL.createObjectURL(image); setPreview(url); return () => URL.revokeObjectURL(url); }, [image]);
  if (!token) return <Navigate to="/" replace />;
  if (!user) return <main className="mx-auto max-w-2xl px-6 py-16 text-gray-500">Loading account...</main>;

  const saveProfile = async (event) => {
    event.preventDefault(); setBusy("profile");
    try {
      const form = new FormData(); form.append("name", name.trim()); if (image) form.append("image", image);
      const { data } = await axios.patch("/api/users/profile", form);
      if (!data.success) throw new Error(data.message);
      setUser(data.user); setImage(null); toast.success(data.message);
    } catch (error) { toast.error(error.response?.data?.message || error.message); }
    finally { setBusy(""); }
  };
  const requestCode = async () => {
    setBusy("email");
    try { const { data } = await axios.post("/api/users/email-change", { email }); if (!data.success) throw new Error(data.message); setCodeSent(true); toast.success(data.message); }
    catch (error) { toast.error(error.response?.data?.message || error.message); }
    finally { setBusy(""); }
  };
  const verifyCode = async () => {
    setBusy("verify");
    try { const { data } = await axios.post("/api/users/email-change/verify", { code }); if (!data.success) throw new Error(data.message); setUser(data.user); setCodeSent(false); setCode(""); toast.success(data.message); }
    catch (error) { toast.error(error.response?.data?.message || error.message); }
    finally { setBusy(""); }
  };
  const inputClass = "mt-2 w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15";
  return <main className="mx-auto w-full max-w-2xl px-6 py-10 md:py-14">
    <h1 className="text-3xl font-semibold text-gray-900">Account settings</h1>
    <p className="mt-2 text-gray-500">Update your profile and contact email.</p>
    <form onSubmit={saveProfile} className="mt-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Your profile</h2>
      <div className="mt-5 flex items-center gap-5">
        {preview || user.image ? <img src={preview || user.image} alt="Profile" className="h-20 w-20 rounded-full object-cover" /> : <span className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-2xl font-semibold text-primary">{user.name?.[0]?.toUpperCase()}</span>}
        <label className="cursor-pointer rounded-lg border border-slate-300 px-4 py-2 text-sm font-medium hover:bg-slate-50">Change photo<input type="file" accept="image/*" className="sr-only" onChange={(event) => { const file = event.target.files?.[0]; if (file && (!file.type.startsWith("image/") || file.size > 5 * 1024 * 1024)) { toast.error("Choose an image under 5 MB"); event.target.value = ""; return; } setImage(file || null); }} /></label>
      </div>
      <p className="mt-2 text-xs text-gray-500">JPG, PNG, or another image up to 5 MB.</p>
      <label className="mt-6 block text-sm font-medium">Name<input required maxLength={80} value={name} onChange={(event) => setName(event.target.value)} className={inputClass} /></label>
      <button disabled={Boolean(busy)} className="mt-6 min-h-11 rounded-lg bg-primary px-6 font-medium text-white disabled:opacity-50">{busy === "profile" ? "Saving..." : "Save profile"}</button>
    </form>
    <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold">Email address</h2>
      <p className="mt-1 text-sm text-gray-500">A verification code will be sent to your new email.</p>
      <label className="mt-5 block text-sm font-medium">Email<input type="email" required value={email} onChange={(event) => { setEmail(event.target.value); setCodeSent(false); }} className={inputClass} /></label>
      {!codeSent ? <button type="button" disabled={Boolean(busy) || email.trim().toLowerCase() === user.email} onClick={requestCode} className="mt-5 min-h-11 rounded-lg bg-primary px-6 font-medium text-white disabled:opacity-50">{busy === "email" ? "Sending..." : "Verify new email"}</button> : <div className="mt-5"><label className="block text-sm font-medium">Six digit code<input value={code} inputMode="numeric" maxLength={6} onChange={(event) => setCode(event.target.value.replace(/\D/g, ""))} className={inputClass} /></label><button type="button" disabled={Boolean(busy) || code.length !== 6} onClick={verifyCode} className="mt-5 min-h-11 rounded-lg bg-primary px-6 font-medium text-white disabled:opacity-50">{busy === "verify" ? "Checking..." : "Confirm email"}</button></div>}
    </section>
  </main>;
}
