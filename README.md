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

These values matter for pulling s3 files:   

```
bucketUrlPath: 'https://kaleidoscope-media.s3.us-east-1.amazonaws.com/',
awsRegion: 'us-east-1',
awsBucket: 'kaleidoscope-media',
//these aws credentials are for RO S3 access. Meaning, it matters 0% if someone skims this as far as i am concerned.
awsAccessKey: 'AKIA6AVV5VSCJOMOZI5J',
awsSecretKey: '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'
```

_Note: If I can find a different way to grab the list of files from s3 then I can ditch the credentials._ 

The main idea is: 
- load a list of all files
- organize them by subdirectory 
- provide checkboxes for all the lists
- randomly load files in to play in the main area depending on which checkbox is selected. 

should be easy enough... 
