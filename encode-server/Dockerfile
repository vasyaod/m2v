FROM node:latest

COPY * /app/

WORKDIR /app

RUN npm install

# THe exec is very important here, the command replaces start process to our one.
CMD npm start