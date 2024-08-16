class Video extends PostLike {
    hydrate(data) {
        this.info = data
        if(this.info.type && this.info.video) {
            this.info = this.info.video
        }
        
        return this
    }

    getURL() {
        return this.info.sizes[4].url
    }

    getDuration() {
        return Utils.format_seconds(this.info.duration)
    }

    getPreview(size = null) {
        if(!this.hasPreview()) {
            return ''
        }

        const preview = new MinimalPhoto(this.info.image)
        if(!size) {
            return preview.info[0]
        } else {
            return preview.info[size] ? preview.info[size] : null
        }
    }

    getTitle() {
        return (this.info.title ?? this.info.name).escapeHtml()
    }

    getViews() {
        return this.info.views
    }
    
    getLocalViews() {
        return this.info.local_views
    }

    getFullsizeTemplate() {
        return window.templates.video_attachment_with_name(this)
    }

    getMiniTemplate() {
        return window.templates.video_attachment_mini(this)
    }

    getGridTemplate() {
        return this.getMiniTemplate()
    }

    getRestriction() {
        return this.info.restriction
    }

    hasPreview() {
        return this.has('image')
    }

    hasRestriction() {
        return this.has('restriction')
    }
}
