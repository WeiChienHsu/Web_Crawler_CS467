import sys
import requests
import uuid
import validators
from bs4 import BeautifulSoup
from urllib.parse import urlparse

headers = requests.utils.default_headers()
headers.update({ 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})

proxies = {
  'http': 'http://10.10.1.10:3128',
  'https': 'http://10.10.1.10:1080',
}

nodeList = []
edgeList = []

def newEdge(source, target):
    edge = {
    	'source': source,
        'target': target
    }
    return edge

def newNode(url):
    parts = urlparse(url)
    soup = getSoup(url)
    node = {
    	'id': uuid.uuid4().hex,
        'url': url,
        'domain': parts.netloc,
        'title': soup.title.string if soup.title else 'No title'
        #'status': get_status_code(url)
    }
    return node

def getSoup(link):
    request_object = requests.get(link, headers)
    soup = BeautifulSoup(request_object.content, "html.parser")
    return soup

# def get_status_code(link):
#     """
#     Return the error code for any url
#     param: link
#     """
#     try:
#         error_code = requests.get(link).status_code
#     except requests.exceptions.ConnectionError:
#         error_code = 
#     return error_code

def removeQuery(url):
    return url[:url.find('?')]

# visits all urls on the given page and continues to depth (maximum of 3)
# returns the starting node's ID
def bfs(start, depth):
    children = []
    foundUrls = [start]
    startNode = newNode(start)
    nodeList.append(startNode)
    queue = [startNode]

    #if we have reached depth then we don't need to search any more links
    while depth > 0:
        #check all of the nodes at this depth before moving deeper
        while queue:
            #take the next node at this height
            parentNode = queue.pop(0)
            thisUrl = parentNode['url']
            
            # get links from this new page
            soup = getSoup(thisUrl)
            pageLinks = soup.findAll("a", href=True)

            # put top 20 new urls into a queue for traversing if not already found
            count = 0
            for link in pageLinks:
                #break loop as too many links will kill algorithm
                if count == 20:
                    break
                newUrl = link.get('href')
                newUrl = removeQuery(newUrl)
                if validators.url(newUrl) and (newUrl not in foundUrls):
                    print(newUrl)
                    count += 1
                    foundUrls.append(newUrl)
                    childNode = newNode(newUrl)
                    children.append(childNode)
                    nodeList.append(childNode)
                    edgeList.append(newEdge(parentNode['id'], childNode['id']))
        queue = children[:]
        children = []
        depth -= 1
        print('***************** depth = ', depth)
    return startNode['id'] 


def main():
  print(str(sys.argv))
  startId = bfs(sys.argv[1], int(sys.argv[2]))
  edgeList.append(newEdge(0, startId))
  response = {'nodes': nodeList, 'edges': edgeList}
  print(str(response))

  
if __name__== "__main__":
  main()