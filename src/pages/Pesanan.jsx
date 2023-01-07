import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import PocketBase from 'pocketbase';

import "../assets/modal.css"

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

        console.log(pesananById)
        for (let i = 0; i < pesananById.length; i++) {
            // console.log(pesananById[i].id);
            if (pesananById[i].id == id) {

                const id_trx = pesananById[i].midtrans_response.transaction_id
                console.log(id_trx);
                const batal_midtans = batalMidtans(id_trx);
                batal_midtans.then(async (array) => {
                    console.log("array dari batal_midtans");
                    console.log(array[0].message);

                    if (array[0].status == 200) {
                        await pb.collection('pesanan').delete(id);
                        getAllPesananById()
                    } else {
                        alert("gagal batalin, ada masalah server")
                    }

                });
            }

        }

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

            const array = [{
                "message": midtrans_response,
                "status": 200
            }]
            return array
        } catch (error) {
            console.error(`Axios error..: ${error}`);

            const array = [{
                "message": `Axios error..: ${error}`,
                "status": 400
            }]
            return array
        }
    }


    return (
        <div>
            {pesananById.length == 0 ?
                "Tidak ada pesanan, ayo belanja sekarang!"
                :
                <>
                    {pesananById.map((p, index) => {
                        return <div key={index}>
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

                                    {/* https://codeshack.io/pure-css3-modal-example/ */}
                                    <input type="checkbox" className='' id={p.id} />
                                    <label for={p.id} className="example-label">Detail</label>
                                    <label for={p.id} className="modal-background"></label>
                                    <div className="modal">
                                        <div className="modal-header">
                                            <h3>Modal Title</h3>
                                            <label for={p.id}>
                                                x
                                            </label>
                                        </div>
                                        <div>
                                            <div>
                                                <p>{p.midtrans_response.order_id}</p>
                                                <p>Tanggal pembelian {p.midtrans_response.transaction_time}</p>
                                            </div>
                                            <div>
                                                <h3>Detail produk</h3>

                                                {p.product_details.map((pd, index) => {
                                                    return <div key={index}>
                                                        <h3>{pd.nama}</h3>
                                                        <p>{pd.jumlah} x {pd.harga}</p>
                                                    </div>
                                                })}
                                            </div>
                                            <div>
                                                <h3>Info pengiriman</h3>
                                                <p>Kurir : {p.kurir.name}</p>
                                                <p>NoResi : {p.no_resi}</p>

                                                {p.alamat_tujuan.map((pat, index) => {
                                                    return <p>Alamat : {pat.nama} {pat.alamat.nomor_hp} {pat.alamat.alamat}</p>
                                                })}

                                            </div>
                                            <div>
                                                <h3>Rincian pembayaran</h3>

                                                {p.product_details.map((pd, index) => {
                                                    return <p>Total harga ({pd.jumlah} barang) : {pd.harga * pd.jumlah}</p>
                                                })}

                                                <p>Total ongkos kirim : {p.kurir.price}</p>

                                                <p>Total belanja : {p.midtrans_response.gross_amount}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    })}
                </>
            }

        </div>
    )
}

export default Pesanan