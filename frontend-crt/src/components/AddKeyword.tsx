"use client";

import { useEffect, useState } from "react";
import Loading from "@/components/loading";
import ChooseReference from "@/components/ChooseReference";

export default function AddKeyword() {

  const [keyword, setKeyword] = useState('how to write an article');
  const [googleDomain, setGoogleDomain] = useState('google.com');
  const [searchLocation, setSearchLocation] = useState('us');
  const [searchLang, setSearchLang] = useState('en');
  const [loading, setLoading] = useState(false);
  const [resultsAvailable, setResultsAvailable] = useState(false);
  const [organicResults, setOrganicResults] = useState([]);
  const [postId, setPostId] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
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
      setPostId(data.post_id)
    })
    .catch((error) => {
      console.error('Error:', error);
      setLoading(false);
    });
  }



    return (
      <div className="my-10">
        {
            loading ? <Loading /> : null
        }


      {
        (resultsAvailable && organicResults.length > 0) && (
          <ChooseReference 
            postId={postId}
            organicResults={organicResults} />
        )
      }


        <p className="font-bold">Add New Content+</p>

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
    )
}