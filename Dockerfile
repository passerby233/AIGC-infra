FROM node:24-alpine
WORKDIR /app
COPY . .
RUN node scripts/build.mjs
ENV HOST=0.0.0.0 PORT=8080
EXPOSE 8080
USER node
CMD ["node", "web/server.mjs"]
