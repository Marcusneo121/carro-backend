FROM node:21.6.0

WORKDIR /carro-app-backend
# COPY . /carro-app-backend
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3333

# ENV PORT=3333
# ENV HOST=0.0.0.0
# ENV NODE_ENV=development
# ENV APP_KEY=m2_pOXrFu1gvYuuy8rxjqaSr1v9_nIQ_
# ENV DRIVE_DISK=local
# ENV DB_CONNECTION=pg
# ENV PG_HOST=ec2-100-24-250-155.compute-1.amazonaws.com
# ENV PG_PORT=5432
# ENV PG_USER=ejjfnmyurpjhea
# ENV PG_PASSWORD=22329404f78ce1b8dadb8e622fb908cb3fb294a9fc31473448637a286b3bd41c
# ENV PG_DB_NAME=db77bf6ecdfqnd
# ENV SECRET_TOKEN=9Zz4tw0Ionm1XPZUfN0NOml3z5FMfmpgXwovD9hp8ryDIuGRM2EPHAB4iHsc0fb
# ENV EMAIL_USER=carrocarsharing@gmail.com
# ENV EMAIL_PASSWORD="oxva oyeg lkny drch"
# ENV CACHE_VIEWS=false

RUN npm run migration
RUN npm run build
CMD [ "npm", "run", "start" ]