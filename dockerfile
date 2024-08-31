FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm install

COPY . .

RUN npx prisma generate

RUN npx nodemon src/app.ts

EXPOSE 3000

CMD ["node", "dist/app.js"]