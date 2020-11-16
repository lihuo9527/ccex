FROM node:10.9.0-stretch
ARG NODE_ENV

ENV APP_DIR /app
ENV NODE_ENV ${NODE_ENV:-development}

RUN npm install -g @angular/cli

WORKDIR ${APP_DIR}
EXPOSE 4200