import { useEffect, useState } from "react";

export default function ChooseReference({
    postId,
    organicResults,
} : {
    postId: number,
    organicResults: any,
}

) {
    const [loading, setLoading] = useState(false);
    const [choosenLinks, setChoosenLinks] = useState([])


    useEffect(() => {
        // add first 5 organic_result .link to choosenLinks
        if(organicResults.length > 0) {
            setChoosenLinks(organicResults.slice(0, 5).map((result) => result.link))
        }
    }, [organicResults])

    const handleArticleChange = (e, index) => {
        if(e.target.checked) {
        // add to choosenLinks
        setChoosenLinks([...choosenLinks, organicResults[index].link])
        } else {
        // remove from choosenLinks
        setChoosenLinks(choosenLinks.filter((article) => article !== organicResults[index].link))
        }
    }

    const goToEditorPage = () => {
        // save choosen article to DB
        fetch('http://localhost:8000/links', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                postId, choosenLinks,
            }),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
                window.location.href = `/editor/${postId}`
            })
            .catch((error) => {
            console.error('Error:', error);
                alert('Error saving to DB')
                setLoading(false);
            });
    }

    return (
        <div className="my-5">
            <h2 className="mb-5">
            These are the top 20 articles that rank for your keyword. 
            <b>Choose 5-10 articles as comparison</b></h2>

            <button className="bg-blue-500 text-white p-3 mb-5 rounded-lg"
            onClick={goToEditorPage}>
            Continue
            </button>

            {
                organicResults.map((result, index) => (
                    <div key={index}
                    className="mb-3 border-l pl-2 flex items-center justify-between">

                    <label htmlFor="url_to_scrape"
                        className="mr-5">
                        <input type="checkbox"
                                id="url_to_scrape"
                                onChange={(e) => handleArticleChange(e, index)}
                                checked={choosenLinks.includes(result.link)}
                                className="" />
                    </label>

                    <p className="font-bold w-5/12">{result.title}</p>
                    <a className="w-5/12 underline text-sky-500"
                        href={result.link}>
                        {result.link}
                    </a>
                    </div>
                ))
            }
      </div>
    )
}