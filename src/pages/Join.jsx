import React, { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import PocketBase from 'pocketbase';

const pb = new PocketBase('https://ecommerce.choniki.tk');

function Join() {
    const navigate = useNavigate();

    const [pembeliUsers, setPembeliUsers] = useState([]);
    async function getAllPembeliUser() {
        // fetch a paginated records list
        const resultList = await pb.collection('pembeli').getFullList(200, {
            filter: 'created >= "2022-01-01 00:00:00"',
        });
        console.log(resultList);

        setPembeliUsers(resultList)
    }

    useEffect(() => {
        if (pb.authStore.isValid) {
            navigate("/");
        }

        getAllPembeliUser()

        // async function tes1() {
        //     const user = await pb.collection("pembeli").getFirstListItem(`username="aryasury"`);
        //     console.log(user);
        // } 
        // tes1()

        // async function getAuth() {
        //     const authData = await pb.admins.authWithPassword('admin@choniki.tk', 'Fahmid@ud2018');

        //     // after the above you can also access the auth data from the authStore
        //     console.log(pb.authStore.isValid);
        //     console.log(pb.authStore.token);
        //     console.log(pb.authStore.model.id);
        // }
        // getAuth()
    }, []);

    pb.collection('pembeli').subscribe('*', function (e) {
        console.log("relatime result dr e.record");
        console.log(e.record);

        getAllPembeliUser()
    });

    const [isUsernameFill, setIsUsernameFill] = useState(false);
    const [isTerdaftarViaUsername, setIsTerdaftarViaUsername] = useState(false);
    async function handleUsername(event) {
        let input_username = event.target.value
        setUsername(input_username)

        // console.log(input_username.length);
        if (input_username.length != 0) {
            setIsUsernameFill(true)
        } else {
            setIsUsernameFill(false)
        }

        console.log(pembeliUsers);

        for (let i = 0; i < pembeliUsers.length; i++) {
            console.log(pembeliUsers[i].username);

            if (input_username === pembeliUsers[i].username) {
                setIsTerdaftarViaUsername(true)
                break;
            } else {
                setIsTerdaftarViaUsername(false)
            }
        }
    }

    const [isTerdaftarViaEmail, setIsTerdaftarViaEmail] = useState(false);
    async function handleEmail() {
        let input_email = event.target.value
        setEmail(input_email)

        for (let i = 0; i < pembeliUsers.length; i++) {
            console.log(pembeliUsers[i].username);

            if (input_email === pembeliUsers[i].email) {
                setIsTerdaftarViaEmail(true)
                break;
            } else {
                setIsTerdaftarViaEmail(false)
            }
        }
    }

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirm, setPasswordConfirm] = useState("");
    const [nama, setNama] = useState("");
    async function createUser() {
        console.log("isTerdaftarViaUsername");
        console.log(isTerdaftarViaUsername);
        console.log("isTerdaftarViaEmail");
        console.log(isTerdaftarViaEmail);

        if (isTerdaftarViaUsername || isTerdaftarViaEmail) {
            console.log("sedang login");

            let authData
            if (isTerdaftarViaUsername) {
                authData = await pb.collection('pembeli').authWithPassword(
                    username,
                    password,
                );
            } else {
                authData = await pb.collection('pembeli').authWithPassword(
                    email,
                    password,
                );
            }
            console.log("authData");
            console.log(authData);

            navigate("/");

        } else {
            console.log("sedang daftar");

            const alamat = [
                {
                    "Alamat": "",
                    "nomor_hp": ""
                }
            ]

            const data = {
                "username": username,
                "email": email,
                "emailVisibility": true,
                "password": password,
                "passwordConfirm": passwordConfirm,
                "nama": nama,
                "alamat": alamat
            };
            console.log(data);

            const record = await pb.collection('pembeli').create(data);

            console.log("record");
            console.log(record);

            const authData = await pb.collection('pembeli').authWithPassword(
                username,
                password,
            );
            console.log("authData");
            console.log(authData);

            navigate("/");
        }
        // console.log("record");
        // console.log(record);

    }

    return (
        <div>
            {!isTerdaftarViaEmail &&
                <input type="text" placeholder="username" onChange={handleUsername} />
            }
            {isUsernameFill &&
                <>
                    {!isTerdaftarViaUsername && !isTerdaftarViaEmail &&
                        <input type="text" placeholder="nama" onChange={e => setNama(e.target.value)} />
                    }

                    {!isTerdaftarViaUsername &&
                        <input type="email" placeholder="email" onChange={handleEmail} />
                    }

                    <input type="password" placeholder="password" onChange={e => setPassword(e.target.value)} />

                    {!isTerdaftarViaUsername && !isTerdaftarViaEmail &&
                        <>
                            <input type="password" placeholder="passwordConfirm" onChange={e => setPasswordConfirm(e.target.value)} />
                        </>
                    }

                    <button type="button" onClick={createUser}>Join now</button>
                </>
            }

        </div>
    )
}

export default Join