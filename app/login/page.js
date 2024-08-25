"use client";
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
    const router = useRouter();

    // Check if user is already logged in
    useEffect(() => {
        if (localStorage.getItem('token') !== null) {
            router.push('/chat')
        }
    }, [])

    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [submitting, isSubmitting] = useState(false);

    const loginHandler = async (e) => {
        isSubmitting(true);
        e.preventDefault();
        const res = await fetch(
            '/api/login',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    phone: phone,
                    password: password
                })
            }
        );
        const resResult = await res.json();
        if (resResult.success) {
            console.log(resResult);
            localStorage.setItem('token', resResult.token);
            localStorage.setItem('username', resResult.username);
            localStorage.setItem('phone', resResult.phone);
            localStorage.setItem('userId', resResult.userId)
            toast.success('Đăng nhập thành công. Đang điều hướng');
            router.push('/chat')
        } else {
            toast.error('Sai rồi thử lại');
            setPhone("");
            setPassword("");
            isSubmitting(false);
        }
    }

    return (
        <>
            <div className="absolute w-full h-full">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 810" preserveAspectRatio="xMinYMin slice">
                    <path fill="#aad6ff" d="M592.66 0c-15 64.092-30.7 125.285-46.598 183.777C634.056 325.56 748.348 550.932 819.642 809.5h419.672C1184.518 593.727 1083.124 290.064 902.637 0H592.66z"></path>
                    <path fill="#e8f3ff" d="M545.962 183.777c-53.796 196.576-111.592 361.156-163.49 490.74 11.7 44.494 22.8 89.49 33.1 134.883h404.07c-71.294-258.468-185.586-483.84-273.68-625.623z"></path>
                    <path fill="#cee7ff" d="M153.89 0c74.094 180.678 161.088 417.448 228.483 674.517C449.67 506.337 527.063 279.465 592.56 0H153.89z"></path>
                    <path fill="#e8f3ff" d="M153.89 0H0v809.5h415.57C345.477 500.938 240.884 211.874 153.89 0z"></path>
                    <path fill="#e8f3ff" d="M1144.22 501.538c52.596-134.583 101.492-290.964 134.09-463.343 1.2-6.1 2.3-12.298 3.4-18.497 0-.2.1-.4.1-.6 1.1-6.3 2.3-12.7 3.4-19.098H902.536c105.293 169.28 183.688 343.158 241.684 501.638v-.1z"></path>
                    <path fill="#eef4f8" d="M1285.31 0c-2.2 12.798-4.5 25.597-6.9 38.195C1321.507 86.39 1379.603 158.98 1440 257.168V0h-154.69z"></path>
                    <path fill="#e8f3ff" d="M1278.31,38.196C1245.81,209.874 1197.22,365.556 1144.82,499.838L1144.82,503.638C1185.82,615.924 1216.41,720.211 1239.11,809.6L1439.7,810L1439.7,256.768C1379.4,158.78 1321.41,86.288 1278.31,38.195L1278.31,38.196z"></path>
                </svg>
            </div>
            <div className="relative z-10 flex items-center justify-center w-full h-full">
                <div className="p-5 w-[500px]">
                    <Image
                        src="/zlogo.png"
                        height={70}
                        width={200}
                        className="w-[114px] h-[41px] mb-3 m-auto"
                    />
                    <div className="px-2 py-1.5 mb-3 text-center bg-[#0069ff] w-fit m-auto text-white rounded-md font-semibold">Clone</div>
                    <p className="text-center text-gray-500 font-semibold mb-5">Sử dụng tài khoản Zalo Clone của bạn để tiếp tục</p>
                    <div className="w-full bg-white h-fit">
                        <div className="p-10 shadow-lg">
                            <form onSubmit={loginHandler}>
                                <div className="mb-5">
                                    <input type="text" disabled={submitting} value={phone} onChange={(e) => { setPhone(e.target.value) }} className="w-full border border-b-1 border-l-0 border-t-0 border-r-0 text-sm ring-0 outline-0 pb-3" placeholder="Số điện thoại"/>
                                </div>
                                <div className="mb-5">
                                    <input type="password" disabled={submitting} value={password} onChange={(e) => { setPassword(e.target.value) }} className="w-full border border-b-1 border-l-0 border-t-0 border-r-0 text-sm ring-0 outline-0 pb-3" placeholder="Mật khẩu"/>
                                </div>
                                <button type="submit" disabled={submitting} className="bg-[#0191f4] p-2 w-full text-white font-semibold mb-3 text-sm border border-1 border-[#0191f4]">Đăng nhập</button>
                            </form>
                            <button onClick={() => { router.push('/register') }} className="border border-1 hover:border-[#0191f4] p-2 w-full font-semibold mb-3 text-[#0191f4] text-sm">Đăng ký</button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}