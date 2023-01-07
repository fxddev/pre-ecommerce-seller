import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";

import '../assets/products.css'

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Products() {

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
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>Smith</td>
                        <td>50</td>
                        <td>50</td>
                        <td>50</td>
                        <td>50</td>
                    </tr>
                    <tr>
                        <td><input type="checkbox" /></td>
                        <td>Smith</td>
                        <td>50</td>
                        <td>50</td>
                        <td>50</td>
                        <td>50</td>
                    </tr>
                </table>
            </div>
        </div>
    )
}

export default Products