window.templates._club_list_view = (club) => {
    return `
    <div class='short_list_item'>
        <div class='short_list_item_avatar avatar'>
            <a href='${club.getUrl()}'>
                <img class='outliner' src='${club.info.photo_100}'>
            </a>
        </div>

        <div class='short_list_item_name'>
            <div style='display: flex;'>
                <a href='${club.getUrl()}'>
                    <b>${club.getName()}</b>
                </a>
            </div>

            ${club.has('activity') ? `<span>${club.getActivity()}</span>` : ''}
            ${club.has('description') ? `<span>"${club.getDescription(200)}"</span>` : ''}
            <a href='?group_id=${club.getId()}#search/users'>${_('counters.subscriptions_count', club.info.members_count)}</a>
        </div>

        <div class='short_list_item_actions' id='_actions'>
            ${club.isClosed() == 0 ? `
                ${!club.isMember() ? `<a class='action' id='_toggleSub' data-val='0' data-addid='${club.getId()}'> ${_('groups.subscribe')}</a>` : ''}
                ${club.isMember() ? `<a class='action' id='_toggleSub' data-val='1' data-addid='${club.getId()}'> ${_('groups.unsubscribe')}</a>` : ''}
            ` : ``}
            ${!club.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='club' data-addid='${club.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
            ${club.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='club' data-addid='${club.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
        </div>
    </div>
`
}
