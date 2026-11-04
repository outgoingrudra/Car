import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';
import ForgotPassword from './ForgotPassword';

export default function Login() {
    const { setShowLogin, setToken, login, navigate, axios } = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");
    const [code, setCode] = React.useState("");
    const [submitting, setSubmitting] = React.useState(false);

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        setSubmitting(true);
        try {
            if (state === "login") {
                const result = await login(email, password);
                if (result === "verify") setState("verify");
                if (result === true) {
                    setShowLogin(false);
                    navigate("/");
                }
            } else if (state === "register") {
                const { data } = await axios.post("/api/users/register", { name, email, password });
                if (!data.success) throw new Error(data.message);
                toast.success(data.message);
                setState("verify");
            } else {
                const { data } = await axios.post("/api/users/verify-email", { email, code });
                if (!data.success) throw new Error(data.message);
                localStorage.setItem("token", data.token);
                setToken(data.token);
                toast.success(data.message);
                setShowLogin(false);
                navigate("/");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    };

    const resendCode = async () => {
        setSubmitting(true);
        try {
            const { data } = await axios.post("/api/users/resend-verification", { email });
            if (!data.success) throw new Error(data.message);
            toast.success(data.message);
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
        } finally {
            setSubmitting(false);
        }
    };

    // Clear form when switching between login/register
    React.useEffect(() => {
        if (state !== "verify") {
            setName("");
            setEmail("");
            setPassword("");
            setCode("");
        }
    }, [state]);

    // Animation variants
    const overlayVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { duration: 0.3 }
        },
        exit: { 
            opacity: 0,
            transition: { duration: 0.2 }
        }
    };

    const modalVariants = {
        hidden: { 
            opacity: 0,
            scale: 0.8,
            y: -50
        },
        visible: { 
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: "easeOut"
            }
        },
        exit: { 
            opacity: 0,
            scale: 0.8,
            y: 50,
            transition: { duration: 0.3 }
        }
    };

    const inputVariants = {
        hidden: { opacity: 0, x: -20 },
        visible: (i) => ({
            opacity: 1,
            x: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.3
            }
        })
    };

    if (state === "forgot") return <ForgotPassword onBack={() => setState("login")} />;
    return (
        <motion.div 
            onClick={() => setShowLogin(false)} 
            className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50"
            variants={overlayVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            style={{zIndex:1}}
        >
            <motion.form 
                onSubmit={onSubmitHandler} 
                onClick={(e) => e.stopPropagation()} 
                className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white"
                variants={modalVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
            >
                <motion.p 
                    className="text-2xl font-medium m-auto"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4 }}
                >
                    <span className="text-primary">User</span> {state === "login" ? "Login" : state === "register" ? "Sign Up" : "Verify Email"}
                </motion.p>

                <AnimatePresence mode="wait">
                    {state === "register" && (
                        <motion.div 
                            className="w-full"
                            key="name-field"
                            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                            animate={{ 
                                opacity: 1, 
                                height: "auto", 
                                marginBottom: 0,
                                transition: { duration: 0.3 }
                            }}
                            exit={{ 
                                opacity: 0, 
                                height: 0, 
                                marginBottom: 0,
                                transition: { duration: 0.2 }
                            }}
                        >
                            <p>Name</p>
                            <input 
                                onChange={(e) => setName(e.target.value)} 
                                value={name} 
                                placeholder="type here" 
                                className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors" 
                                type="text" 
                                required 
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {state !== "verify" && <motion.div
                    className="w-full"
                    custom={state === "register" ? 1 : 0}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="type here" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors" 
                        type="email" 
                        required 
                    />
                </motion.div>}

                {state !== "verify" && <motion.div
                    className="w-full"
                    custom={state === "register" ? 2 : 1}
                    variants={inputVariants}
                    initial="hidden"
                    animate="visible"
                >
                    <p>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="type here" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary focus:border-primary transition-colors" 
                        type="password" 
                        required 
                    />
                </motion.div>}

                {state === "login" && <button type="button" onClick={() => setState("forgot")} className="text-sm text-primary">Forgot password?</button>}
                {state === "verify" && <div className="w-full">
                    <p className="mb-2 text-sm">Enter the six digit code sent to <strong>{email}</strong>.</p>
                    <input value={code} onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        type="text" inputMode="numeric" autoComplete="one-time-code" pattern="[0-9]{6}"
                        placeholder="Verification code" required
                        className="border border-gray-200 rounded w-full p-2 outline-primary focus:border-primary" />
                    <button type="button" onClick={resendCode} disabled={submitting}
                        className="text-primary mt-3 disabled:opacity-50">Resend code</button>
                </div>}

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    {state === "verify" ? (
                        <>Wrong email? <button type="button" onClick={() => setState("register")} className="text-primary">Sign up again</button></>
                    ) : state === "register" ? (
                        <>
                            Already have account? <motion.span 
                                onClick={() => setState("login")} 
                                className="text-primary cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                click here
                            </motion.span>
                        </>
                    ) : (
                        <>
                            Create an account? <motion.span 
                                onClick={() => setState("register")} 
                                className="text-primary cursor-pointer"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                click here
                            </motion.span>
                        </>
                    )}
                </motion.p>

                <motion.button 
                    disabled={submitting}
                    className="bg-primary hover:bg-blue-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {submitting ? "Please wait..." : state === "register" ? "Send verification code" : state === "verify" ? "Verify email" : "Login"}
                </motion.button>
            </motion.form>
        </motion.div>
    )
}
