"use client";

import { useEffect, useState } from "react";

export default function Terms({id} : {id: string}) {

    const [result, setResult] = useState({} as any)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getData(id).then((data) => {
            setResult(data.data)
        })
    }, [])

    async function getData(id: string) {
        const res = await fetch(`http://localhost:8000/scrape/${id}`)
        
        if (!res.ok) {
            throw new Error('Failed to fetch data')
        }

        setLoading(false)
        return res.json()
    }

    if (loading) {
        return (
            <section className="my-5">
                <h2>Terms (Take up to 1 minute)</h2>
                Loading...
            </section>
        )
    }

    return (
        <section className="my-5">
        
            {
                result.topKeywords && (
                <div
                    id="terms"
                    className="">
                    <h3 className="mt-10 mb-5 text-xl font-bold">Terms (Top Keywords)</h3>
                    <ul>
                        {
                            result.topKeywords.map((term: string, index: number) => {
                                return (
                                    <li className="inline-block bg-gray-200 mb-1 rounded-full px-3 py-1 text-sm text-gray-700 mr-2"
                                        key={index}>
                                        {term[0]}: {parseInt(term[1]) / result.contentInfo.length}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                )
            }   

            {
                result.contentInfo && (
                <div 
                    id="outline"
                    className="my-5 border p-5 border-green-700 text-sm">
                    <h3 className="mt-10 mb-5 text-xl font-bold">Competitor reference</h3>
                    <p> Average words length: {result.averageWords} </p>
                    <div className="flex justify-between space-x-5 overflow-x-scroll">
                        {
                            result.contentInfo.map((site: string, index: number) => {
                                return (
                                    <div key={index}
                                        className="border border-green-200 p-2">
                                        <p>
                                           Site: &nbsp;
                                           <a className="text-sky-700" 
                                              href={site.link}>
                                            {site.link.substring(0, 30)}...
                                           </a>
                                        </p>
                                        <p>
                                            Words: {site.totalWords}
                                        </p>

                                        {
                                            site.headings.length > 0 && (
                                                <div>
                                                    <p>Headings</p>
                                                    {
                                                        site.headings.map((heading: string, index: number) => {
                                                            return (
                                                                <p key={index}>
                                                                    {heading.tag}: {heading.text}
                                                                </p>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        }

{
                                            site.keywords.length > 0 && (
                                                <div>
                                                    <p>keywords</p>
                                                    {
                                                        site.keywords.map((keyword: string, index: number) => {
                                                            return (
                                                                <li key={index} 
                                                                    className="inline-block bg-gray-200 mb-1 rounded-full px-3 py-1 text-sm text-gray-700 mr-2">
                                                                    
                                                                    {
                                                                        Array.isArray(keyword.word) ? keyword.word.join(' ') : keyword.word
                                                                    } : 
                                                                    {keyword.frequency}
                                                                </li>
                                                            )
                                                        })
                                                    }
                                                </div>
                                            )
                                        }
                                    </div>
                                )   
                            })
                        }
                    </div>
                </div>
                )
            }
        </section>
    )
}