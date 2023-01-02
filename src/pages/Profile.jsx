import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Checkouts() {

    const rajaongkir_api = "https://8000-fahmidabdil-rajaongkira-vqj3ndw31j4.ws-us80.gitpod.io"

    const id_user = pb.authStore.model.id

    useEffect(() => {

        const funcAsyncTrigger = async () => {
            await getProfile()
            await getCitys()
        }

        // call the function
        funcAsyncTrigger()
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
        setCityOrigin(record.alamat[0].origin)
        // setProfileUser(record)
    }

    const [city, setCity] = useState("");
    const [rajaOngkir, setRajaOngkir] = useState([]);
    async function getCitys() {
        var config = {
            method: "post",
            url: `${rajaongkir_api}/rajaongkir/city`,
        };
        try {
            const resp = await axios(config);
            const data = await resp.data;
            console.log(data);
            console.log(data.data.rajaongkir.results);

            setRajaOngkir(data.data.rajaongkir.results)
            setSearchCityResult(data.data.rajaongkir.results)
        } catch (error) {
            console.error(`Axios error..: ${error}`);
        }
    }

    const [searchCityResult, setSearchCityResult] = useState([]);
    async function searchCity(event) {
        console.log(event.target.value);
        const input_lower = event.target.value.toLowerCase()

        let array = []
        for (let i = 0; i < rajaOngkir.length; i++) {
            // console.log(rajaOngkir[i].city_name);

            const rajaongkir_lower = rajaOngkir[i].city_name.toLowerCase();
            if (rajaongkir_lower.includes(input_lower)) {
                console.log(rajaOngkir[i]);
                array.push(rajaOngkir[i])
            }            
        }
        setSearchCityResult(array)
    }

    const [cityOrigin, setCityOrigin] = useState({});
    function setCityOriginHandle(val) {
        console.log("val");
        console.log(val);

        setCityOrigin(val)
    }

    const [alamat, setAlamat] = useState("");
    const [noHp, setNoHp] = useState("");
    async function updateProfile() {
        const full_alamat = [{
            "alamat": alamat,
            "nomor_hp": noHp,
            "origin": cityOrigin
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

                                <div>
                                    Origin selected:
                                    {cityOrigin.type} {cityOrigin.city_name} 
                                    <input type="text" placeholder='kota..' onChange={searchCity} />

                                    {searchCityResult.slice(0, 5).map((ro, index) => {
                                        return <div key={index}>
                                            <button onClick={() => setCityOriginHandle(ro)}>{ro.type} {ro.city_name}</button>
                                        </div>
                                    })}
                                </div>

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