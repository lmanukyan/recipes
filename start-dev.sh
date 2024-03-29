#!/usr/bin/bash

# մեկնարկում ենք MongoDB ֊ ն 
mongo_status=$(pgrep mongod)
if [ -z "$mongo_status" ]
then
  systemctl start mongod
fi

# մեկնարկում ենք լոկալ փրոքսի սերվերը
caddy run

# մեկնարկում ենք backend server - ը
cd server
yarn start:dev &

# մեկնարկում ենք client - ը
cd ../client
yarn start &
