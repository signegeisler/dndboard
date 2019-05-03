class BlobBuilder{
    constructor(){
    this.parts = [];
    this.blob = new Blob();
    }

    append(blobPart){
        this.parts.push(blobPart);
        this.blob = undefined;
    }

    getBlob(){
        if(!this.blob){
            this.blob = new Blob(this.parts, {type: "text/plain;"});
        }
        return this.blob;
    }


}