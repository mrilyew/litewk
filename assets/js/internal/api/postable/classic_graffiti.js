class ClassicGraffiti extends Hasable {
    constructor(info) {
        super(info)
        this.info = info
    }

    getURL() {
        // new graffiti
        if(this.has('url')) {
            return this.info.url
        }

        if(this.info.photo_586) {
            return this.info.photo_586
        } else if(this.photo_604) {
            return this.info.photo_604
        }
    }
    
    getFullsizeTemplate() {
        return window.templates.photo_graffiti(this)
    }
}
