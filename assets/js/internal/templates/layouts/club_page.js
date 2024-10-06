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
        <input id='clb_id' type='hidden' data-clubid='${club.getId()}' value='${club.getId()}'>
        <div class='club_page_wrapper entity_page_wrapper default_wrapper'>
            ${club.hasCover() && window.settings_manager.getItem('ui.cover_upper').isEqual('0') ? window.templates.entity_page_cover_upper(club) : ''}

            <div class='club_page_grid'>
                <div class='left_block cover_upper' id='_bigger_block'>
                    ${club.hasCover() && window.settings_manager.getItem('ui.cover_upper').isEqual('1') ? `<div class='entity_page_cover'>
                        <picture>
                            <source srcset="${club.getCoverURL(1)}" media="(min-width: 1920px)" />
                            <source srcset="${club.getCoverURL(2)}" media="(min-width: 700px)" />
                            <source srcset="${club.getCoverURL(4)}" media="(min-width: 300px)" />
                            <source srcset="${club.getCoverURL(3)}" media="(min-width: 100px)" />
                            <img src='${club.getCoverURL(1)}'>
                        </picture>
                    </div>` : ''}
                    <div class='info_block flex flex_column gap_5 padding_small bordered_block'>
                        ${club.hasCover() && window.settings_manager.getItem('ui.cover_upper').isEqual('4') ? `
                            <style>
                                .background_fixed {
                                    background-image: url(${club.getCoverURL()});
                                    display: block;
                                }
                        
                                ${window.consts.CSS_FOCUS_NAVIGATION}
                            </style>
                        ` : ''}

                        <div class='common_info'>
                            <div class='common_info_with_online'>
                                <div class='common_info_with_online_name'>
                                    <span class='entity_name${club.isSubscribed() ? ' subbed' : ''}'>${club.getName()}</span>

                                    ${club.isVerified() ? `
                                        <svg class='verified_mark' viewBox="0 0 12 9.5"><polygon points="1.5 4 4 6.5 10.5 0 12 1.5 4 9.5 0 5.5 1.5 4"/></svg>
                                    ` : ''}
                                </div>
                            </div>

                            <div id='status_block'>
                                <span>${club.getTextStatus()}</span>
                            </div>
                        </div>

                        <div class='flex flex_column additional_info'>
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

                            ${club.has('counters') ? `<div class='additional_info_block marginic'>
                                <div class='additional_info_block_counters'>
                                    ${club.has('counters') && club.info.counters.audios ? `
                                        <a href='#audios${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.audios}</b>
                                            <span>${_('counters.audios_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.albums ? `
                                        <a href='#albums${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.albums}</b>
                                            <span>${_('counters.albums_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.articles ? `
                                        <a href='#articles${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.articles}</b>
                                            <span>${_('counters.articles_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.clips ? `
                                        <a href='#clips${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.clips}</b>
                                            <span>${_('counters.clips_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.docs ? `
                                        <a href='#docs${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.docs}</b>
                                            <span>${_('counters.docs_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.photos ? `
                                        <a href='#albums${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.photos}</b>
                                            <span>${_('counters.photos_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.topics ? `
                                        <a href='#albums${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.topics}</b>
                                            <span>${_('counters.topics_count')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('counters') && club.info.counters.videos ? `
                                        <a href='#videos${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.counters.videos}</b>
                                            <span>${_('counters.videos')}</span>
                                        </a>
                                    ` : ''}
                                    ${club.has('members_count') && club.info.members_count ? `
                                        <a href='#search/users?group_id=${club.getRealId()}' data-back='id${club.getId()}'>
                                            <b>${club.info.members_count}</b>
                                            <span>${_('counters.followers_count')}</span>
                                        </a>
                                    ` : ''}
                                </div>
                            </div>` : ''}
                        </div>
                    </div>
                    <div class='entity_row bordered_block padding_small hidden' id='_similar_groups_block'>
                        <div class='entity_row_title'>
                            <b>${_('groups.similar_groups')}</b>
                        </div>

                        <div class='filler' style='height: 80px;'></div>
                        <div class='entity_items'></div>
                    </div>

                    ${window.templates.group_board_block(club.info.board, _('groups.topics'), '#board' + club.getId(), club.getId())}
                    ${window.templates.photo_status(club.info.main_photos)}

                    <div class='wall_inserter'></div>
                </div>
                    
                <div class='right_block' id='_smaller_block'>
                    <div class='bordered_block padding_small'>
                        <img class='avatar main_avatar photo_viewer_open clickable' src='${club.getAvatar()}' data-full='${club.info.photo_max_orig}' alt='${_('user_page.user_avatar')}'>
                        <div class='entity_actions' id='_actions'>
                            ${window.templates._club_page_buttons(club)}
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
        ${window.settings_manager.getItem('ui.cover_upper').isEqual('0') ? `<div class='entity_page_cover filler skeleton_cover'></div>` : ''}
        <div class='club_page_grid'>
            <div class='left_block cover_upper'>
                ${window.settings_manager.getItem('ui.cover_upper').isEqual('1') ? `<div class='filler skeleton_cover'></div>` : ''}
                
                <div class="info_block filler bordered_block ${window.site_params.get('ui.cover_upper', '0') == '2' ? 'covered' : ''}">
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
                    <div class='filler skeleton_avatar' style='height: 215px;'></div>
                </div>

                <div class='entity_row bordered_block'>
                    <div class='filler' style='height: 215px;'></div>
                </div>
                <div class='entity_row bordered_block'>
                    <div class='filler' style='height: 100px;'></div>
                    <div class='filler' style='height: 100px;margin-top: 5px;'></div>
                </div>
                <div class='entity_row bordered_block'>
                    <div class='entity_row_title'></div>

                    <div class='filler' style='height: 100px;'></div>
                    <div class='filler' style='height: 100px;margin-top: 3px;'></div>
                </div>
                <div class='entity_row bordered_block'>
                    <div class='filler' style='height: 100px;'></div>
                </div>
            </div>
        </div>
    </div>`
}

window.templates.club_page_carousel = (club) => {
    return `
    <div class='carousel_entity_item'>
        <div class='carousel_entity_item_content'>
            <img src='${club.getAvatar()}'>

            <div class='carousel_entity_item_content_name'>
                <a href='${club.getUrl()}'>${club.getName()}</a>
                <span>${club.getActivity()}</span>
            </div>
        </div>
    </div>
    `
}
