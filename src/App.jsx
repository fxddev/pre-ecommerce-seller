import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

// https://www.w3schools.com/react/react_router.asp
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

import Home from "./pages/Home";
import Join from "./pages/Join";
import Cart from "./pages/Cart";
import Checkouts from "./pages/Checkouts";
import Pesanan from "./pages/Pesanan";
import Profile from "./pages/Profile";

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Link to='/'>Home </Link>

      {pb.authStore.isValid == false &&
        <Link to='/join'>Join</Link>
      }

      <Routes>
        <Route index element={<Home />} />
        <Route path="join" element={<Join />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkouts" element={<Checkouts />} />
        <Route path="pesanan" element={<Pesanan />} />
        <Route path="profile" element={<Profile />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
