"use client"
import { useEffect, useState } from "react";
import Terms from "./Terms";
import Outline from "./Outline";


export default function Sidebar({
    id, searchResult
}: {
    id: string,
    searchResult: any
}) {
    const [menu, setMenu] = useState<string>('terms')

    const [result, setResult] = useState({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchData = async () => {
            const res = await fetch(`http://localhost:8000/scrape/${id}`)
        
            if (!res.ok) {
                throw new Error('Failed to fetch data')
            }
    
            const _data = await res.json()
            setResult(_data.data)
            setLoading(false)
        }

        fetchData()
            .catch(err => {
                console.log(err)
            })
    }, [])        


    return (
        <section className="ml-5 w-3/12 bg-gray-100 p-5">

        <section className="flex space-x-4 border-b-2 pb-3">
            {/* <p>Terms</p> */}
            <p onClick={() => {setMenu('terms')}} 
                className={`
                    cursor-pointer hover:text-emerald-500 
                    ${menu === 'terms' ? 'text-emerald-700 border-b-2 border-b-emerald-700' : ''}   
                `}>Terms</p>
            <p onClick={() => {setMenu('research')}} 
                className={`
                    cursor-pointer hover:text-emerald-500 
                    ${menu === 'research' ? 'text-emerald-700 border-b-2 border-b-emerald-700' : ''}
                `}>
                    Research</p>
            <p onClick={() => {setMenu('outline')}} 
                className={`
                    cursor-pointer hover:text-emerald-500 
                    ${menu === 'outline' ? 'text-emerald-700 border-b-2 border-b-emerald-700' : ''}
                `}>Outline</p>
        </section>

        {
            menu == 'research' && (
            <section>
            {
                searchResult.answer_box && (
                    <section className="my-5 text-sm">
                            <h3 className="inline-block text-emerald-700 ">Answer Box (Featued Snippet)</h3>
                            <p className="italic">
                                {
                                    searchResult.answer_box.snippet
                                }
                            </p>

                            {
                                searchResult.answer_box.list && (
                                    <div>
                                    <p className="text-bold italic">Info: Features snippet is a list</p>
                                    {
                                        searchResult.answer_box.list.map((item, index) => {
                                            return (
                                                <div key={index}>
                                                    <p>{item}</p>
                                                </div>
                                            )
                                        })
                                    }
                                    </div>
                                )
                            }

                            <p>
                                <a className="text-sky-700"
                                    href={searchResult.answer_box.link}>
                                    source 
                                </a>
                            </p>
                    </section>
                )
            }

            {
                searchResult.related_questions.length > 0 && (
                    <section className="my-5 text-sm">

                        <h3 className="inline-block text-emerald-700 mb-2">Related Questions</h3>
                        
                        {
                            searchResult.related_questions.map((item, index) => {
                                return (
                                        <div key={index} className="mb-1">
                                            <details>
                                                <summary>
                                                    <p className="inline"> {item.question} </p>
                                            </summary>
                                            <p className="italic"> {item.snippet} </p>
                                            </details>
                                        </div>
                                )
                            })
                        }
                    </section>
                )
            }

            {
                searchResult.autocomplete.length > 0 && (
                    <section className="my-5 text-sm">

                        <h3 className="inline-block text-emerald-700 mb-2">Autocomplete</h3>
                        
                        {
                            searchResult.autocomplete.map((item, index) => {
                                return (
                                        <div key={index} className="mb-1">
                                            {item.value}
                                        </div>
                                )
                            })
                        }
                    </section>
                )
            }

            {
                searchResult.related_searches.length > 0 && (
                    <section className="my-5 text-sm">

                    <h3 className="inline-block text-emerald-700 mb-2">Related Searches</h3>
                    {
                        searchResult.related_searches.map((item, index) => {
                            return (
                                    <div key={index} className="mb-1">
                                        <p className=""> {item.query} </p>
                                    </div>
                            )
                        })
                    }
                    </section>
                )
            }
            </section>
        )}

        {
            menu == 'terms' && (
                <>
                {
                    loading ?  <p>Loading ... (Up to 1 minutes) </p> : <Terms result={result} />                    
                }
                </>
            )
        }

        {
            menu == 'outline' && (
                <>
                {
                    loading ?  <p>Loading ... (Up to 1 minutes)</p> : <Outline result={result} />                    
                }
                </>
            )
        }
        
        </section>
    )
}