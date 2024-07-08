class Video extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getURL() {
        return this.info.sizes[4].url
    }

    getDuration() {
        return Utils.format_seconds(this.info.duration)
    }

    getPreview(num = 3) {
        if(!this.hasPreview()) {
            return ''
        }

        if(!this.info.image[num]) {
            try {
                return this.info.image[3].url
            } catch(e) {
                return this.info.image[0].url
            }
        } else {
            return this.info.image[num].url
        }
    }

    getTitle() {
        return Utils.escape_html(this.info.title)
    }

    getViews() {
        return this.info.views
    }
    
    getLocalViews() {
        return this.info.local_views
    }

    hasPreview() {
        return this.has('image')
    }
}
