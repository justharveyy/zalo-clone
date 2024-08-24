"use client";
import { collection, where, query, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Chat() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push('/login')
        }
    }, [router]);
    
    const [chats, setChats] = useState([]);
    const [chatsAvailable, setChatsAvailable] = useState(false);

    useEffect(() => {
		const chatsQuery = query(collection(db, 'chatrooms'), where("members", "array-contains", localStorage.getItem('username')));
		onSnapshot(chatsQuery, (querySnapshot) => {
			let chatsArr = [];
			querySnapshot.forEach((doc) => {
				chatsArr.push({ ...doc.data(), id: doc.id });
			});
			setChats(chatsArr);
            if (chatsArr.length === 0) {
                setChatsAvailable(false);
            } else {
                setChatsAvailable(true);
            }
		});
	}, []);

    return (
        <div className="w-full h-full flex">
            <div className="w-[300px] h-full border border-1 border-t-0 border-b-0 border-l-0 border-r-1 flex-none">
                <div className="mt-5">
                    {!chatsAvailable && ( <p>Tạo chat để tiếp tục</p> )}
                    {chatsAvailable && chats.map((value, key) => (
                        <div className="w-full h-fit hover:bg-gray-200 p-3" key={key} onClick={() => {router.push(`/chat/${value.id}`) }}>
                            <p className="font-semibold">{value.chatTitle}</p>
                            <p className="text-gray-500 font-semibold text-sm">
                                {value.chats[0].sender}: {value.chats[0].message}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}