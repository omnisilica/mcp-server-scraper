## Purpose
This script was created to scrape configurations for MCP servers found on 'https://github.com/modelcontextprotocol/servers/tree/main/src'. Meant for LiteLLM.

## Implementation and Reasoning
The main self executing function navigates to the github page and puts the object together. 

Most of the scraping logic is in 'scrapeServerConfiguration'. MCP server configurations come in JSON that are exposed in some pages (server directories), and a user can copy them to the browser's clipboard. On other pages the configuration is hidden under a dropdown, i.e., "Using docker". The scraper primarily looks for docker configurations, followed by npx configurations, and uvx configurations if the preference doesn't exist. For whatever reason, playwright's selector keeps favoring the npx configuration (admittedly, this might be some fault in the code logic), so another 'for loop' was created to specifically get docker configurations if they exist (contact author for further explanation). 

Console logs were added for debugging. Delete any comment as preferred.
 
## Usage
- Compile typescript: npm run build
- Run script: npm start
