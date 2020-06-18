FROM node:12
WORKDIR /app
COPY . .
RUN apt-get update && apt-get install build-essential -y
RUN npm install