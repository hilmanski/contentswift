import os
from fastapi import FastAPI
from dotenv import load_dotenv
from serpapi import GoogleSearch
from fastapi.middleware.cors import CORSMiddleware
from concurrent.futures import ThreadPoolExecutor
import asyncio

from newspaper import Article, Config
from bs4 import BeautifulSoup
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from nltk.util import bigrams, trigrams

import operator
import nltk

from .db.post import add_post, save_links, get_post, get_all_post, remove_post



# Load env
load_dotenv() 
SERPAPI_KEY = os.getenv('SERPAPI_KEY')

app = FastAPI()

# Setup Cors
origins = [
    "http://localhost",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    # allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

nltk.download('punkt')
nltk.download('stopwords')

# API Routes
@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.post('/search/')
def search(search: dict):
    googleSearch = GoogleSearch({
        "api_key": SERPAPI_KEY,
        "engine": "google",
        "num": 20,
        "q": search['keyword'], 
        "hl": search['searchLang'],
        "gl": search['searchLocation'],
        "google_domain": search['googleDomain'],
        # "location": location,
    })
    result = googleSearch.get_dict()
    
    post = add_post(
        title = search['keyword'],
        search_query = {
            "q": search['keyword'],
            "hl": search['searchLang'],
            "gl": search['searchLocation'],
            "googleDomain": search['googleDomain'],
        },
        search_result = result
    )

    return {
        "post_id": post.id,
        "search_result": result
    }

@app.post('/links/')
def saveLinks(linkData: dict):
    post = save_links(
        post_id = linkData['postId'],
        choosen_links = linkData['choosenLinks']
    )

    return post

@app.get('/posts')
def getPosts():
    posts = get_all_post()
    return posts

@app.get('/posts/{post_id}')
def getPost(post_id: str):
    post = get_post(post_id)
    return post

@app.delete('/posts/{post_id}')
def deletePost(post_id: str):
    post = remove_post(post_id)
    return post

@app.get('/scrape/{post_id}')
async def scrape(post_id: str):
    post = get_post(post_id)
    links = post.choosen_links

    contentInfo = []
    allKeywords = []

    with ThreadPoolExecutor() as executor:
        tasks = [asyncio.get_running_loop().run_in_executor(executor, _scrape_article, link) for link in links]
        results = await asyncio.gather(*tasks)

    for result in results:
        if result:
            contentInfo.append(result)
            allKeywords.extend(result['keywords'])

    topKeywords = _getTopKeywords(allKeywords) 
    averageWords = sum([content['totalWords'] for content in contentInfo]) / len(contentInfo)

    return {
        "status": "success",
        "data": {
            "contentInfo": contentInfo,
            "topKeywords": topKeywords,
            "averageWords": averageWords
        }
    }

def _scrape_article(link):
    article = Article(link, keep_article_html=True)
    content = None

    try:
        article.download()
        article.parse()
        content = article.text
        content_html = article.article_html

        soup = BeautifulSoup(content_html, 'html.parser')
        headings = []

        for heading in soup.find_all(['h1', 'h2', 'h3']):
            headings.append({
                "text": heading.text,
                "tag": heading.name
            })

    except:
        print("Error scrape. Run manual fetch ", link)
        return None

    if content == None:
        return None

    text = content.lower()
    word_tokens = word_tokenize(text)
    stop_words = set(stopwords.words('english'))
    filtered_text = [word for word in word_tokens if word.isalpha() and word not in stop_words]
    
    single_freq_dist = nltk.FreqDist(filtered_text)
    bigram_freq_dist = nltk.FreqDist(bigrams(filtered_text))
    trigram_freq_dist = nltk.FreqDist(trigrams(filtered_text))

    # # turn each tuple into a string

    # combine all frequency distribution
    freq_dist = single_freq_dist + bigram_freq_dist + trigram_freq_dist


    keywords = []
    for word, frequency in freq_dist.most_common(10):
        keywords.append({
            "word": word,
            "frequency": frequency
        })

    totalWords = len(content.split())
    return {
        "link": link,
        "totalWords": totalWords,
        "keywords": keywords,
        "headings": headings,
    }

def _getTopKeywords(allKeywords):
    MAX_KEYWORD = 15
    
    topKeywords = {}
    for word_dict in allKeywords:
        # if word_dict['word'] is tuple, convert it to string
        _word = word_dict['word']
        if isinstance(_word, tuple):
            _word = ' '.join(word_dict['word'])

        word = _word.lower()
        
        if word in topKeywords:
            topKeywords[word] += word_dict['frequency']
        else:
            topKeywords[word] = word_dict['frequency']

    # sort the dictionary by the frequency in descending order and get the first 10 items
    sorted_topKeywords = sorted(topKeywords.items(), key=operator.itemgetter(1), reverse=True)[:MAX_KEYWORD]
    return sorted_topKeywords