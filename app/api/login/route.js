import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from '../../firebase';
import crypto from 'crypto';
import { sign, verify } from 'jsonwebtoken';

export async function POST(req) {
    const body = await req.json();
    const q = query(collection(db, 'users'), where("phone", "==", body.phone));
    const results = await getDocs(q);

    // Get first results
    let users = [];
    results.forEach((doc) => {
        users.push({ ...doc.data(), id: doc.id });
    });

    if (results.empty) {
        return Response.json({
            success: false,
            message: 'User not found'
        })
    } else {
        if (crypto.createHash("sha256").update(body.password).digest("hex") === users[0].password) {
            return Response.json({
                success: true,
                token: sign({   
                    phone: users[0].phone,
                    password: users[0].password
                }, 'testkey' /* Replace with actual secret key */, {
                    expiresIn: '14d'
                }),
                userId: users[0].id,
                username: users[0].username
            })
        } else {
            return Response.json({
                success: false,
                message: 'Wrong username or password'
            })
        }   
    }
}