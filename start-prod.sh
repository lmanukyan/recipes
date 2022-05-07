#!/usr/bin/bash

# մեկնարկում ենք լոկալ փրոքսի սերվերը
caddy run

# մեկնարկում ենք client - ը
cd client
yarn build

# մեկնարկում ենք backend server - ը
cd ../server
yarn build
yarn start