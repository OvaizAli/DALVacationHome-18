FROM node:16.10-alpine3.11 AS build
WORKDIR /app
COPY package.json /app/package.json
RUN yarn install
COPY . /app/
RUN yarn build
 
FROM nginx:1.21-alpine
COPY --from=build /app/build /opt/site
COPY nginx.conf.template /etc/nginx/nginx.conf.template
CMD ["sh", "-c", "envsubst '$PORT' < /etc/nginx/nginx.conf.template > /etc/nginx/nginx.conf && nginx -g 'daemon off;'"]