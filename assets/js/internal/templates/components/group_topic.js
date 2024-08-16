window.templates.group_topic = (topic) => {
    const updater = topic.getLastUpdater()

    return `
        <div class='group_topic'>
            <div>
                <a href='#topic${topic.getId()}' data-back='club${topic.group_id}'><b>${topic.getTitle()}</b></a>
            </div>

            <div>
                ${_('counters.messages_count', topic.getCommentsCount())}
                |
                ${updater ? _('groups.last_from_user_time', updater.getUrl(), updater.getName(), Utils.short_date(topic.getUpdatingTime())) : ''}
            </div>
        </div>
    `
}
