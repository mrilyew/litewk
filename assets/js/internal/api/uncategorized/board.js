class Topic {
    constructor(info, profiles, groups, group_id) {
        this.info = info
        this.profiles = profiles
        this.groups = groups
        this.group_id = group_id
    }

    getLastUpdaterID() {
        return this.info.updated_by
    }

    getTitle() {
        return this.info.title.escapeHtml()
    }

    getLastUpdater() {
        if(this.getLastUpdaterID()) {
            return Utils.find_owner_in_arrays_and_return_entity(this.getLastUpdaterID(), this.profiles, this.groups)
        }
        
        return null
    }

    getId() {
        return this.group_id + '_' + this.info.id
    }

    getCommentsCount() {
        return this.info.comments
    }

    getUpdatingTime() {
        return this.info.updated
    }

    getTemplate() {
        return window.templates.group_topic(this)
    }
}
