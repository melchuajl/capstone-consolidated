FROM node:16-alpine as buildStage
WORKDIR /app
COPY package.json /app
RUN npm install
COPY . /app
RUN npm run build --prod

FROM nginx
COPY --from=buildStage /app/dist/transport-app /usr/share/nginx/html
COPY ./nginx.conf /etc/nginx/nginx.conf