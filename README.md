# Kaleidoscope

This is an Angular webpage that provides a "never-ending" stream of music/video files.
Very simply, it pulls from an S3 folder source, and inserts a random file from that source onto the page.
There are also very simple controls, like direct file linking and a next/previous button.

The media files used in this project are not sourced by anything in this codebase.
They mainly come from the [Archivist](https://github.com/alloba/archivist) project,
and the remainder being manually added.

## Running Project

This project should be very simple to run locally, since at this point it is just a basic Angular app.
From the main directory, simply run `npm install` to download project dependencies, and `npm run start` to get a local server running.

The S3 bucket that is used as a media file source and the credentials used to access it can be changed via property files.
The ones stored there currently have read-only access to the bucket.
I've decided that public access to those files is allowable, so the key gets to stay.

Deployment is fully described by the architecture files and the GitHub CI file in the project.
Cloudformation is used to define AWS components (just S3 buckets with permissions, really), and publicly hosted GitHub runners are used to
handle actual execution. AWS credentials are stored encrypted in GitHub.

**Note**: The S3 buckets and deployment to them is defined in this project, but the proper DNS routing is not. So with no tweaking, the cloudformation files here will leave you with
the ability to use a standard S3 link to get to the website, and nothing more.

## Short History

This project has taken on a few iterations by this point.
By now I'd more consider it a way to play around with different methods of organizing frontend and backends for basic tasks.

It started out as a simple HTML + Javascript project backed by a Node Express server. That was then modified to
connect instead to a Spring Boot backend. During this time there was some fiddling around with having two separate apps vs
having a backend spring or express server just additionally provide the frontend files to a user.
This is where the name of the project comes from ultimately (combined, vs the original frontend and backend pieces of the project that were stored separately).

Partially out of a desire to simplify the project and partially out of a desire to move the application to the cloud instead of hosting the service out of a
private server on my LAN, the project changed further - first (briefly) operating as an elastic beanstalk application before shifting fully to just a simple website stored in an S3 bucket.
