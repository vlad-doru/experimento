FROM node:6.2.2

# Add the package.json to a temporary directory
ADD package.json /tmp/package.json
# Run npm install into the temporary directory
RUN cd /tmp && npm install
# Add current directory into path /data in image
ADD . /ui
# Set working directory to /data
WORKDIR /ui
# Remove the node_modules locally installed
RUN rm -rf node_modules
# Copy the modules installed on docker
RUN cp -a /tmp/node_modules .

CMD npm run deploy && npm start
