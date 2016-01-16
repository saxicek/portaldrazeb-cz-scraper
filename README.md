# portaldrazeb-cz-scraper
Scraper for www.portaldrazeb.cz

Cloudant is used as a auction data storage. Initially only auction urls are stored in documents. Then in separate step
these urls are fetched and parsed. Data about scraper runs are saved also for later analysis. Code is structured to be
run on AWS Lambda - see scripts lambdaparse.js and lambdaupdateurls.js.