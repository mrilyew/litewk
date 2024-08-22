if(!window.templates) {
    window.templates = {}
}

window.templates.user_page = (user) => {
    const template = `
        <input id='user_info' type='hidden' data-userid='${user.getId()}' value='${user.getId()}'>
        <div class='absolute_zone_wrapper default_wrapper user_page_wrapper entity_page_wrapper'>
            ${user.hasCover() && window.site_params.get('ui.cover_upper', '0') == '0' ? window.templates.entity_page_cover_upper(user) : ''}
            
            <div class='user_page_grid absolute_zone'>
                <div class='left_block' id='_smaller_block'>
                    <div class='bordered_block'>
                        <img id='avatar_img' class='photo_viewer_open outliner' src='${user.getAvatar()}' data-full='${user.info.photo_max_orig}' alt='${_('user_page.user_avatar')}'>
                        <div id='_actions'>
                            ${window.templates._user_page_buttons(user)}
                        </div>
                    </div>

                    ${window.templates.gifts_block(user.info.gifts, '#gifts' + user.getId())}
                    ${window.templates.row_block(user.info.friends, _('friends.friends'), '#friends' + user.getId())}
                    
                    <div class='friends_online_block'>
                        ${window.templates.row_block(user.info.friends_online, _('friends.friends_online'), '#friends' + user.getId() + '/online')}
                    </div>

                    ${window.templates.row_list_block(user.info.subscriptions, _('friends.subscriptions'), '#subscriptions' + user.getId())}
                    ${window.templates.albums(user.info.albums, '#albums' + user.getId())}
                    ${window.templates.videos_block(user.info.videos, '#videos' + user.getId())}
                </div>
                <div class='right_block cover_upper' id='_bigger_block'>
                    ${user.hasCover() && window.site_params.get('ui.cover_upper', '0') == '1' ? `<div class='entity_page_cover'>
                        <picture>
                            <source srcset="${user.getCoverURL(1)}" media="(min-width: 1920px)" />
                            <source srcset="${user.getCoverURL(2)}" media="(min-width: 700px)" />
                            <source srcset="${user.getCoverURL(4)}" media="(min-width: 300px)" />
                            <source srcset="${user.getCoverURL(3)}" media="(min-width: 100px)" />
                            <img src='${user.getCoverURL(1)}'>
                        </picture>
                    </div>` : ''}
                    <div class="info_block bordered_block ${user.hasCover() && window.site_params.get('ui.cover_upper', '0') == '2' ? 'covered' : ''}">
                        ${user.hasCover() && window.site_params.get('ui.cover_upper', '0') == '2' ? `
                            <div class='cover_bg' style='background-image: url(${user.getCoverURL()});'></div>
                        ` : ''}

                        ${user.hasCover() && window.site_params.get('ui.cover_upper', '0') == '4' ? `
                            <style>
                                .background_fixed {
                                    background-image: url(${user.getCoverURL()});
                                    display: block;
                                }
                        
                                ${window.consts.CSS_FOCUS_NAVIGATION}
                            </style>
                        ` : ''}
                        <div class='common_info'>
                            <div class='user_name_with_status'>
                                ${user.getHTMLName()}

                                <span id='status_block'>
                                    ${user.getTextStatus()}
                                </span>
                            </div>

                            ${user.isDead() ? `
                            <span class='dead_person_mark'>
                                ${_('user_page.page_of_deceased')}
                            </span>
                            ` : ``}

                            <span id='_last_online' ${user.isDead() ? `style='display:none'` : ''}>
                                ${user.getFullOnline()}
                            </span>
                        </div>

                        <div class='additional_info'>
                            <div class='additional_info_block'>
                                ${user.getTextStatus() != '' ?
                                `<div class='additional_info_block_cover'>
                                    <b class='title'>${_('user_page.personal_info')}</b>
                                    <hr class='hidden_line'>
                                </div>` : ''}

                                <div class='table'>
                                    ${user.has('sex') ? `
                                    <div class='table_element'>
                                        <span>${_('user_page.sex')}</span>

                                        <div class='table_element_value'>
                                            <span>${user.getSex()}</span>
                                        </div>
                                    </div>
                                    ` : ``}
                                    ${user.has('bdate') ? `
                                    <div class='table_element'>
                                        <span>${_('user_page.birthdate')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.getBdate()}</span>
                                        </div>
                                    </div>
                                    ` : ''}
                                    ${user.has('relation') ? `
                                    <div class='table_element'>
                                        <span>${_('user_page.marital_status')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.getRelationStatus()}</span>
                                        </div>
                                    </div>
                                    ` : ``}
                                    ${user.has('personal') && user.info.personal.langs ? 
                                    `
                                    <div class='table_element'>
                                        <span>${_('user_page.known_languages')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.getLangs()}</span>
                                        </div>
                                    </div>
                                    `
                                    : ``}
                                </div>
                            </div>
                            <div class='additional_info_block'>
                                <div class='additional_info_block_cover'>
                                    <b class='title'>${_('user_page.profile_info')}</b>
                                    <hr class='hidden_line'>
                                </div>

                                <div class='table'>
                                    <div class='table_element'>
                                        <span>ID</span>
                                        <div class='table_element_value'>
                                            <span>${user.getId()}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.page_link')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.getDomain()}</span>
                                        </div>
                                    </div>
                                    ${window.site_params.get('ux.show_reg', '0') == '1' ? 
                                    `<div class='table_element'>
                                        <span>${_('user_page.register_date')}</span>
                                        <div class='table_element_value'>
                                            <span id='__regdate'>--.--.----</span>
                                        </div>
                                    </div>` : ''}
                                    <div class='table_element'>
                                        <span>${_('user_page.has_verification')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.isVerified() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.has_verification_esia')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.isVerifiedInEsia() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.has_verification_phone')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.isPhoneVerified() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.has_indexing')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.isIndexing() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                    <div class='table_element'>
                                        <span>${_('user_page.is_closed')}</span>
                                        <div class='table_element_value'>
                                            <span>${user.isClosed() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ${user.hasContacts() || user.hasInterests() || user.has('career') || user.hasEducation() || user.hasRelatives() || user.hasMilitary() || user.hasPersonal() ? `<div class='show_hidden_info_block' id='_show_hidden_info_us'>
                                ${_('user_page.show_more_info')}
                            </div>` : ''}
                            <div class='additional_info_block_hidden_default'>
                                ${user.hasContacts() ? `<div class='additional_info_block'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.contacts')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div class='table'>
                                        ${user.has('country') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.country')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getCountry()}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('city') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.city')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getCity()}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('home_town') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.hometown')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getHometown()}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('mobile_phone') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.mobile_phone')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getMobile()}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('home_phone') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.additional_phone')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getHomephone()}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('skype') ? `
                                        <div class='table_element'>
                                            <span>Skype</span>
                                            <div class='table_element_value'>
                                                <a href='skype:${user.getSkype()}?call'>${user.getSkype()} </a>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('site') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.personal_site')}</span>
                                            <div class='table_element_value'>
                                                <a href=\'${user.getSite()}\'>${user.getSite()}</a>
                                            </div>
                                        </div>
                                        ` : ``}
                                    </div>
                                </div>` : ''}
                                ${user.hasInterests() ? `<div class='additional_info_block' id='_interestsBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.interests')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    
                                    <div class='table'>
                                        ${user.has('activities') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.activities')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('activities')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('interests') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.interests')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('interests')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('music') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.fav_music')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('music')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('movies') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.fav_films')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('movies')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('tv') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.fav_tv')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('tv')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('books') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.fav_books')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('books')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('games') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.fav_games')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('games')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.has('quotes') ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.fav_quotes')}</span>
                                            <div class='table_element_value'>
                                                <span>${user.getInterests('quotes')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                    </div>
                                </div>` : ''}
                                ${user.has('career') ? `<div class='additional_info_block' id='_carrerBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.career')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div class='insert_carerr' style='padding: 1px 3px 7px 3px;'></div>
                                </div>` : ''}
                                ${user.hasEducation() ? `<div class='additional_info_block' id='_carrerBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.education')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div id='insert_education' style='padding: 1px 3px 7px 3px;'>
                                        <div class='table'></div>
                                    </div>
                                </div>` : ''}
                                ${user.hasRelatives() ? `<div class='additional_info_block' id='_carrerBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.relatives')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div id='insert_relatives' style='padding: 1px 3px 7px 3px;'></div>
                                </div>` : ''}
                                ${user.hasMilitary() ? `<div class='additional_info_block' id='_carrerBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.military')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div id='insert_military' style='padding: 1px 3px 7px 3px;'>
                                        <div class='table'></div>
                                    </div>
                                </div>` : ''}
                                ${user.hasPersonal() ? `
                                <div class='additional_info_block' id='_lifeBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.life_position')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div class='table'>
                                        ${user.info.personal.political ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.political_views')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('political')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.info.personal.religion ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.worldview')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('religion')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.info.personal.life_main ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.main_in_life')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('life_main')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.info.personal.people_main ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.main_in_people')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('people_main')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.info.personal.smoking ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.attitude_towards_smoking')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('smoking')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.info.personal.alcohol ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.attitude_towards_alcohol')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('alcohol')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                        ${user.info.personal.inspired_by ? `
                                        <div class='table_element'>
                                            <span>${_('user_page.inspired_by')}</span>

                                            <div class='table_element_value'>
                                                <span>${user.getInterests('inspired_by')}</span>
                                            </div>
                                        </div>
                                        ` : ``}
                                    </div>
                                </div>` : ``}
                            </div>
                            <div class='additional_info_block'>
                                <div class='additional_info_block_cover'>
                                    <b class='title'>${_('user_page.counters')}</b>
                                    <hr class='hidden_line'>
                                </div>

                                <div id='_counters'>
                                    ${user.has('counters') && user.info.counters.albums ? `<a href='#' data-back='id${user.getId()}'>${_('counters.albums_count', user.info.counters.albums)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.audios ? `<a href='#' data-back='id${user.getId()}'>${_('counters.audios_count', user.info.counters.audios)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.badges ? `<a href='#' data-back='id${user.getId()}'>${_('counters.badges_count', user.info.counters.badges)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.friends ? `<a href='#friends${user.getId()}' data-back='id${user.getId()}'>${_('counters.friends_count', user.info.counters.friends)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.online_friends ? `<a href='#friends${user.getId()}/online' data-back='id${user.getId()}'>${_('counters.online_friends_count', user.info.counters.online_friends)}</a>` : ''}
                                    ${user.has('common_count') && user.info.common_count && user.info.common_count > 0 ? `<a href='#friends${user.getId()}/mutual' data-back='id${user.getId()}'>${_('counters.mutual_friends_count', user.info.common_count)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.gifts ? `<a href='#' data-back='id${user.getId()}'>${_('counters.gifts_count', user.info.counters.gifts)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.groups ? `<a href='#groups${user.getId()}' data-back='id${user.getId()}'>${_('counters.groups_count', user.info.counters.groups)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.pages ? `<a href='#' data-back='id${user.getId()}'>${_('counters.interesting_pages_count', user.info.counters.pages)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.photos ? `<a href='#' data-back='id${user.getId()}'>${_('counters.photos_count', user.info.counters.photos)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.posts ? `<a href='#wall${user.getId()}' data-back='id${user.getId()}'>${_('counters.posts_on_wall_count', user.info.counters.posts)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.subscriptions ? `<a href='#' data-back='id${user.getId()}'>${_('counters.subscriptions_count', user.info.counters.subscriptions)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.video_playlists ? `<a href='#' data-back='id${user.getId()}'>${_('counters.video_playlists_count', user.info.counters.video_playlists)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.videos ? `<a href='#' data-back='id${user.getId()}'>${_('counters.added_videos_count', user.info.counters.videos)}</a>` : ''}
                                    ${user.has('followers_count') && user.info.followers_count ? `<a href='#friends${user.getId()}/followers' data-back='id${user.getId()}'>${_('counters.followers_count', user.info.followers_count)}</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    ${window.templates.photo_status(user.info.main_photos)}
                    
                    <div class='wall_inserter'>
                        ${user.isDeactivatedPeacefully() ? `
                            <div class='bordered_block errored_block'>
                                ${_('errors.user_has_been_banned')}
                            </div>
                        ` : ''}
                        ${user.isDeactivatedByRkn() ? `
                            <div class='bordered_block errored_block'>
                                ${_('errors.caused_by_rkn')}
                            </div>
                        ` : ''}
                        ${user.isDeleted() ? `
                            <div class='bordered_block errored_block'>
                                ${_('errors.user_has_been_deleted')}
                            </div>
                        ` : ''}
                    </div>
                </div>
            </div>
        </div>
    `

    const user_template = document.createElement('div')
    user_template.innerHTML = template
    
    if(user.has('career')) {
        user.info.career.forEach(work => {
            user_template.querySelector('#_carrerBlock .insert_carerr').innerHTML += window.templates.work_template(work)
        })
    }

    if(user.hasEducation()) {
        user.info.schools.forEach(school => {
            user_template.querySelector('#insert_education .table').insertAdjacentHTML('beforeend', window.templates.school_template(school))
        })

        user.info.universities.forEach(university => {
            user_template.querySelector('#insert_education .table').insertAdjacentHTML('beforeend', window.templates.univer_template(university))
        })
    }

    if(user.hasRelatives()) {
        user.getRelatives().forEach(rel => {
            user_template.querySelector('#insert_relatives').insertAdjacentHTML('beforeend', window.templates.relative_template(rel))
        })
    }

    if(user.hasMilitary()) {
        user.getMilitary().forEach(mil => {
            user_template.querySelector('#insert_military .table').insertAdjacentHTML('beforeend', window.templates.mil_template(mil))
        })
    }

    return user_template.innerHTML
}

window.templates.user_page_skeleton = () => {
    return `
        <div id='_skeleton' class='default_wrapper user_page_wrapper user_page_wrapper_skeleton entity_page_wrapper'>
            ${window.site_params.get('ui.cover_upper', '0') == '0' ? `<div class='entity_page_cover filler skeleton_cover'></div>` : ''}

            <div class='user_page_grid'>
                <div class='left_block'>
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
                <div class='right_block cover_upper'>
                    ${window.site_params.get('ui.cover_upper', '0') == '1' ? `<div class='filler skeleton_cover'></div>` : ''}
                    
                    <div class="info_block bordered_block ${window.site_params.get('ui.cover_upper', '0') == '2' ? 'covered' : ''}">
                        <div class='common_info'>
                            <div class='user_name_with_status'>
                                <div class='user_info_with_name'>
                                    <span class='user_name'>${_('navigation.loading')}</span>
                                </div>

                                <span id='status_block'>
                                    ...
                                </span>
                            </div>

                            <span>
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
            </div>
        </div>
    `
}