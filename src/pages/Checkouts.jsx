import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Checkouts() {
    const rajaongkir_api = "https://8000-fahmidabdil-rajaongkira-vqj3ndw31j4.ws-us80.gitpod.io"

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
            await getAlamat()
            await getCartSelected()
            await getCartSelectedDetails()
            await getCost()
        }

        // call the function
        funcAsyncTrigger()

    }, []);

    let city_id
    const [alamat, setAlamat] = useState({});
    async function getAlamat() {
        const record = await pb.collection('pembeli').getOne(id_user, {
            expand: 'relField1,relField2.subRelField',
        });

        console.log(record.alamat[0]);

        console.log(record.alamat[0].origin.city_id);
        city_id = record.alamat[0].origin.city_id

        setAlamat(record.alamat[0])
    }

    let cart_selected_by_id = []
    const [cartById, setCartById] = useState([]);
    async function getCartSelected() {
        const records = await pb.collection('keranjang').getFullList(200 /* batch size */, {
            sort: '-created',
        });

        console.log(records);

        let array = []
        for (let i = 0; i < records.length; i++) {
            if (records[i].id_pembeli === id_user && records[i].is_selected == true) {
                const obj = {
                    "id": records[i].id,
                    "id_products": records[i].id_products,
                    "id_pembeli": records[i].id_pembeli,
                    "jumlah": records[i].jumlah,
                    "is_selected": records[i].is_selected
                }

                array.push(obj)

                cart_selected_by_id = array
                setCartById(array)
            }

        }
        console.log("array");
        console.log(array);
    }

    const [cartSelectedDetails, setCartSelectedDetails] = useState([]);
    // const [hargaSemuaBarang, setHargaSemuaBarang] = useState(0);
    let harga_semua_barang = 0
    async function getCartSelectedDetails() {
        console.log("cart_selected_by_id");
        console.log(cart_selected_by_id);

        let array = []
        let harga_total = 0
        for (let i = 0; i < cart_selected_by_id.length; i++) {
            const record = await pb.collection('products').getOne(cart_selected_by_id[i].id_products, {
                expand: 'relField1,relField2.subRelField',
            });
            console.log(`record produk id=${cart_selected_by_id[i].id_products}`);
            console.log(record);

            const obj = {
                "id": cart_selected_by_id[i].id,
                "product_details": record,
                "id_pembeli": cart_selected_by_id[i].id_pembeli,
                "jumlah": cart_selected_by_id[i].jumlah,
                "is_selected": cart_selected_by_id[i].is_selected
            }
            array.push(obj)
            // cart_details = array
            // setCartDetails(array)

            console.log("record.harga");
            console.log(record.harga);
            const harga = harga_total + record.harga
            harga_total = harga
            // setHargaTotal(harga_total)

            // setHargaSemuaBarang(harga_total)
        }
        console.log("array dari getCartSelectedDetails");
        console.log(array);
        setCartSelectedDetails(array)

        harga_semua_barang = harga_total

        hargaTotalHandle()
    }

    const [kurirList, setKurirList] = useState([]);
    async function getCost() {
        const obj = {
            origin: city_id,
            destination: "154", //jakartaTimur
            weight: "500",
            courier: "jne",
        };
        var payload = JSON.stringify(obj);
        var config = {
            method: "post",
            url: `${rajaongkir_api}/rajaongkir/cost`,
            headers: {
                "Content-Type": "application/json",
            },
            data: payload,
        };

        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);
            const res = data.data.rajaongkir.results;
            console.log("res");
            console.log(res);
            console.log("res.length");
            console.log(res.length);

            let ongkir = [];
            for (let index = 0; index < res.length; index++) {
                const costs = res[index].costs;
                // console.log("costs");
                // console.log(costs);
                for (let j = 0; j < costs.length; j++) {
                    const obj = {
                        code: res[index].code,
                        name: res[index].name,
                        service: costs[j].service,
                        description: costs[j].description,
                        value: costs[j].cost[0].value,
                        etd: costs[j].cost[0].etd,
                        note: costs[j].cost[0].note,
                    };
                    ongkir.push(obj);
                }
                // ongkir.push(res[index]);
                // console.log("res[index]");
                // console.log(res[index]);
                console.log("ongkir");
                console.log(ongkir);
            }
            setKurirList(ongkir)
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    const [kurirSelected, setKurirSelected] = useState({});
    // const [hargaKurir, setHargaKurir] = useState(0);
    let harga_kurir = 0
    async function pilihKurir(event) {
        console.log("ini pil kur");
        // console.log(event);

        const obj = JSON.parse(event.target.value)
        console.log(obj);

        // console.log(obj.value);
        // const harga = harga_total + obj.value
        // harga_total = harga
        // setHargaKurir(obj.value)
        harga_kurir = obj.value

        setKurirSelected(event.target.value)

        hargaTotalHandle()
    }

    const [paymentSelected, setPaymentSelected] = useState("");
    function pilihPayment(event) {
        console.log("pilihPayment");
        console.log(event.target.value);

        setPaymentSelected(event.target.value)
    }

    const [hargaTotal, setHargaTotal] = useState(0);
    function hargaTotalHandle(){
        console.log("sedang total hargaBarang+Kurir");

        console.log(harga_semua_barang+harga_kurir);
        setHargaTotal(harga_semua_barang+harga_kurir)

        // console.log(hargaKurir+hargaSemuaBarang);
        // setHargaTotal(hargaKurir+hargaSemuaBarang)
    }

    return (
        <>
            <div>
                <h3>{alamat.alamat}</h3>
                <p>{alamat.nomor_hp}</p>
            </div>

            <div>
                {cartSelectedDetails.map((cs) => (
                    <div key={cs.id}>
                        <h3>{cs.product_details.nama}</h3>
                        <h3>{cs.jumlah}x {cs.product_details.harga}</h3>
                    </div>
                ))}
            </div>


            <select onClick={pilihKurir}>
                <option disabled selected>pilih kurir</option>
                {kurirList.map((kl, index) => (
                    <option value={JSON.stringify(kl)}>{kl.code} {kl.service} | Rp.{kl.value} | {kl.etd}Hari</option>
                ))}
            </select>

            <select onClick={pilihPayment}>
                <option value="bri" selected>BRI</option>
            </select>

            <div>
                <div>
                    <h3>Total Harga</h3>
                    <p>{hargaTotal}</p>
                </div>
            </div>
        </>
    )
}

export default Checkouts