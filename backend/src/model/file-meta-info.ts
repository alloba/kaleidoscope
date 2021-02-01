/**
 * hold meta information for a particular file. 
 * This is meant to typically be wrapped inside of the FileInformation class, associated to a filename.
 */
export default class FileMetaInfo{
    tags: Array<string> = [];
    description: string = '';
    songName: string = '';
}