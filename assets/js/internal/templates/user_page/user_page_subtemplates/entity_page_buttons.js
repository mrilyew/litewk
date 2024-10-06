window.templates._user_page_buttons = (user) => {
    const buttons = u(`<div class="flex flex_column gap_5"></div>`)

    if(user.isThisUser()) {
        buttons.append(`
        <a href='#edit' class='subprimary'>
            <input type='button' value='${_('user_page.edit_page')}'>
        </a>`)
    } else {
        if(user.canWrite()) {
            buttons.append(`
            <a href='#im?sel=${user.getId()}' class='accentish'>
                <input type='button' value='${_('users_relations.send_message')}'>
            </a>`)
        }

        buttons.append(`<div class='twix'></div>`)
        const button_twix = buttons.find('.twix')
        let button_text = ''

        switch(user.getFriendStatus()) {
            case 0:
                button_text = _('users_relations.start_friendship')
                if(user.isFollowersModeOn()) {
                    button_text = _('users_relations.subscribe')
                }

                button_twix.append(`<a class='action accentish' id='_friendStatusChange' data-val='0' data-addid='${user.getId()}'>
                    <input type='button' value='${button_text}'>
                </a>`)

                break
            case 1:
                button_text = _('users_relations.cancel_friendship')
                if(user.isFollowersModeOn()) {
                    button_text = _('users_relations.unsubscribe')
                }

                button_twix.append(`<a class='action accentish' id='_friendStatusChange' data-val='1' data-addid='${user.getId()}'>
                    <input type='button' value='${button_text}'>
                </a>`)

                break
            case 2:
                button_twix.append(`
                <a class='action accentish' id='_friendStatusChange' data-val='4' data-addid='${user.getId()}'>
                    <input type='button' value='${_('users_relations.accept_friendship')}'>
                </a>`)
                break
            case 3:
                button_twix.append(`<a class='action accentish' id='_friendStatusChange' data-val='3' data-addid='${user.getId()}'>
                    <input type='button' value='${_('users_relations.destroy_friendship')}'>
                </a>`)
                break
        }

        button_twix.append(`<a class='action subprimary' id='_moreEntityActions'>
            <input type='button' value='...'>
        </a>`)
        
        buttons.append(`
        <div data-trigger='#_moreEntityActions' data-type='click' class='dropdown_menu_wrapper more_actions'>
            <div class='more_actions_body more_actions_insert'></div>
        </div>`)

        const buttons_additional = buttons.find('.more_actions_insert')

        if(user.getFriendStatus() == 2) {
            buttons_additional.append(`
            <a class='action accentish' id='_friendStatusChange' data-val='2' data-addid='${user.getId()}'>${_('users_relations.decline_friendship')}</a>`)
        }

        if(!user.isDeleted()) {
            if(!user.isFaved()) {
                buttons_additional.append(`<a class='action' id='_toggleFave' data-val='0' data-type='user' data-addid='${user.getId()}'> ${_('faves.add_to_faves')}</a>`)
            } else {
                buttons_additional.append(`<a class='action' id='_toggleFave' data-val='1' data-type='user' data-addid='${user.getId()}'> ${_('faves.remove_from_faves')}</a>`)
            }

            if(!user.isBlacklistedByMe()) {
                buttons_additional.append(`<a class='action' id='_toggleBlacklist' data-addid='${user.getId()}' data-val='0'> ${_('blacklist.add_to_blacklist')}</a>`)
            } else {
                buttons_additional.append(`<a class='action' id='_toggleBlacklist' data-addid='${user.getId()}' data-val='1'> ${_('blacklist.remove_from_blacklist')}</a>`)
            }

            if(user.isFriend()) {
                if(!user.isHiddenFromFeed()) {
                    buttons_additional.append(`<a class='action' id='_toggleHiddeness' data-val='0'> ${_('user_page.hide_from_feed')}</a>`)
                } else {
                    buttons_additional.append(`<a class='action' id='_toggleHiddeness' data-val='1'> ${_('user_page.unhide_from_feed')}</a>`)
                }                
            }

            if(!user.isClosed()) {
                if(!user.isSubscribed()) {
                    buttons_additional.append(`<a class='action' id='_toggleSubscribe' data-val='0'> ${_('user_page.subscribe_to_new')}</a>`)
                } else {
                    buttons_additional.append(`<a class='action' id='_toggleSubscribe' data-val='1'> ${_('user_page.unsubscribe_to_new')}</a>`)
                }
            }

            buttons_additional.append(`<a class='action' id='_setReport' data-target='user_${user.getId()}'> ${_('common.report')}</a>`)
        }

        buttons_additional.append(`<a class='action' id='_getAdminGroupd' data-id='${user.getId()}'> ${_('user_page.admined_groups')}</a>`)
        /*buttons_additional.append(`
            <a class='action' href='https://vk.com/id${user.getId()}' target='_blank'> ${_('wall.go_to_vk')}</a>
        `)*/
    }

    return buttons.nodes[0].outerHTML
}

window.templates._club_page_buttons = (club) => {
    const buttons = u(`<div class="flex flex_column gap_5"></div>`)
    if(club.canWrite()) {
        buttons.append(`
        <a href='#im?sel=${club.getId()}' class='accentish'>
            <input type='button' value='${_('users_relations.send_message')}'>
        </a>`)
    }

    buttons.append(`<div class='twix'></div>`)
    const button_twix = buttons.find('.twix')

    if(club.isClosed() == 0) {
        if(!club.isMember()) {
            button_twix.append(`<a class='action accentish' id='_toggleSub' data-val='0' data-addid='${club.getId()}'>
                <input type='button' value='${_('groups.subscribe')}'>
            </a>`)
        } else {
            button_twix.append(`<a class='action accentish' id='_toggleSub' data-val='1' data-addid='${club.getId()}'>
                <input type='button' value='${_('groups.unsubscribe')}'>
            </a>`)
        }
    }

    button_twix.append(`<a class='action subprimary' id='_moreEntityActions'>
        <input type='button' value='...'>
    </a>`)
            
    buttons.append(`
    <div data-trigger='#_moreEntityActions' data-type='click' class='dropdown_menu_wrapper more_actions'>
        <div class='more_actions_body more_actions_insert'></div>
    </div>`)

    const buttons_additional = buttons.find('.more_actions_insert')
    if(!club.isFaved()) {
        buttons_additional.append(`<a class='action' id='_toggleFave' data-val='0' data-type='club' data-addid='${club.getId()}'> ${_('faves.add_to_faves')}</a>`)
    } else {
        buttons_additional.append(`<a class='action' id='_toggleFave' data-val='1' data-type='club' data-addid='${club.getId()}'> ${_('faves.remove_from_faves')}</a>`)
    }

    if(!club.isSubscribedToNews()) {
        buttons_additional.append(`<a class='action' id='_toggleSubscribe' data-val='0'> ${_('user_page.subscribe_to_new')}</a>`)
    } else {
        buttons_additional.append(`<a class='action' id='_toggleSubscribe' data-val='1'> ${_('user_page.unsubscribe_to_new')}</a>`)
    }

    if(club.isMember()) {
        if(!club.isHiddenFromFeed()) {
            buttons_additional.append(`<a class='action' id='_toggleHiddeness' data-val='0'> ${_('user_page.hide_from_feed')}</a>`)
        } else {
            buttons_additional.append(`<a class='action' id='_toggleHiddeness' data-val='1'> ${_('user_page.unhide_from_feed')}</a>`)
        }
    }

    if(!club.isPrivate()) {
        buttons_additional.append(`<a class='action' id='_similarGroups'> ${_('groups.similar_groups')}</a>`)
    }

    buttons_additional.append(`<a class='action' href='https://vk.com/club${club.getId()}' target='_blank'> ${_('wall.go_to_vk')}</a>`)
    return buttons.nodes[0].outerHTML
}
