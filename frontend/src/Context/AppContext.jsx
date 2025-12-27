import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY;
    const [token, setToken] = useState(null);
    const [user, setUser] = useState(null);
    const [isOwner, setIsOwner] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [returnDate, setReturnDate] = useState('');
    const [cars, setCars] = useState([]);

    // Function to check user logged in
    const fetchUser = async () => {
        try {
            const { data } = await axios.get("/api/users/data");
            if (data.success) {
                setUser(data.user);
                setIsOwner(data.user.role === 'owner');
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
        navigate("/"); // FIXED: Added navigation
    };

    // useEffect to retrieve token from local storage
    useEffect(() => {
        const storedToken = localStorage.getItem("token");
        if (storedToken) {
            setToken(storedToken);
            axios.defaults.headers.common["Authorization"] = storedToken; // FIXED: Set headers here
        }
        fetchCars();
    }, []);

    // useEffect to fetch user data when token changes
    useEffect(() => {
        if (token) {
            fetchUser(); // FIXED: Fetch user when token is available
        }
    }, [token]); // FIXED: Added token dependency

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