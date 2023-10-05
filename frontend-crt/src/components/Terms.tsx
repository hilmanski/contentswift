export default function Terms({result} : {result: any}) {

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
                                        {term[0]}: {(parseInt(term[1]) / result.contentInfo.length).toFixed(2)}
                                    </li>
                                )
                            })
                        }
                    </ul>
                </div>
                )
            }   
        </section>
    )
}