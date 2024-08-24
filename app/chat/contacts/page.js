"use client";
import { collection, doc, getDocs, onSnapshot, query, where } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';

export default function CreateChat() {
    const [contacts, setContacts] = useState([]);

    useEffect(() => {
        const getContacts = async () => {
            const contactsQuery = query(collection(db, "users"), where("username", "==", localStorage.getItem('username')));
            const snapshot = await getDocs(contactsQuery);
            let currentContacts = [];
            snapshot.forEach((doc) => {
                currentContacts.push({ ...doc.data(), id: doc.id })
            });
            setContacts(currentContacts[0].friends);
        }
        getContacts();
    })

    return (
        <div className="w-full h-full flex">
            <div className="w-[300px] h-full border border-1 border-t-0 border-b-0 border-l-0 border-r-1 flex-none">
                <div className="mt-5">
                    <div className="p-3 w-full"></div>
                    <p className="font-semibold px-3 py-2">Bạn bè</p>
                    {contacts.map((value, key) => (
                        <div key={key} className="p-3 w-full hover:bg-gray-200">
                            {value}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}