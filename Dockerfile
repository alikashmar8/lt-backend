FROM node:20.17.0 AS builder
RUN npm i -g @nestjs/cli
RUN npm i -g @nestjs/config

WORKDIR /usr/src/app
COPY ./package.json ./
COPY ./package-lock.json ./
RUN npm i --force
COPY ./ ./
# # Creates a "dist" folder with the production build
# RUN npm run build

# # Start the server using the production build
# CMD [ "node", "dist/main.js" ]
EXPOSE 3000
