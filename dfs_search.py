import sys
import requests
import validators
import random
import time
from bs4 import BeautifulSoup
from urllib.parse import urlparse, urlsplit, urlunsplit
from urllib.request import Request, urlopen
from itertools import cycle
import shadow_useragent

user_agent = shadow_useragent.ShadowUserAgent()
foundUrls = []
proxies = []


def parse_proxies(soup):
    proxies = []
    proxies_table = soup.find(id='proxylisttable')
    # Save proxies in the array
    for row in proxies_table.tbody.find_all('tr'):
        if row.find_all('td')[6].string == 'yes':
            proxies.append({
                'ip': row.find_all('td')[0].string,
                'port': row.find_all('td')[1].string
            })
        if len(proxies) == 8:
            break
    return proxies


def get_proxies():
    proxies_req = Request('https://www.us-proxy.org/')
    proxies_req.add_header('User-Agent', user_agent.random)
    proxies_doc = urlopen(proxies_req).read().decode('utf8')
    return parse_proxies(BeautifulSoup(proxies_doc, 'html.parser'))

# get a random index proxy
def random_proxy():
  return random.randint(0, len(proxies) - 1)


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
    use_proxy = False
    headers = {'User-Agent': user_agent.random}
    print(user_agent.random)
    for p in proxies:
        index = random_proxy()
        item = proxies[index]
        proxy = item['ip'] + ':' + item['port']
        try:
            # request_object = requests.get(link, headers, proxies={"http": proxy, "https": proxy})
            if use_proxy:
                request_object = requests.get(link, headers, proxies={"http": proxy, "https": proxy})
                print("Request with ip:" + proxy)
            else:
                request_object = requests.get(link, headers)
            soup = BeautifulSoup(request_object.content, "lxml")
            break
        except:
            # Most free proxies will often get connection errors.
            del proxies[index]
            use_proxy = not use_proxy
            print("Skipping proxy. Connection error")
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

def getNewUrl(pageLinks):
    newUrl = ''
    while (not validators.url(newUrl)) or (removeScheme(newUrl) in foundUrls) or not get_status_code(newUrl):
        if len(pageLinks) == 0:
            return 0 
        randNum = random.randrange(len(pageLinks))
        link = pageLinks[randNum]
        pageLinks.pop(randNum)
        newUrl = link.get('href')
        print("before: " + newUrl)
        newUrl = removeQuery(newUrl)
        print("After: " + newUrl)
    return newUrl

# visits all urls on the given page and continues to depth (maximum of 3)
# returns the starting node's ID
def dfs(parentNode, depth, keyword, keywordFound):
    print('***************** depth = ', depth)
    if depth < 0:
        return 'end'

    #take the next node at this height
    thisUrl = parentNode['url']

    #prepare proxies
    print(len(proxies))
    if len(proxies) < 8:
        proxies.extend(get_proxies())

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
  proxies.extend(get_proxies())
  start = newNode(sys.argv[1])
  temp = None
  if len(sys.argv) == 4:
    temp = sys.argv[3]
  print (dfs(start, int(sys.argv[2]), temp, False))
  print("--- %s seconds ---" % (time.time() - start_time))
  #return nodeList in JSON format
  
if __name__== "__main__":
    main()