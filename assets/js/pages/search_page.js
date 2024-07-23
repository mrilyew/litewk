window.page_class = new class {
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
                <a href='#search/${el}?query=${window.main_url.getParam('query') ?? ''}' ${section == el ? 'class=\'selected\'' : ''}>${_(`search.search_${el}_section`)}</a>
            `
        })

        switch(section) {
            default:
                if(window.site_params.get('internal.use_execute', '1') == '0') {
                    SearchClass = UserListView
                    method = 'users.search'
                    method_params.q = window.main_url.getParam('query') ?? ''

                    break
                }

                method = 'execute'
                method_params.code = `
                    var user_results = API.users.search({"q": "${window.main_url.getParam('query') ?? ''}", "count": 5, "fields": "${window.Utils.typical_fields}"});
                    var clubs_results = API.groups.search({"q": "${window.main_url.getParam('query') ?? ''}", "count": 5, "fields": "${window.Utils.typical_group_fields}"});
                    var videos_results = API.video.search({"q": "${window.main_url.getParam('query') ?? 'видео'}", "count": 5});
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
                method_params.q = window.main_url.getParam('query') ?? ''

                if(window.main_url.getParam('group_id')) {
                    method_params.group_id = window.main_url.getParam('group_id')
                }

                if(window.main_url.hasParam('sp_cityid')) {
                    method_params.city = window.main_url.getParam('sp_cityid')
                }

                if(window.main_url.hasParam('sp_age_from')) {
                    method_params.age_from = window.main_url.getParam('sp_age_from')
                }
                
                if(window.main_url.hasParam('sp_age_to')) {
                    method_params.age_to = window.main_url.getParam('sp_age_to')
                }
                                
                if(window.main_url.hasParam('sp_birth')) {
                    let splitted_date = window.main_url.getParam('sp_birth').split('-')

                    method_params.birth_year = splitted_date[0]
                    method_params.birth_month = splitted_date[1]
                    method_params.birth_day = splitted_date[2]
                }
                                                
                if(window.main_url.hasParam('sp_gender')) {
                    method_params.sex = window.main_url.getParam('sp_gender')
                }

                if(window.main_url.hasParam('sp_hometown')) {
                    method_params.hometown = window.main_url.getParam('sp_hometown')
                }
                
                if(window.main_url.hasParam('sp_has_photo')) {
                    method_params.has_photo = window.main_url.getParam('sp_has_photo')
                }
                                
                if(window.main_url.hasParam('sp_has_online')) {
                    method_params.online = window.main_url.getParam('sp_has_online')
                }
                                                
                if(window.main_url.hasParam('sp_sort')) {
                    method_params.sort = window.main_url.getParam('sp_sort')
                }
                                                                
                if(window.main_url.hasParam('sp_country')) {
                    method_params.country = window.main_url.getParam('sp_country')
                }
                                                                               
                if(window.main_url.hasParam('sp_university')) {
                    method_params.university = window.main_url.getParam('sp_university')
                }
                                                                                               
                if(window.main_url.hasParam('sp_relation')) {
                    method_params.status = window.main_url.getParam('sp_relation')
                }
                                                                                                               
                if(window.main_url.hasParam('sp_school')) {
                    method_params.school = window.main_url.getParam('sp_school')
                }
                                                                                                                               
                if(window.main_url.hasParam('sp_religion')) {
                    method_params.religion = window.main_url.getParam('sp_religion')
                }

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

                params_html = `
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_city')}</b>
                        <input type='text' value='${window.main_url.getParam('sp_cityid') ?? ''}' data-setname='cityid' placeholder='${_('search.search_params_user_city_id')}'>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_sort')}</b>
                        <select data-setname='sort'>
                            <option value='0' ${window.main_url.getParam('sp_sort') != '1' ? 'selected' : ''}>${_('search.search_params_user_sort_popularity')}</option>
                            <option value='1' ${window.main_url.getParam('sp_sort') == '1' ? 'selected' : ''}>${_('search.search_params_user_sort_regdate')}</option>
                        </select>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_relation')}</b>
                        <select data-setname='relation'>
                            <option value='0' ${window.main_url.getParam('sp_relation', '0') == '0' ? 'selected' : ''}>${_('relation.not_picked_small')}</option>
                            <option value='1' ${window.main_url.getParam('sp_relation', '0') == '1' ? 'selected' : ''}>${_('relation.single')}</option>
                            <option value='2' ${window.main_url.getParam('sp_relation', '0') == '2' ? 'selected' : ''}>${_('relation.meets')}</option>
                            <option value='3' ${window.main_url.getParam('sp_relation', '0') == '3' ? 'selected' : ''}>${_('relation.engaged')}</option>
                            <option value='4' ${window.main_url.getParam('sp_relation', '0') == '4' ? 'selected' : ''}>${_('relation.married')}</option>
                            <option value='5' ${window.main_url.getParam('sp_relation', '0') == '5' ? 'selected' : ''}>${_('relation.complicated')}</option>
                            <option value='6' ${window.main_url.getParam('sp_relation', '0') == '6' ? 'selected' : ''}>${_('relation.active')}</option>
                            <option value='7' ${window.main_url.getParam('sp_relation', '0') == '7' ? 'selected' : ''}>${_('relation.inlove')}</option>
                        </select>
                    </div>
                    <div class='search_param ager'>
                        <b class='nobold'>${_('search.search_params_user_age')}</b>

                        <div class='flex_row' style='gap: 6px;'>
                            <input type='text' value='${window.main_url.getParam('sp_age_from') ?? ''}' data-setname='age_from' placeholder='${_('search.search_params_user_from')}'>
                            <input type='text' value='${window.main_url.getParam('sp_age_to') ?? ''}' data-setname='age_to' placeholder='${_('search.search_params_user_to')}'>
                        </div>
                    </div>
                    <div class='search_param ager'>
                        <b class='nobold'>${_('search.search_params_user_birthday')}</b>

                        <input type='date' value='${window.main_url.getParam('sp_birth') ?? ''}' data-setname='birth'>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_gender')}</b>

                        <label>
                            <input type='radio' value='0' name='sp_gender' ${window.main_url.getParam('sp_gender') == 0 || !window.main_url.hasParam('sp_gender') ? 'checked' : ''} data-setname='gender'>
                            ${_('search.search_params_user_gender_any')}
                        </label>

                        <label>
                            <input type='radio' value='2' name='sp_gender' ${window.main_url.getParam('sp_gender') == 2 ? 'checked' : ''} data-setname='gender'>
                            ${_('search.search_params_user_gender_male')}
                        </label>

                        <label>
                            <input type='radio' value='1' name='sp_gender' ${window.main_url.getParam('sp_gender') == 1 ? 'checked' : ''} data-setname='gender'>
                            ${_('search.search_params_user_gender_female')}
                        </label>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_hometown')}</b>

                        <input type='text' placeholder='${_('search.search_params_user_hometown')}' value='${window.main_url.hasParam('sp_hometown') ? window.main_url.getParam('sp_hometown') : ''}' data-setname='hometown'>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_user_additional')}</b>

                        <div>
                            <label>
                                <input type='checkbox' value='1' ${window.main_url.getParam('sp_has_photo') == 1 ? 'checked' : ''} data-setname='has_photo'>
                                ${_('search.search_params_user_has_photo')}
                            </label>
                            <label>
                                <input type='checkbox' value='1' ${window.main_url.getParam('sp_has_online') == 1 ? 'checked' : ''} data-setname='has_online'>
                                ${_('search.search_params_user_has_online')}
                            </label>
                        </div>
                    </div>
                `

                break
            case 'groups':
                SearchClass = ClubListView
                method = 'groups.search'
                method_params.q = window.main_url.getParam('query') ?? ''

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
                method_params.q = window.main_url.getParam('query') ?? ''
                            
                if(window.main_url.hasParam('sp_attachment')) {
                    switch(window.main_url.getParam('sp_attachment')) {
                        default:
                            break
                        case '1':
                            method_params.q += ' has:photo'
                            break
                        case '2':
                            method_params.q += ' has:video'
                            break
                        case '3':
                            method_params.q += ' has:audio'
                            break
                        case '4':
                            method_params.q += ' has:graffiti'
                            break
                        case '5':
                            method_params.q += ' has:note'
                            break
                        case '6':
                            method_params.q += ' has:poll'
                            break
                        case '7':
                            method_params.q += ' has:link'
                            break
                        case '8':
                            method_params.q += ' has:doc'
                            break
                        case '9':
                            method_params.q += ' has:album'
                            break
                        case '10':
                            method_params.q += ' has:article'
                            break
                        case '12':
                            method_params.q += ' has:page'
                            break
                        case '11':
                            method_params.q += ' has:none'
                            break
                    }
                }

                if(window.main_url.hasParam('sp_type')) {
                    switch(window.main_url.getParam('sp_type')) {
                        default:
                            break
                        case 'copy':
                            method_params.q += ' type:copy'
                            break
                    }
                }

                if(window.main_url.hasParam('sp_link')) {
                    method_params.q += ' url:' + window.main_url.getParam('sp_link')
                }
                
                if(window.main_url.hasParam('sp_exclude')) {
                    let words = window.main_url.getParam('sp_exclude').split(' ')

                    words.forEach(word => {
                        method_params.q += ' -' + word
                    })
                }
                                
                if(window.main_url.hasParam('sp_likes')) {
                    if(parseInt(window.main_url.getParam('sp_likes')) > 0) {
                        method_params.q += ' likes:' + window.main_url.getParam('sp_likes')
                    }
                }

                if(window.main_url.hasParam('sp_show_trash')) {
                    if(window.main_url.getParam('sp_show_trash') == '1') {
                        method_params.q += ' rate:10'
                    }
                }

                params_html = `
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_posts_type')}</b>
                        <select data-setname='type'>
                            <option value='none' ${window.main_url.getParam('sp_type', 'none') == 'none' ? 'selected' : ''}>${_('search.search_params_posts_type_none')}</option>
                            <option value='copy' ${window.main_url.getParam('sp_type', 'none') == 'copy' ? 'selected' : ''}>${_('search.search_params_posts_type_copies')}</option>
                        </select>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_posts_attachments')}</b>
                        <select data-setname='attachment'>
                            <option value='0' ${window.main_url.getParam('sp_attachment', '0') == '0' ? 'selected' : ''}>${_('search.search_params_posts_attachments_not_select')}</option>
                            <option value='1' ${window.main_url.getParam('sp_attachment', '0') == '1' ? 'selected' : ''}>${_('search.search_params_posts_attachments_photo')}</option>
                            <option value='2' ${window.main_url.getParam('sp_attachment', '0') == '2' ? 'selected' : ''}>${_('search.search_params_posts_attachments_video')}</option>
                            <option value='3' ${window.main_url.getParam('sp_attachment', '0') == '3' ? 'selected' : ''}>${_('search.search_params_posts_attachments_audio')}</option>
                            <option value='4' ${window.main_url.getParam('sp_attachment', '0') == '4' ? 'selected' : ''}>${_('search.search_params_posts_attachments_graffiti')}</option>
                            <option value='5' ${window.main_url.getParam('sp_attachment', '0') == '5' ? 'selected' : ''}>${_('search.search_params_posts_attachments_note')}</option>
                            <option value='6' ${window.main_url.getParam('sp_attachment', '0') == '6' ? 'selected' : ''}>${_('search.search_params_posts_attachments_poll')}</option>
                            <option value='7' ${window.main_url.getParam('sp_attachment', '0') == '7' ? 'selected' : ''}>${_('search.search_params_posts_attachments_link')}</option>
                            <option value='8' ${window.main_url.getParam('sp_attachment', '0') == '8' ? 'selected' : ''}>${_('search.search_params_posts_attachments_file')}</option>
                            <option value='9' ${window.main_url.getParam('sp_attachment', '0') == '9' ? 'selected' : ''}>${_('search.search_params_posts_attachments_album')}</option>
                            <option value='10' ${window.main_url.getParam('sp_attachment', '0') == '10' ? 'selected' : ''}>${_('search.search_params_posts_attachments_article')}</option>
                            <option value='12' ${window.main_url.getParam('sp_attachment', '0') == '12' ? 'selected' : ''}>${_('search.search_params_posts_attachments_wikipage')}</option>
                            <option value='11' ${window.main_url.getParam('sp_attachment', '0') == '11' ? 'selected' : ''}>${_('search.search_params_posts_attachments_none')}</option>
                        </select>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_posts_link')}</b>
                        <input type='text' placeholder='${_('search.search_params_posts_link')}' data-setname='link' value='${window.main_url.getParam('sp_link', '')}'>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_posts_exclude')}</b>
                        <input type='text' placeholder='${_('search.search_params_posts_exclude')}' data-setname='exclude' value='${window.main_url.getParam('sp_exclude', '')}'>
                    </div>
                    <div class='search_param'>
                        <b class='nobold'>${_('search.search_params_posts_likes')}</b>
                        <select data-setname='likes'>
                            <option value='0' ${!window.main_url.hasParam('sp_likes', '0') ? 'selected' : ''}>${_('search.search_params_posts_likes_any')}</option>
                            <option value='10' ${window.main_url.getParam('sp_likes', '0') == '10' ? 'selected' : ''}>${_('search.search_params_posts_likes_not_lesser', 10)}</option>
                            <option value='100' ${window.main_url.getParam('sp_likes', '0') == '100' ? 'selected' : ''}>${_('search.search_params_posts_likes_not_lesser', 100)}</option>
                            <option value='1000' ${window.main_url.getParam('sp_likes', '0') == '1000' ? 'selected' : ''}>${_('search.search_params_posts_likes_not_lesser', 1000)}</option>
                        </select>

                        <label>
                            <input type='checkbox' value='1' ${window.main_url.getParam('sp_show_trash') == 1 ? 'checked' : ''} data-setname='show_trash'>
                            ${_('search.search_params_posts_show_trash')}
                        </label>
                    </div>
                `

                break
            case 'audios':
                SearchClass = Audio
                method = 'audio.search'
                method_params.q = window.main_url.getParam('query') ?? ''
                break
            case 'videos':
                SearchClass = VideoListView
                method = 'video.search'
                method_params.q = window.main_url.getParam('query') ?? ''
                break
            case 'photos':
                SearchClass = PhotoListView
                method = 'photos.search'
                method_params.q = window.main_url.getParam('query') ?? ''
                break
            case 'docs':
                SearchClass = Doc
                method = 'docs.search'
                method_params.return_tags = 1
                method_params.q = window.main_url.getParam('query') ?? ''

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

        $('.page_content')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='default_wrapper layer_two_columns'>
                    <div>
                        ${tabs_html}

                        <div class='flex_row flex_row_sticky flex_nowrap' id='_global_search' style='margin-bottom: 10px;'>
                            <input type='text' placeholder='${_('search.search')}' value='${window.main_url.getParam('query') ?? ''}'>
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
                            <div class='search_params'>
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

            let tab_dom = $(`.layer_two_columns_up_panel a[data-section='${section}']`)
            if(tab_dom[0] && method != 'newsfeed.search') {
                tab_dom[0].innerHTML = tab_dom[0].innerHTML + ` (${window.main_classes['wall'].objects.count})`
            }

            $('#insert_paginator_here_bro')[0].insertAdjacentHTML('beforeend', window.templates.paginator(window.main_classes['wall'].objects.pagesCount, (Number(window.main_url.getParam('page') ?? 1))))
        } else {
            let results = await window.vk_api.call(method, method_params, false)
            results = results.response

            if(results.users.count > 0) {
                $('#_global_users h4')[0].innerHTML += ` (${results.users.count})`
            } else {
                $('#_global_users').remove()
            }
            
            if(results.clubs.count > 0) {
                $('#_global_groups h4')[0].innerHTML += ` (${results.clubs.count})`
            } else {
                $('#_global_groups').remove()
            }

            if(results.videos.count > 0) {
                $('#_global_videos h4')[0].innerHTML += ` (${results.videos.count})`
            } else {
                $('#_global_videos').remove()
            }

            results.users.items.forEach(user => {
                let ob_j = new UserListView
                ob_j.hydrate(user)

                $('#_global_users ._global_search_insert')[0].insertAdjacentHTML('beforeend', ob_j.getTemplate())
            })

            results.clubs.items.forEach(club => {
                let ob_j = new ClubListView
                ob_j.hydrate(club)

                $('#_global_groups ._global_search_insert')[0].insertAdjacentHTML('beforeend', ob_j.getTemplate())
            })

            results.videos.items.forEach(vid => {
                let ob_j = new VideoListView
                ob_j.hydrate(vid)

                $('#_global_videos ._global_search_insert')[0].insertAdjacentHTML('beforeend', ob_j.getTemplate())
            })
        }
    }
}
