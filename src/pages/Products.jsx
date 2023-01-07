import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import PocketBase from 'pocketbase';

import '../assets/products.css'
import '../assets/switch.css'
import "../assets/modal.css"

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Products() {

    const navigate = useNavigate();

    const is_valid = pb.authStore.isValid

    let id_user
    // const [idUser, setIdUser] = useState("");

    useEffect(() => {
        if (is_valid) {
            id_user = pb.authStore.model.id
            // setIdUser(idUser)
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

        let new_status = true
        let array = []
        for (let i = 0; i < products.length; i++) {
            if (products[i].id == idProduct) {
                console.log(products[i]);

                new_status = !products[i].status

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
            } else {
                array.push(products[i])
            }
        }
        setProducts(array)

        const data = {
            "status": new_status
        };

        const record = await pb.collection('products').update(idProduct, data);
    }

    const [nama, setNama] = useState("");
    const [img, setImg] = useState("https://online.remboprinting.com/wp-content/uploads/2020/08/A4-Paper-PSD-MockUp-1536x1150.png");
    const [harga, setHarga] = useState("");
    const [deskripsi, setDeskripsi] = useState("");
    const [kondisi, setKondisi] = useState("");
    const [minimumPembelian, setMinimumPembelian] = useState("");
    const [berat, setBerat] = useState("");
    const [stock, setStock] = useState("");
    const [status, setStatus] = useState(true);
    async function addProduct() {
        const harga_obj = {
            "normal": parseInt(harga),
            "diskon": 0
        }

        let status_bool = true
        if (status != "true") {
            status_bool = false
        }

        const data = {
            "nama": nama,
            "img": img,
            "harga": harga_obj,
            "deskripsi": deskripsi,
            "kondisi": kondisi,
            "minimum_pembelian": parseInt(minimumPembelian),
            "berat": parseInt(berat),
            "stock": parseInt(stock),
            "id_penjual": pb.authStore.model.id,
            "status": status_bool
        };
        console.log(data);

        const record = await pb.collection('products').create(data);
        window.location.reload(false);
    }

    async function deleteProduct(idProduct) {
        console.log(`idProduct yg akanDiaHapus = ${idProduct}`);

        await pb.collection('products').delete(idProduct);
        window.location.reload(false);
    }

    const [isEdit, setIsEdit] = useState(false);
    const [idProduct, setIdProduct] = useState("");
    const [idPenjual, setIdPenjual] = useState("");
    async function updateProductHandle(obj) {
        setIsEdit(true)
        console.log("obj dari updateProduct");
        console.log(obj);

        setIdProduct(obj.id)
        setIdPenjual(obj.id_penjual)

        setNama(obj.nama)
        setImg(obj.img)

        if (obj.harga.diskon == 0) {
            setHarga(obj.harga.normal)
        } else {
            setHarga(obj.harga.diskon)
        }

        setDeskripsi(obj.deskripsi)
        setKondisi(obj.kondisi)
        setMinimumPembelian(obj.minimum_pembelian)
        setBerat(obj.berat)
        setStock(obj.stock)
        setStatus(obj.status)
    }

    async function updateProduct() {
        console.log(`sdg update product = ${idProduct}`);

        const harga_obj = {
            "normal": parseInt(harga),
            "diskon": 0
        }

        let status_bool = true
        if (status != "true") {
            status_bool = false
        }

        const data = {
            "nama": nama,
            "img": img,
            "harga": harga_obj,
            "deskripsi": deskripsi,
            "kondisi": kondisi,
            "minimum_pembelian": parseInt(minimumPembelian),
            "berat": parseInt(berat),
            "stock": parseInt(stock),
            "id_penjual": idPenjual,
            "status": status_bool
        };
        console.log(data);
        
        const record = await pb.collection('products').update(idProduct, data);
        window.location.reload(false);
    }

    function handleCloseModal() {
        console.log("modal diclose");
        setIsEdit(false)
    }

    return (
        <div>
            <input type="checkbox" className='check__box' id="modalAddEdit" />
            <label htmlFor="modalAddEdit" className="example-label">Tambah product</label>
            <label htmlFor="modalAddEdit" className="modal-background"></label>
            <div className="modal">
                <div className="modal-header">
                    <h3>Modal Title</h3>
                    <label htmlFor="modalAddEdit" onClick={handleCloseModal}>
                        x
                    </label>
                </div>
                <div>
                    <input type="text" placeholder='nama produk' value={nama} onChange={e => setNama(e.target.value)} />
                    <input type="text" disabled />
                    <input type="number" placeholder='harga' value={harga} onChange={e => setHarga(e.target.value)} />
                    <input type="text" placeholder='deskripsi' value={deskripsi} onChange={e => setDeskripsi(e.target.value)} />

                    <p>Kondisi:</p>
                    {!isEdit &&
                        <>
                            <input type="radio" id="baru" value="baru" onChange={e => setKondisi(e.target.value)} />
                            <label for="baru">Baru</label><br />
                            <input type="radio" id="bekas" value="bekas" onChange={e => setKondisi(e.target.value)} />
                            <label for="bekas">Bekas</label><br />
                        </>
                    }

                    {kondisi}
                    {isEdit &&
                        <>
                            {kondisi === "baru" ?
                                <>
                                    <input type="radio" id="baru" value="baru" checked onChange={e => setKondisi(e.target.value)} />
                                    <label htmlFor="baru">Baru</label><br />
                                    <input type="radio" id="bekas" value="bekas" onChange={e => setKondisi(e.target.value)} />
                                    <label htmlFor="bekas">Bekas</label><br />
                                </>
                                :
                                <>
                                    <input type="radio" id="baru" value="baru" onChange={e => setKondisi(e.target.value)} />
                                    <label htmlFor="baru">Baru</label><br />
                                    <input type="radio" id="bekas" value="bekas" checked onChange={e => setKondisi(e.target.value)} />
                                    <label htmlFor="bekas">Bekas</label><br />
                                </>
                            }
                        </>
                    }


                    <input type="number" placeholder='minimum_pembelian' value={minimumPembelian} onChange={e => setMinimumPembelian(e.target.value)} />
                    <input type="number" placeholder='berat' value={berat} onChange={e => setBerat(e.target.value)} />gr
                    <input type="number" placeholder='stock' value={stock} onChange={e => setStock(e.target.value)} />

                    <br /><label htmlFor="status">status</label><br />
                    {!isEdit &&
                        <>
                            <input type="radio" id="aktif" value="true" onChange={e => setStatus(e.target.value)} />
                            <label htmlFor="aktif">Aktif</label><br />
                            <input type="radio" id="noAktif" value="false" onChange={e => setStatus(e.target.value)} />
                            <label htmlFor="noAktif">Tidak Aktif</label><br />
                        </>
                    }

                    {isEdit &&
                        <>
                            {status ?
                                <>
                                    <input type="radio" id="aktif" checked value="true" onChange={e => setStatus(e.target.value)} />
                                    <label htmlFor="aktif">Aktif</label><br />
                                    <input type="radio" id="noAktif" value="false" onChange={e => setStatus(e.target.value)} />
                                    <label htmlFor="noAktif">Tidak Aktif</label><br />
                                </>
                                :
                                <>
                                    <input type="radio" id="aktif" value="true" onChange={e => setStatus(e.target.value)} />
                                    <label htmlFor="aktif">Aktif</label><br />
                                    <input type="radio" id="noAktif" value="false" checked onChange={e => setStatus(e.target.value)} />
                                    <label htmlFor="noAktif">Tidak Aktif</label><br />
                                </>
                            }
                        </>
                    }

                    {isEdit ? 
                    <button onClick={updateProduct}>Update</button>
                    : 
                    <button onClick={addProduct}>Tambah</button>
                }
                </div>
            </div>

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
                            <td>
                                {p.harga.diskon == 0 ?
                                    p.harga.normal
                                    :
                                    p.harga.diskon
                                }
                            </td>
                            <td>{p.stock}</td>
                            <td>
                                <label className="switch">
                                    {p.status ?
                                        <input type="checkbox" checked onClick={() => handleSwitch(p.id)} />
                                        :
                                        <input type="checkbox" onClick={() => handleSwitch(p.id)} />
                                    }
                                    <span className="slider round"></span>
                                </label>
                            </td>
                            <td>
                                {/* <button>Edit</button> */}
                                <label htmlFor="modalAddEdit" className="example-label" onClick={() => updateProductHandle(p)}>Edit</label>
                                <button onClick={() => deleteProduct(p.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}

                </table>
            </div>
        </div>
    )
}

export default Products