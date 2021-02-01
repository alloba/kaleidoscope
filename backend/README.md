This is the backend piece of the overall kaliedoscope application. 

Refer to the Dockerfile for specifics on how to get things running properly.
Generally, it's just a straight up node application that requires a number of environment variables 
to be set prior to execution. 

The following environment variables need to be set correctly to run this server: 
- IMAGE_DIRECTORY -- directory that contains webm files to serve
- FILE_INFO_PATH -- json file to use as file meta info storage
- PORT -- port to run express server on 

### Docker
This app can be wrapped in a docker container to support easier execution wherever it needs be. 
The docker setup will copy the src folder to the container, and will run the build process to compile typescript files and shift contents to the dist directory. 
The container is set up to expose port 7000. This can be tweaked to bind to any host port that is desired. 

You must also provide the directory that will be used to serve image files from. 
This is provided as a volume mount to the docker container. 

Commands used EXAMPLES: 
Build - `docker build -t alloba/kaleidoscope-backend .`
Run - `docker run -d --restart always -p 7000:7000 -v ~/projects/wsg_scraper/image_pool:/media/kaleidoscope-backend -v ~/projects/kaleidoscope-backend/songmeta.json:/media/songmeta.json --name kaleidoscope-backend alloba/kaleidoscope-backend`
Inspect Contents (troubleshooting) - `docker run -it alloba/kaleidoscope-backend sh`