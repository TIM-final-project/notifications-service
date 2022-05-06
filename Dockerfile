FROM node:14
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm i -g @nestjs/cli
RUN npm ci
COPY . .
EXPOSE 3005
CMD [ "npm", "run", "start" ]