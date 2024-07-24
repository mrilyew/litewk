class Photo extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getURL() {
        return this.getUrlBySize('p')
    }

    getFullSizeURL() {
        let sorted = this.info.sizes.sort(function (a, b) {
            if(a.height > b.height) {
                return -1;
            }

            if(a.height < b.height) {
                return 1;
            }

            return 0
        })

        if(!sorted[0]) {
            return '' // todo palceholder
        }

        return sorted[0].url
    }

    getOriginalURL() {
        if(!this.info.orig_photo) {
            return this.info.orig_photo.url
        }
    }

    getUrlBySize(type = 'q') {
        if(!this.hasSize(type)) {
            let found = this.info.sizes.find(size => size.type == 'x')

            if(found.url) {
                return found.url
            } else {
                return found.src
            }
        }

        let found = this.info.sizes.find(size => size.type == type)

        if(found.url) {
            return found.url
        } else {
            return found.src
        }
    }

    hasSize(type = 'z') {
        return this.info.sizes.find(size => size.type == type) != null
    }

    isVertical() {
        try {
            let size = this.info.sizes[0]
            return size.height > size.width
        } catch(e) {
            return false
        }
    }
}

class LinkPhoto extends Photo {
    getUrlBySize(type = 'q') {
        try {
            if(!this.hasSize(type)) {
                return this.info.sizes.find(size => size.type == 'b').url
            }
    
            return this.info.sizes.find(size => size.type == type).url
        } catch(e) {
            return ''
        }
    }
}
