"use client";
import { collection, doc, getDocs, onSnapshot, query, where, arrayUnion, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export default function CreateChat() {
    const [contacts, setContacts] = useState([]);
    const [addFriend, setAddFriend] = useState("");
    const [submitting, isSubmitting] = useState(false);

    useEffect(() => {
        const getContacts = async () => {
            const contactsQuery = query(collection(db, "users"), where("username", "==", localStorage.getItem('username')));
            onSnapshot(contactsQuery, (snapshot) => {
                let currentContacts = [];
                snapshot.forEach((doc) => {
                    currentContacts.push({ ...doc.data(), id: doc.id })
                });
                if (currentContacts[0] === undefined) {
                    setContacts([])
                } else {
                    setContacts(currentContacts[0].friends);
                }
            }); 
        }
        getContacts();
    })

    const handleAddFriend = async (e) => {
        e.preventDefault();
        if (addFriend === '') {
            toast.error('Không thể để tên người dùng trống');
            isSubmitting(false);
            setAddFriend("");
        } else {
            if (contacts.includes(addFriend)) {
                toast.error("Đã có người dùng này trong danh sách bạn bè");
                isSubmitting(false);
                setAddFriend("");
            } else if (addFriend == localStorage.getItem('username')) {
                toast.error("Bạn không thể thêm chính mình");
                isSubmitting(false);
                setAddFriend("");
            } else {
                // See if user exists
                const userQuery = query(collection(db, 'users'), where("username", "==", addFriend));
                const userQuerySnapshot = await getDocs(userQuery);
                
                if (userQuerySnapshot.empty) {
                    toast.error('Người dùng không tồn tại');
                    isSubmitting(false);
                    setAddFriend("");
                } else {        
                    const currentFriendsRef = doc(db, "users", localStorage.getItem('userId'));
                    await updateDoc(currentFriendsRef, {
                        friends: arrayUnion(addFriend)
                    })
                    toast.success("Thêm thành công")
                    isSubmitting(false);
                    setAddFriend("");
                }
            }
        }
    }

    return (
        <div className="w-full h-full flex">
            <div className="w-[300px] h-full border border-1 border-t-0 border-b-0 border-l-0 border-r-1 flex-none">
                <div className="mt-5">
                    <div className="p-3 w-full mb-5">
                        <p className="font-semibold mb-3">Thêm bạn bè</p>
                        <form onSubmit={handleAddFriend} className="flex">    
                            <input type="text" onChange={(e) => { setAddFriend(e.target.value) }} value={addFriend} className="border border-1 border-b-1 border-r-0 border-l-0 border-t-0 outline-0 w-full px-1.5 py-2 text-sm grow" disabled={submitting} placeholder='Tên người dùng' />
                            <button type="submit" className="flex-none px-1.5 py-2 text-center bg-[#0091fe] text-white" disabled={submitting}>Thêm</button>
                        </form>
                    </div>
                    <p className="font-semibold px-3">Bạn bè</p>
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