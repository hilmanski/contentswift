package main

import (
    "fmt"
	// "log"
	// "strings"
	"regexp"
	"encoding/json"

    "net/http"
	"github.com/gocolly/colly/v2"
	"github.com/PuerkitoBio/goquery"
)

func helloWorldHandler(w http.ResponseWriter, r *http.Request) {
    fmt.Fprintf(w, "Hello World!")
}

type Response struct {
	Content     string `json:"content"`
	ContentHTML string `json:"content_html"`
}

func fetchArticleContent(w http.ResponseWriter, r *http.Request) {
	// Parse the URL parameter
	link := r.URL.Query().Get("link")
	if link == "" {
		http.Error(w, "link parameter is missing", http.StatusBadRequest)
		return
	}

	// Create a new collector
	c := colly.NewCollector()

	var content, contentHTML string

	mainTagExists := false
	c.OnHTML("main", func(e *colly.HTMLElement) {
		mainTagExists = true

		// Remove all script and style elements
		e.DOM.Find("script, style, img").Each(func(index int, item *goquery.Selection) {
			item.Remove()
		})

		contentHTML, _ = e.DOM.Html()
		content = e.Text

		// double check remove img tag
		// remove any <img ...> tags at e.text	
		re := regexp.MustCompile(`<img[^>]*>`)
		content = re.ReplaceAllString(content, "")
	})

	// Fallback if main tag not exists
	c.OnHTML("body", func(e *colly.HTMLElement) {
		if mainTagExists {
			return
		}
		// Remove all script and style elements
		e.DOM.Find("script, style, img").Each(func(index int, item *goquery.Selection) {
			item.Remove()
		})
		
		contentHTML, _ = e.DOM.Html()
		content = e.Text

		// double check remove img tag
		// remove any <img ...> tags at e.text
		re := regexp.MustCompile(`<img[^>]*>`)
		content = re.ReplaceAllString(content, "")
	})


	// Start the web scraping
	err := c.Visit(link)
	if err != nil {
		http.Error(w, "Failed to fetch article content " + link, http.StatusInternalServerError)
		return
	}

	response := Response{
		Content:     content,
		ContentHTML: contentHTML,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

// Allow CORS
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
    return func(w http.ResponseWriter, r *http.Request) {
        w.Header().Set("Access-Control-Allow-Origin", "*")
        w.Header().Set("Access-Control-Allow-Methods", "POST, GET, OPTIONS, PUT, DELETE")
        w.Header().Set("Access-Control-Allow-Headers", "Accept, Content-Type, Content-Length, Accept-Encoding, Authorization")
        
        if r.Method == "OPTIONS" {
            w.WriteHeader(http.StatusOK)
            return
        }
        
        next(w, r)
    }
}

func main() {
	http.HandleFunc("/scrape", enableCORS(fetchArticleContent))
    http.HandleFunc("/", helloWorldHandler)
    http.ListenAndServe(":8080", nil)
}
