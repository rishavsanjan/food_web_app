import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import FoodDeliveryLanding from './pages/landingpage'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import RestaurantLanding from './pages/restrauntlandingpage'
import LogIn from './pages/login'
import Cart from './pages/cart'
import UserProfile from './pages/profile'
import RestaurantAdminDashboard from './pages/restaurantadmin'


function AppContent() {
  return (
    <Routes>
      <Route path="/" element={<FoodDeliveryLanding />} />
      <Route path="/restraunt" element={<RestaurantLanding/>}/>
      <Route path='/login' element={<LogIn/>}/>
      <Route path='/cart' element={<Cart/>}/>
      <Route path='/profile' element={<UserProfile/>}/>
      <Route path='/restaurant-admin' element={<RestaurantAdminDashboard/>}/>
    </Routes>
  )
}



function App() {

  return (
    <>
      <Router>
        <AppContent />
      </Router>
    </>
  )
}

export default App
