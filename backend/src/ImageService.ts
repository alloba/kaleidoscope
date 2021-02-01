import fs from 'fs';
export class ImageService{ 

    private readonly imageDirectory: string;
    private bag: string[]; 
    private staticBag: string[]

    constructor(imageDirectory: string) {
        this.imageDirectory = imageDirectory;
        
        try{
            this.bag = fs.readdirSync(this.imageDirectory);
            this.staticBag = fs.readdirSync(this.imageDirectory);
            if(this.bag == null)
                this.bag = [];
        } catch (ex) {
            console.error("Failed to load image directory in ImageService instantiation")
            throw ex;
        }
        
    }

    getImageList(): string[] {
        return this.staticBag;
    }

    findRandomImageFullPath(): string{
        return this.imageDirectory + this.findRandomImageName();
    }

    findRandomImageName(): string{
        // const allFiles = fs.readdirSync(this.imageDirectory);
        const fileIndex = Math.floor(Math.random() * this.bag.length);
        const selectedFile = this.bag[fileIndex];
        this.bag.splice(fileIndex, 1)

        if(this.bag.length == 0){
            try{
                this.bag = fs.readdirSync(this.imageDirectory);
                if(this.bag == null)
                    this.bag = [];
            } catch (ex) {
                console.error("Failed to load image directory in ImageService instantiation")
                throw ex;
            }
        }

        return selectedFile;
    }

    getFullImagePath(filename: string) {
        return this.imageDirectory + filename;
    }

    parseTitle(filename: string): string {
        const separator = '_';
        return filename.slice(0, filename.lastIndexOf(separator))
    }
}