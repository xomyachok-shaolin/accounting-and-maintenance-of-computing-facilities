# pull the official base image
FROM node:16.14
# set working direction
WORKDIR /app
# add `/app/node_modules/.bin` to $PATH
ENV PATH /app/node_modules/.bin:$PATH
# install application dependencies
COPY package.json ./
RUN npm install --silent
# add app
COPY . ./
EXPOSE 3000
# start app
CMD ["npm", "start"]
