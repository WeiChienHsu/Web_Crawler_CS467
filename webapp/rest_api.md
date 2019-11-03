# Visualizers Web Server REST API
See [Visualizer API](https://github.com/joemccann/dillinger/blob/master/KUBERNETES.md) -- edit link

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
| Level* | Integer | The depth level for crawling | true | Max of 3 |
| Keywords | Array | A collection of keywords to include in the search. | false | Valid words |
###### Response:
- Response Body MIME Type: ‘application/json’

| Outcome | Status Code | Notes |
| ------ | ------ | ------ |
| Success | 201 Created |
| Error | 400 | When one or more required fields are missing. |
| Error | 404 | Not Found |


#### DFS
Crawl as BFS
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
| Level* | Integer | The depth level for crawling | true | None
| Keywords | Array | A collection of keywords to include in the search. | false | Valid words |

###### Response:
- Response Body MIME Type: ‘application/json’

| Outcome | Status Code | Notes |
| ------ | ------ | ------ |
| Success | 201 Created |
| Error | 400 | When one or more required fields are missing. |
| Error | 404 | Not Found |

License
----
MIT
