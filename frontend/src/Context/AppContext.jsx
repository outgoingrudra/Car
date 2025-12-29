import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;
    const [token, setToken] = useState(localStorage.getItem("token") || null); // Initialize from localStorage
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCars] = useState([]);

    // ✅ ADDED: Login function
    const login = async (email, password) => {
        try {
            const { data } = await axios.post("/api/users/login", { email, password });
            
            if (data.success && data.token) {
                // Save token to localStorage
                localStorage.setItem("token", data.token);
                
                // Update token state (this will trigger the useEffect to fetch user)
                setToken(data.token);
                
                toast.success("Login successful!");
                return true;
            } else {
                toast.error(data.message || "Login failed");
                return false;
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message);
            return false;
        }
    };

    // Function to check user logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/users/data");
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role == 'owner');
            } else {
                navigate("/");
            }
        } catch (error) {
            console.log("Error in app context file in user fetch:", error);
            toast.error(error.response?.data?.message || error.message);
        }
    };

    // Function to fetch all cars
    const fetchCars = async () => {
        try {
            const { data } = await axios.get("/api/users/cars");
            if (data.success) {
                setCars(data.cars);
            } else {
                toast.error(data.message || "Failed to fetch cars");
            }
        } catch (error) {
            console.log("Error fetching cars:", error);
            if (error.response) {
                toast.error(error.response.data?.message || "Server error");
            } else if (error.request) {
                toast.error("Network error. Please check your connection.");
            } else {
                toast.error(error.message || "Failed to fetch cars");
            }
        }
    };

    // Function to log out user
    const logout = () => {
        localStorage.removeItem("token");
        setToken(null);
        setUser(null);
        setIsOwner(false);
        axios.defaults.headers.common['Authorization'] = "";
        toast.success("Log out Successfully!");
        navigate("/");
    };

    // useEffect to update axios headers whenever token changes
    useEffect(() => {
        if (token) {
            axios.defaults.headers.common["Authorization"] = ` ${token}`;
            fetchUser(); // This will fetch and set user data
        } else {
            axios.defaults.headers.common["Authorization"] = "";
            setUser(null);
            setIsOwner(false);
        }
    }, [token]);

    // useEffect to fetch cars on mount
    useEffect(() => {
        fetchCars();
    }, []);

    const value = {
        navigate,
        currency,
        axios,
        user,
        setUser,
        token,
        setToken,
        isOwner,
        setIsOwner,
        fetchUser,
        login, // ✅ ADDED: Login function
        showLogin,
        setShowLogin,
        logout,
        fetchCars,
        cars,
        setCars,
        pickupDate,
        setPickupDate,
        returnDate,
        setReturnDate
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    return useContext(AppContext);
};