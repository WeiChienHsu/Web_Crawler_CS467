# Visualizers Web Server REST API
See [Visualizer API](https://visualizers-rest-api.appspot.com)

The Web Server handles requests from the Client. A Node.Js server services two endpoints:
- BFS
- DFS

#### BFS
Crawl as BFS
```sh
POST  /bfsData
```
Allows you to request the crawler to begin server posting the data from the crawling results.
###### Request:
- Request Parameters: None
- Request Body: Required
- Request Body MIME Type: ‘application/json’


| Name | Type | Description | Required | Constraint |
| ------ | ------ | ------ | ------ | ------ |
| URL | String | The URL to crawl | true | None |
| Depth | Integer | The depth level for crawling | true | Max of 3 |
| Keyword | String | A word to include in the search. | false | Valid words |

Request Body Example:
```sh
{
  "url": "https://www.google.com",
  "depth": 8,
  "keyword": "mindfulness"
}
```

###### Response:
- Response Body MIME Type: ‘application/json’

| Outcome | Status Code | Notes |
| ------ | ------ | ------ |
| Success | 201 Created |
| Error | 400 | When one or more required fields are missing. |
| Error | 404 | Not Found |

Response Body Example:
```sh
{
    "url": "https://www.reddit.com/r/OSUOnlineCS/",
    "domain": "reddit",
    "title": "reddit: the front page of the internet",
    "children": [
        {
            "url": "https://www.reddit.com/register/?dest=https%3A%2F%2Fwww.reddit.com%2Fr%2FOSUOnlineCS%2F",
            "domain": "reddit",
            "title": "reddit.com: Join the worldwide conversation",
            "children": [
                {
                    "url": "https://www.reddit.com/help/useragreement",
                    "domain": "reddit",
                    "title": "User Agreement - September 24, 2018 - Reddit",
                    "children": null
                },
                {
                    "url": "https://www.reddit.com/help/privacypolicy/",
                    "domain": "reddit",
                    "title": "Privacy Policy - May 25, 2018 - Reddit",
                    "children": null
                },
                {
                    "url": "https://www.reddit.com/help/contentpolicy/",
                    "domain": "reddit",
                    "title": "Content Policy - Reddit",
                    "children": null
                }
            ]
        }
    ]
}
```

#### DFS
Crawl as DFS
```sh
POST  /dfsData
```
Allows you to request the crawler to begin server posting the data from the crawling results.
###### Request:
- Request Parameters: None
- Request Body: Required
- Request Body MIME Type: ‘application/json’

| Name | Type | Description | Required | Constraint |
| ------ | ------ | ------ | ------ | ------ |
| URL | String | The URL to crawl | true | None
| Depth | Integer | The depth level for crawling | true | None
| Keyword | String | A keyword to base search on. | false | Valid words |

Request Body Example:
```sh
{
  "url": "https://www.amazon.com",
  "depth": 8,
  "keyword": null
}
```

###### Response:
- Response Body MIME Type: ‘application/json’

| Outcome | Status Code | Notes |
| ------ | ------ | ------ |
| Success | 201 Created |
| Error | 400 | When one or more required fields are missing. |
| Error | 404 | Not Found |


Response Body Example:
```sh
{
    "nodes": [
        {
            "index": 0,
            "url": "https://en.wikipedia.org/wiki/Main_Page",
            "domain": "wikipedia",
            "title": "Wikipedia, the free encyclopedia"
        },
        {
            "index": 1,
            "url": "https://hu.wikipedia.org/wiki/",
            "domain": "wikipedia",
            "title": "Wikipédia, a szabad enciklopédia"
        },
        {
            "index": 2,
            "url": "https://hu.wikiquote.org/wiki/",
            "domain": "wikiquote",
            "title": "Wikidézet"
        }
    ],
    "edges": [
        {
            "source": 0,
            "target": 1
        },
        {
            "source": 1,
            "target": 2
        },
        {
            "source": 2,
            "target": 3
        },
        {
            "source": 3,
            "target": 4
        },
        {
    ]
}
```

License
----
MIT
