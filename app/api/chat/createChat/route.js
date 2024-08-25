import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import { headers } from 'next/headers';
import { verify } from 'jsonwebtoken';
import { db } from '../../../firebase';

export async function POST(req) {
    try {
        const token = headers().get('Authorization');
        if (!token) {
            return new Response(JSON.stringify({
                success: false,
                message: "Missing authentication token"
            }), { status: 401 });
        }

        // Validate Token   
        const decoded = verify(token, 'testkey');
        
        // Reading the JSON body correctly
        const body = await req.json(); 
        console.log('Logging body...');
        console.log(body);

        const q = query(collection(db, 'users'), where("phone", "==", decoded.phone));
        const results = await getDocs(q);
        let users = [];

        results.forEach((doc) => {
            users.push({ ...doc.data(), id: doc.id });
        });

        if (users.length === 0) {
            return new Response(JSON.stringify({
                success: false,
                message: "User not found"
            }), { status: 404 });
        }

        // Get info of the other recipients
        let otherRecipients = [];
        for (const member of body.members) {
            const userCheck = query(collection(db, 'users'), where("username", "==", member));
            const userResults = await getDocs(userCheck);
            if (userResults.empty) {
                return new Response(JSON.stringify({
                    success: false,
                    message: `Member with username ${member} is unavailable`
                }), { status: 404 });
            } else {
                otherRecipients.push(member);
            }
        }
        
        // Create New Chat
        try {
            await addDoc(collection(db, 'chatrooms'), {
                members: otherRecipients,
                chats: [],
                chatTitle: body.chatTitle
            });
        } catch (err) {
            console.error(err);
            return new Response(JSON.stringify({
                success: false,
                message: 'Internal server error'
            }), { status: 500 });
        }

        return new Response(JSON.stringify({
            success: true
        }), { status: 200 });
    } catch (err) {
        console.error(err);
        return new Response(JSON.stringify({
            success: false,
            message: 'Invalid token'
        }), { status: 401 });
    }
}
