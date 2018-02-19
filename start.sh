wget -O ./src/config/googlekeys.json "https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com"
./src/node_modules/netlify-lambda/bin/cmd.js serve src/