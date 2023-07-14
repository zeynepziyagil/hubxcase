FROM node:16-alpine
WORKDIR /app
COPY . /app
RUN npm install
EXPOSE 5001
CMD ["npm", "start"]