window.page_class = new class {
    async render_page() {
        document.title = _('friends.friends')
        
        let section = window.main_class['hash_params'].section ?? 'all'

        let id = Number(window.main_class['hash_params'].id)
        let us_info = new User
        if(id == 0 || id == null || isNaN(id)) {
            id = window.active_account.info.id
        }

        let is_this = (id == window.active_account.info.id)

        if(!is_this) {
            await us_info.fromId(id)
        } else {
            us_info.hydrate(window.active_account.info)
        }

        let tabs_html = `
            <a href='#friends${id}/all' data-section='all'>${_('friends.all_friends')}</a>
            <a href='#friends${id}/online' data-section='online'>${_('friends.online_friends')}</a>
            ${!is_this ? `<a href='#friends${id}/mutual' data-section='mutual'>${_('friends.mutual_friends')}</a>` : ''}
        `

        if(id == 0 || id == null) {
            id = window.active_account.info.id
        }

        let method = 'friends.get'
        let wall_params = {'user_id': id, 'count': 10, 'extended': 1, 'fields': window.Utils.typical_fields}

        if(id == window.active_account.info.id) {
            wall_params.order = 'hints'
        }

        switch(section) {
            default:   
                document.title = _('friends.friends')

                method = 'friends.get'
                break
            case 'online':
                document.title = _('friends.online_friends')

                method = 'friends.getOnline'
                break
            case 'search':
                document.title = _('friends.search_friends')

                method = 'friends.search'
                tabs_html = `
                    <div class='flex_row flex_nowrap'>
                        <input type='text' value='${window.main_url.getParam('query') ?? ''}' placeholder='${_('friends.search_friends_longer')}' id='__friendssearch'>
                        <input type='button' value='${_('friends.search_friends')}' id='__friendssearchbtn'>
                    </div>
                `

                wall_params.q = window.main_url.getParam('query') ?? ''
                break
            case 'incoming':
                document.title = _('friends.incoming_requests')

                method = 'friends.getRequests'
                wall_params.out = 0

                tabs_html = `
                    <a href='#friends${id}/incoming' data-section='incoming'>${_('friends.incoming')}</a>
                    <a href='#search/users?from_list=subscriptions' data-section='outcoming'>${_('friends.outcoming')}</a>
                `
                break
            case 'outcoming':
                document.title = _('friends.outcoming_requests')

                method = 'friends.getRequests'
                wall_params.out = 1
                
                tabs_html = `
                    <a href='#friends${id}/incoming' data-section='incoming'>${_('friends.incoming')}</a>
                    <a href='#search/users?from_list=subscriptions' data-section='outcoming'>${_('friends.outcoming')}</a>
                `
                break
            case 'suggests':
                document.title = _('friends.recomended_friends')

                method = 'friends.getSuggestions'
                tabs_html = ''
                break
            case 'cleanup':
                document.title = _('friends.cleanup_friends')

                method = 'friends.getFriendsDeletionSuggestions'
                tabs_html = ''
                break
            case 'followers':
                document.title = _('friends.followers')

                method = 'users.getFollowers'
                tabs_html = `
                    <a href='#friends${id}/followers' data-section='followers'>${_('friends.followers')}</a>
                `
                break
            case 'mutual':
                document.title = _('friends.mutual_friends')

                // разрабы вк апи сделали три формата ответов методов друзей. но нахуя?
                method = 'execute'
                wall_params.target_uid = id
                let new_wall_params = {}

                new_wall_params.code = `
                    var friends = API.friends.getMutual(${JSON.stringify(wall_params)});
                    var ids = "";
                    var iter = 0;

                    while (iter < friends.length) {
                        ids  = ids + friends[iter] + ",";
                        iter = iter + 1;
                    }

                    var normal_friends = API.users.get({"user_ids": ids, "fields": "${window.Utils.typical_fields}"});

                    return {"items": normal_friends, "count": friends.length};
                `
                
                wall_params = new_wall_params
                break
            case 'list':
                document.title = _('friends.friends_list')
                tabs_html = `
                    <a href="#friends${id}/list" data-section='list' data-ignore='1' class="selected">${_('friends.friends_list')}</a>
                `

                method = 'friends.get'
                wall_params.list_id = window.main_url.getParam('section_id')
                break
        }

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper layer_two_columns'>
                    <div>
                        ${tabs_html != '' ? `
                        <div class='layer_two_columns_up_panel bordered_block' id='insert_paginator_here_bro'>
                            <div class='tabs' ${section == 'search' ? `style='width: 60%;'` : ''}>${tabs_html}</div>
                        </div>` : ''}

                        <div class='friends_insert short_list bordered_block'></div>
                    </div>
                    <div class='layer_two_columns_tabs bordered_block'>
                        <div>
                            <a href='${us_info.getUrl()}' class='layer_two_columns_tabs_user_info'>
                                <div>
                                    <img class='avatar' src='${us_info.getAvatar()}'>
                                </div>

                                <div class='layer_two_columns_tabs_user_info_name'>
                                    <b ${us_info.isFriend() ? `class='friended'` : ''}>${Utils.cut_string(us_info.getName(), 15)}</b>
                                    <span>${_('user_page.go_to_user_page')}</span>
                                </div>
                            </a>

                            ${is_this ? `
                                <a href='#friends/all' ${section == 'all' || section == 'online' ? 'class=\'selected\'' : ''}>${_(`friends.all_friends`)}</a>
                                <a href='#search/users?from_list=friends' ${section == 'search' ? 'class=\'selected\'' : ''}>${_(`friends.search_friends`)}</a>
                                <a href='#friends/incoming' ${section == 'incoming' || section == 'outcoming' ? 'class=\'selected\'' : ''}>${_(`friends.friends_requests`)}</a>
                                <a href='#friends/suggests' ${section == 'suggests' ? 'class=\'selected\'' : ''}>${_(`friends.recomended_friends`)}</a>
                                <a href='#friends/cleanup' ${section == 'cleanup' ? 'class=\'selected\'' : ''}>${_(`friends.cleanup_friends`)}</a>
                                <a href='#friends/followers' ${section == 'followers' ? 'class=\'selected\'' : ''}>${_(`friends.followers`)}</a>
                            ` : `
                            <a href='#friends${id}/all' ${section == 'all' || section == 'online' || section == 'mutual' ? 'class=\'selected\'' : ''}>${_(`friends.users_friends`)}</a>
                            <a href='#friends${id}/search' ${section == 'search' ? 'class=\'selected\'' : ''}>${_(`friends.search_friends`)}</a>
                            <a href='#friends${id}/followers' ${section == 'followers' ? 'class=\'selected\'' : ''}>${_(`friends.followers`)}</a>
                            `}
                            
                            <div class='layer_two_columns_params' style='display:none;'>
                                <span>${_('friends.friends_lists')}</span>
                            </div>
                            <div id='__insertlists'></div>
                        </div>
                    </div>
                </div>
            `
        )

        let tab_dom = $(`.layer_two_columns_up_panel a[data-section='${section}']`)

        tab_dom.addClass('selected')
        
        window.main_classes['wall'] = new Friends(UserListView, '.friends_insert')
        window.main_classes['wall'].setParams(method, wall_params)
        window.main_classes['wall'].clear()
            
        if(window.main_url.hasParam('page')) {
            window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
        }

        let val = await window.main_classes['wall'].nextPage()

        if(tab_dom[0]) {
            tab_dom[0].innerHTML = tab_dom[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
        }

        if(val == 'ERR') {
            if(method == 'friends.getFriendsDeletionSuggestions') {
                return
            }
            
            main_class.add_onpage_error(_('errors.friends_not_found', id))
            return
        } else {
            $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        }

        let friends_lists = await window.vk_api.call('friends.getLists', {'user_id': id}, false)
        friends_lists = friends_lists.response

        if(friends_lists.count > 0) {
            $('.wall_wrapper_newsfeed_params')[0].style.display = 'block'

            friends_lists.items.forEach(list => {
                $('#__insertlists')[0].insertAdjacentHTML('beforeend', 
                    `
                    <a href='#friends${id}/list?section_id=${list.id}' ${Number(window.main_url.getParam('section_id')) == list.id ? 'class=\'selected\'' : ''}>${list.name}</a>
                    `
                )
            })
        }
    }
}
