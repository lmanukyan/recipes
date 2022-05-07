#!/usr/bin/bash

# մեկնարկում ենք լոկալ փրոքսի սերվերը
caddy run

# մեկնարկում ենք backend server - ը
cd server
yarn start:dev &

# մեկնարկում ենք client - ը
cd ../client
yarn start &