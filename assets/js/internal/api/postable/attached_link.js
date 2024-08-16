class Link extends PostLike {
    hasPhoto() {
        return this.has('photo')
    }

    getPhoto() {
        const photo = new Photo
        photo.hydrate(this.info.photo)

        return photo
    }

    getURL() {
        if(window.site_params.get('ux.navigation_away_enable', '1') == '0') {
            return this.info.url
        }

        return '#away?id=' + this.info.url
    }

    getUnsafeURL() {
        return this.info.url
    }

    getTitle() {
        return this.info.title ? this.info.title.escapeHtml() : _('wall.untitled_link')
    }
    
    getCaption() {
        return this.info.caption ? this.info.caption.escapeHtml() : this.getUnsafeURL().circum(30)
    }

    getCaptionURL() {
        if(window.site_params.get('ux.navigation_away_enable', '1') == '0') {
            return this.getCaption()
        }
        
        return '#away?id=' + this.getCaption()
    }

    getDescription() {
        return this.info.description ? this.info.description.escapeHtml() : ''
    }

    isFaved() {
        return this.info.is_favorite
    }

    getFullsizeTemplate(additional = {}) {
        const photo = this.getPhoto()

        switch(this.info.ref) {
            default:
                break
            case 'audio_playlist':
                return window.templates.attached_link_playlist(this)
        }

        if(!additional.forceVertical && (!photo || !photo.isWide())) {
            return window.templates.attached_link_regular(this)
        } else {
            return window.templates.attached_link_vertical(this)
        }
    }

    getTemplate(additional) {
        return this.getFullsizeTemplate(additional)
    }
}
