"use client";
import { collection, where, arrayUnion, query, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Send } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Chat({ params }) {
    const router = useRouter();
    const chatRef = useRef(null);

    useEffect(() => {
        if (localStorage.getItem('token') === null) {
            router.push('/login')
        }
    }, [router]);
    
    const [chats, setChats] = useState([]);
    const [chatTitle, setChatTitle] = useState("");
    const [chatMembers, setChatMembers] = useState([]);
    const [currentChat, setCurrentChat] = useState(); 
    const [chatsAvailable, setChatsAvailable] = useState(false);
    const [text, setText] = useState("");

    const textHandler = async (e) => {
        e.preventDefault();
        if (text.length === 0) {
            toast.error('Tin nhắn không được bỏ trống');
            setText('')
        }
        const currentChatRef = doc(db, "chatrooms", params.chatId);
        await updateDoc(currentChatRef, {
            chats: arrayUnion({
                sender: localStorage.getItem('username'),
                message: text,
                date: new Date()
            })  
        })
        setText("");
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

        const chatSub = onSnapshot(doc(db, "chatrooms", params.chatId), (doc) => {
            setChatTitle(doc.data().chatTitle);
            setChatMembers(doc.data().members);
            setCurrentChat(doc.data().chats);
            setChatsAvailable(true);
        })
	}, []);

    useEffect(() => {
        chatRef.current.lastElementChild.scrollIntoView()
    }, [currentChat])
    return (
        <div className="w-full h-full flex">
            <div className="w-[300px] h-full border border-1 border-t-0 border-b-0 border-l-0 border-r-1 flex-none">
                
            </div>
            <div className="grow h-full flex flex-col">
                <div className="w-full h-fit p-5 flex justify-between border border-1 border-t-0 border-l-0 border-r-0 border-b-1 flex-none">
                    <div className="">
                        <p className="font-semibold">{chatTitle} #{params.chatId}</p>
                        <div className="flex items-center">
                            {!chatMembers.length > 0 && <p>Đang tải</p>}
                            {chatMembers.length > 0 && chatMembers.map((value, key) => {
                                if (key + 1 == chatMembers.length) {
                                    return ( 
                                        <p className="text-gray-600" key={key}>{value}</p>
                                    )
                                } else {
                                    return (
                                        <p className="text-gray-600" key={key}>{value}&#44;&nbsp;</p>
                                    )
                                }
                            })}
                        </div>
                    </div>
                </div>
                <div className="w-full grow bg-gray-200 p-5 overflow-y-scroll flex flex-col h-full" ref={chatRef}>
                    <div></div>
                    {!chatsAvailable && <p>Đang tải chat</p>}
                    {chatsAvailable && currentChat.map((value, key) => (
                        <div className="p-3 rounded bg-white border border-1 border-[#365f97] w-fit mb-3" key={key}>
                            <p className="text-sm text-gray-400 font-semibold mb-2">{value.sender} đã gửi</p>
                            <p className="mb-2">{value.message}</p>
                            <p className="text-sm text-gray-400 font-semibold mb-2">{new Date(value.date.seconds * 1000).toISOString()}</p>
                        </div>
                    ))}
                </div>
                <div className="w-full h-fit flex-none">
                    <form className="flex items-center p-3" onSubmit={textHandler}>
                        <input className="py-2 px-3 border border-1 border-b-1 border-l-0 border-t-0 border-r-0 text-sm grow outline-0" placeholder="Nhập tin nhắn" value={text} onChange={(e) => { setText(e.target.value) }}></input>
                        <button type="submit"><Send className="flex-none" /></button>
                    </form>
                </div>
            </div>
        </div>
    )
}