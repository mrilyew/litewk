class Photo extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getURL() {
        return this.getUrlBySize('p')
    }

    getFullSizeURL() {
        if(this.hasSize('w')) {
            return this.getUrlBySize('w')
        } else if(this.hasSize('z')) {
            return this.getUrlBySize('z')
        } else if(this.hasSize('y')) {
            return this.getUrlBySize('y')
        } else if(this.hasSize('r')) {
            return this.getUrlBySize('r')
        } else {
            return this.getUrlBySize('q')
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
