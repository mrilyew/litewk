window.pages['search_page'] = new class {
    async render_page() {
        document.title = _('search.search')
          
        let section = window.main_class['hash_params'].section ?? 'all'
        let method = 'users.search'
        let params_html = null
        let method_params = {'count': 10, 'extended': 1, 'fields': window.Utils.typical_group_fields + ',' + window.Utils.typical_fields}
        let SearchClass = null
        let sections_list = ``
        let tabs_html = ` 
        <div class='bordered_block layer_two_columns_up_panel' id='insert_paginator_here_bro'>
            <div class='tabs'>
                <a href='#search/${section}' class='selected' data-section='${section}'>${_('search.search')}</a>
            </div>
        </div>`
        let sections = ['all', 'users', 'groups', 'posts', 'photos', 'videos', 'audios', 'docs', /*'games'*/]
        sections.forEach(el => {
            if(el == 'divider') {
                sections_list += `
                    <hr>
                `
                
                return
            }

            sections_list += `
                <a href='#search/${el}?q=${window.main_url.getParam('q') ?? ''}' ${section == el ? 'class=\'selected\'' : ''}>${_(`search.search_${el}_section`)}</a>
            `
        })

        switch(section) {
            default:
                if(window.site_params.get('internal.use_execute', '1') == '0') {
                    SearchClass = UserListView
                    method = 'users.search'
                    method_params.q = window.main_url.getParam('q') ?? ''

                    break
                }

                method = 'execute'
                method_params.code = `
                    var user_results = API.users.search({"q": "${window.main_url.getParam('q') ?? ''}", "count": 5, "fields": "${window.Utils.typical_fields}"});
                    var clubs_results = API.groups.search({"q": "${window.main_url.getParam('q') ?? ''}", "count": 5, "fields": "${window.Utils.typical_group_fields}"});
                    var videos_results = API.video.search({"q": "${window.main_url.getParam('q') ?? 'видео'}", "count": 5});
                    return {
                        "users": user_results,
                        "clubs": clubs_results,
                        "videos": videos_results,
                    };
                `
                break
            case 'users':
                SearchClass = UserListView
                method = 'users.search'
                method_params.q = window.main_url.getParam('q') ?? ''

                if(window.main_url.getParam('group_id')) {
                    method_params.group_id = window.main_url.getParam('group_id')
                }

                method_params = Utils.applyUsersSearchParams(window.main_url, method_params)

                if(window.main_url.hasParam('from_list')) {
                    let us_info = new User
                    us_info.hydrate(window.active_account.info)

                    sections_list = `
                        <a href='${us_info.getUrl()}' class='layer_two_columns_tabs_user_info'>
                            <div>
                                <img class='avatar' src='${us_info.getAvatar()}'>
                            </div>

                            <div class='layer_two_columns_tabs_user_info_name'>
                                <b ${us_info.isFriend() ? `class='friended'` : ''}>${Utils.cut_string(us_info.getName(), 15)}</b>
                                <span>${_('user_page.go_to_user_page')}</span>
                            </div>
                        </a>
                        <a href='#friends/all'>${_(`friends.all_friends`)}</a>
                        <a href='#search/users?from_list=friends' ${window.main_url.getParam('from_list') == 'friends' ? 'class=\'selected\'' : ''}>${_(`friends.search_friends`)}</a>
                        <a href='#friends/incoming' ${window.main_url.getParam('from_list') == 'subscriptions' ? 'class=\'selected\'' : ''}>${_(`friends.friends_requests`)}</a>
                        <a href='#friends/suggests'>${_(`friends.recomended_friends`)}</a>
                        <a href='#friends/cleanup'>${_(`friends.cleanup_friends`)}</a>
                        <a href='#friends/followers'>${_(`friends.followers`)}</a>
                    `

                    if(window.main_url.getParam('from_list') == 'subscriptions') {
                        tabs_html = `
                        <div class='bordered_block layer_two_columns_up_panel' id='insert_paginator_here_bro'>
                            <div class='tabs'>
                                <a href='#friends/incoming'>${_('friends.incoming')}</a>
                                <a href='#search/users?from_list=subscriptions' data-section='${section}' class='selected'>${_('friends.outcoming')}</a>
                            </div>
                        </div>
                        `
                    }

                    method_params.from_list = window.main_url.getParam('from_list')
                }

                params_html = window.templates.search_users_params()

                break
            case 'groups':
                SearchClass = ClubListView
                method = 'groups.search'
                method_params.q = window.main_url.getParam('q') ?? ''

                if(window.main_url.hasParam('sp_type')) {
                    method_params.type = window.main_url.getParam('sp_type')
                }
                
                if(window.main_url.hasParam('sp_country')) {
                    method_params.country_id = window.main_url.getParam('sp_country')
                }
                                
                if(window.main_url.hasParam('sp_city')) {
                    method_params.city_id = window.main_url.getParam('sp_city')
                }
                                                
                if(window.main_url.hasParam('sp_future_event')) {
                    method_params.future = window.main_url.getParam('sp_future_event')
                }
                                                                
                if(window.main_url.hasParam('sp_unsafe')) {
                    method_params.safe = 0
                }
                                                                
                if(window.main_url.hasParam('sp_sort')) {
                    method_params.sort = window.main_url.getParam('sp_sort')
                }
                            
                if(window.main_url.hasParam('sp_subject')) {
                    method_params.category = window.main_url.getParam('sp_subject')
                }
                
                params_html = `
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_sort')}</b>
                        <select data-setname='sort'>
                            <option value='0' ${window.main_url.getParam('sp_sort', '0') == '0' ? 'selected' : ''}>${_('search.search_params_group_sort_relevant')}</option>
                            <option value='6' ${window.main_url.getParam('sp_sort', '0') == '6' ? 'selected' : ''}>${_('search.search_params_group_sort_subs')}</option>
                        </select>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_group_type')}</b>
                        <select data-setname='type'>
                            <option value='group' ${window.main_url.getParam('sp_type', 'group') == 'group' ? 'selected' : ''}>${_('search.search_params_group_type_group')}</option>
                            <option value='page' ${window.main_url.getParam('sp_type', 'group') == 'page' ? 'selected' : ''}>${_('search.search_params_group_type_page')}</option>
                            <option value='event' ${window.main_url.getParam('sp_type', 'group') == 'event' ? 'selected' : ''}>${_('search.search_params_group_type_event')}</option>
                        </select>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_city')}</b>
                        <input type='text' value='${window.main_url.getParam('sp_city') ?? ''}' data-setname='city' placeholder='${_('search.search_params_user_city_id')}'>
                    </div>

                    ${window.main_url.getParam('sp_type', 'group') == 'event' ? `
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_group_additional')}</b>
                        <label>
                            <input type='checkbox' value='1' ${window.main_url.getParam('sp_future_event') == 1 ? 'checked' : ''} data-setname='future_event'>
                            ${_('search.search_params_group_future')}
                        </label>
                    </div>
                    ` : ''}
                `

                break
            case 'posts':
                SearchClass = Post
                method = 'newsfeed.search'
                tabs_html = ''
                method_params.q = window.main_url.getParam('q') ?? ''
                method_params = Utils.applyPostsSearchParams(window.main_url, method_params)

                params_html = window.templates.search_posts_params(false)

                break
            case 'audios':
                SearchClass = Audio
                method = 'audio.search'
                method_params.q = window.main_url.getParam('q') ?? ''
                break
            case 'videos':
                SearchClass = VideoListView
                method = 'video.search'
                method_params.q = window.main_url.getParam('q') ?? ''
                break
            case 'photos':
                SearchClass = PhotoListView
                method = 'photos.search'
                method_params.q = window.main_url.getParam('q') ?? ''
                break
            case 'docs':
                SearchClass = Doc
                method = 'docs.search'
                method_params.return_tags = 1
                method_params.q = window.main_url.getParam('q') ?? ''

                if(window.main_url.hasParam('sp_my')) {
                    method_params.search_own = '1'
                }
                
                if(window.main_url.hasParam('sp_type')) {
                    let type = Number(window.main_url.getParam('sp_type'))

                    if(type > 0 && type < 9) {
                        method_params.type = type
                    }
                }
                                
                if(window.main_url.hasParam('sp_search_type')) {    
                    method_params.search_type = Number(window.main_url.getParam('sp_search_type'))
                }

                if(window.main_url.hasParam('sp_tags')) {    
                    method_params.tags = window.main_url.getParam('sp_tags')
                }

                params_html = `
                    <div class='search_param'>
                        <label>
                            <input type='checkbox' value='1' ${window.main_url.getParam('sp_search_type') == 1 ? 'checked' : ''} data-setname='search_type'>
                            ${_('search.search_params_docs_mine')}
                        </label>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_docs_type')}</b>
                        <select data-setname='type'>
                            <option value='0' ${window.main_url.getParam('sp_type', '0') == '0' ? 'selected' : ''}>${_('search.search_params_docs_type_none')}</option>
                            <option value='1' ${window.main_url.getParam('sp_type', '0') == '1' ? 'selected' : ''}>${_('docs.doc_type_text')}</option>
                            <option value='2' ${window.main_url.getParam('sp_type', '0') == '2' ? 'selected' : ''}>${_('docs.doc_type_archive')}</option>
                            <option value='3' ${window.main_url.getParam('sp_type', '0') == '3' ? 'selected' : ''}>${_('docs.doc_type_gif')}</option>
                            <option value='4' ${window.main_url.getParam('sp_type', '0') == '4' ? 'selected' : ''}>${_('docs.doc_type_image')}</option>
                            <option value='5' ${window.main_url.getParam('sp_type', '0') == '5' ? 'selected' : ''}>${_('docs.doc_type_audio')}</option>
                            <option value='6' ${window.main_url.getParam('sp_type', '0') == '6' ? 'selected' : ''}>${_('docs.doc_type_video')}</option>
                            <option value='7' ${window.main_url.getParam('sp_type', '0') == '7' ? 'selected' : ''}>${_('docs.doc_type_book')}</option>
                            <option value='8' ${window.main_url.getParam('sp_type', '0') == '8' ? 'selected' : ''}>${_('docs.doc_type_any')}</option>
                        </select>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_docs_tags')}</b>
                        <input type='text' data-setname='tags' value='${window.main_url.getParam('sp_tags', '')}' placeholder='${_('search.search_params_docs_tags_csv')}'>
                    </div>
                `
                break
        }

        document.title = _(`search.search_${section}_section`) + ' | ' + _('search.search')

        u('.page_content').html(`
                <div class='default_wrapper layer_two_columns'>
                    <div>
                        ${tabs_html}

                        <div class='flex_row flex_row_sticky flex_nowrap' id='_global_search' style='margin-bottom: 10px;'>
                            <input type='text' placeholder='${_('search.search')}' value='${window.main_url.getParam('q') ?? ''}'>
                            <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
                        </div>

                        <div class='search_insert bordered_block short_list'>
                            ${method == 'execute' ? 
                            ` 
                                <div id='_global_users'>
                                    <h4>${_('search.search_users_section')}</h4>
                                    <div class='_global_search_insert'></div>
                                </div>
                                <div id='_global_groups'>
                                    <h4>${_('search.search_groups_section')}</h4>
                                    <div class='_global_search_insert'></div>
                                </div>
                                <div id='_global_videos'>
                                    <h4>${_('search.search_videos_section')}</h4>
                                    <div class='_global_search_insert'></div>
                                </div>
                            ` : ''}
                        </div>
                    </div>
                    <div class='layer_two_columns_tabs bordered_block'>
                        <div>
                            ${sections_list}
                        </div>

                        ${params_html ? `<div class='layer_two_columns_params'>
                            <div class='search_params' id='_search_params_appender'>
                                ${params_html}
                            </div>
                        </div>` : ''}
                    </div>
                </div>
            `
        )

        if(method != 'execute') {
            if(method != 'newsfeed.search') {
                window.main_classes['wall'] = new Search(SearchClass, '.search_insert')
            } else {
                window.main_classes['wall'] = new Newsfeed('.search_insert')
            }
           
            window.main_classes['wall'].setParams(method, method_params)
            window.main_classes['wall'].clear()
                
            if(window.main_url.hasParam('page')) {
                window.main_classes['wall'].objects.page = Number(window.main_url.getParam('page')) - 1
            }
    
            await window.main_classes['wall'].nextPage()

            let tab_dom = u(`.layer_two_columns_up_panel a[data-section='${section}']`)
            if(tab_dom.nodes[0] && method != 'newsfeed.search') {
                tab_dom.nodes[0].innerHTML = tab_dom.nodes[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
            }

            u('#insert_paginator_here_bro').append(window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        } else {
            let results = await window.vk_api.call(method, method_params, false)
            results = results.response

            if(results.users.count > 0) {
                u('#_global_users h4').nodes[0].innerHTML += ` (${results.users.count})`
            } else {
                u('#_global_users').remove()
            }
            
            if(results.clubs.count > 0) {
                u('#_global_groups h4').nodes[0].innerHTML += ` (${results.clubs.count})`
            } else {
                u('#_global_groups').remove()
            }

            if(results.videos.count > 0) {
                u('#_global_videos h4').nodes[0].innerHTML += ` (${results.videos.count})`
            } else {
                u('#_global_videos').remove()
            }

            results.users.items.forEach(user => {
                let ob_j = new UserListView
                ob_j.hydrate(user)

                u('#_global_users ._global_search_insert').append(ob_j.getTemplate())
            })

            results.clubs.items.forEach(club => {
                let ob_j = new ClubListView
                ob_j.hydrate(club)

                u('#_global_groups ._global_search_insert').append(ob_j.getTemplate())
            })

            results.videos.items.forEach(vid => {
                let ob_j = new VideoListView
                ob_j.hydrate(vid)

                u('#_global_videos ._global_search_insert').append(ob_j.getTemplate())
            })
        }
    }
}
