import { lazy, Suspense } from 'react'
import { BrowserRouter, Navigate, Routes, Route } from 'react-router-dom'
import CartProvider from './components/cart/CartProvider'
import FeatureNoticeProvider from './components/common/FeatureNoticeProvider'

const HomePage = lazy(() => import('./pages/HomePage'))
const RestaurantPage = lazy(() => import('./pages/RestaurantPage'))
const CheckoutPage = lazy(() => import('./pages/CheckoutPage'))
const TrackingPage = lazy(() => import('./pages/TrackingPage'))
const DeliveredPage = lazy(() => import('./pages/DeliveredPage'))
const OrdersPage = lazy(() => import('./pages/OrdersPage'))
const ProfilePage = lazy(() => import('./pages/ProfilePage'))
const DiscoverPage = lazy(() => import('./pages/DiscoverPage'))
const CartPage = lazy(() => import('./pages/CartPage'))

function PageLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-[#f7f8fc] text-sm font-medium text-slate-500">
      街区亮灯中…
    </div>
  )
}

export default function App() {
  return (
    <FeatureNoticeProvider>
      <CartProvider>
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <Suspense fallback={<PageLoading />}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/restaurant/:id" element={<RestaurantPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/tracking" element={<TrackingPage />} />
              <Route path="/delivered" element={<DeliveredPage />} />
              <Route path="/orders" element={<OrdersPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/discover" element={<DiscoverPage />} />
              <Route path="/cart" element={<CartPage />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </CartProvider>
    </FeatureNoticeProvider>
  )
}
