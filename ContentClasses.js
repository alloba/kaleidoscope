class S3ListResults {
    constructor(textResponse) {
        const domParse = [... xmlParser.parseFromString(textResponse, 'text/xml').childNodes[0].childNodes]

        this.contents = domParse.filter(x => x.nodeName === 'Contents').map(y => new ContentEntry(y))
        this.bucketName = domParse.find(x => x.nodeName === 'Name')?.textContent
        this.isTruncated = domParse.find(x => x.nodeName === 'IsTruncated')?.textContent === "true"
        this.marker = domParse.find(x => x.nodeName === 'Marker')?.textContent
        this.nextMarker = domParse.find(x => x.nodeName === 'NextMarker')?.textContent
    }
}

class ContentEntry {
    constructor(childNode) {
        this.key = [...childNode.childNodes].find(x => x.nodeName === 'Key')?.textContent
        this.lastModified = [...childNode.childNodes].find(x => x.nodeName === 'LastModified')?.textContent
        this.eTag = [...childNode.childNodes].find(x => x.nodeName === 'ETag')?.textContent
        this.size = [...childNode.childNodes].find(x => x.nodeName === 'Size')?.textContent
        this.storageClass = [...childNode.childNodes].find(x => x.nodeName === 'StorageClass')?.textContent
    }
}