import sys
import requests
import validators
import time
from bs4 import BeautifulSoup
from urllib.parse import urlparse
from multiprocessing.dummy import Pool as ThreadPool

#headers = requests.utils.default_headers()
#headers.update({ 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})
headers = {
        'user-agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_11_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/56.0.2924.87 Safari/537.36',
    }
proxies = {
  'http': 'http://10.10.1.10:3128',
  'https': 'http://10.10.1.10:1080',
}

nodeList = []
foundUrls = []

def newNode(url):
    parts = urlparse(url)
    soup = getSoup(url)
    node = {
        'url': url,
        'domain': parts.netloc,
        'children': [],
        'title': soup.title.string if soup.title else 'No title'
    }
    return node

def getSoup(link):
    request_object = requests.get(link, headers)
    soup = BeautifulSoup(request_object.content, "html.parser")
    return soup

def get_status_code(link):
    """
    Return the error code for any url
    param: link
    """
    try:
        error_code = requests.get(link).status_code
    except requests.exceptions.ConnectionError:
        error_code = 13
    return error_code

def removeQuery(url):
    return url[:url.find('?')]

def removeScheme(url):
    parsed = urlparse(url)
    scheme = "%s://" % parsed.scheme
    return parsed.geturl().replace(scheme, '', 1)

def scrape(parentNode):
    #take the next node at this height
    children = []
    #parentNode = queue.pop(0)
    thisUrl = parentNode['url']
    
    # get links from this new page
    soup = getSoup(thisUrl)
    pageLinks = soup.findAll("a", href=True)

    # put new urls into a queue for traversing if not already found
    for link in pageLinks:
        newUrl = link.get('href')
        newUrl = removeQuery(newUrl)
        noSchemeUrl = removeScheme(newUrl)
        if validators.url(newUrl) and (noSchemeUrl not in foundUrls) and (get_status_code(newUrl) != 404):
            foundUrls.append(noSchemeUrl)
            print(newUrl)
            #create a new node for this newUrl
            childNode = newNode(newUrl)
            children.append(childNode)
            parentNode['children'].append(childNode)
    return children

# visits all urls on the given page and continues to depth (maximum of 3)
# returns the starting node's ID
def bfs(start, depth, keyword):
    start = removeQuery(start)
    foundUrls.append(removeScheme(start))
    startNode = newNode(start)
    nodeList.append(startNode)
    queue = [startNode]
    keywordFound = False
    p = ThreadPool(10)

    #if we have reached depth then we don't need to search any more links
    #check all of the nodes at this depth before moving deeper
    while depth > 0 and queue and not keywordFound:
        results = p.map(scrape, queue)
        queue = []
        for children in list(results):
            for childNode in children:
                tempUrl = childNode['url']
                if removeScheme(tempUrl) in foundUrls:
                    children.remove(childNode)
                    continue
                if keyword and (keyword in tempUrl):
                    keywordFound = True
                    childNode['hasKeyword'] = True
                    break
                foundUrls.append(removeScheme(tempUrl))
            queue.extend(children)
            if (keywordFound): break
        depth -= 1
        print('***************** depth levels remaining = ', depth)
    p.terminate()
    p.join()
    return


def main():
  start_time = time.time()
  print(str(sys.argv))
  temp = None
  if len(sys.argv) == 4:
      temp = sys.argv[3]
  bfs(sys.argv[1], int(sys.argv[2]), temp)
  print(str(nodeList))
  print("--- %s seconds ---" % (time.time() - start_time))
  #return nodelist in JSON format

  
if __name__== "__main__":
  main()