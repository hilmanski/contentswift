export default function Outline({result} : {result: any}) {

    return (
        <section className="my-5">
    
            {
                result.contentInfo && (
                <div 
                    className="my-5 text-sm">
                    <h3 className="mb-5 text-xl font-bold">Competitor reference</h3>
                    <p> Average words length: {result.averageWords} </p>
                    <div className="my-5">
                    {
                        result.contentInfo.map((site: string, index: number) => {
                            return (
                                <div key={index}
                                    className="border-b-2 pb-5">
                                    <p className="border-l-2 border-l-black pl-2 my-2">
                                        <a className="text-sky-700" 
                                            href={site.link}>
                                        {site.title}...
                                        </a>
                                    </p>
                                    <p className="mb-2 text-gray-600">
                                        src: {site.link}
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