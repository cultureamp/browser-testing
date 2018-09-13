FROM node:8.11.4-slim

# Install tools & libs to compile everything
RUN apt-get update && apt-get install -y && apt-get clean

COPY . /browser-testing
WORKDIR /browser-testing
RUN npm install
