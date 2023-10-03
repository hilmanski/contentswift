"use client";

import Link from "next/link";
import { useEffect, useState } from "react"

export default function ListKeyword() {
    const [loading, setLoading] = useState(true);
    const [keywords, setKeywords] = useState([])

    useEffect(() => {
        getKeywordList()
    },  [])

    const getKeywordList = async () => {
        fetch('http://localhost:8000/posts', {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                setKeywords(data)
                setLoading(false);
            })
            .catch((error) => {
                alert('Error ' + error)
                setLoading(false);
            });
    }

    const remove = (id: number) => async () => {
        setLoading(true);
        fetch(`http://localhost:8000/posts/${id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            .then(response => response.json())
            .then(data => {
                console.log(data)
                getKeywordList()
            })
            .catch((error) => {
                alert('Error ' + error)
                setLoading(false);
            });
    }

    return (
        <div className="my-10 border-t border-t-slate-300 py-5 ">
            <h2 className="font-bold ">Keyword List</h2>

            {
                loading && <p>Loading...</p>
            }

            {
                keywords.map((keyword: any) => (
                    <div key={keyword.id}
                        className="my-5 p-3 bg-gray-200 flex justify-between">
                        <p>{keyword.title} - <span className="text-sm text-gray-500"> Created at {keyword.createdAt}</span></p>

                        <div className="flex space-x-3">
                            <button onClick={remove(keyword.id)} className="text-rose-300 hover:underline">Remove</button> 
                            <Link href={`/editor/${keyword.id}`} className="hover:underline">Go-To-Editor</Link>
                        </div>
                    </div>
                ))
            }
        </div>
    )
}