if(!window.templates) {
    window.templates = {}
}

window.templates.club_page = (club) => {
    let history_html = ''

    if(club.info.history) {
        club.info.history.items.forEach(item => {
            let hist_item = new GroupHistoryItem(item)
    
            history_html += hist_item.getHTML()
        })
    }

    let template = `
        <input id='clb_id' type='hidden' value='${club.getId()}'>
        <div class='club_page_wrapper entity_page_wrapper default_wrapper'>
            ${club.hasCover() && window.site_params.get('ui.cover_upper', '0') == '0' ? `
                <div class='entity_page_cover'>
                    <picture>
                        <source srcset="${club.getCoverURL(3)}" media="(min-width: 1920px)" />
                        <source srcset="${club.getCoverURL(4)}" media="(min-width: 700px)" />
                        <source srcset="${club.getCoverURL(2)}" media="(min-width: 300px)" />
                        <source srcset="${club.getCoverURL(1)}" media="(min-width: 100px)" />
                        <img src='${club.getCoverURL(3)}'>
                    </picture>
                </div>
            ` : ''}

            <div class='club_page_grid'>
                <div class='left_block cover_upper' id='_bigger_block'>
                    ${club.hasCover() && window.site_params.get('ui.cover_upper', '0') == '1' ? `<div class='entity_page_cover'>
                        <picture>
                            <source srcset="${club.getCoverURL(1)}" media="(min-width: 1920px)" />
                            <source srcset="${club.getCoverURL(2)}" media="(min-width: 700px)" />
                            <source srcset="${club.getCoverURL(4)}" media="(min-width: 300px)" />
                            <source srcset="${club.getCoverURL(3)}" media="(min-width: 100px)" />
                            <img src='${club.getCoverURL(1)}'>
                        </picture>
                    </div>` : ''}
                    <div class='info_block bordered_block ${club.hasCover() && window.site_params.get('ui.cover_upper', '0') == '2' ? 'covered' : ''}'>
                        ${club.hasCover() && window.site_params.get('ui.cover_upper', '0') == '2' ? `
                            <div class='cover_bg' style='background-image: url(${club.getCoverURL()});'></div>
                        ` : ''}

                        ${club.hasCover() && window.site_params.get('ui.cover_upper', '0') == '4' ? `
                            <style>
                                .background_fixed {
                                    background-image: url(${club.getCoverURL()});
                                    display: block;
                                }
                        
                                ${window.consts.CSS_FOCUS_NAVIGATION}
                            </style>
                        ` : ''}

                        <div class='common_info'>
                            <div id="name_block">
                                <span id='name' class='entity_name'>${club.getName()}</span>
                            </div>
                        </div>

                        <div id='status_block'>
                            <span>${club.getTextStatus()}</span>
                        </div>

                        <div class='additional_info'>
                            <div class='additional_info_block'>
                                <div class='additional_info_block_cover'>
                                    <b class='title'>${_('groups.main_info')}</b>
                                    <hr class='hidden_line'>
                                </div>

                                <div class='table'>
                                    ${club.has('description') ? `
                                    <div class='table_element'>
                                        <span>${_('groups.description')}</span>
                                        <div class='table_element_value'>
                                            <span>${club.getDescription(0, true)}</span>
                                        </div>
                                    </div>` : ''}
                                    ${club.info.age_limits != 1 ? `
                                    <div class='table_element'>
                                        <span>${_('groups.age_limits')}</span>
                                        <div class='table_element_value'>
                                            <span>${club.getAgeLimits()}</span>
                                        </div>
                                    </div>` : ''}
                                    <div class='table_element'>
                                        <span>ID</span>
                                        <div class='table_element_value'>
                                            <span>${club.getId()}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.page_link')}</span>
                                        <div class='table_element_value'>
                                            <span>${club.getDomain()}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.has_verification')}</span>

                                        <div class='table_element_value'>
                                            <span>${club.isVerified() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('groups.is_closed')}</span>

                                        <div class='table_element_value'>
                                            <span>${club.isClosed() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                    ${club.has('activity') ? `
                                    <div class='table_element'>
                                        <span>${_('groups.activity')}</span>

                                        <div class='table_element_value'>
                                            <span>${club.getActivity()}</span>
                                        </div>
                                    </div>` : ''}
                                    ${club.has('country') ? `
                                    <div class='table_element'>
                                        <span>${_('user_page.city')}</span>

                                        <div class='table_element_value'>
                                            <span>${club.getCity()}</span>
                                        </div>
                                    </div>` : ''}
                                </div>
                            </div>

                            ${club.hasHistory() ? `<div class='show_hidden_info_block' id='_show_hidden_history'>
                                ${_('groups.show_history_block')}
                            </div>

                            <div class='additional_info_block_hidden_default'>
                                <div class='club_history'>
                                    ${history_html}
                                </div>
                            </div>` : ''}

                            ${club.has('counters') ? `<div class='additional_info_block'>
                                <div class='additional_info_block_cover'>
                                    <b class='title'>${_('user_page.counters')}</b>
                                    <hr class='hidden_line'>
                                </div>

                                <div id='_counters'>
                                    ${club.has('counters') && club.info.counters.albums ? `<a href='#' data-back='club${club.getId()}'>${_('counters.albums_count', club.info.counters.albums)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.articles ? `<a href='#' data-back='club${club.getId()}'>${_('counters.articles_count', club.info.counters.articles)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.clips ? `<a href='#' data-back='club${club.getId()}'>${_('counters.clips_count', club.info.counters.clips)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.docs ? `<a href='#docs-${club.getId()}' data-back='club${club.getId()}'>${_('counters.docs_count', club.info.counters.docs)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.photos ? `<a href='#' data-back='club${club.getId()}'>${_('counters.photos_count', club.info.counters.photos)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.topics ? `<a href='#' data-back='club${club.getId()}'>${_('counters.topics_count', club.info.counters.topics)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.video_playlists ? `<a href='#' data-back='club${club.getId()}'>${_('counters.video_playlists_count', club.info.counters.video_playlists)}</a>` : ''}
                                    ${club.has('counters') && club.info.counters.videos ? `<a href='#' data-back='club${club.getId()}'>${_('counters.added_videos_count', club.info.counters.videos)}</a>` : ''}
                                    ${club.has('members_count') && club.info.members_count ? `<a href='#search/users?group_id=${club.getId()}' data-back='club${club.getId()}'>${_('counters.followers_count', club.info.members_count)}</a>` : ''}
                                </div>
                            </div>` : ''}
                        </div>
                    </div>

                    ${window.templates.group_board_block(club.info.board, _('groups.topics'), '#board' + club.getId(), club.getId())}
                    ${window.templates.photo_status(club.info.main_photos)}

                    <div class='wall_inserter'></div>
                </div>
                    
                <div class='right_block' id='_smaller_block'>
                    <div class='bordered_block'>
                        <object id='avatar_img' type="image/jpeg" class='photo_viewer_open outliner' data-full='${club.info.photo_max_orig}' data='${club.getAvatar()}' alt='${_('user_page.user_avatar')}'></object>
                        <div id='_actions'>
                            ${club.isClosed() == 0 ? `
                                ${!club.isMember() ? `<a class='action' id='_toggleSub' data-val='0' data-addid='${club.getId()}'> ${_('groups.subscribe')}</a>` : ''}
                                ${club.isMember() ? `<a class='action' id='_toggleSub' data-val='1' data-addid='${club.getId()}'> ${_('groups.unsubscribe')}</a>` : ''}
                            ` : ``}
                            ${!club.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='club' data-addid='${club.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
                            ${club.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='club' data-addid='${club.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
                            ${!club.isClosed() && !club.isSubscribed() ? `<a class='action' id='_toggleSubscribe' data-val='0'> ${_('user_page.subscribe_to_new')}</a>` : ''}
                            ${!club.isClosed() && club.isSubscribed() ? `<a class='action' id='_toggleSubscribe' data-val='1'> ${_('user_page.unsubscribe_to_new')}</a>` : ''}
                            ${club.isMember() ? `
                                ${!club.isHiddenFromFeed() ? `<a class='action' id='_toggleHiddeness' data-val='0'> ${_('user_page.hide_from_feed')}</a>` : ''}
                                ${club.isHiddenFromFeed() ? `<a class='action' id='_toggleHiddeness' data-val='1'> ${_('user_page.unhide_from_feed')}</a>` : ''}
                            ` : ''}
                            <a class='action' href='https://vk.com/club${club.getId()}' target='_blank'> ${_('wall.go_to_vk')}</a>
                        </div>
                    </div>

                    <div style='margin-bottom: -8px;'>
                        ${window.templates.row_block(club.info.members_friends, _('groups.followers_friends'), '#followers' + club.getId() + '/friends')}
                    </div>

                    ${window.templates.row_block(club.info.members, _('groups.followers'), '#followers' + club.getId())}
                    ${window.templates.group_links(club.info.links, _('groups.links'), '#club' + club.getId() + '/links')}
                    ${window.templates.albums(club.info.albums, '#albums' + club.getId())}
                    ${window.templates.videos_block(club.info.videos, '#videos' + club.getId())}
                    ${window.templates.docs_block(club.info.docs, '#docs-' + club.getId(), 'club' + club.getId())}

                    ${window.templates.contacts_block(club.info.contacts, '#club' + club.getId() + '/contacts')}
                </div>
            </div>
        </div>
    `

    let club_template = document.createElement('div')
    club_template.innerHTML = template

    return club_template.innerHTML
}

window.templates.club_page_skeleton = () => {
    return `
    <div id='_skeleton' class='default_wrapper club_page_wrapper club_page_wrapper_skeleton entity_page_wrapper'>
        ${window.site_params.get('ui.cover_upper', '0') == '0' ? `<div class='entity_page_cover filler skeleton_cover'></div>` : ''}
        <div class='club_page_grid'>
            <div class='left_block cover_upper'>
                ${window.site_params.get('ui.cover_upper', '0') == '1' ? `<div class='filler skeleton_cover'></div>` : ''}
                
                <div class="info_block bordered_block ${window.site_params.get('ui.cover_upper', '0') == '2' ? 'covered' : ''}">
                    <div class='common_info'>
                        <div id="name_block">
                            <span id='name' class='entity_name'>${_('navigation.loading')}</span>
                        </div>

                        <span id='status_block'>
                            ...
                        </span>
                    </div>

                    <div class='empty_space' style='height: 24vh;'></div>
                </div>

                <div class='entity_row entity_photoblock bordered_block'>
                    <div id='entity_photoblock_insert'>
                        <div class='entity_photoblock_image filler'></div>
                        <div class='entity_photoblock_image filler'></div>
                        <div class='entity_photoblock_image filler'></div>
                        <div class='entity_photoblock_image filler'></div>
                        <div class='entity_photoblock_image filler'></div>
                        <div class='entity_photoblock_image filler'></div>
                    </div>
                </div>

                <div class='wall_block_insert'>
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                    ${window.templates.post_skeleton()}
                </div>
            </div>
            <div class='right_block'>
                <div class='bordered_block'>
                    <div class='filler skeleton_avatar'></div>

                    <div class='empty_space' style='height: 50px;'></div>
                </div>

                <div class='entity_row bordered_block'>
                    <div class='entity_row_title'>
                        <b>...</b>
                    </div>
                    
                    <div class='entity_row_grid'>
                        <div class='entity_row_insert_item entity_row_horizont'>
                            <div>
                                <div class='filler'></div>
                            </div>
            
                            <span>...</span>
                        </div>
                        <div class='entity_row_insert_item'>
                            <div>
                                <div class='filler'></div>
                            </div>
            
                            <span>...</span>
                        </div>
                        <div class='entity_row_insert_item'>
                            <div>
                                <div class='filler'></div>
                            </div>
            
                            <span>...</span>
                        </div>
                    </div>
                </div>
                <div class='entity_row bordered_block'>
                    <div class='entity_row_title'></div>
                    <div class='filler' style='height: 100px;'></div>
                    <div class='filler' style='height: 100px;margin-top: 3px;'></div>
                </div>
                <div class='entity_row bordered_block'>
                    <div class='entity_row_title'></div>

                    <div class='filler' style='height: 100px;'></div>
                    <div class='filler' style='height: 100px;margin-top: 3px;'></div>
                </div>
                <div class='entity_row bordered_block'>
                    <div id='entity_row_insert' class='entity_row_list'>
                        <div class='entity_row_insert_item'>
                            <a href='javascript:void(0)'>
                                <div class='filler'></div>
                            </a>
            
                            <div class='entity_row_insert_item_info'>
                                <a href='javascript:void(0)'>...</a>
                                <p>...</p>
                            </div>
                        </div>
                        <div class='entity_row_insert_item'>
                            <a href='javascript:void(0)'>
                                <div class='filler'></div>
                            </a>
            
                            <div class='entity_row_insert_item_info'>
                                <a href='javascript:void(0)'>...</a>
                                <p>...</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
}
