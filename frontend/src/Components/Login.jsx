import React from 'react'
import { motion, AnimatePresence } from 'framer-motion';
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';

export default function Login() {
    const { setShowLogin, login, navigate, axios } = useAppContext();
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (state === "login") {
            const success = await login(email, password);
            if (success) {
                setShowLogin(false);
                navigate("/");
            }
        } else {
            try {
                const { data } = await axios.post(`/api/users/${state}`, {
                    name,
                    email,
                    password
                });
                console.log(data);
                
                if (data.success) {
                    const loginSuccess = await login(email, password);
                    if (loginSuccess) {
                        setShowLogin(false);
                        navigate("/");
                    }
                } else {
                    toast.error(data.message);
                }
            } catch (error) {
                toast.error(error.response?.data?.message || error.message);
            }
        }
    };

    // Clear form when switching between login/register
    React.useEffect(() => {
        setName("");
        setEmail("");
        setPassword("");
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
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
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

                <motion.div 
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
                </motion.div>

                <motion.div 
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
                </motion.div>

                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.3 }}
                >
                    {state === "register" ? (
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
                    className="bg-primary hover:bg-blue-600 transition-all text-white w-full py-2 rounded-md cursor-pointer"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5, duration: 0.3 }}
                >
                    {state === "register" ? "Create Account" : "Login"}
                </motion.button>
            </motion.form>
        </motion.div>
    )
}