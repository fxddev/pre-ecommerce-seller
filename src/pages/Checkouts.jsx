import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Checkouts() {
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
        }

        // call the function
        funcAsyncTrigger()        

    }, []);

    const [alamat, setAlamat] = useState({});
    async function getAlamat(){
        const record = await pb.collection('pembeli').getOne(id_user, {
            expand: 'relField1,relField2.subRelField',
        });

        console.log(record.alamat[0]);

        setAlamat(record.alamat[0])
    }

    let cart_selected_by_id = []
    const [cartById, setCartById] = useState([]);
    async function getCartSelected(){
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
    async function getCartSelectedDetails(){
        console.log("cart_selected_by_id");
        console.log(cart_selected_by_id);

        let array = []
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
        }
        console.log("array dari getCartSelectedDetails");
        console.log(array);
        setCartSelectedDetails(array)
    }


    return (
        <>
            <div>
                <h3>{alamat.alamat}</h3>
                <p>{alamat.nomor_hp}</p>
            </div>

            <div>

            </div>
        </>
    )
}

export default Checkouts