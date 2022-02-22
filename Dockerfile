# pull official base image
FROM node:13.12.0-alpine

# set working directory
WORKDIR /app

# add `/app/node_modules/.bin` to $PATH
ENV PATH=/app/node_modules/.bin:$PATH
# install app dependencies
COPY package.json ./
COPY package-lock.json ./
# add --silent to supress installation output
RUN npm i
RUN npm i react-scripts@3.4.1 -g

# add current directory files to app
COPY . ./

# start node server
CMD ["npm", "start"]