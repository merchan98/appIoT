# syntax=docker/dockerfile:1

FROM ubuntu:latest
ENV NODE_ENV=production

WORKDIR /home/app

COPY ["./package.json", "./"]

RUN apt-get update -y
RUN apt-get upgrade -y
RUN apt-get install nodejs -y
RUN apt-get install npm -y
RUN node -v
RUN npm install
COPY . /home/app
RUN npm run build
# RUN npm run start

EXPOSE 3000 3001 8081 80



CMD [ "node", "server.js" ]