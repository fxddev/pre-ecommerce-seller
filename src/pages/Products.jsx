import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import '../assets/products.css'

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Products() {

    const navigate = useNavigate();

    const is_valid = pb.authStore.isValid
    
    let id_user

    useEffect(() => {
        if (is_valid) {
            id_user = pb.authStore.model.id
        } else {
            navigate("/join");
        }

        getProducts()
        // getCartsById()
    }, []);

    const [products, setProducts] = useState([]);
    async function getProducts() {
        const records = await pb.collection('products').getFullList(200 /* batch size */, {
            sort: '-created',
        });
        console.log(records);

        setProducts(records)
    }

    return (
        <div>
            <button>Tambah product</button>

            <div className='responsive__table'>
                <table>
                    <tr>
                        <th></th>
                        <th>Info produk</th>
                        <th>Harga</th>
                        <th>Stock</th>
                        <th>Aktif</th>
                        <th>Action</th>
                    </tr>
                    {products.map((p, i) => (
                        <tr key={i}>
                            <td><input type="checkbox" /></td>
                            <td>{p.nama}</td>
                            <td>{p.harga}</td>
                            <td>{p.stock}</td>
                            <td>{p.status}</td>
                            <td>
                                <button>Edit </button>
                                <button>Hapus</button>
                            </td>
                        </tr>
                    ))}

                </table>
            </div>
        </div>
    )
}

export default Products