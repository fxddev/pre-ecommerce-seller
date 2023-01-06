import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Pesanan() {
    const midtrans_api = "https://8000-fahmidabdil-midtransapi-vakferl6soy.ws-us81.gitpod.io"

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
            // await getAllPesananById()
            // await getCartDetails()
        }

        // call the function
        // funcAsyncTrigger()

        getAllPesananById()

    }, []);

    const [pesananById, setPesananById] = useState([]);
    async function getAllPesananById() {
        const records = await pb.collection('pesanan').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        console.log("records getAllPesananById");
        console.log(records);

        let array = []
        for (let i = 0; i < records.length; i++) {
            if (records[i].id_pembeli == id_user) {
                // console.log(records[i]);
                array.push(records[i])
            }
        }
        setPesananById(array)
    }

    async function batalkanPesanan(id) {
        console.log("id pesanan yg akan batalkanPesanan");
        console.log(id);

        const batal_midtans = batalMidtans("fe8c6138-77e9-4881-8edd-a670834f910e");
        batal_midtans.then(async (val) => {
            console.log("val dari batal_midtans");
            console.log(val);

            await pb.collection('pesanan').delete(id);

            getAllPesananById()
        });
    }

    async function batalMidtans(id_trx) {
        const payload = {
            "transaction_id": id_trx
        }

        var data = JSON.stringify(payload);
        console.log(data);

        var config = {
            method: 'post',
            url: `${midtrans_api}/midtrans/cancel`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: data
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            // console.log(data);
            const midtrans_response = data.data;
            console.log("midtrans_response");
            console.log(midtrans_response);

            return midtrans_response
        } catch (error) {
            console.error(`Axios error..: ${error}`);

            const array = [{
                "message": `Axios error..: ${error}`
            }]
            return array
        }
    }


    return (
        <div>
            {pesananById.map((p, index) => (
                <div key={index}>
                    <div>
                        <div>
                            <h3>Belanja</h3>
                            <p>{p.midtrans_response.transaction_time}</p>
                        </div>
                        <div>
                            {p.is_proses == false && p.no_resi == "" && p.is_selesai == false &&
                                <p>Menunggu Konfirmasi</p>
                            }

                            {p.is_proses == true && p.no_resi == "" && p.is_selesai == false &&
                                <p>Diproses</p>
                            }

                            {p.is_proses == true && p.no_resi != "" && p.is_selesai == false &&
                                <p>Dikirim</p>
                            }

                            {p.is_proses == true && p.no_resi != "" && p.is_selesai == true &&
                                <p>Selesai</p>
                            }

                            <button onClick={() => batalkanPesanan(p.id)}>Batalin</button>
                        </div>
                        
                        <div>
                            <h3>{p.product_details.nama}</h3>
                            <p>{p.product_details.jumlah} barang</p>
                        </div>

                        <div>
                            <h3>Total belanja</h3>
                            <p>{p.midtrans_response.gross_amount}</p>
                            <button>Detail</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

export default Pesanan