import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Checkouts() {
    const id_user = pb.authStore.model.id

    useEffect(() => {

        const funcAsyncTrigger = async () => {
            // await getCartById()
            // await getCartDetails()
        }

        // call the function
        // funcAsyncTrigger()

    }, []);


    return (
        <>
            <p>Ini Hal checkouts</p>
        </>
    )
}

export default Checkouts