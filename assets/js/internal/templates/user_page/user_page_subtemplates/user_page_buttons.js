window.templates._user_page_buttons = (user) => {
    return `
    ${user.isThisUser() ?
        `
        ${`<a class='action' href='#edit'> ${_('user_page.edit_page')}</a>`}
        ` :
        `
        ${!user.isDeleted() ? `${user.isNotFriend() ? `<a class='action' id='_friendStatusChange' data-val='0' data-addid='${user.getId()}'> ${_('users_relations.start_friendship')}</a>` : ''}
        ${user.getFriendStatus() == 1 ? `<a class='action' id='_friendStatusChange' data-val='1' data-addid='${user.getId()}'> ${_('users_relations.cancel_friendship')}</a>` : ''}
        ${user.getFriendStatus() == 2 ? `<a class='action' id='_friendStatusChange' data-val='4' data-addid='${user.getId()}'> ${_('users_relations.accept_friendship')}</a>` : ''}
        ${user.getFriendStatus() == 2 ? `<a class='action' id='_friendStatusChange' data-val='2' data-addid='${user.getId()}'> ${_('users_relations.decline_friendship')}</a>` : ''}
        ${user.getFriendStatus() == 3 ? `<a class='action' id='_friendStatusChange' data-val='3' data-addid='${user.getId()}'> ${_('users_relations.destroy_friendship')}</a>` : ''}
        ${!user.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='user' data-addid='${user.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
        ${user.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='user' data-addid='${user.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
        ${!user.isBlacklistedByMe() ? `<a class='action' id='_toggleBlacklist' data-addid='${user.getId()}' data-val='0'> ${_('blacklist.add_to_blacklist')}</a>` : ''}
        ${user.isBlacklistedByMe() ? `<a class='action' id='_toggleBlacklist' data-addid='${user.getId()}' data-val='1'> ${_('blacklist.remove_from_blacklist')}</a>` : ''}
        
        ${user.isFriend() ? `
            ${!user.isHiddenFromFeed() ? `<a class='action' id='_toggleHiddeness' data-val='0'> ${_('user_page.hide_from_feed')}</a>` : ''}
            ${user.isHiddenFromFeed() ? `<a class='action' id='_toggleHiddeness' data-val='1'> ${_('user_page.unhide_from_feed')}</a>` : ''}
        ` : ''}

        ${!user.isClosed() && !user.isSubscribed() ? `<a class='action' id='_toggleSubscribe' data-val='0'> ${_('user_page.subscribe_to_new')}</a>` : ''}
        ${!user.isClosed() && user.isSubscribed() ? `<a class='action' id='_toggleSubscribe' data-val='1'> ${_('user_page.unsubscribe_to_new')}</a>` : ''}` : ''}
        <a class='action' id='_setReport' data-target='user_${user.getId()}'> ${_('common.report')}</a>
        <a class='action' href='https://vk.com/id${user.getId()}' target='_blank'> ${_('wall.go_to_vk')}</a>
        `
    }
    `
}
