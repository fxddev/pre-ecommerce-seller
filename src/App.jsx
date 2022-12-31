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

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Link to='/'>Home </Link>

      {pb.authStore.isValid == false &&
        <Link to='join'>Join</Link>
      }

      <Routes>
        <Route index element={<Home />} />
        <Route path="join" element={<Join />} />
        <Route path="cart" element={<Cart />} />
      </Routes>

    </BrowserRouter>
  )
}

export default App
