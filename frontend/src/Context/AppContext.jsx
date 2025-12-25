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
    const fetchUser = async(){
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
            toast.error(error.message)
            
        }
    }

    //use effect to retrieve token from local storage
    useEffect(()=>{
        const token = localStorage.getItem("token")
        setToken(token)
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

    }

 return (<AppContext.Provider value={value}>
    {children}
    
 </AppContext.Provider>)
}

export const useAppContext = () => {
   
    return useContext(AppContext)

}