import { collection, query, where, getDocs } from "firebase/firestore";
import { headers } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db } from '../../../firebase';

export async function POST(req) {
    const token = headers().get('Authorization');
    console.log(token);
    if (token === null) {
        return Response.json({
            success: false,
            message: "Missing authentication token"
        })
    };

    // Validate Token
    try {
        const decoded = verify(token, 'testkey');
        const body = await req.json();

        const q = query(collection(db, 'users'), where("username", "==", decoded.username));
        const results = await getDocs(q);
        let users = [];

        results.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
        });

        if (results.length === 0) {
            return Response.json({
                success: false,
                message: 'User not found'
            })
        }

        const chatQuery = query(collection(db, 'chatrooms'), where("members", "array-contains", decoded.username), where("chatId", "==", body.chatId));
        const chatResults = await getDocs(chatQuery);
        let chats = [];
        chatResults.forEach((doc) => {
            chats.push({ ...doc.data(), id: doc.id });
        })
        return Response.json({
            success: true,
            chats: chats
        }) 
    } catch (err) {
        console.error(err);
        return Response.json({
            success: false,
            message: 'Invalid token'
        })
    }
}