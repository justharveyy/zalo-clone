"use client";

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Avatar from 'boring-avatars';
import { MessageCircleMore, BookUser, LogOut } from 'lucide-react';

export default function ChatLayout({ children }) {
    const router = useRouter();
    
    () => {
        if (localStorage.getItem('token') === null) {
            router.push('/login')
        }
    }

    return (
        <div className="w-full h-full flex">
            <div className="w-[64px] h-full bg-[#0091fe] flex-none">
                <div className="p-2 w-full h-fit flex justify-center items-center mb-5 mt-5">
                    <Image 
                        src="/freakydog.jpg"
                        height={300}
                        width={300}
                        className="rounded-full border border-1 border-white"
                    />
                </div>
                <div onClick={() => { router.push('/chat') }} className="p-2 w-full h-[64px] hover:bg-[#0065b2] flex justify-center items-center">
                    <MessageCircleMore color="#ffffff" size={40} className="m-auto" />
                </div>
                <div onClick={() => { router.push('/chat/contacts   ') }} className="p-2 w-full h-[64px] hover:bg-[#0065b2] flex justify-center items-center">
                    <BookUser color="#ffffff" size={40} className="m-auto" />
                </div>
                <div onClick={() => { localStorage.clear(); router.push('/login') }} className="p-2 w-full h-[64px] hover:bg-[#0065b2] flex justify-center items-center">
                    <LogOut color="#ffffff" size={40} className="m-auto" />
                </div>
            </div>
            <div className="grow h-full">
                {children}
            </div>
        </div>
    )
}