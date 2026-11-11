# Kaleidoscope

This is a simple webpage that provides a "never-ending" stream of music/video files.
Very simply, it pulls from an S3 folder source, and inserts a random file from that source onto the page.
There are also very simple controls, like direct file linking and a next/previous button.

The media files used in this project are not sourced by anything in this codebase.
They mainly come from the [Archivist](https://github.com/alloba/archivist) project,
with the remainder being manually added (very uncommon).

## Running Project

TODO - probably just launch page in browser. 

## Migration Notes

Getting rid of Angular. 
It's a single page with a couple of event hooks, so I'm hoping it's relatively chill. 

The page lists the public `kaleidoscope-media` bucket anonymously (bucket policy allows `s3:ListBucket` and
`s3:GetObject`), so no AWS credentials are needed or stored in this repo.

The main idea is: 
- load a list of all files
- organize them by subdirectory 
- provide checkboxes for all the lists
- randomly load files in to play in the main area depending on which checkbox is selected. 

should be easy enough... 
