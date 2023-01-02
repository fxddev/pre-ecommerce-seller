import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Checkouts() {
    const id_user = pb.authStore.model.id

    useEffect(() => {

        // const funcAsyncTrigger = async () => {
        // await getCartById()
        // await getCartDetails()
        // }

        // call the function
        // funcAsyncTrigger()

        getProfile()
    }, []);
    
    const [nama, setNama] = useState("");

    const [profileUser, setProfileUser] = useState([]);
    // const [profileUser, setProfileUser] = useState({});
    async function getProfile() {
        const record = await pb.collection('pembeli').getOne(id_user, {
            expand: 'relField1,relField2.subRelField',
        });
        console.log("record");
        console.log(record);

        setProfileUser([record])
        console.log([record]);

        console.log("record.nama");
        console.log(record.nama);
        setNama(record.nama)

        setAlamat(record.alamat[0].alamat)
        setNoHp(record.alamat[0].nomor_hp)
        // setProfileUser(record)
    }

    const [alamat, setAlamat] = useState("");
    const [noHp, setNoHp] = useState("");
    async function updateProfile() {
        const full_alamat = [{
            "alamat": alamat,
            "nomor_hp": noHp
        }]

        const data = {
            "nama": nama,
            "alamat": full_alamat
        };

        const record = await pb.collection('pembeli').update(id_user, data);
        console.log("record update profile");
        console.log(record);
    }

    return (
        <>
            <div >
                {/* <input type="text" value={profileUser.nama} />
                <input type="text" value={profileUser.alamat} /> */}
                {/* <input type="text" value={profileUser.alamat.nomor_hp} /> */}

                {/* {profileUser.alamat.map((a) => (
                    <input type="text" value={a.alamat} />
                ))} */}

                {/* https://www.makeuseof.com/map-over-nested-array-in-react/ */}
                {profileUser.map((pu) => {
                    return <div key={pu.id} >
                        <input type="text" value={nama} onChange={e => setNama(e.target.value)} />
                        {pu.alamat.map((a, index) => {
                            return <div key={index}>
                                <input type="text" placeholder='alamat' value={alamat} onChange={e => setAlamat(e.target.value)} />
                                <input type="text" placeholder='Nohp' value={noHp} onChange={e => setNoHp(e.target.value)} />
                            </div>
                        })}
                    </div>
                })}

                <button onClick={updateProfile}>updateProfile</button>
            </div>
        </>
    )
}

export default Checkouts