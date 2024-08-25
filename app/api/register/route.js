import { collection, query, where, addDoc, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import crypto from 'crypto';

export async function POST(req) {
    const body = await req.json();
    
    // See if usuer already exists
    const q = query(collection(db, 'users'), where("phone", "==", body.phone));
    let users = [];
    let results = await getDocs(q);
    results.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
    });

    if (users.length > 0) {
        return Response.json({
            success: false,
            message: 'Another user with the same phone number has been created'
        })
    } else {
        await addDoc(collection(db, 'users'), {
            username: body.username,
            password: crypto.createHash("sha256").update(body.password).digest("hex"),
            phone: body.phone.trim(),
            friends: []
        });
        return Response.json({
            success: true
        })
    }
}