import express from 'express';
import {ImageService} from './ImageService';
import path from 'path';
import FileInfoService from './FileInfoService';
import FileMetaInfo from './model/file-meta-info';
import cors from 'cors';
import {CommandParser} from "./CommandParser";

let port = 7000;
let imageDirectory = '/projects/wsg_scraper/image_pool/'; //this is the default holdover from before you had to provide a directory yourself. 
let fileInformationPath = '/projects/kaleidoscope/testinfo.json' //both of these are actually provided at launch (through launch.json in the case of vscode)

processStartupArgs();
const app = express();
app.use(cors());
app.use(express.json());

const imageService = new ImageService(imageDirectory);
const fileinfoService = new FileInfoService(fileInformationPath);
/**
 * TODO: The desire to blow this away and do a java version increases as i experience build issues.... but also ive been drinking so maybe im missing something obvious
 */
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../' + 'webpage/index.html'));
});

app.get('/randomImage', (req, res) => {
    const imageFile = imageService.findRandomImageName();
    res.setHeader('Cache-Control', 'no-cache')
    res.redirect('/image?imageFile=' + imageFile)
});

app.get('/image', (req, res) => {
    const passedImage = req.query.imageFile;
    const imageFullPath = imageService.getFullImagePath(passedImage as string);
    console.log('found image file: ' + passedImage)
    
    res.setHeader('Cache-Control', 'no-cache')
    res.setHeader('File', passedImage as string);
    res.setHeader('Filename', imageService.parseTitle(passedImage as string))
    res.sendFile(imageFullPath)
});

app.get('/imageList', (req, res) => {
    const imageList = imageService.getImageList();
    res.setHeader('Cache-Control', 'no-cache')
    res.send(imageList);
});

app.get('/allTags', (req, res) => {
    const allTags = fileinfoService.getAllTags();
    res.setHeader('Cache-Control', 'no-cache');
    res.send(allTags)
})

app.get('/favicon.ico', (req, res) => {
    res.status(204);
    res.send('favicon.ico')
});

app.get('/fileinfo/:filename', (req, res) => {
    const filename = req.params.filename;
    const info = fileinfoService.getFileInfo(filename);

    if(info){
        res.setHeader('Content-Type', 'application/json')
        res.status(200)
        res.send(JSON.stringify(info, null , 2))
        return;
    }   
    else {
        //else condition should hypothetically never happen. if a file isnt found with the passed in name, it is created on the fly.
        res.status(404);
        res.send('No file found with provided filename string: ' + filename);
    }
})

app.get('/reloadinfo', (req, res) => {
    fileinfoService.reloadInfoFile();
    imageService.reload();
    res.status(200);
    res.send('reloaded');
})

app.get('/saveinfo', (req, res) => {
    fileinfoService.updateInformationFile();
    res.status(200);
    res.send('Saved to disk - ' + fileInformationPath);
})

app.post('/updateFileInfo/:filename', (req, res) => {
    const filename = req.params.filename;
    const body = req.body;

    if(filename && body){
        console.log('triggering update operation for ' + filename);
        console.log(body);
        fileinfoService.updateFileInformation(filename, body as FileMetaInfo);
    }
})

app.listen(port, () => {
    console.log('Express server started on port ' + port)
    console.log('Using image directory: ' + imageDirectory)
    console.log('Using information file: ' + fileInformationPath)
})

function processStartupArgs() {
    //Default to env values being set (to work with docker nicely), then attempt to load process args as a backup.

    if(process.argv.filter(x => x.startsWith('help')).length > 0){
        console.log('You must provide a directory from which to serve image files. This directory must contain ONLY webm files.');
        console.log('You must also provide a location to pull file information from. This is expected to be a full path to a json file.')
        console.log('use command line argument in the format of `node server.js imagedir=/path/to/directory/ fileInfoPath=/path/to/file.json`');
        process.exit(1);
    }

    if(process.env.PORT){
        port = process.env.PORT as unknown as number;
    } else {
        const portVar = CommandParser.getarg(process.argv, 'port');
        if(portVar == ''){
            throw new Error('Must provide port number');
        }
        port = portVar as unknown as number
    }

    if(process.env.IMAGE_DIRECTORY){
        imageDirectory = process.env.IMAGE_DIRECTORY;
    } else {
        const dirVar = CommandParser.getarg(process.argv, 'imageDirectory');
        if(dirVar == ''){
            throw new Error('Must provide image directory');
        }
        imageDirectory = dirVar
    }

    if(process.env.FILE_INFO_PATH){
        fileInformationPath = process.env.FILE_INFO_PATH;
    } else {
        const fileInfoVar = CommandParser.getarg(process.argv, 'fileInfoPath');
        if(fileInfoVar == ''){
            throw new Error('Must provide file info path');
        }
        fileInformationPath = fileInfoVar
    }

    if(! imageDirectory.endsWith('/')){ //because i'll forget to add it...
        imageDirectory += '/'
    }

}