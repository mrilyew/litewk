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
        return Utils.escape_html(this.info.title)
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

    getTemplate() {
        let updater = this.getLastUpdater()

        return `
            <div class='group_topic'>
                <div>
                    <a href='#topic${this.getId()}'><b>${this.getTitle()}</b></a>
                </div>

                <div>
                    ${_('counters.messages_count', this.getCommentsCount())}
                    |
                    ${updater ? _('groups.last_from_user_time', updater.getUrl(), updater.getName(), Utils.short_date(this.info.updated)) : ''}
                </div>
            </div>
        `
    }
}
