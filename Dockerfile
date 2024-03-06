FROM node:21.6.0

# ARG PORT
# ARG HOST
# ARG NODE_ENV
# ARG APP_KEY
# ARG DRIVE_DISK
# ARG DB_CONNECTION
# ARG PG_HOST
# ARG PG_PORT
# ARG PG_USER
# ARG PG_PASSWORD
# ARG PG_DB_NAME
# ARG SECRET_TOKEN
# ARG EMAIL_USER
# ARG EMAIL_PASSWORD
# ARG CACHE_VIEWS


# RUN --mount=type=secret,id=PORT \
#     --mount=type=secret,id=HOST \
#     --mount=type=secret,id=NODE_ENV \
#     --mount=type=secret,id=APP_KEY \
#     --mount=type=secret,id=DRIVE_DISK \
#     --mount=type=secret,id=DB_CONNECTION \
#     --mount=type=secret,id=PG_HOST \
#     --mount=type=secret,id=PG_PORT \
#     --mount=type=secret,id=PG_USER \
#     --mount=type=secret,id=PG_PASSWORD \
#     --mount=type=secret,id=PG_DB_NAME \
#     --mount=type=secret,id=SECRET_TOKEN \
#     --mount=type=secret,id=EMAIL_USER \
#     --mount=type=secret,id=EMAIL_PASSWORD \
#     --mount=type=secret,id=CACHE_VIEWS \
#     export PORT=$(cat /run/secrets/PORT) && \
#     export HOST=$(cat /run/secrets/HOST) && \
#     export NODE_ENV=$(cat /run/secrets/NODE_ENV) && \
#     export APP_KEY=$(cat /run/secrets/APP_KEY) && \
#     export DRIVE_DISK=$(cat /run/secrets/DRIVE_DISK) && \
#     export DB_CONNECTION=$(cat /run/secrets/DB_CONNECTION) && \
#     export PG_HOST=$(cat /run/secrets/PG_HOST) && \
#     export PG_PORT=$(cat /run/secrets/PG_PORT) && \
#     export PG_USER=$(cat /run/secrets/PG_USER) && \
#     export PG_PASSWORD=$(cat /run/secrets/PG_PASSWORD) && \
#     export PG_DB_NAME=$(cat /run/secrets/PG_DB_NAME) && \
#     export SECRET_TOKEN=$(cat /run/secrets/SECRET_TOKEN) && \
#     export EMAIL_USER=$(cat /run/secrets/EMAIL_USER) && \
#     export EMAIL_PASSWORD=$(cat /run/secrets/EMAIL_PASSWORD) && \
#     export CACHE_VIEWS=$(cat /run/secrets/CACHE_VIEWS)

WORKDIR /carro-app-backend
# COPY . /carro-app-backend
# COPY . /build 
COPY package*.json ./
RUN npm install
COPY . .

EXPOSE 3333

# ENV PORT=${PORT}
# ENV HOST=${HOST}
# ENV NODE_ENV=${NODE_ENV}
# ENV APP_KEY=${APP_KEY}
# ENV DRIVE_DISK=${DRIVE_DISK}
# ENV DB_CONNECTION=${DB_CONNECTION}
# ENV PG_HOST=${PG_HOST}
# ENV PG_PORT=${PG_PORT}
# ENV PG_USER=${PG_USER}
# ENV PG_PASSWORD=${PG_PASSWORD}
# ENV PG_DB_NAME=${PG_DB_NAME}
# ENV SECRET_TOKEN=${SECRET_TOKEN}
# ENV EMAIL_USER=${EMAIL_USER}
# ENV EMAIL_PASSWORD=${EMAIL_PASSWORD}
# ENV CACHE_VIEWS=${CACHE_VIEWS}

ENV PORT=3333
ENV HOST=0.0.0.0
ENV NODE_ENV=development
ENV APP_KEY=m2_pOXrFu1gvYuuy8rxjqaSr1v9_nIQ_
ENV DRIVE_DISK=local
ENV DB_CONNECTION=pg
ENV TZ=UTC
ENV PG_HOST=ec2-100-24-250-155.compute-1.amazonaws.com
ENV PG_PORT=5432
ENV PG_USER=ejjfnmyurpjhea
ENV PG_PASSWORD=22329404f78ce1b8dadb8e622fb908cb3fb294a9fc31473448637a286b3bd41c
ENV PG_DB_NAME=db77bf6ecdfqnd
ENV SECRET_TOKEN=9Zz4tw0Ionm1XPZUfN0NOml3z5FMfmpgXwovD9hp8ryDIuGRM2EPHAB4iHsc0fb
ENV EMAIL_USER=carrocarsharing@gmail.com
ENV EMAIL_PASSWORD="oxva oyeg lkny drch"
ENV CACHE_VIEWS=false
ENV REDIS_CONNECTION=local
ENV REDIS_HOST=redis-15345.c238.us-central1-2.gce.cloud.redislabs.com
ENV REDIS_PORT=15345
ENV REDIS_USERNAME=default
ENV REDIS_PASSWORD=tkxu0k3kEfmZqJZlby50DueEi8Z9JO3F
ENV GCP_STORAGE_BUCKET=gs://carro-backend-storage
ENV PROJECT_ID=pro-bliss-413511
ENV STRIPE_SECRET=sk_test_51Oqqil00aGL9TpAiZrFaaAQ7yIiuW1Kula6LPUvXwwh5IACLY8iuYEegUO5Auy8qNksYYCVyXFkAqABOzKNgsadB00Xr06bjF8
ENV STRIPE_PUBLIC=pk_test_51Oqqil00aGL9TpAipKil8i6DXoSRrYSFy55m0xU1o01koLUX0ztuFhBBAG6DnzWP2D19WsyeMhyLSDbSX6AzNNhl00Fj60OrMr


RUN npm run migration
RUN npm run build
CMD [ "npm", "run", "start" ]