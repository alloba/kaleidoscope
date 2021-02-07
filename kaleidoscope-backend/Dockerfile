FROM maven:3.6.0-jdk-11-slim AS build
COPY pom.xml /home/app/pom.xml
RUN mvn -f /home/app/pom.xml verify clean --fail-never

COPY . /home/app
RUN mvn -f /home/app/pom.xml clean package


FROM openjdk:11-jre-slim
COPY --from=build /home/app/target/*.jar /home/app/app.jar

ENV PORT=${BACKEND_PORT:-7000}
ENV IMAGE_DIRECTORY=/media/kaleidoscope
ENV FILE_INFO_PATH=/media/songmeta.json
RUN mkdir -p /media/kaleidoscope
#RUN touch /media/songmeta.json

EXPOSE 7000

VOLUME ${MEDIA_VOL:-~/projects/wsg_scraper/image_pool}:/media/kaleidoscope/
VOLUME ${META_FILE:-~/projects/kaleidoscope/songmeta.json}:/media/songmeta.json

ENTRYPOINT ["java", "-jar", "/home/app/app.jar"]