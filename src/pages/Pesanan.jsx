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

    const [allPsn, setAllPsn] = useState([]);
    async function getAllPesanan() {
        const records = await pb.collection('pesanan').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        
        console.log(records);
        setAllPsn(records)

        for (let i = 0; i < records.length; i++) {
            if (records[i].midtrans_response.transaction_status) {
                
            }            
        }
    }
    
    const [tampilan, setTampilan] = useState("psnbaru");
    const [psnBaru, setPsnBaru] = useState([]);
    const [siapKrm, setSiapKrm] = useState([]);
    const [otw, setOtw] = useState([]);
    function handleTampilan(val) {
        setTampilan(val)
    }

    return (
        <div>
            {/* https://www.youtube.com/watch?v=MgEQf7r3tNw */}
            <div>
                <button onClick={() => handleTampilan("psnbaru")}>Pesanan Baru</button>
                <button onClick={() => handleTampilan("siapkrm")}>Siap dikirim</button>
                <button onClick={() => handleTampilan("otw")}>Dalam pengiriman</button>
            </div>

            {tampilan == "psnbaru" && 
                <>
                <p>psnbaru</p>
                </>
            }

            {tampilan == "siapkrm" && 
                <>
                <p>siapkrm</p>
                </>
            }

            {tampilan == "otw" && 
                <>
                <p>otw</p>
                </>
            }
        </div>
    )
}

export default Pesanan