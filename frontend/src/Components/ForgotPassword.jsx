import { useState } from "react";
import toast from "react-hot-toast";
import { useAppContext } from "../Context/AppContext";

export default function ForgotPassword({ onBack }) {
  const { axios, setShowLogin } = useAppContext();
  const [email, setEmail] = useState("");
  const [step, setStep] = useState("email");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [nextSend, setNextSend] = useState(0);
  const sendCode = async () => {
    if (Date.now() < nextSend) { toast("Please wait one minute before requesting another code."); return; }
    setBusy(true);
    try {
      const { data } = await axios.post("/api/users/forgot-password", { email });
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      setStep("reset");
      setCode("");
      setNextSend(Date.now() + 60000);
    } catch (error) { toast.error(error.response?.data?.message || error.message); }
    finally { setBusy(false); }
  };
  const submit = async (event) => {
    event.preventDefault();
    if (step === "email") return sendCode();
    if (password !== confirm) { toast.error("Passwords do not match"); return; }
    setBusy(true);
    try {
      const { data } = await axios.post("/api/users/reset-password", { email, code, password });
      if (!data.success) throw new Error(data.message);
      toast.success(data.message);
      onBack();
    } catch (error) { toast.error(error.response?.data?.message || error.message); }
    finally { setBusy(false); }
  };
  const inputClass = "mt-1 w-full rounded-lg border border-gray-300 px-3 py-2 outline-primary";
  return <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setShowLogin(false)}>
    <form onSubmit={submit} onClick={(event) => event.stopPropagation()} className="w-full max-w-sm max-h-[90vh] overflow-y-auto rounded-xl bg-white p-7 space-y-4">
      <h2 className="text-2xl font-semibold">Reset your password</h2>
      {step === "email" ? <>
        <p className="text-sm text-gray-500">Enter your account email to receive a reset code.</p>
        <label className="block text-sm">Email<input autoFocus type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} /></label>
      </> : <>
        <p className="text-sm text-gray-500">Enter the code sent to {email}. It expires after 10 minutes.</p>
        <label className="block text-sm">Reset code<input autoFocus inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}" required value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))} className={inputClass} /></label>
        <label className="block text-sm">New password<input type="password" autoComplete="new-password" minLength={8} required value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} /></label>
        <label className="block text-sm">Confirm password<input type="password" autoComplete="new-password" minLength={8} required value={confirm} onChange={(e) => setConfirm(e.target.value)} className={inputClass} /></label>
        <button type="button" disabled={busy} onClick={sendCode} className="text-sm text-primary disabled:opacity-50">Resend code</button>
      </>}
      <button disabled={busy} className="w-full rounded-lg bg-primary py-2 text-white disabled:opacity-50">{busy ? "Please wait..." : step === "email" ? "Send reset code" : "Save new password"}</button>
      <button type="button" disabled={busy} onClick={onBack} className="text-sm text-primary">Back to login</button>
    </form>
  </div>;
}
