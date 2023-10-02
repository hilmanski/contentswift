
# About
ContentSwift - Content research/optimization tool for SEO.

Using this tool, you'll get relevant information regarding specific keyword searches and hints on what other top-ranking results did with their article/page.

> Right now we're focusing on Google SERP only

*The commercial version for this open source tool would be something like:
Surfer SEO, Frase io, ClearScope, NeuronWriter, etc.. (of course they offer more features than this).*

- This is for personal usage, no authentication setup needed in the app itself.
- Sign up to [SerpApi](https://serpapi.com) to get FREE Serp search results credit

## Status
Under heavy development. Not for production.

## Tech

### Backend 
`backend-crt` is a docker setup for `fastApi` and `Postgre`

### Frontend
`frontend-crt` is manual `nextjs` installation

### Scrape API (SerpAPI)
Scraping Google search result on our own will require a lot of time to prevent us from getting blocked and getting the proper structure. That's why we're using simple solution from SerpApi.

### Python lib
- [NLTK](https://www.nltk.org/)
- [Newspaper](https://newspaper.readthedocs.io/en/latest/)
- [Beautifulsoup](https://pypi.org/project/beautifulsoup4/)

## Setup env file

- Create new empty `.env` file at `/backend-crt/src` folder
- Get your `API_KEY` from serpapi.com
- Paste your Serp api key in `.env` file at `backend-crt`
```
SERPAPI_KEY=$here_is_your_api_key
```

## Run the project

Make sure docker app is open

1. run backend (API)
```
cd backend-crt && docker-compose up -d --build
```

2. Setup Database (1 time only)

Cd into src
```
cd backend-crt/src
```

Activating a virtual env (setup if not yet)
```
source env/bin/activate
```

Run migration
```
python db/models.py
```

3. run Frontend (API)
(Not inside python virtual env)
Now from root folder (another terminal or just go back). 


```
cd frontend-crt && yarn dev
```

Project is available at localhost:3000


## TODO
- Add visual screenshot
- Add sample compare to other research tool
- Add short video

## Potential Issue / improvement
- Remove code as part of word frequency: Ignore content between triple backtick
- User rotating-proxy to bypass individual web scraping (Find free proxy as a start)
- Right now keywords is limited per 1 word, how to get 2-3 keywords effectively (Use thread/parallel for faster function).
