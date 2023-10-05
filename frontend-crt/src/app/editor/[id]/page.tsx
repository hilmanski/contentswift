"use client";

import Link from "next/link";
import Terms from "@/components/Terms";
import TextEditor from "@/components/TextEditor";
import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

export default function Editor({
    children, params
}: {
    children: React.ReactNode;
    params: {
        id: string;
    }
}) {
    const [data, setData] = useState({})
    const [searchResult, setSearchResult] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8000/posts/${params.id}`)
        
            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }
            
            const data = await res.json()
            setLoading(false)
            setData(data)
            setSearchResult(data.search_result)
        }

        fetchData()
            .catch(err => {
                console.log(err)
            })
    }, [])        

    if (loading) {
        return (
            <div className="my-10 max-w-7xl mx-auto">
                <p>Loading...</p>
            </div>
        )
    }
    

    return (
        <div className="my-10 max-w-7xl mx-auto">

            <div className="flex justify-between mb-5">
                <p className="text-xl">
                    Text Editor
                </p>

                <Link href="/" className="underline">
                    Home
                </Link>
            </div>

            <section className="flex justify-betwee">
               
               <TextEditor 
                    id={params.id}
                    prevContent={data.content}
                    title={data.title} />

                
                <Sidebar
                    id={params.id}  
                    searchResult={searchResult}
                    />
            </section>
        </div>
    )
}

