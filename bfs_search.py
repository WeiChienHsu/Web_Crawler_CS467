import sys
import requests
import validators
import time
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlsplit, urlunsplit
import shadow_useragent

ua = shadow_useragent.ShadowUserAgent()

nodeList = []

def newNode(url):
    parts = urlparse(url)
    #soup = getSoup(url)
    node = {
        'url': url,
        'domain': parts.netloc,
        'children': [],
        'title':  'No title'
    }
    return node

def getSoup(link):
    headers = {'User-Agent': ua.random}
    request_object = requests.get(link, headers)
    soup = BeautifulSoup(request_object.content, "lxml")
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
    return (error_code >=200 and error_code < 400)

def removeQuery(url):
    split = urlsplit(url)
    components = (split.scheme, split.netloc, split.path, '', '')
    return urlunsplit(components)

def removeScheme(url):
    parsed = urlparse(url)
    scheme = "%s://" % parsed.scheme
    return parsed.geturl().replace(scheme, '', 1)

# visits all urls on the given page and continues to depth (maximum of 3)
# returns the starting node's ID
def bfs(start, depth, keyword):
    start = removeQuery(start)
    children = []
    foundUrls = [removeScheme(start)]
    startNode = newNode(start)
    nodeList.append(startNode)
    queue = [startNode]
    keywordFound = False

    #if we have reached depth then we don't need to search any more links
    while depth > 0:
        #check all of the nodes at this depth before moving deeper
        while queue and not keywordFound:
            #take the next node at this height
            parentNode = queue.pop(0)
            thisUrl = parentNode['url']

            # get links from this new page
            soup = getSoup(thisUrl)
            pageLinks = soup.findAll("a", href=True)
            if soup.title: parentNode['title'] = soup.title.string

            # put top 20 new urls into a queue for traversing if not already found
            count = 0
            for link in pageLinks:
                newUrl = link.get('href')
                newUrl = removeQuery(newUrl)
                noSchemeUrl = removeScheme(newUrl)
                if validators.url(newUrl) and (noSchemeUrl not in foundUrls) and get_status_code(newUrl):
                    print(newUrl)
                    count += 1
                    foundUrls.append(noSchemeUrl)
                    #create a new node for this newUrl
                    childNode = newNode(newUrl)
                    if keyword and (keyword in newUrl):
                        keywordFound = True
                        childNode['hasKeyword'] = True
                    # if depth == 1:
                    #     childSoup = getSoup(childNode['url'])
                    #     if childSoup.title: 
                    #         childNode['title'] = childSoup.title.string
                    children.append(childNode)
                    parentNode['children'].append(childNode)
                #break loop as too many links will kill algorithm
                if count == 20 or keywordFound:
                    break
        queue = children[:]
        children = []
        depth -= 1
        print('***************** depth = ', depth)
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