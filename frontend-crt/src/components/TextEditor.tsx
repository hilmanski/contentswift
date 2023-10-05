"use client";

import { atom, useAtom } from 'jotai'
import { contentAtom } from "@/utils/state";

export default function TextEditor({id, title}: {id: string, title: string}) {
    
    const [content, setContent] = useAtom(contentAtom)

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
                <p className="font-bold text-xl">Title: {title}</p>
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