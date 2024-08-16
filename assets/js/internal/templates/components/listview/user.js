window.templates._user_list_view = (user) => {
    return `
    <div class='short_list_item'>
        <div class='short_list_item_avatar avatar'>
            <a href='${user.getUrl()}'>
                <img class='outliner' src='${user.info.photo_100}'>
            </a>
        </div>

        <div class='short_list_item_name'>
            <a href='#id${user.getId()}' class='${user.isFriend() ? 'friended' : ''}'>
                <b>
                    ${user.getHTMLName()}
                </b>
            </a>

            ${user.has('status') ? `<span>"${user.getTextStatus()}"</span>` : ''}
            <span>${user.getFullOnline()}</span>
            ${user.has('city') ? `<span>${user.getCountryncity()}</span>` : ''}
            ${!user.isFriend() && user.info.common_count > 0 ? `<a href='#friends${user.getId()}/mutual'>${_('counters.mutual_friends_count', user.info.common_count)}</a>` : ''}
        </div>

        <div class='short_list_item_actions' id='_actions'>
            ${!user.isThisUser() ?
            `
            ${user.isNotFriend() ? `<a class='action' id='_toggleFriend' data-val='0' data-addid='${user.getId()}'> ${_('users_relations.start_friendship')}</a>` : ''}
            ${user.getFriendStatus() == 1 ? `<a class='action' id='_toggleFriend' data-val='1' data-addid='${user.getId()}'> ${_('users_relations.cancel_friendship')}</a>` : ''}
            ${user.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='4' data-addid='${user.getId()}'> ${_('users_relations.accept_friendship')}</a>` : ''}
            ${user.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='2' data-addid='${user.getId()}'> ${_('users_relations.decline_friendship')}</a>` : ''}
            ${user.getFriendStatus() == 3 ? `<a class='action' id='_toggleFriend' data-val='3' data-addid='${user.getId()}'> ${_('users_relations.destroy_friendship')}</a>` : ''}
            <a class="action">${_('user_page.create_message')}</a>
            <a class="action" href='#friends${user.getId()}'>${_('user_page.list_friends')}</a>
            ${!user.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='user' data-addid='${user.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
            ${user.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='user' data-addid='${user.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
            ` : ''}
        </div>
    </div>
    `
}
