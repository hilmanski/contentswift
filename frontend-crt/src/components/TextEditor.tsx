"use client";

import { useState } from "react";

export default function TextEditor({id, prevContent}: {id: string, prevContent: string}) {

    const [content, setContent] = useState<string>(prevContent)

    const saveContent = () => {
        fetch(`http://localhost:8000/posts/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content
            })
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err))
    }

    return (
        <section className="ml-5 w-8/12">
            <div className="flex justify-between items-center mb-5">
                <p className="font-bold text-xl">Text Editor</p>
                <button 
                    onClick={() => {saveContent()}} 
                    className="bg-sky-400 hover:bg-sky-600 p-3 rounded-lg text-white">
                    Save
                </button>
            </div>

            <textarea 
                value={content || ''}
                onChange={(e) => {setContent(e.target.value)}}
                className="w-full h-screen border border-gray-300 p-5"></textarea>
        </section>
    )
}