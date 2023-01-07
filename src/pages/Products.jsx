import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import '../assets/products.css'
import '../assets/switch.css'

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

        // console.log("id_user aka idPenjual");
        // console.log(id_user);

        let array = []
        for (let i = 0; i < records.length; i++) {
            if (records[i].id_penjual == id_user) {
                array.push(records[i])
            }
        }

        setProducts(array)
    }

    async function handleSwitch(idProduct) {
        console.log(idProduct);

        let array = []
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == idProduct) {
                console.log(products[i]);

                const new_status = !products[i].status

                const obj = {
                    "id": products[i].id,
                    "nama": products[i].nama,
                    "img": products[i].img,
                    "harga": products[i].harga,
                    "deskripsi": products[i].deskripsi,
                    "kondisi": products[i].kondisi,
                    "minimum_pembelian": products[i].minimum_pembelian,
                    "berat": products[i].berat,
                    "stock": products[i].stock,
                    "id_penjual": products[i].id_penjual,
                    "status": new_status,
                    "created": products[i].created,
                    "updated": products[i].updated,
                    "collectionId": products[i].collectionId,
                    "collectionName": products[i].collectionName
                }
                array.push(obj)

                const data = {
                    "status": new_status
                };
                
                const record = await pb.collection('products').update(idProduct, data);
            } else {
                array.push(products[i])
            }            
        }
        setProducts(array)
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
                            <td>
                                <label class="switch">
                                    {p.status ?
                                        <input type="checkbox" checked onClick={() => handleSwitch(p.id)} />
                                        :
                                        <input type="checkbox" onClick={() => handleSwitch(p.id)} />
                                    }
                                    <span class="slider round"></span>
                                </label>
                            </td>
                            <td>
                                <button>Edit</button>
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