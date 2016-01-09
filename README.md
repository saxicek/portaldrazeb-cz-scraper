# portaldrazeb-cz-scraper
Scraper for www.portaldrazeb.cz

Cloudant branch will try a bit different approach in crawling and parsing - it will store whole HTML documents in
Cloudant (or alternatively any Couchbase Server) and parsing will be implemented directly in DB (views,
map-reduce jobs). That should provide better control on how auctions are fetched, parsed and made obsolete. The idea
is that documents fetched from www.portaldrazeb.cz can keep rich set of metadata like date fetched, MD5 sums of
content and based on that better strategy for scraping can be implemented (do not want to hammer the site by getting
complete content every now and then).
