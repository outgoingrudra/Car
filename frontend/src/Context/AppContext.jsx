import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


axios.defaults.baseURL = import.meta.env.VITE_BASE_URL

export const AppContext =  createContext() ;
export const AppProvider =({children})=>{
    const navigate = useNavigate();
    const currency = import.meta.env.VITE_CURRENCY ;
    const [token ,setToken]=  useState(null);
    const [user ,setUser]=  useState(null);
    const [isOwner ,setIsOwner]=  useState(false);
    const [showLogin , setShowLogin ] = useState(false)
    const [pickupDate , setPickupDate ] = useState('')
    const [returnDate , setReturnDate ] = useState('')

    const [cars , setCars ] = useState([])

    //fun to check user logged in
    const fetchUser = async()=>{
        try {
         const {data} =  await axios.get("/api/user/data")
         if(data.success) 
        {
            setUser(data.user)
            setIsOwner(data.user.role=='owner')
        }
        else{
            navigate("/")
        }

        } catch (error) {
             console.log("error in app context file in user fetch");

            toast.error(error.message)
            
        }
    }
    //fun to fetch all cars
   const fetchCars = async () => {
    try {
        const { data } = await axios.get("/api/users/cars")
        if (data.success) {
            setCars(data.cars)
        } else {
            toast.error(data.message || "Failed to fetch cars")
        }
    } catch (error) {
        console.log("Error fetching cars:", error)
        // Check if it's an axios error with response
        if (error.response) {
            // Server responded with error status
            toast.error(error.response.data?.message || "Server error")
        } else if (error.request) {
            // Request made but no response
            toast.error("Network error. Please check your connection.")
        } else {
            // Something else
            toast.error(error.message || "Failed to fetch cars")
        }
    }
}
    //func to log out user
    const logout = ()=>{
        localStorage.removeItem("token")
        setToken(null)
        setUser(null)
        setIsOwner(false)
        axios.defaults.headers.common['Authorization']=""
        toast.success("Log out Successfully !")
    }

    //use effect to retrieve token from local storage
    useEffect(()=>{
        const token = localStorage.getItem("token")
        setToken(token)
        fetchCars()
    },[])

    //use effect to fetch user data from token
    useEffect(()=>{
        if(token)
        {
            axios.defaults.headers.common["Authorization"]=`${token}`
        }
    },[])

    const value ={
        navigate, 
        currency ,
        axios , user, setUser, token , setToken , isOwner,setIsOwner , fetchUser, showLogin,setShowLogin,logout,
        fetchCars,cars,setCars ,pickupDate,setPickupDate,returnDate,setReturnDate

    }

 return (<AppContext.Provider value={value}>
    {children}
    
 </AppContext.Provider>)
}

export const useAppContext = () => {
   
    return useContext(AppContext)

}