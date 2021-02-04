FROM node:latest
ENV PORT=${BACKEND_PORT:-7000}
ENV IMAGE_DIRECTORY=/media/kaleidoscope
ENV FILE_INFO_PATH=/media/songmeta.json

WORKDIR /dist/
COPY . /dist/
RUN mkdir -p /media/kaleidoscope
RUN touch /media/songmeta.json
RUN npm install && npm install -g typescript
RUN npm run build
EXPOSE 7000

VOLUME ${MEDIA_VOL:-~/projects/wsg_scraper/image_pool}:/media/kaleidoscope/
VOLUME ${META_FILE:-~/projects/kaleidoscope/songmeta.json}:/media/songmeta.json

CMD ["node", "dist/src/server.js"]
# "imagedir=/media/kaleidoscope-backend/", "fileInfoPath=/media/songmeta.json"]