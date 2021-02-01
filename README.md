# 'Kaleidoscope' Project

This project was created with the intention to serve a collection of webm files on a private network, 
to a web-browser. 

Files are selected in a random-ish fashion, and presented to the user. 
These files then are played in the page, and cycled through when they are completed. 

Pretty basic use-case, right?

## Running Project
This project is split into two pieces, frontend and backend. 
The frontend is a very standard Angular application, and the backend is a very standard Express webserver.

Both of these apps can be launched in a coordinated fashion very easily by using the docker compose file that 
is provided in the project. The compose file also outlines the information that must be provided to the 
two services in order to run correctly. 

Basically, the frontend needs no real configuration to get running. By default, it runs in prod mode, but 
the only special consideration for environmental differences are defining correct endpoints for the backend service.

The backend needs a number of environment variables to be set before startup - things like the file directory to use 
and where to pull meta info from. 

Ideally, these two apps can be immediately built and ran just using `docker-compose up`. 