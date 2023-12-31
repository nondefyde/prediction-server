# # syntax=docker/dockerfile:1

# # Comments are provided throughout this file to help you get started.
## Stage 1. Compile TS sources to JS
FROM node:16-alpine as builder
# Set build directory
WORKDIR /usr/src/app
# Copy application dependency manifests to the container image.
# A wildcard is used to ensure both package.json AND package-lock.json are copied.
# Copying this separately prevents re-running npm install on every code change.
COPY ./package*.json ./*.lock ./tsconfig.json ./tsconfig.build.json ./nest-cli.json ./
# Install dev dependencies
RUN yarn install --frozen-lockfile --dev

# Copy sources
COPY . .
COPY ./config ./config
COPY ./libs ./libs

# Build app
RUN yarn run build
## Stage 2. Run built app
# Note: node:12-alpine could not be used here due to weak bcrypt support:
# https://github.com/kelektiv/node.bcrypt.js/wiki/Installation-Instructions#alpine-linux-based-images
FROM node:16-alpine

# Set app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY package.json ./
RUN yarn install --frozen-lockfile --production
COPY --from=builder /usr/src/app/dist ./dist
# Expose port for use
EXPOSE 7000

CMD ["node", "dist/src/main"]
