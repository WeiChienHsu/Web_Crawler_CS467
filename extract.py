import tldextract

tsd, td, tsu = tldextract.extract("www.google.com")

url = td + '.' + tsu ## Will print google.com

print (url)

tsd, td, tsu = tldextract.extract("google.com") # prints abc, hostname, com

url = td + '.' + tsu ## Will print google.com

print (url)

tsd, td, tsu = tldextract.extract("www.google.com/") # prints abc, hostname, com

url = td + '.' + tsu ## Will print google.com

print (url)

tsd, td, tsu = tldextract.extract("www.google.com/gmail") # prints abc, hostname, com

url = td + '.' + tsu ## Will print google.com

print (url)

tsd, td, tsu = tldextract.extract("https://www.google.com/") # prints abc, hostname, com

url = td + '.' + tsu ## Will print google.com

print (url)