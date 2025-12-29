import React from 'react'
import { useAppContext } from '../Context/AppContext';
import toast from 'react-hot-toast';

export default function Login() {
    const { setShowLogin, login, navigate } = useAppContext(); // Use the login function from context
    const [state, setState] = React.useState("login");
    const [name, setName] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const onSubmitHandler = async (e) => {
        e.preventDefault();
        
        if (state === "login") {
            // Use the login function from AppContext
            const success = await login(email, password);
            if (success) {
                setShowLogin(false);
                navigate("/");
            }
        } else {
            // For registration, keep your existing code
            try {
                const { data } = await axios.post(`/api/users/${state}`, {
                    name,
                    email,
                    password
                });
                console.log(data);
                
                if (data.success) {
                    // After successful registration, auto-login
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

    return (
        <div onClick={() => setShowLogin(false)} className="fixed top-0 bottom-0 left-0 right-0 z-100 flex items-center text-sm text-gray-600 bg-black/50">
            <form onSubmit={onSubmitHandler} onClick={(e) => e.stopPropagation()} className="flex flex-col gap-4 m-auto items-start p-8 py-12 w-80 sm:w-[352px] text-gray-500 rounded-lg shadow-xl border border-gray-200 bg-white">
                <p className="text-2xl font-medium m-auto">
                    <span className="text-primary">User</span> {state === "login" ? "Login" : "Sign Up"}
                </p>
                {state === "register" && (
                    <div className="w-full">
                        <p>Name</p>
                        <input 
                            onChange={(e) => setName(e.target.value)} 
                            value={name} 
                            placeholder="type here" 
                            className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                            type="text" 
                            required 
                        />
                    </div>
                )}
                <div className="w-full ">
                    <p>Email</p>
                    <input 
                        onChange={(e) => setEmail(e.target.value)} 
                        value={email} 
                        placeholder="type here" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                        type="email" 
                        required 
                    />
                </div>
                <div className="w-full ">
                    <p>Password</p>
                    <input 
                        onChange={(e) => setPassword(e.target.value)} 
                        value={password} 
                        placeholder="type here" 
                        className="border border-gray-200 rounded w-full p-2 mt-1 outline-primary" 
                        type="password" 
                        required 
                    />
                </div>
                {state === "register" ? (
                    <p>
                        Already have account? <span onClick={() => setState("login")} className="text-primary cursor-pointer">click here</span>
                    </p>
                ) : (
                    <p>
                        Create an account? <span onClick={() => setState("register")} className="text-primary cursor-pointer">click here</span>
                    </p>
                )}
                <button className="bg-primary hover:bg-blue-600 transition-all text-white w-full py-2 rounded-md cursor-pointer">
                    {state === "register" ? "Create Account" : "Login"}
                </button>
            </form>
        </div>
    )
}