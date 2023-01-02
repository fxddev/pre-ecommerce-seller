import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Pesanan() {
    const navigate = useNavigate();

    const is_valid = pb.authStore.isValid

    let id_user    

    useEffect(() => {
        if (is_valid) {
            id_user = pb.authStore.model.id
        } else {
            navigate("/join");
        }

        const funcAsyncTrigger = async () => {
            // await getCartById()
            // await getCartDetails()
        }

        // call the function
        // funcAsyncTrigger()

    }, []);


    return (
        <>
            <p>Ini Hal pesanan</p>
        </>
    )
}

export default Pesanan