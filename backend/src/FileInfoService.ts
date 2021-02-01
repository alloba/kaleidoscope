import fs from 'fs';
import path from 'path';
import FileInformation from './model/file-info';
import FileMetaInfo from './model/file-meta-info';

/**
 * This service is meant to deal with all handling of the meta data that gets attached to a particular file that passes through this application. 
 * File information is stored in a json file, the path of which is provided on instantiation (application startup), and parsed immediately.
 * 
 * Operations in this class are almost all CRUD type operations, except with a little bit more logic attached to some stuff 
 * (creating defaults, flat mapping lists, whatever else).
 * 
 * There should be sufficient handling around the passed in filepath to not just immediately die with zero helpful information 
 * if something unexpected is passed in, but i am continually surprised by how i can goof or overlook something.
 */
export default class FileInfoService {
    private filepath: string;
    private fileInfo: Array<FileInformation>;

    constructor (filepath: string){
        this.filepath = filepath;
        this.reloadInfoFile();
    }

    /**
     * Pull file information based on the passed in name. 
     * This will return a FileMetaInfo type object.
     * The input parameter is strictly the filename itself, not the fully qualified path. 
     * By the time it gets here, the path should be generally useless, and the name should be acting as a key or id... 
     * 
     * If no information is found for the file that is being passed in, a default response is created and added to the overall info collection. 
     * This is then passed off to be saved in the background, back to disk.
     * 
     * @param filename - name of the file that information is going to be pulled for. This is the name only, not full path.
     */
    getFileInfo(filename: string): FileMetaInfo {
        const targetFile = this.fileInfo.filter(file => file.filename === filename);
        if(targetFile.length == 0){
            console.log(`No existing information found for file '${filename}'. Creating new entry now.`)
            const newItem = new FileInformation();
            newItem.filename = filename;

            this.fileInfo.push(newItem);
            this.updateInformationFile(); //async operation
            return newItem.meta;
        }
        if(targetFile.length > 1){
            console.warn(`Multiple entries found during file information lookup of filename: '${filename}'.\nThis should not be possible. Returning first entry in the array as a fallback.`);
        }
        if(targetFile[0].meta == null){
            console.log(`No meta information found for filename '${filename}'. Creating empty information set and assigning it to this id.`)
            targetFile[0].meta = new FileMetaInfo();
        }
        return targetFile[0].meta;
    }

    /**
     * Get all tags for all files that are stored in the information set. 
     * Convert list of file objects to a flatmap of all their tags, then remove duplicates via adding to a Set. 
     * 
     * I view this as a cheap enough operation currently, if that stops being the case one day then replace this operation with a precomputed/maintained list.
     */
    getAllTags(): Array<string> {
        const tags = this.fileInfo.map(info => info.meta).flatMap(meta => meta.tags);
        return [...new Set(tags)]; //i prefer arrays as final output, but need a set conversion to remove duplicates. the performance police can suck it.
    }

    /**
     * Update the information about the provided file. 
     * This assumes a fully valid meta info target, 
     * EXCEPT if a particular field is left entirely blank or undefined, it is assumed a garbage value and is bypassed. 
     * This is mostly a guard during development, around bad request objects. 
     * It actively ignores the possibility that you might genuinely want to remove some field entirely (for now). 
     * 
     * @param filename - filename of the update target
     * @param metaInfo - information to assign to target file
     */
    updateFileInformation(filename: string, metaInfo: FileMetaInfo){
        const existingItem = this.getFileInfo(filename);

        if(metaInfo.description && metaInfo.description !== ''){
            existingItem.description = metaInfo.description;
        }
            
        if(metaInfo.songName && metaInfo.songName !== ''){
            existingItem.songName = metaInfo.songName
        }
            
        if(metaInfo.tags && metaInfo.tags != []){
            existingItem.tags = metaInfo.tags
        }
            
        
        this.updateInformationFile()
    }
    
    /**
     * Write current in-memory file information list to disk. 
     * This uses the filepath that was passed to the FileInfoService during instantiation.
     * 
     * This operation is async. (i dont care about save operations 99% of the time, as long as it works)
     */
    async updateInformationFile(){
        fs.writeFile(this.filepath, JSON.stringify(this.fileInfo, null, 2), (err) => {
            if(err){
                console.error('Information file update failure! Not Terminating program execution, but something definitely went wrong!');
                console.error(err)
            }
            console.log(`Wrote updated information file to path: ${this.filepath}`)
        })
    }

    /**
     * Load file information from disk. The file at the path is loaded as a json object, and converted to an array of FileInformation items.
     * The primary use-case of this method is during application startup / Service instantiation, 
     * although i have also found use for it when making manual edits to the text file while the application is running. 
     */
    reloadInfoFile(){
        console.log(`Beginning load of information file: ${this.filepath}`);

        if (path.extname(this.filepath) != '.json'){
            console.error(`Cannot operate with information file that is not saved as a json file.`)
            throw new Error(`Invalid file type provided to FileInfoService: '${path.extname(this.filepath)}'`)
        }

        else if(fs.existsSync(this.filepath) && fs.lstatSync(this.filepath).isDirectory()){
            console.error('Cannot pass directory as an information file.')
            throw new Error(`Directory provided instead of a filename to FileInfoService. '${this.filepath}'`)
        }

        else if(!fs.existsSync(this.filepath)){
            console.warn(`Information File at location [${this.filepath}] does not exist. Will attempt to create new file at this location.`)
            try{
                const directorypath = path.dirname(this.filepath);
                if(!fs.existsSync(directorypath)){
                    fs.mkdirSync(directorypath, {recursive: true})
                }
                this.fileInfo = [];
                fs.writeFileSync(this.filepath, JSON.stringify(this.fileInfo));
            }
            catch (ex) {
                console.error(`Could not create information file.`)
                throw new Error(`Failed to create information file at provided path '${this.filepath}'. \nException:\n${ex}`)
            }
        }

        try{
            const rawJson = fs.readFileSync(this.filepath).toString();
            this.fileInfo = JSON.parse(rawJson);
            if(this.fileInfo == null){
                console.log(`Blank information file passed from path '${this.filepath}'. Creating new information set and saving to file.`);
                this.fileInfo = [];
                this.updateInformationFile();
            }
        }
        catch(ex) {
            console.error('Failure to load information file');
            throw new Error(`Could not load/parse provided information file '${this.filepath}'.\nException\n${ex}`);
        }

        console.log('Information file loaded.')
    }
}