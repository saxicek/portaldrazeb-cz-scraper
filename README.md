# portaldrazeb-cz-scraper
Scraper for www.portaldrazeb.cz

Cloudant is used as a auction data storage. Initially only auction urls
are stored in documents. Then in separate step these urls are fetched 
and parsed. Data about scraper runs are saved also for later analysis.
Code is structured to be run on AWS Lambda - see scripts lambdaparse.js
and lambdaupdateurls.js.

To create installation package and upload it to AWS run `gulp default`.

Please note that there is some issue when creating zip file using 
Gulp - AWS then reports that some required modules cannot be found.
For workaround just zip content of `/build` directory yourself.
