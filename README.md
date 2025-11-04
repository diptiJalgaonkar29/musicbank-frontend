## how to add new Super brand in Sponic Space?

1. create config JSON files
   a. public\config\demoServer\superBrandname.json -eg. public\config\demoServer\vodafone.json
   b. public\config\productionServer\superBrandname.json
   c. public\config\stageServer\superBrandname.json

2. create iubenda file (public\iubenda\superBrandname.js) -eg. public\iubenda\vodafone.js

3. create termsOfUse file (public\termsOfUse\superBrandname.html) -eg. public\termsOfUse\vodafone.html

4. add assets in branding folder (src\branding\superBrandname) -eg. src\branding\vodafone

5. add brand in brandConstants file (src\common\utils\brandConstants.js)

6. env file changes :
   a. add brand domains in domainsSettings (REACT_APP_BRANDNAME_DOMAINS) eg- REACT_APP_VODAFONE_DOMAINS
   b. add brandId in commonSettings (REACT_APP_BRANDNAME_DOMAINS) eg- REACT_APP_BRAND_ID_VODAFONE
   c. algolia config in env file
   (REACT_APP_ALGOLIA_APP_ID_BRANDNAME,REACT_APP_ALGOLIA_PUBLIC_TOKEN_BRANDNAME,REACT_APP_ALGOLIA_TAGS_PREFIX_BRANDNAME)

   note: In env file brand name must be in uppercase.
   example: suppose new brand added Vodafone. We'll create a folder inside src/branding named as vodafone (src\branding\vodafone) (suggested in lowercase), then add suffix as uppercase of that folder name that is VODAFONE -eg. REACT_APP_ALGOLIA_APP_ID_VODAFONE,REACT_APP_ALGOLIA_PUBLIC_TOKEN_VODAFONE,REACT_APP_BRAND_ID_VODAFONE,REACT_APP_VODAFONE_DOMAINS etc.

7. add superBrandName condition in src\common\utils\getSuperBrandName.js
