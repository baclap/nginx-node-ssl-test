FROM node:latest

COPY . /usr/app
WORKDIR /usr/app
CMD npm start
