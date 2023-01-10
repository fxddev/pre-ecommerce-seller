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
        console.log("records getAllPesanan");
        console.log(records);

        let array = []
        for (let i = 0; i < records.length; i++) {

            console.log(records[i].midtrans_response.transaction_id);

            var data = JSON.stringify({ "transaction_id": records[i].midtrans_response.transaction_id });

            var config = {
                method: 'post',
                url: `${midtrans_api}/midtrans/status`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: data
            };

            try {
                const resp = await axios(config);
                const data = await resp.data;
                // console.log(data);
                const midtrans_response_newest = data.data;
                console.log("midtrans_response_newest");
                console.log(midtrans_response_newest);

                // const record_pembeli = await pb.collection('pembeli').getOne(records[i].id_pembeli, {
                //     expand: 'relField1,relField2.subRelField',
                // });

                const obj = {
                    "id": records[i].id,
                    "id_pembeli": records[i].id_pembeli,
                    // "pembeli_details": record_pembeli,
                    "product_details": records[i].product_details,
                    "kurir": records[i].kurir,
                    "alamat_tujuan": records[i].alamat_tujuan,
                    "midtrans_response": records[i].midtrans_response,
                    "is_proses": records[i].is_proses,
                    "no_resi": records[i].no_resi,
                    "is_selesai": records[i].is_selesai,
                    "midtrans_response_newest": midtrans_response_newest,
                    "created": records[i].created,
                    "updated": records[i].updated
                }

                if (midtrans_response_newest.transaction_status == 'expire') {
                    console.log(`id ${records[i].id} transaksinya expire`);
                    await pb.collection('pesanan').delete(records[i].id);
                } else {
                    array.push(obj)
                }

            } catch (error) {
                console.error(`Axios error..: ${error}`)
            }

        }
        setAllPsn(array)

        console.log('hasil akhir getAllPesanan');
        console.log(array);
        console.log("hasil akhir allPsn");
        console.log(allPsn);

        // pending = blom bayar

        // "settlement" = sdh byr
        let array_psn_baru = []
        for (let j = 0; j < array.length; j++) {
            if (array[j].midtrans_response_newest.transaction_status == "settlement") {
                array_psn_baru.push(array[j])
            }
        }
        setPsnBaru(array_psn_baru)
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
                <div>
                    {psnBaru.map((pb, i) => {
                        return <div key={i}>
                            <div>
                                <p>{pb.midtrans_response.transaction_time}</p>
                            </div>

                            <div>
                                {pb.product_details.map((pd, index) => {
                                    return <div key={index}>
                                        <h3>{pd.nama}</h3>
                                        <p>{pd.jumlah} x
                                            {pd.harga.diskon == 0 ?
                                                pd.harga.normal
                                                :
                                                pd.harga.diskon
                                            }
                                        </p>
                                    </div>
                                })}

                                <div>
                                    <p>Pembeli:
                                        {pb.alamat_tujuan.map((pat, index) => {
                                            return <> {pat.nama} </>
                                        })}
                                    </p>
                                </div>
                            </div>

                            <div>
                                <button>Details</button>
                                <button>Terima pesanan</button>
                            </div>
                        </div>
                    })}
                </div>
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