class GroupHistoryItem {
    constructor(item, next_from) 
    {
        this.info = item
        this.next_from = next_from
    }

    getType() {
        return this.info.type
    }

    getTitle() 
    {
        switch(this.getType()) {
            case 'create':
                return _('groups_history.groups_history_create')
            case 'rename':
                return _('groups_history.groups_history_name_change', Utils.escape_html(this.info.title))
            case 'collapse':
                return `<a id='_groups_history_full' href='javascript:void(0)' data-nextfrom='${this.next_from}'>${_('groups_history.groups_history_namechange', Number(this.info.title))}</a>`
        }
    }

    getIcon() {
        return ''
    }

    getDate() 
    {
        return Utils.short_date(this.info.time)
    }

    getHTML() 
    {
        return `
            <div class='club_history_item' data-htype='${this.getType()}'>
                <div class='club_history_item_icon'>
                    ${this.getIcon()}
                </div>

                <div class='club_history_item_info'>
                    <b>${this.getTitle()}</b>

                    <span>${this.getDate()}</span>
                </div>
            </div>
        `
    }
}
