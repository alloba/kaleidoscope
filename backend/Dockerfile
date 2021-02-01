FROM node:latest
#WORKDIR /dist/
COPY . .
RUN mkdir -p /media/kaleidoscope
RUN touch /media/songmeta.json
RUN npm install 
RUN npm run build
EXPOSE 7000

CMD ["node", "dist/src/server.js"]
# "imagedir=/media/kaleidoscope-backend/", "fileInfoPath=/media/songmeta.json"]