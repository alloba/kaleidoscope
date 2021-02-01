import FileMetaInfo from "./file-meta-info";

/**
 * Store file information associated by given filename.
 * Expectation is that filename will always be unique (because that is how files work... ), so it serves as a pretty good unique key.
 */
export default class FileInformation {
    filename: string = '';
    meta: FileMetaInfo = new FileMetaInfo();
}