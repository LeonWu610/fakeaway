import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import RestaurantPage from './pages/RestaurantPage'
import CheckoutPage from './pages/CheckoutPage'
import TrackingPage from './pages/TrackingPage'
import DeliveredPage from './pages/DeliveredPage'
import OrdersPage from './pages/OrdersPage'
import ProfilePage from './pages/ProfilePage'
import DiscoverPage from './pages/DiscoverPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/restaurant/:id" element={<RestaurantPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/tracking" element={<TrackingPage />} />
        <Route path="/delivered" element={<DeliveredPage />} />
        <Route path="/orders" element={<OrdersPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/discover" element={<DiscoverPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
