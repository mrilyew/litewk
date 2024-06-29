window.page_class = new class {
    async render_page() {
        document.title = _('friends.friends')
        
        let section = window.s_url.searchParams.get('section') ?? 'all'

        let id = Number(window.s_url.searchParams.get('id'))
        let us_info = null
        if(id == 0 || id == null || isNaN(id)) {
            id = window.active_account.vk_info.id
        }

        let is_this = (id == window.active_account.vk_info.id)
        if(!is_this) {
            us_info = new User
            await us_info.fromId(id)
        } else {
            us_info = new User
            us_info.hydrate(window.active_account.vk_info)
        }

        let tabs_html = `
            <a href='site_pages/friends.html?id=${id}&section=all' data-section='all'>${_('friends.all_friends')}</a>
            <a href='site_pages/friends.html?id=${id}&section=online' data-section='online'>${_('friends.online_friends')}</a>
            ${!is_this ? `<a href='site_pages/friends.html?id=${id}&section=mutual' data-section='mutual'>${_('friends.mutual_friends')}</a>` : ''}
        `
        
        if(id == 0 || id == null) {
            id = window.active_account.vk_info.id
        }

        let method = 'friends.get'
        let wall_params = {'user_id': id, 'count': 10, 'extended': 1, 'fields': window.typical_fields}

        if(id == window.active_account.vk_info.id) {
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
                    <div class='friends_search_fuck_block'>
                        <input type='text' value='${window.s_url.searchParams.get('query') ?? ''}' placeholder='${_('friends.search_friends_longer')}' id='__friendssearch'>
                        <input type='button' value='${_('friends.search_friends')}' id='__friendssearchbtn'>
                    </div>
                `

                wall_params.q = window.s_url.searchParams.get('query') ?? ''
                break
            case 'incoming':
                document.title = _('friends.incoming_requests')

                method = 'friends.getRequests'
                wall_params.out = 0

                tabs_html = `
                    <a href='site_pages/friends.html?id=${id}&section=incoming' data-section='incoming'>${_('friends.incoming')}</a>
                    <a href='site_pages/friends.html?id=${id}&section=outcoming' data-section='outcoming'>${_('friends.outcoming')}</a>
                `
                break
            case 'outcoming':
                document.title = _('friends.outcoming_requests')

                method = 'friends.getRequests'
                wall_params.out = 1
                
                tabs_html = `
                    <a href='site_pages/friends.html?id=${id}&section=incoming' data-section='incoming'>${_('friends.incoming')}</a>
                    <a href='site_pages/friends.html?id=${id}&section=outcoming' data-section='outcoming'>${_('friends.outcoming')}</a>
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
                    <a href='site_pages/friends.html?id=${id}&section=followers' data-section='followers'>${_('friends.followers')}</a>
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

                    var normal_friends = API.users.get({"user_ids": ids, "fields": "${typical_fields}"});

                    return {"items": normal_friends, "count": friends.length};
                `
                
                wall_params = new_wall_params
                break
            case 'list':
                document.title = _('friends.friends_list')
                tabs_html = `
                    <a href="site_pages/friends.html?id=${id}&section=list" data-section='list' data-ignore='1' class="selectd">${_('friends.friends_list')}</a>
                `

                method = 'friends.get'
                wall_params.list_id = window.s_url.searchParams.get('section_id')
                break
        }

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper two_big_blocks_wrapper'>
                    <div>
                        ${tabs_html != '' ? `<div class='typical_tabs bordered_block'>
                            <div class='wall_wrapper_upper_panel friend_select_tab' id='insert_paginator_here_bro'>
                                <div class='tabs' ${section == 'search' ? `style='width: 60%;'` : ''}>${tabs_html}</div>
                            </div>
                        </div>` : ''}

                        <div class='friends_insert short_list bordered_block'></div>
                    </div>
                    <div class='wall_wrapper_tabs bordered_block'>
                        <div>
                            <a href='${us_info.getUrl()}' class='two_big_blocks_wrapper_user_info'>
                                <div>
                                    <img class='avatar' src='${us_info.getAvatar()}'>
                                </div>

                                <div class='two_big_blocks_wrapper_user_info_name'>
                                    <b>${cut_string(us_info.getName(), 15)}</b>
                                    <span>${_('user_page.go_to_user_page')}</span>
                                </div>
                            </a>

                            ${is_this ? `
                                <a href='site_pages/friends.html?section=all' ${section == 'all' || section == 'online' ? 'class=\'selectd\'' : ''}>${_(`friends.all_friends`)}</a>
                                <a href='site_pages/friends.html?section=search' ${section == 'search' ? 'class=\'selectd\'' : ''}>${_(`friends.search_friends`)}</a>
                                <a href='site_pages/friends.html?section=incoming' ${section == 'incoming' || section == 'outcoming' ? 'class=\'selectd\'' : ''}>${_(`friends.friends_requests`)}</a>
                                <a href='site_pages/friends.html?section=suggests' ${section == 'suggests' ? 'class=\'selectd\'' : ''}>${_(`friends.recomended_friends`)}</a>
                                <a href='site_pages/friends.html?section=cleanup' ${section == 'cleanup' ? 'class=\'selectd\'' : ''}>${_(`friends.cleanup_friends`)}</a>
                                <a href='site_pages/friends.html?id=${id}&section=followers' ${section == 'followers' ? 'class=\'selectd\'' : ''}>${_(`friends.followers`)}</a>
                            ` : `
                            <a href='site_pages/friends.html?id=${id}&section=all' ${section == 'all' || section == 'online' || section == 'mutual' ? 'class=\'selectd\'' : ''}>${_(`friends.users_friends`)}</a>
                            <a href='site_pages/friends.html?id=${id}&section=search' ${section == 'search' ? 'class=\'selectd\'' : ''}>${_(`friends.search_friends`)}</a>
                            <a href='site_pages/friends.html?id=${id}&section=followers' ${section == 'followers' ? 'class=\'selectd\'' : ''}>${_(`friends.followers`)}</a>
                            `}
                            
                            <div class='wall_wrapper_newsfeed_params' style='display:none;'>
                                <span>${_('friends.friends_lists')}</span>
                            </div>
                            <div id='__insertlists'></div>
                        </div>
                    </div>
                </div>
            `
        )

        let tab_dom = $(`.typical_tabs a[data-section='${section}']`)

        tab_dom.addClass('selectd')
        
        window.main_classes['wall'] = new ClassicListView(UserListView, '.friends_insert')
        window.main_classes['wall'].setParams(method, wall_params)
        window.main_classes['wall'].clear()
            
        if(window.s_url.searchParams.has('page')) {
            window.main_classes['wall'].objects.page = Number(window.s_url.searchParams.get('page')) - 1
        }

        let val = await window.main_classes['wall'].nextPage()

        if(tab_dom[0]) {
            tab_dom[0].innerHTML = tab_dom[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
        }

        if(val == 'ERR') {
            if(method == 'friends.getFriendsDeletionSuggestions') {
                return
            }
            
            add_onpage_error(_('errors.friends_not_found', id))
            return
        } else {
            $('.friend_select_tab')[0].insertAdjacentHTML('beforeend', paginator_template(window.main_classes['wall'].objects.pagesCount, (Number(window.s_url.searchParams.get('page') ?? 1))))
        }

        let friends_lists = await window.vk_api.call('friends.getLists', {'user_id': id}, false)
        friends_lists = friends_lists.response

        if(friends_lists.count > 0) {
            $('.wall_wrapper_newsfeed_params')[0].style.display = 'block'

            friends_lists.items.forEach(list => {
                $('#__insertlists')[0].insertAdjacentHTML('beforeend', 
                    `
                    <a href='site_pages/friends.html?id=${id}&section=list&section_id=${list.id}' ${Number(window.s_url.searchParams.get('section_id')) == list.id ? 'class=\'selectd\'' : ''}>${list.name}</a>
                    `
                )
            })
        }

    }
}
