import { contentAtom } from "@/utils/state";
import { atom, useAtom } from "jotai";

export default function Terms({result} : {result: any}) {

    const [content, setContent] = useAtom(contentAtom)

    const countProgress = (term: string, targetCount: number) => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        const actualCount = (content.match(regex) || []).length;
        const percentage = (actualCount / targetCount) * 100

        return {
            actualCount,
            percentage
        }
    }

    return (
        <section className="my-5">
            {
                result.topKeywords && (
                <div
                    id="terms"
                    className="">
                    <h3 className="mb-5 text-xl font-bold">Terms (Top Keywords)</h3>
                    <ul>
                        {
                            result.topKeywords.map((term: string, index: number) => {
                                const targetCount = Math.floor(parseInt(term[1]) / result.contentInfo.length)

                                return (
                                    <div key={index}>
                                        <li className="bg-gray-200 px-2 py-1 text-sm text-gray-700 mr-2">
                                            {term[0]}: {targetCount}
                                        </li>

                                        <div className="relative pt-1">
                                            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
                                                <div style={{ width: `${countProgress(term[0], targetCount).percentage}%` }} 
                                                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"></div>
                                            </div>
                                        </div>
                                        
                                    </div>
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