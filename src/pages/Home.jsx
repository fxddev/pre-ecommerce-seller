import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Home() {
    const id_user = pb.authStore.model.id

    const [products, setProducts] = useState([]);
    async function getProducts() {
        const records = await pb.collection('products').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        console.log(records);

        setProducts(records)
    }

    const [carts, setCarts] = useState([]);
    async function getCartsById() {
        // const record = await pb.collection('keranjang').getFirstListItem('id_pembeli="5i570zapg6oglac"', {
        //     expand: 'relField1,relField2.subRelField',
        // });
        // console.log("record cartsById");
        // console.log(record);

        const records = await pb.collection('keranjang').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        console.log("records cartsById");
        console.log(records);

        let carts_temp = []
        for (let i = 0; i < records.length; i++) {
            if (records[i].id_pembeli === id_user) {
                const obj = {
                    "id": records[i].id,
                    "id_products": records[i].id_products,
                    "jumlah": records[i].jumlah
                }
                carts_temp.push(obj)
                setCarts(carts_temp)
            }

        }
    }

    useEffect(() => {
        // console.log(pb.authStore);
        // console.log(pb.authStore.baseModel);

        // console.log(pb.authStore.isValid);
        // console.log(pb.authStore.token);
        // console.log(pb.authStore.model.id);

        getProducts()
        getCartsById()
    }, []);

    function logOut() {
        pb.authStore.clear();
    }

    async function buyHandle(id_product) {
        console.log("id_product");
        console.log(id_product);

        await getCartsById()
        console.log("carts");
        console.log(carts);

        for (let i = 0; i < carts.length; i++) {
            if (carts[i].id_products == id_product) {
                console.log("carts[i].id_products update");
                console.log(carts[i].id_products);

                const data = {
                    "id_products": carts[i].id_products,
                    "id_pembeli": carts[i].id_pembeli,
                    "jumlah": carts[i].jumlah + 1,
                    "is_selected": true
                };

                const record = await pb.collection('keranjang').update(carts[i].id, data);
                console.log("record cart update");
                console.log(record);

                break;
            } else {
                console.log(`posisi carts ke ${i + 1}/${carts.length}`);
                if ((i + 1) === carts.length) {
                    console.log("carts[i].id_products create");
                    console.log(carts[i].id_products);

                    const data = {
                        "id_products": id_product,
                        "id_pembeli": id_user,
                        "jumlah": 1,
                        "is_selected": true
                    };

                    const record = await pb.collection('keranjang').create(data);
                    console.log("record cart create");
                    console.log(record);
                }
            }
        }


    }

    return (
        <>
            <div>
                <Link to='cart'>Cart </Link>
                <Link to='pesanan'>Pesanan </Link>
                {pb.authStore.isValid == false &&
                    <Link to='join'>Join</Link>
                }
                {pb.authStore.isValid == true &&
                    <button onClick={logOut}>Logout</button>
                }
            </div>

            <div>
                {products.map((product) => (
                    <div key={product.id}>
                        <h3>{product.nama}</h3>
                        <p>{product.harga}</p>
                        <button onClick={() => buyHandle(product.id)}>Beli</button>
                    </div>
                ))}
            </div>
        </>
    )
}

export default Home