FROM mhart/alpine-node:5.11.0

ENV APP_NAME nxp-hook
ENV NODE_TLS_REJECT_UNAUTHORIZED 0

WORKDIR /var/www

ADD package.json /tmp/package.json
RUN cd /tmp && npm config set registry http://registry.npmjs.org/ && npm config set loglevel info && npm install --no-optional
RUN mkdir -p /var/www && cp -a /tmp/node_modules /var/www && cp /tmp/package.json /var/www && cd /var/www

COPY ./config /var/www/config
COPY ./src /var/www/src
COPY ./index.js /var/www/index.js

CMD ["npm", "start"]
