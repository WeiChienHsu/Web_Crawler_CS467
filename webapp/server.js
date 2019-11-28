const express       = require('express');
const app           = express();
const bodyParser    = require('body-parser');
const request = require('request');

const cors = require('cors'); // Fix the frontend no-CORS issues

const dfsData       = require('./mockData/mockDFS');
const bfsData       = require('./mockData/mockBFS')

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = express.Router();


const PORT = process.env.PORT || 8080;

const crawlerURL = "https://us-central1-webcrawler-256621.cloudfunctions.net";


/**
 * Enum for crawl type.
 * @readonly
 * @enum {{name: string}}
 */
const CrawlType = Object.freeze({
    BFS:   { name: "bfs", endpoint: "/bfs"},
    DFS:  { name: "dfs", endpoint: "/dfs"}
});

/**
 * @type validation
 */
function isValidUrl(str)
{
    regexp =  /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;


    if (regexp.test(str))
    {
        return true;
    }
    return false;

}


/**
 * Function to validate request and required attributes by client,
 * @param req - api request
 * @returns {*}
 */
function validateRequest(req) {

    if(req.body == null || req.body.length <=0 ) {
        return { status: 400, error: "One or more required fields are missing. No body in request." }
    }

    if (req.body.url == null) {
        return { status: 400, error: "Please enter a URL so the crawler crawler can show you how cool it is."};
    }

    if (!isValidUrl(req.body.url)) {
        return { status: 400, error: "Url invalid."};
    }

    if (req.body.depth == null) {
        return { status: 400, error: "A depth is required to begin crawling. Please enter a depth."};

    }

    if(!Number.isInteger(req.body.depth)) {
        return { status: 400, error: "Invalid type. Depth should be of type Integer."};
    }

    if( req.body.keyword  && req.body.keyword.length <= 2 ) {
        //check only one word and
        return { status: 400, error: "Keyword not valid. Keyword is optional, but if sent then it must be at least 3 characters long." }
    }

}

async function requestCrawler (url, body, res) {

    await request.post(url, { json: body }, (error, result, body) => {

        if (error) {
            return res.status(result.statusCode).send( { Error: "Crawler is reporting an error - " + error });
        } else if (result.statusCode >= 400){
             // error status but crawler missed to send error message as an error message
            return res.status(result.statusCode).send( { Error: "Crawler is reporting an error - " + body });
        } else {
            return res.status(result.statusCode).send(body);
        }
    });
}


/**
 * Get Index
 */
router.get("/", (req, res) => {
  res.send("Welcome to the Web Crawler REST API");
});



/**
 * endpoint for DFS
 */
router.post("/dfsData", (req, res) => {

    let response = validateRequest(req);
    if( response != null ) {
        res.status(response.status).json( { Error: response.error }).end();
    } else {

        let url = crawlerURL + CrawlType.DFS.endpoint;
        requestCrawler(url, req.body, res)
            .catch( (err) => {
                res.status(500).json({ Error: "Unable to connect to Crawler - " + err});
            });

        /*
        request.post(url, { json: req.body }, (error, result, body) => {

            if (error) {
                res.status(result.statusCode).send( { Error: "Crawler is reporting an error - " + error });
            } else {
                res.status(result.statusCode).send(body);
            }
        }); */
    }
});

/**
 * endpoint for BFS
 */
router.post("/bfsData", (req, res) => {

    let response = validateRequest(req);

    if( response != null ) {
        res.status(response.status).json({ Error: response.error });
    } else {

        res.status(200).json(dfsData); // Hard-coded mock data


        let url = crawlerURL + CrawlType.BFS.endpoint;

        /*
        requestCrawler(url, req.body, res)
            .catch( (err) => {
                res.status(500).json({ Error: "Unable to connect to Crawler - " + err});
            }); */

    }
});


app.use('/', router);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});