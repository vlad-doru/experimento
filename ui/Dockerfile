FROM node:6.2.2

# Add current directory into path /data in image
ADD . /ui

# Set working directory to /data
WORKDIR /ui

RUN rm -rf node_modules

RUN npm install

# Run index.js
CMD npm start
