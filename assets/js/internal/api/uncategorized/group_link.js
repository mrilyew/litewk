class GroupLink {
    constructor(info) {
        this.info = info
    }

    getURL() {
        if(window.site_params.get('ux.navigation_away_enable', '1') == '0') {
            return this.info.url
        }
        
        return '#away?id=' + this.info.url
    }

    getIcon() {
        return this.info.photo_50
    }

    getName() {
        return this.info.name.escapeHtml()
    }

    getDescription() {
        return (this.info.desc ?? '').escapeHtml()
    }
}
