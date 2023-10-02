import Terms from "@/components/Terms";

async function getData(id: string) {
    const res = await fetch(`http://localhost:8000/post/${id}`)
    
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
        <div className="my-10 max-w-6xl mx-auto">
            <h1>Editor document with id: {params.id}</h1>
            
            <div>
                Title: {data.title}
            </div>

            {
                searchResult.answer_box && (
                    <section className="my-5 p-3 border border-emerald-600 text-sm">
                    <h3 className="text-emerald-700 ">Answer Box (Featued Snippet)</h3>
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
                    <section className="my-5 p-3 border border-emerald-600 text-sm">
                    <h3 className="text-emerald-700 mb-2">Related Questions</h3>
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
                    </section>
                )
            }

            {
                searchResult.related_searches.length > 0 && (
                    <section className="my-5 p-3 border border-emerald-600 text-sm">
                    <h3 className="text-emerald-700 mb-2">Related Searches</h3>
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

            <Terms id={params.id} />
        </div>
    )
}

