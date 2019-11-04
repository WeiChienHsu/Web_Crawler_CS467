# Visualizers Web Server REST API
See [Visualizer API](https://github.com/WeiChienHsu/Web_Crawler_CS467/edit/apiDoc/webapp/rest_api.md) -- edit link

The Web Server handles requests from the Client. A Node.Js server services two endpoints:
- BFS
- DFS

#### BFS
Crawl as BFS
```sh
POST  /BFS
```
Allows you to request the crawler to begin server posting the data from the crawling results.
###### Request:
- Request Parameters: None
- Request Body: Required
- Request Body MIME Type: ‘application/json’


| Name | Type | Description | Required | Constraint |
| ------ | ------ | ------ | ------ | ------ |
| URL | String | The URL to crawl | true | None |
| Level | Integer | The depth level for crawling | true | Max of 3 |
| Keywords | Array | A collection of keywords to include in the search. | false | Valid words |
###### Response:
- Response Body MIME Type: ‘application/json’

| Outcome | Status Code | Notes |
| ------ | ------ | ------ |
| Success | 201 Created |
| Error | 400 | When one or more required fields are missing. |
| Error | 404 | Not Found |


#### DFS
Crawl as DFS
```sh
POST  /DFS
```
Allows you to request the crawler to begin server posting the data from the crawling results.
###### Request:
- Request Parameters: None
- Request Body: Required
- Request Body MIME Type: ‘application/json’

| Name | Type | Description | Required | Constraint |
| ------ | ------ | ------ | ------ | ------ |
| URL | String | The URL to crawl | true | None
| Level | Integer | The depth level for crawling | true | None
| Keywords | Array | A collection of keywords to include in the search. | false | Valid words |

Request Body Example:
```sh
{
  "url": "https://www.amazon.com",
  "level": 8,
  "keywords": null
}
```

###### Response:
- Response Body MIME Type: ‘application/json’

| Outcome | Status Code | Notes |
| ------ | ------ | ------ |
| Success | 201 Created |
| Error | 400 | When one or more required fields are missing. |
| Error | 404 | Not Found |


Example Response:
{
    "nodes": [
        {
            "index": 0,
            "url": "https://en.wikipedia.org/wiki/Main_Page",
            "domainName": "wikipedia",
            "title": "Wikipedia, the free encyclopedia"
        },
        {
            "index": 1,
            "url": "https://hu.wikipedia.org/wiki/",
            "domainName": "wikipedia",
            "title": "Wikipédia, a szabad enciklopédia"
        },
        {
            "index": 2,
            "url": "https://hu.wikiquote.org/wiki/",
            "domainName": "wikiquote",
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

License
----
MIT
