FROM ubuntu:xenial

# prep the box - install node
RUN apt-get update
RUN apt-get install -y curl
RUN curl -sL https://deb.nodesource.com/setup_6.x | bash -
RUN apt-get install -y nodejs

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add native bindings
RUN apt-get update && apt-get upgrade -y libstdc++6
RUN apt-get install -y build-essential libkrb5-dev python2.7
RUN npm config set python /usr/bin/python2.7

COPY ./ /usr/src/app
RUN npm install # install deps
RUN npm run clean   # remove previous builds
RUN npm run build   # compile the source

EXPOSE 3000
CMD ["npm", "start"]
