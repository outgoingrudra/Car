import React, { useCallback, useEffect, useState } from 'react'

import Title from "../../Components/owner/Title"
import { useAppContext } from "../../Context/AppContext";
import toast from "react-hot-toast";
import OwnerSkeleton, { InlineSpinner } from "../../Components/owner/OwnerSkeleton";

export default function ManageBookings() {
    const {axios,currency } = useAppContext()

    const [bookings ,SetBookings ] = useState([])
    const [busyId, setBusyId] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState("")
      


  const fetchOwnerBookings = useCallback(async(showLoader = true)=>{
       if (showLoader) setLoading(true)
       setError("")
       try {
        const {data} = await axios.get("/api/bookings/owner")
        if(data.success)
        {
          SetBookings(data.bookings)
        }
        else {
          setError(data.message || "Could not load bookings")
        }
       } catch (error) {
         setError(error.response?.data?.message || error.message)
       } finally { setLoading(false) }
  }, [axios])

   const changeBookingStatus = async(bookingId,status)=>{
       setBusyId(bookingId)
       try {
        const {data} = await axios.post("/api/bookings/change-status",{bookingid : bookingId,status})
        if(data.success)
        {
        if (data.warning) toast.error(data.warning)
        else toast.success(data.message)
        await fetchOwnerBookings(false)
        }
        else {
          toast.error(data.message)
        }
       } catch (error) {
         toast.error(error.response?.data?.message || error.message)
       } finally {
         setBusyId(null)
       }
  }

  const retryEmail = async (bookingId) => {
    setBusyId(bookingId)
    try {
      const { data } = await axios.post(`/api/bookings/${bookingId}/confirmation-email`)
      if (!data.success) throw new Error(data.message)
      toast.success(data.message)
      await fetchOwnerBookings(false)
    } catch (error) {
      toast.error(error.response?.data?.message || error.message)
    } finally { setBusyId(null) }
  }

  useEffect(()=>{
    fetchOwnerBookings()
  },[fetchOwnerBookings])
  return (
      <div className="px-4 py-10 md:px-10 w-full min-w-0">
        <Title title="Manage Bookings" subTitle="Review reservations and confirm or decline new requests."/>
        
        <div className="mt-6 max-w-6xl">
        {loading ? <OwnerSkeleton label="Loading your bookings" /> : error ? <div role="alert" className="rounded-xl border border-red-100 bg-red-50 p-6"><p>{error}</p><button className="mt-3 font-medium text-primary" onClick={() => fetchOwnerBookings()}>Try again</button></div>
        : bookings.length === 0 ? <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center"><h2 className="text-lg font-semibold text-gray-800">No bookings yet</h2><p className="mt-2 text-sm text-gray-500">New reservation requests will appear here.</p></div>
        : <div className="w-full rounded-xl overflow-x-auto border border-slate-200 shadow-sm">
          <table className='w-full border-collapse text-left text-sm text-gray-600'>
            <thead className='text-gray-500 bg-slate-50'>
              <tr>
                <th className='p-3 font-medium'>Car</th>
                <th className='p-3 font-medium'>Renter</th>
                <th className='p-3 font-medium max-md:hidden'>Date Range</th>
                <th className='p-3 font-medium'>Total</th>
                <th className='p-3 font-medium max-md:hidden'>payment</th>
                <th className='p-3 font-medium'>Actions</th>
              </tr>
            </thead>
            <tbody>
              {
                bookings.map((booking)=>(
                  <tr key={booking._id} className="border-t border-borderColor text-gray-500">
                    <td className="p-3 align-middle"><div className="flex items-center gap-3">
                      {booking.car?.image && <img src={booking.car.image} alt="" className='h-12 w-12 aspect-square rounded-md object-cover'/>}
                      <p className="font-medium max-md:hidden">{booking.car ? `${booking.car.brand} ${booking.car.model}` : "Car no longer listed"}</p>

                    </div></td>
                    <td className="p-3">
                      <div className="flex items-center gap-3 min-w-[220px]">
                        <RenterAvatar user={booking.user} />
                        <div>
                          <p className="font-medium text-gray-800">{booking.user?.name || "Account unavailable"}</p>
                          {booking.user?.email && <a className="text-primary text-xs break-all" href={`mailto:${booking.user.email}`}>{booking.user.email}</a>}
                        </div>
                      </div>
                    </td>
                    <td className="p-3 max-md:hidden">
                      { booking.pickupDate.split("T")[0] } to  {booking.returnDate.split("T")[0] }
                      
                    </td>

                    <td className="p-3">  
                      {currency }{booking.price} 
                    </td>
                    <td className="p-3 max-md:hidden">
                      <span className="bg-gray-100 p-1 rounded-full text-xs ">
                        Offline
                      </span>
                    </td>
                    <td className="p-3">
                         {booking.status == "pending" ? (
                          <select disabled={busyId === booking._id} onChange={(e)=>changeBookingStatus(booking._id,e.target.value)} value={booking.status} className='px-2 py-1.5 mt-1 text-gray-500 border border-borderColor rounded-md outline-none '>
                          <option value="pending">pending</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="confirmed">Confirmed</option>
                         </select>) :(
                         <span className={`px-3 py-1 rounded-full text-xs  font-semibold  ${booking.status =="confirmed" ? "bg-green-100 text-green-500"
                          : "bg-red-100 text-red-500"
                         }`}>
                          {booking.status}
                         </span>
                         )}
                         {booking.status === "confirmed" && (
                           booking.confirmationEmailSentAt
                             ? <p className="mt-2 text-xs text-green-700">Confirmation emailed</p>
                             : <button type="button" disabled={busyId === booking._id} onClick={() => retryEmail(booking._id)}
                                 className="mt-2 block text-xs text-primary disabled:opacity-50">
                                 {busyId === booking._id ? <span className="inline-flex items-center gap-2"><InlineSpinner /> Sending...</span> : "Retry email"}
                               </button>
                         )}
                    </td>
                   
    
                  </tr>
                ))
              }
            </tbody>
    
          </table>
    
        </div>}
        </div>
       </div>
  )
}

function RenterAvatar({ user }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [user?.image]);
  if (user?.image && !failed) return <img src={user.image} alt={`${user.name || "Renter"}'s profile`} onError={() => setFailed(true)} className="h-10 w-10 shrink-0 rounded-full object-cover" />;
  const initials = user?.name?.trim().split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "?";
  return <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-primary font-semibold" aria-label="No profile photo">{initials}</span>;
}
