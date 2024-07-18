if(!window.templates) {
    window.templates = {}
}

window.templates.user_page = (user) => {
    let template = `
        <input id='usr_id' type='hidden' value='${user.getId()}'>
        <div class='default_wrapper user_page_wrapper entity_page_wrapper'>
            ${user.hasCover() && window.site_params.get('ui.cover_upper', '0') == '0' ? `<div class='entity_page_cover'>
                <picture>
                    <source srcset="${user.getCoverURL(1)}" media="(min-width: 1920px)" />
                    <source srcset="${user.getCoverURL(2)}" media="(min-width: 700px)" />
                    <source srcset="${user.getCoverURL(4)}" media="(min-width: 300px)" />
                    <source srcset="${user.getCoverURL(3)}" media="(min-width: 100px)" />
                    <img src='${user.getCoverURL(1)}'>
                </picture>
            </div>` : ''}

            <div class='user_page_grid'>
                <div class='left_block' id='_smaller_block'>
                    <div class='bordered_block'>
                        <img id='avatar_img' class='photo_viewer_open outliner' src='${user.getAvatar()}' data-full='${user.info.photo_max_orig}' alt='${_('user_page.user_avatar')}'>
                        <div id='_actions'>
                            ${user.isThisUser() ?
                                `
                                ${`<a class='action' href='#edit'> ${_('user_page.edit_page')}</a>`}
                                ` :
                                `
                                ${!user.isDeleted() ? `${user.isNotFriend() ? `<a class='action' id='_toggleFriend' data-val='0' data-addid='${user.getId()}'> ${_('users_relations.start_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 1 ? `<a class='action' id='_toggleFriend' data-val='1' data-addid='${user.getId()}'> ${_('users_relations.cancel_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='4' data-addid='${user.getId()}'> ${_('users_relations.accept_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='2' data-addid='${user.getId()}'> ${_('users_relations.decline_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 3 ? `<a class='action' id='_toggleFriend' data-val='3' data-addid='${user.getId()}'> ${_('users_relations.destroy_friendship')}</a>` : ''}
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
                                <a class='action' href='https://vk.com/id${user.getId()}' target='_blank'> ${_('wall.go_to_vk')}</a>
                                `
                            }
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
                            <div class='cover_bg' style='background-image: url(${user.getCoverURL(1)});'></div>
                        ` : ''}
                        <div class='common_info'>
                            <div class='user_name_with_status'>
                                ${user.getHTMLName()}

                                <span id='status_block'>
                                    ${user.getTextStatus()}
                                </span>
                            </div>

                            <span>
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

                                <table>
                                    <tbody>
                                        ${user.has('sex') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.sex')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getSex()}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('bdate') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.birthdate')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getBdate()}</span>
                                            </td>
                                        </tr>
                                        ` : ''}
                                        ${user.has('relation') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.marital_status')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getRelationStatus()}</span>
                                                </td>
                                            </tr>
                                        ` : ``}
                                        ${user.has('personal') && user.info.personal.langs ? 
                                        `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.known_languages')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getLangs()}</span>
                                                </td>
                                            </tr>
                                        `
                                        : ``}
                                    </tbody>
                                </table>
                            </div>
                            <div class='additional_info_block'>
                                <div class='additional_info_block_cover'>
                                    <b class='title'>${_('user_page.profile_info')}</b>
                                    <hr class='hidden_line'>
                                </div>

                                <table>
                                    <tbody>
                                        <tr>
                                            <td>
                                                <span>ID</span>
                                            </td>
                                            <td>
                                                <span>${user.getId()}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.page_link')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getDomain()}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.register_date')}</span>
                                            </td>
                                            <td>
                                                <span id='__regdate'>--.--.----</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.has_verification')}</span>
                                            </td>
                                            <td>
                                                <span>${user.isVerified() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.has_verification_esia')}</span>
                                            </td>
                                            <td>
                                                <span>${user.isVerifiedInEsia() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.has_verification_phone')}</span>
                                            </td>
                                            <td>
                                                <span>${user.isPhoneVerified() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.has_indexing')}</span>
                                            </td>
                                            <td>
                                                <span>${user.isIndexing() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td>
                                                <span>${_('user_page.is_closed')}</span>
                                            </td>
                                            <td>
                                                <span>${user.isClosed() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
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
                                    <table>
                                        <tbody>
                                            ${user.has('country') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.country')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getCountry()}</span>
                                                </td>
                                            </tr>
                                            ` : ``}
                                            ${user.has('city') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.city')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getCity()}</span>
                                                </td>
                                            </tr>
                                            ` : ``}
                                            ${user.has('home_town') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.hometown')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getHometown()}</span>
                                                </td>
                                            </tr>
                                            ` : ``}
                                            ${user.has('mobile_phone') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.mobile_phone')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getMobile()}</span>
                                                </td>
                                            </tr>
                                            ` : ``}
                                            ${user.has('home_phone') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.additional_phone')}</span>
                                                </td>
                                                <td>
                                                    <span>${user.getHomephone()}</span>
                                                </td>
                                            </tr>
                                            ` : ``}
                                            ${user.has('skype') ? `
                                            <tr>
                                                <td>
                                                    <span>Skype</span>
                                                </td>
                                                <td>
                                                    <a href='skype:${user.getSkype()}?call'>${user.getSkype()} </a>
                                                </td>
                                            </tr>
                                            ` : ``}
                                            ${user.has('site') ? `
                                            <tr>
                                                <td>
                                                    <span>${_('user_page.personal_site')}</span>
                                                </td>
                                                <td>
                                                    <a href=\'${user.getSite()}\'>${user.getSite()}</a>
                                                </td>
                                            </tr>
                                            ` : ``}
                                        </tbody>
                                    </table>
                                </div>` : ''}
                                ${user.hasInterests() ? `<div class='additional_info_block' id='_interestsBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.interests')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    
                                    <table>
                                        <tbody>
                                        ${user.has('activities') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.activities')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('activities')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('interests') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.interests')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('interests')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('music') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.fav_music')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('music')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('movies') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.fav_films')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('movies')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('tv') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.fav_tv')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('tv')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('books') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.fav_books')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('books')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('games') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.fav_games')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('games')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        ${user.has('quotes') ? `
                                        <tr>
                                            <td>
                                                <span>${_('user_page.fav_quotes')}</span>
                                            </td>
                                            <td>
                                                <span>${user.getInterests('quotes')}</span>
                                            </td>
                                        </tr>
                                        ` : ``}
                                        </tbody>
                                    </table>
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
                                        <table><tbody></tbody></table>
                                    </div>
                                </div>` : ''}
                                ${user.hasRelatives() ? `<div class='additional_info_block' id='_carrerBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.relatives')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div id='insert_relatives' style='padding: 1px 3px 7px 3px;'>
                                    </div>
                                </div>` : ''}
                                ${user.hasMilitary() ? `<div class='additional_info_block' id='_carrerBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.military')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                    <div id='insert_military' style='padding: 1px 3px 7px 3px;'>
                                        <table><tbody></tbody></table>
                                    </div>
                                </div>` : ''}
                                ${user.hasPersonal() ? `
                                <div class='additional_info_block' id='_lifeBlock'>
                                    <div class='additional_info_block_cover'>
                                        <b class='title'>${_('user_page.life_position')}</b>
                                        <hr class='hidden_line'>
                                    </div>
                                        <table>
                                            <tbody>
                                                ${user.info.personal.political ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.political_views')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('political')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                                ${user.info.personal.religion ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.worldview')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('religion')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                                ${user.info.personal.life_main ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.main_in_life')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('life_main')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                                ${user.info.personal.people_main ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.main_in_people')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('people_main')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                                ${user.info.personal.smoking ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.attitude_towards_smoking')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('smoking')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                                ${user.info.personal.alcohol ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.attitude_towards_alcohol')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('alcohol')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                                ${user.info.personal.inspired_by ? `
                                                <tr>
                                                    <td>
                                                        <span>${_('user_page.inspired_by')}</span>
                                                    </td>
                                                    <td>
                                                        <span>${user.getInterests('inspired_by')}</span>
                                                    </td>
                                                </tr>
                                                ` : ``}
                                            </tbody>
                                        </table>
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
                                    <a href='#groups${user.getId()}' data-back='id${user.getId()}'>${_('counters.groups_count', user.info.counters && user.info.counters.groups ? user.info.counters.groups : 0)}</a>
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

    let user_template = document.createElement('div')
    user_template.innerHTML = template
    
    if(user.has('career')) {
        user.info.career.forEach(work => {
            user_template.querySelector('#_carrerBlock .insert_carerr').innerHTML += window.templates.work_template(work)
        })
    }

    if(user.hasEducation()) {
        user.info.schools.forEach(school => {
            user_template.querySelector('#insert_education tbody').insertAdjacentHTML('beforeend', window.templates.school_template(school))
        })

        user.info.universities.forEach(university => {
            user_template.querySelector('#insert_education tbody').insertAdjacentHTML('beforeend', window.templates.univer_template(university))
        })
    }

    if(user.hasRelatives()) {
        user.getRelatives().forEach(rel => {
            user_template.querySelector('#insert_relatives').insertAdjacentHTML('beforeend', window.templates.relative_template(rel))
        })
    }

    if(user.hasMilitary()) {
        user.getMilitary().forEach(mil => {
            user_template.querySelector('#insert_military tbody').insertAdjacentHTML('beforeend', window.templates.mil_template(mil))
        })
    }

    return user_template.innerHTML
}