import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Cart() {
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
            await getCartById()
            await getCartDetails()
        }

        // call the function
        funcAsyncTrigger()

    }, []);

    let cart_by_id = []
    const [cartById, setCartById] = useState([]);
    async function getCartById() {
        console.log("sedang getCartById");

        const records = await pb.collection('keranjang').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        console.log(records);

        let array = []
        for (let i = 0; i < records.length; i++) {
            if (records[i].id_pembeli === id_user) {
                const obj = {
                    "id": records[i].id,
                    "id_products": records[i].id_products,
                    "id_pembeli": records[i].id_pembeli,
                    "jumlah": records[i].jumlah,
                    "is_selected": records[i].is_selected
                }

                array.push(obj)

                cart_by_id = array
                setCartById(array)
            }

        }
    }

    // let cart_details = []
    const [cartDetails, setCartDetails] = useState([]);
    const [totalHarga, setTotalHarga] = useState(0);
    async function getCartDetails() {
        console.log("sedang getCartDetails");
        console.log("cartById");
        console.log(cartById);
        console.log("cart_by_id");
        console.log(cart_by_id);

        let array = []
        let total_harga = 0
        for (let i = 0; i < cart_by_id.length; i++) {
            const record = await pb.collection('products').getOne(cart_by_id[i].id_products, {
                expand: 'relField1,relField2.subRelField',
            });
            console.log(`record produk id=${cart_by_id[i].id_products}`);
            console.log(record);

            const obj = {
                "id": cart_by_id[i].id,
                "id_products": cart_by_id[i].id_products,
                "product_details": record,
                "id_pembeli": cart_by_id[i].id_pembeli,
                "jumlah": cart_by_id[i].jumlah,
                "is_selected": cart_by_id[i].is_selected
            }
            array.push(obj)
            // cart_details = array
            // setCartDetails(array)

            if (cart_by_id[i].is_selected) {
                const harga = record.harga + total_harga
                total_harga = harga
            }
        }
        console.log("array dari getCartDetails");
        console.log(array);
        setCartDetails(array)
        // console.log("cartDetails");
        // console.log(cartDetails);

        // console.log("cart_details");
        // console.log(cart_details);

        console.log("total_harga");
        console.log(total_harga);
        setTotalHarga(total_harga)

    }

    async function handleJumlah(e, idCart) {
        const jumlah_new = e.target.value
        console.log(jumlah_new);
        console.log(idCart);

        let array = []
        console.log(cartDetails);
        for (let i = 0; i < cartDetails.length; i++) {
            if (cartDetails[i].id == idCart) {
                const obj = {
                    "id": cartDetails[i].id,
                    "id_products": cartDetails[i].id_products,
                    "product_details": cartDetails[i].product_details,
                    "id_pembeli": cartDetails[i].id_pembeli,
                    "jumlah": jumlah_new,
                    "is_selected": cartDetails[i].is_selected
                }
                array.push(obj)

                const data = {
                    "id_products": cartDetails[i].id_products,
                    "id_pembeli": cartDetails[i].id_pembeli,
                    "jumlah": jumlah_new,
                    "is_selected": cartDetails[i].is_selected
                };
                
                const record = await pb.collection('keranjang').update(idCart, data);
            } else {
                array.push(cartDetails[i])
            }
        }
        setCartDetails(array)
    }

    async function handleCheckbox(id_cart) {
        console.log(id_cart);

        const record = await pb.collection('keranjang').getOne(id_cart, {
            expand: 'relField1,relField2.subRelField',
        });
        console.log(record);

        const current_is_selected = record.is_selected

        const data = {
            "is_selected": !current_is_selected
        };

        const record_up = await pb.collection('keranjang').update(id_cart, data);
        console.log("record_up");
        console.log(record_up);

        const funcAsyncTrigger = async () => {
            await getCartById()
            await getCartDetails()
        }

        // call the function
        funcAsyncTrigger()
    }

    return (
        <>
            <div>
                {cartDetails.map((cart) => (
                    <div key={cart.id}>
                        {cart.is_selected ?
                            <input type="checkbox" checked onChange={() => handleCheckbox(cart.id)} />
                            :
                            <input type="checkbox" onChange={() => handleCheckbox(cart.id)} />
                        }

                        <h3>{cart.product_details.nama}</h3>
                        <p>{cart.product_details.harga}</p>

                        {/* https://stackoverflow.com/questions/68256270/react-map-method-render-input-dynamically-change-value-separate-fields */}
                        <input type="number" value={cart.jumlah} onChange={(e) => handleJumlah(e, cart.id)} />
                    </div>
                ))}
            </div>

            <div>
                <h2>Total: {totalHarga}</h2>
                <Link to='/checkouts'>Beli</Link>
            </div>
        </>
    )
}

export default Cart