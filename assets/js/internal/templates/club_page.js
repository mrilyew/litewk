if(!window.templates) {
    window.templates = {}
}

window.templates.club_page = async (club) => {
    let template = `
        <input id='clb_id' type='hidden' value='${club.getId()}'>
        <div class='club_page_wrapper entity_page_wrapper default_wrapper'>
            ${club.hasCover() ? `
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
            <div class='club_page_wrapper_grid'>
                <div class="left_block bordered_block">
                    <div>
                        <div class='upper_block'>
                            <div id="name_block">
                                <span id='name' class='bolder'>${club.getName()}</span>
                            </div>
                        </div>

                        <div id='status_block'>
                            <span>${club.getTextStatus()}</span>
                        </div>
                    </div>

                    <div class='mini_info_block'>
                        <div class='tilte_cover'>
                            <b class='title'>${_('group_page.main_info')}</b>
                            <hr class='hidden_line'>
                        </div>

                        <table>
                            <tbody>
                                ${club.has('description') ? `<tr>
                                    <td valign="top">
                                        <span>${_('group_page.description')}</span>
                                    </td>
                                    <td>
                                        <span>${club.getDescription()}</span>
                                    </td>
                                </tr>` : ''}
                                ${club.info.age_limits != 1 ? `<tr>
                                    <td>
                                        <span>${_('groups.age_limits')}</span>
                                    </td>
                                    <td>
                                        <span>${club.getAgeLimits()}</span>
                                    </td>
                                </tr>` : ''}
                                <tr>
                                    <td>
                                        <span>ID</span>
                                    </td>
                                    <td>
                                        <span>${club.getId()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>${_('user_page.page_link')}</span>
                                    </td>
                                    <td>
                                        <span>${club.getDomain()}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>${_('user_page.has_verification')}</span>
                                    </td>
                                    <td>
                                        <span>${club.isVerified() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>
                                        <span>${_('group_page.is_closed')}</span>
                                    </td>
                                    <td>
                                        <span>${club.isClosed() ? _('user_page.user_yes') : _('user_page.user_no')}</span>
                                    </td>
                                </tr>
                                ${club.has('activity') ? 
                                `<tr>
                                    <td>
                                        <span>${_('group_page.activity')}</span>
                                    </td>
                                    <td>
                                        <span>${club.getActivity()}</span>
                                    </td>
                                </tr>` : ''}
                                ${club.has('country') ? 
                                `<tr>
                                    <td>
                                        <span>${_('user_page.city')}</span>
                                    </td>
                                    <td>
                                        <span>${club.getCity()}</span>
                                    </td>
                                </tr>` : ''}
                            </tbody>
                        </table>
                    </div>

                    <div class='mini_info_block'>
                        <div class='tilte_cover'>
                            <b class='title'>${_('user_page.counters')}</b>
                            <hr class='hidden_line'>
                        </div>

                        <div id='_counters'>
                            ${club.has('counters') && club.info.counters.albums ? `<a href='#'>${_('counters.albums_count', club.info.counters.albums)}</a>` : ''}
                            ${club.has('counters') && club.info.counters.articles ? `<a href='#'>${_('counters.articles_count', club.info.counters.articles)}</a>` : ''}
                            ${club.has('counters') && club.info.counters.clips ? `<a href='#'>${_('counters.clips_count', club.info.counters.clips)}</a>` : ''}
                            ${club.has('counters') && club.info.counters.photos ? `<a href='#'>${_('counters.photos_count', club.info.counters.photos)}</a>` : ''}
                            ${club.has('counters') && club.info.counters.topics ? `<a href='#'>${_('counters.topics_count', club.info.counters.topics)}</a>` : ''}
                            ${club.has('counters') && club.info.counters.video_playlists ? `<a href='#'>${_('counters.video_playlists_count', club.info.counters.video_playlists)}</a>` : ''}
                            ${club.has('counters') && club.info.counters.videos ? `<a href='#'>${_('counters.added_videos_count', club.info.counters.videos)}</a>` : ''}
                            ${club.has('members_count') && club.info.members_count ? `<a href='?group_id=${club.getId()}#search/users'>${_('counters.followers_count', club.info.members_count)}</a>` : ''}
                        </div>
                    </div>
                </div>
                <div class="right_block bordered_block">
                    <div class='block_parallax'>
                        <img id='avatar_img' class='photo_attachment' data-full='${club.info.photo_max_orig}' src='${club.getAvatar()}' alt='${_('user_page.user_avatar')}'>
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
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    let club_template = document.createElement('div')
    club_template.innerHTML = template

    return club_template.innerHTML
}
