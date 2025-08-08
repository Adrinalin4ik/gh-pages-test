How to build it.
- Go to chrome://extensions
- Click on pack extension
- select extension folder
- click pack

It will generate crx and pem files.

- Go to https://robwu.nl/crxviewer/crxviewer.html
- Open dev tools (console)
- Select crx file
- Look at console, you will see a message "Calculated extension ID: <id>". This is the extension id.
- Modify sleep_extension.xml file, update appid with extension id from the prev step.

- Deploy to your hosting or pg-pages. 
- Once it is deployed, get the url to the crx file and update sleep_extension.xml with the proper link to it.
- Deploy it once again.

- Get a link to the xml file.
- So at this moment you have extension installation url (the link to xml file) and extension id. You have all the necessary info to deploy it in Google Admin.
