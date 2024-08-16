class Photo extends PostLike {
    constructor(info) {
        super(info)
        this.info = info

        this.resortSizes()
    }

    resortSizes() {
        /*let _final_sizes = Object.entries(this.info.sizes)
        if(_final_sizes[0][1] == undefined) {
            return
        }

        let final_sizes = []
        _final_sizes.forEach(size => {
            final_sizes.push(size[1])
        })

        this.info.sizes = final_sizes*/
        if(this.info && this.info.sizes) {
            const sorted = this.info.sizes.sortByHeight()
            
            this.info.sizes = sorted
        }
    }

    hydrate(info) {
        super.hydrate(info)

        this.resortSizes()
    }

    async fromId(owner_id, photo_id) {
        const photo = await window.vk_api.call('photos.getById', {'photos': owner_id + '_' + photo_id, 'extended': 1, 'photo_sizes': 1})

        this.hydrate(photo[0])
    }

    getDescription() {
        return this.info.text.escapeHtml()
    }

    getURL() {
        try {
            return this.info.sizes[4].url
        } catch(e) {
            const size = this.info.sizes[(this.info.sizes.length - 2)]
            console.log(this.info.sizes)
            if(!size) {
                return ''
            }

            return size.url
        }
    }

    getFullSizeURL() {
        if(!this.info.sizes[1]) {
            return '' // todo palceholder
        }

        return this.info.sizes[1].url
    }

    getUrlByIndex(id = 0) {
        if(!this.info.sizes[id]) {
            return '' // todo palceholder
        }

        return this.info.sizes[id].url
    }

    getOriginalURL() {
        if(this.info.orig_photo) {
            return this.info.orig_photo.url
        } else {
            return this.getUrlByIndex(0)
        }
    }

    getUrlBySize(type = 'q') {
        if(!this.hasSize(type)) {
            const found = this.info.sizes.find(size => size.type == 'x')

            if(found.url) {
                return found.url
            } else {
                return found.src
            }
        }

        const found = this.info.sizes.find(size => size.type == type)
        if(found.url) {
            return found.url
        } else {
            return found.src
        }
    }

    hasSize(type = 'z') {
        return this.info.sizes.find(size => size.type == type) != null
    }

    hasDescription() {
        return this.has('text')
    }

    isWide() {
        try {
            const size = this.info.sizes[0]
            const ratio = (size.width / size.height)
            return /*ratio >= window.consts.MASONRY_WIDE_RATIO ||*/ ratio <= window.consts.MASONRY_REGULAR_RATIO
        } catch(e) {
            return false
        }
    }

    getFullsizeTemplate(additional = {}) {
        return window.templates._photo_fullsize_attachment(this, additional)
    }

    getMiniTemplate(additional = {}) {
        return window.templates._photo_mini_attachment(this, additional)
    }
    
    getGridTemplate() {
        return this.getMiniTemplate()
    }
}

class MinimalPhoto {
    constructor(info) {
        this.info = info

        if(this.info) {
            const sorted = this.info.sort(function (a, b) {
                if(a.height > b.height) {
                    return -1;
                }
    
                if(a.height < b.height) {
                    return 1;
                }
    
                return 0
            })
    
            this.info = sorted
        }
    }

    getImage(index = 0) {
        return this.info[index]
    }
}

