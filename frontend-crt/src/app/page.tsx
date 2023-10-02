"use client";

import { useEffect, useState } from "react";
import Loading from "../components/loading";


export default function Home() {

  const [keyword, setKeyword] = useState('how to write an article');
  const [googleDomain, setGoogleDomain] = useState('google.com');
  const [searchLocation, setSearchLocation] = useState('us');
  const [searchLang, setSearchLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [resultsAvailable, setResultsAvailable] = useState(false);
  const [organicResults, setOrganicResults] = useState([]);
  const [choosenLinks, setChoosenLinks] = useState([])
  const [postId, setPostId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(keyword);
    console.log(googleDomain);
    console.log(searchLocation);
    console.log(searchLang);

    setLoading(true);

    // fetch data from api
    fetch('http://localhost:8000/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        keyword: keyword,
        googleDomain: googleDomain,
        searchLocation: searchLocation,
        searchLang: searchLang,
      }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Success:', data);
      setLoading(false);
      setResultsAvailable(true)
      setOrganicResults(data.search_result.organic_results)

      // add first 5 organic_result .link to choosenLinks
      setChoosenLinks(data.search_result.organic_results.slice(0, 5).map((result) => result.link))
      setPostId(data.post_id)
    })
    .catch((error) => {
      console.error('Error:', error);
      setLoading(false);
    });
  }

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
    <main className='my-10 mx-auto max-w-5xl'>
      <h1 className="text-xl">Content Research Tool</h1>

      {
        loading ? <Loading /> : null
      }

      {
        (resultsAvailable && organicResults.length > 0) && (
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


      <div className="my-10">
        <p className="font-bold">New Content</p>

        <div className="my-5">
            <p className="">keyword you want to rank</p>
            <input className="border border-gray-400 rounded w-full p-2"
                   placeholder="how to write an article"
                   value={keyword}
                   onChange={e => setKeyword(e.target.value)}
                    />
        </div>

        <div className="my-5">
            {/* select option for search engine */}
            <p className="">Search Engine (Google domain). 
            <a className="text-blue-600 underline ml-2" 
              href="https://serpapi.com/google-domains">See Reference</a>
            </p>
            <input className="border border-gray-400 rounded w-full p-2"
                   placeholder="google.com"
                    value={googleDomain}
                    onChange={e => setGoogleDomain(e.target.value)}
                    />
        </div>

        <div className="my-5">
            <p className="">Search Location  
            <a className="text-blue-600 underline ml-2" 
              href="https://serpapi.com/google-countries">See Reference</a>
            </p>
            <input className="border border-gray-400 rounded w-full p-2"
                   placeholder="us"
                    value={searchLocation}
                    onChange={e => setSearchLocation(e.target.value)}
                    />
        </div>

        <div className="my-5">
            <p className="">Search Lang  
            <a className="text-blue-600 underline ml-2" 
              href="https://serpapi.com/google-languages">See Reference</a>
            </p>
            <input className="border border-gray-400 rounded w-full p-2"
                   placeholder="en"
                    value={searchLang}
                    onChange={e => setSearchLang(e.target.value)}
                    />
        </div>

        {/* submit btn */}
        <div className="my-5">
            <button 
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={handleSubmit}
              >
              Submit
            </button>
          </div>
      </div> 
      {/* End of form */}

    </main>
  )
}
