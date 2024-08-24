"use client";
import { collection, where, query, onSnapshot, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function Chat() {
    const router = useRouter();

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push('/login')
        }
    }, [router]);
    
    const [chats, setChats] = useState([]);
    const [chatsAvailable, setChatsAvailable] = useState(false);

    const [newChatName, setNewChatName] = useState("");
    const [newChatMember, setNewChatMember] = useState("");

    const handleCreateNewChat = async (e) => {
        e.preventDefault();
        if (newChatName === '' || newChatMember === '') {
            toast.error("Vui lòng điền đầy đủ thông tin");
        } else {
            // Check if chat already exists
            const chatExistsQuery = query(collection(db, "chatrooms"), where("members", "array-contains", [localStorage.getItem('username'), newChatMember]));
            const chatExists = await getDocs(chatExistsQuery);

            if (!chatExists.empty) {
                toast.error("Đã tồn tại một nhóm chat với cùng thành viên");
                setNewChatMember("");
                setNewChatName("");
            } else {
                const res = await fetch(
                    '/api/chat/createChat',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': localStorage.getItem('token')
                        },
                        body: JSON.stringify({
                            members: [localStorage.getItem('username'), newChatMember],
                            chatTitle: newChatName
                        })
                    }
                )
                if (res.success) {
                    toast.success('Đã tạo chat');
                    setNewChatMember("");
                    setNewChatName("");
                } else {
                    toast.error(res.message);
                    setNewChatMember("");
                    setNewChatName("");
                }
            }
        }
    }

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
                    <p className="px-3 font-semibold">Tạo chat để tiếp tục</p>
                    <form onSubmit={handleCreateNewChat} className="w-full p-3">
                        <input type="text" className="w-full border border-1 border-b-1 border-t-0 border-l-0 border-r-0 mb-3 outline-0" value={newChatName} onChange={(e) => { setNewChatName(e.target.value) }} placeholder="Tên Chat" />
                        <input type="text" className="w-full border border-1 border-b-1 border-t-0 border-l-0 border-r-0 mb-3 outline-0" value={newChatMember} onChange={(e) => { setNewChatMember(e.target.value) }} placeholder="Thành Viên" />
                        <button type="submit" className="px-1.5 py-2 text-center bg-[#0091fe] text-white w-full">Tạo</button>
                    </form>
                    {!chatsAvailable && ( 
                        <p>Chưa có chat nào</p>
                    )}
                    {chatsAvailable && chats.map((value, key) => (
                        <div className="w-full h-fit hover:bg-gray-200 p-3" key={key} onClick={() => {router.push(`/chat/${value.id}`) }}>
                            <p className="font-semibold">{value.chatTitle}</p>
                            {value.chats[0] === undefined && <p className="text-gray-500 font-semibold text-sm">Chưa có tin nhắn</p>}
                            {value.chats[0] !== undefined && 
                                ( <p className="text-gray-500 font-semibold text-sm">{value.chats[0].sender}: {value.chats[0].message}</p> )
                            }
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}