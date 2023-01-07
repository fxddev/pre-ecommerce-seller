import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Home() {   

    return (
        <>
            hal home
        </>
    )
}

export default Home