import sys
import requests
import validators
import random
import time
from bs4 import BeautifulSoup
from urllib.parse import urlparse

headers = requests.utils.default_headers()
headers.update({ 'User-Agent': 'Mozilla/5.0 (X11; Ubuntu; Linux x86_64; rv:52.0) Gecko/20100101 Firefox/52.0'})

proxies = {
  'http': 'http://10.10.1.10:3128',
  'https': 'http://10.10.1.10:1080',
}

foundUrls = []

def newNode(url):
    parts = urlparse(url)
    node = {
        'url': url,
        'domain': parts.netloc,
        'children': [],
        'title': 'No title'
    }
    return node

def getSoup(link):
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
    return url[:url.find('?')]

def removeScheme(url):
    parsed = urlparse(url)
    scheme = "%s://" % parsed.scheme
    return parsed.geturl().replace(scheme, '', 1)

def getNewUrl(pageLinks):
    newUrl = ''
    while (not validators.url(newUrl)) or (removeScheme(newUrl) in foundUrls) or not get_status_code(newUrl):
        if len(pageLinks) == 0:
            return 0 
        randNum = random.randrange(len(pageLinks))
        link = pageLinks[randNum]
        pageLinks.pop(randNum)
        newUrl = link.get('href')
        newUrl = removeQuery(newUrl)  
    return newUrl

# visits all urls on the given page and continues to depth (maximum of 3)
# returns the starting node's ID
def dfs(parentNode, depth, keyword, keywordFound):
    print('***************** depth = ', depth)
    if depth < 0:
        return 'end'

    #take the next node at this height
    thisUrl = parentNode['url']
    
    # get links from this new page
    soup = getSoup(thisUrl)
    pageLinks = soup.findAll("a", href=True)
    childResponse = 0
    if soup.title: parentNode['title'] = soup.title.string

    #keep calling dfs until we reach depth or if we hit a dead end, try again
    while not childResponse and depth and not keywordFound:
        #find a new valid link in the list and if none exists, return 0
        newUrl = getNewUrl(pageLinks)
        if not newUrl:
            return 0
        print(newUrl)
        foundUrls.append(removeScheme(newUrl))
        childNode = newNode(newUrl)
        parentNode['children'].append(childNode)
        if keyword and (keyword in newUrl):
            keywordFound = True
            childNode['hasKeyword'] = True
            break
        childResponse = dfs(childNode, depth-1, keyword, keywordFound)
    return parentNode


def main():
  start_time = time.time()
  print(str(sys.argv))
  start = newNode(sys.argv[1])
  temp = None
  if len(sys.argv) == 4:
    temp = sys.argv[3]
  print (dfs(start, int(sys.argv[2]), temp, False))
  print("--- %s seconds ---" % (time.time() - start_time))
  #return nodeList in JSON format
  
if __name__== "__main__":
    main()