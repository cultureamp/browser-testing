FROM node:10.11

# Install tools & libs to compile everything
RUN apt-get update && apt-get install -y && apt-get clean
COPY . /browser-testing
WORKDIR /browser-testing
RUN yarn
RUN yarn config set script-shell bash
CMD bash
