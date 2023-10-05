import Link from "next/link";
import Terms from "@/components/Terms";
import TextEditor from "@/components/TextEditor";

async function getData(id: string) {
    const res = await fetch(`http://localhost:8000/posts/${id}`)
    
    if (!res.ok) {
        throw new Error('Failed to fetch data')
    }
    
    return res.json()
}


export default async function Editor({
    children, params
}: {
    children: React.ReactNode;
    params: {
        id: string;
    }
}) {
    const data = await getData(params.id);
    const searchResult = data.search_result

    return (
        <div className="my-10 max-w-7xl mx-auto">

            <div className="flex justify-between mb-5">
                <p className="text-xl">
                    Title: {data.title}
                </p>

                <Link href="/" className="underline">
                    Home
                </Link>

            </div>
         
            <section className="fixed">
                <p>Menu</p>

                <div className="text-sm">
                    <a className="block mt-2" href="#answer-box">#Google Results</a>
                    <a className="block mt-2" href="#related-questions">#Related Questions</a>
                    <a className="block mt-2" href="#autocomplete">#Autocomplete</a>
                    <a className="block mt-2" href="#related-searches">#Related Searches</a>
                    <a className="block mt-2" href="#terms">#Terms</a>
                    <a className="block mt-2" href="#outline">#Outline</a>
                </div>
            </section>

            <section className="flex justify-between">

                <section className="ml-[200px] w-3/12 max-h-screen overflow-y-scroll">


                {
                    searchResult.answer_box && (
                        <section 
                        id="answer-box"
                        className="my-5 p-3 border border-emerald-600 text-sm">
                            <details>
                                <summary>
                                    <h3 className="inline-block text-emerald-700 ">Answer Box (Featued Snippet)</h3>
                                </summary>
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
                            </details>
                        </section>
                    )
                }

                {
                    searchResult.related_questions.length > 0 && (
                        <section 
                            id="related-questions"
                            className="my-5 p-3 border border-emerald-600 text-sm">

                            <details>
                                <summary>
                                    <h3 className="inline-block text-emerald-700 mb-2">Related Questions</h3>
                                </summary>
                                {
                                    searchResult.related_questions.map((item, index) => {
                                        return (
                                                <div key={index} className="mb-1">
                                                    <p className="font-bold"> {item.question} </p>
                                                    <p className="italic"> {item.snippet} </p>
                                                </div>
                                        )
                                    })
                                }
                            </details>
                        </section>
                    )
                }

                {
                    searchResult.autocomplete.length > 0 && (
                        <section 
                            id="autocomplete"
                            className="my-5 p-3 border border-emerald-600 text-sm">

                            <details>
                                <summary>
                                    <h3 className="inline-block text-emerald-700 mb-2">Autocomplete</h3>
                                </summary>
                                {
                                    searchResult.autocomplete.map((item, index) => {
                                        return (
                                                <div key={index} className="mb-1">
                                                    {item.value}
                                                </div>
                                        )
                                    })
                                }
                            </details>
                        </section>
                    )
                }

                {
                    searchResult.related_searches.length > 0 && (
                        <section 
                            id="related-searches"
                            className="my-5 p-3 border border-emerald-600 text-sm">

                        <details>   
                            <summary>
                                <h3 className="inline-block text-emerald-700 mb-2">Related Searches</h3>
                            </summary>

                            {
                                searchResult.related_searches.map((item, index) => {
                                    return (
                                            <div key={index} className="mb-1">
                                                <p className=""> {item.query} </p>
                                            </div>
                                    )
                                })
                            }
                        </details>      
                        </section>
                    )
                }

                <Terms id={params.id} />
                </section>

               <TextEditor 
                    id={params.id}
                    prevContent={data.content} />
            </section>
        </div>
    )
}

