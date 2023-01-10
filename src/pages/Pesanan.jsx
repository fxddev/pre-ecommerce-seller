import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PocketBase from 'pocketbase';

import "../assets/modal.css"

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Pesanan() {

    const navigate = useNavigate();

    const is_valid = pb.authStore.isValid

    let id_user

    useEffect(() => {
        if (is_valid) {
            id_user = pb.authStore.model.id
            // setIdUser(idUser)
        } else {
            navigate("/join");
        }

        getAllPesanan()
        // getCartsById()
    }, []);

    async function getAllPesanan() {
        const records = await pb.collection('pesanan').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        
        console.log(records);
    }

    return (
        <p>Ini pes</p>
    )
}

export default Pesanan