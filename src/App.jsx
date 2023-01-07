import { useState } from 'react'
import reactLogo from './assets/react.svg'
import './App.css'

// https://www.w3schools.com/react/react_router.asp
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

import Join from "./pages/Join";
import Home from "./pages/Home";
import Products from "./pages/Products";


import Cart from "./pages/Cart";
import Checkouts from "./pages/Checkouts";
import Pesanan from "./pages/Pesanan";
import Profile from "./pages/Profile";

function App() {

  function logOut() {
    pb.authStore.clear();
    window.location.reload(false);
  }

  return (
    <BrowserRouter>
      <Link to='/'>Home </Link>
      <Link to='/products'>products </Link>

      {pb.authStore.isValid == false ?
        <Link to='/join'>Join</Link>
        :
        <button onClick={logOut}>Logout</button>
      }

      <Routes>
        <Route index element={<Home />} />
        <Route path="join" element={<Join />} />
        <Route path="products" element={<Products />} />

        <Route path="checkouts" element={<Checkouts />} />
        <Route path="pesanan" element={<Pesanan />} />
        <Route path="profile" element={<Profile />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
