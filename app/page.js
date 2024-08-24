"use client";

import { collection, addDoc, query, onSnapshot } from 'firebase/firestore';
import { useState, useEffect } from 'react';
import { db } from './firebase';

export default function Home() {
    const [test, setTest] = useState([]);
	const [cum, setCum] = useState("");

	const addItem = async (e) => {
		e.preventDefault();
		await addDoc(collection(db, 'cum'), {
			doodoo: cum
		});
		setCum(''); // Clear the input after adding the item
	} 

	useEffect(() => {
		const q = query(collection(db, 'cum'));
		const unsub = onSnapshot(q, (querySnapshot) => {
			let itemsArr = [];
			querySnapshot.forEach((doc) => {
				itemsArr.push({ ...doc.data(), id: doc.id });
			});
			setTest(itemsArr);
		});
		return () => unsub();
	}, []);

	return (
		<div>
			cum list
			<ul>
				{test.map((value) => (
					<li key={value.id}>
						{value.doodoo}
					</li>
				))}
			</ul>
			<input 
				value={cum}
				onChange={(e) => { setCum(e.target.value) }}
			/>
			<button	
				onClick={addItem}
			>cum</button>
		</div>
	);
}
