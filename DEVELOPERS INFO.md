# Info for devs

- This document should tell you what you need to know about working on this project

## Front end info

To work on the front end scripting there is a key workflow to follow:

1. Run "npm run watch" in the CLIENT folder
1. Make changes to scripts.ts
1. Save scripts.ts (this will cause a re-compilation)
1. Test etc
1. Repeat steps 2-4 as desired
1. Push changes

Working on html and css is relatively simple, just make, save, test and push changes as usual.

Always remember to NOT TOUCH the following files, DO NOT EVEN BREATHE NEAR THEM:
- oldScripts.js (only here for preservation, no longer used)
- tsconfig.json (unless you have very very good reason)
- package.json (same as tsconfig.json)
- scripts.js (this is generated when you compile scripts.ts, you shoudn't be manually modifying it)

## Back end info

Working on the back end also has a pretty simple workflow, just remember a few key things
- DO NOT TOUCH newServer.ts
- Generally you will only ever be editing newApp.ts
- package.json and package-lock.json can be modified for good reason but this generallly happens through commands
- Don't mess with oldApp and oldServer, those are just there for preservation and a certain dev being a desperate hoarder and are no longer used 
- Don't mess with tsconfig.json unless you are VERY sure you know what you're doing
- And as always, don't touch the node_modules