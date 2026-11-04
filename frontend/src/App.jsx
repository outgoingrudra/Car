import { lazy, Suspense } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Navbar from './Components/Navbar'
import Footer from './Components/Footer'
import { useAppContext } from './Context/AppContext'

const Home = lazy(() => import('./Pages/Home'))
const Cars = lazy(() => import('./Pages/Cars'))
const CarDetails = lazy(() => import('./Pages/CarDetails'))
const MyBookings = lazy(() => import('./Pages/MyBookings'))
const AccountSettings = lazy(() => import('./Pages/AccountSettings'))
const Login = lazy(() => import('./Components/Login'))
const Layout = lazy(() => import('./Pages/owner/Layout'))
const Dashboard = lazy(() => import('./Pages/owner/Dashboard'))
const AddCar = lazy(() => import('./Pages/owner/AddCar'))
const ManageCars = lazy(() => import('./Pages/owner/ManageCars'))
const ManageBookings = lazy(() => import('./Pages/owner/ManageBookings'))

function PageFallback() {
  return <main role="status" className="mx-auto w-full max-w-6xl px-6 py-12" aria-label="Loading page">
    <div className="h-8 w-48 rounded bg-slate-200 motion-safe:animate-pulse" />
    <div className="mt-5 h-4 w-72 max-w-full rounded bg-slate-100 motion-safe:animate-pulse" />
    <div className="mt-10 h-48 rounded-xl bg-slate-100 motion-safe:animate-pulse" />
    <span className="sr-only">Loading page</span>
  </main>
}

export default function App() {
  const { showLogin } = useAppContext()
  const isOwnerPath = useLocation().pathname.startsWith('/owner')

  return <>
    <Toaster />
    {showLogin && <Suspense fallback={null}><Login /></Suspense>}
    {!isOwnerPath && <Navbar />}
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cars" element={<Cars />} />
        <Route path="/car-details/:id" element={<CarDetails />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/settings" element={<AccountSettings />} />
        <Route path="/owner" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="add-car" element={<AddCar />} />
          <Route path="edit-car/:id" element={<AddCar />} />
          <Route path="manage-cars" element={<ManageCars />} />
          <Route path="manage-bookings" element={<ManageBookings />} />
          <Route path="settings" element={<AccountSettings />} />
        </Route>
      </Routes>
    </Suspense>
    {!isOwnerPath && <Footer />}
  </>
}
