async function work_template(work) 
{
    let tmp_club = null
    if(work.group_id) {
        tmp_club = await resolve_club(work.group_id)
    }

    return `
    <div class='career_work  ${!tmp_club ? 'no_group' : ''}'>
        ${tmp_club ? 
        `<div class='career_work_avatar avatar'>
            <a href='site_pages/club_page.html?id=${work.group_id}'>
                <img class='avatar' src='${tmp_club.photo_50}'>
            </a>
        </div>` : ''}

        <div class='career_work_info'>
            ${tmp_club ? `<a href='site_pages/club_page.html?id=${work.group_id}'><b>${escape_html(tmp_club.name ?? 'no name')}</b></a>` : `<b>${escape_html(work.company)}</b>`}
            <p>${work.position ? `${_('user_page.job_post')}: ` + escape_html(work.position) : ''}</p>
            <p>${work.from  ? `${_('user_page.job_year_start')}: ` + work.from : ''}</p>
            <p>${work.until ? `${_('user_page.job_year_end')}: ` + work.until : ''}</p>
            <p>${work.city_id ? `${_('user_page.job_city')}: ` + await resolve_city(work.city_id) : ''}</p>
        </div>
    </div>
    `
}

async function user_page_template(user)
{
    let template = `
        <input id='usr_id' type='hidden' value='${user.getId()}'>
        <div class='default_wrapper entity_page_wrapper user_page_wrapper'>
            ${user.hasCover() ? `
                <div class='entity_page_cover'>
                    <picture>
                        <source srcset="${user.getCoverURL(1)}" media="(min-width: 1920px)" />
                        <source srcset="${user.getCoverURL(2)}" media="(min-width: 700px)" />
                        <source srcset="${user.getCoverURL(4)}" media="(min-width: 300px)" />
                        <source srcset="${user.getCoverURL(3)}" media="(min-width: 100px)" />
                        <img src='${user.getCoverURL(1)}'>
                    </picture>
                </div>
            ` : ''}
            <div class='user_page_wrapper_grid'>
                <div class="left_block bordered_block">
                    <div class='block_parallax'>
                        <img id='avatar_img' src='${user.getAvatar()}' alt='${_('user_page.user_avatar')}'>
                        <div id='_actions'>
                            ${user.isThisUser() ?
                                `
                                ${`<a class='action' href='site_pages/edit_page.html'> ${_('user_page.edit_page')}</a>`}
                                ` :
                                `
                                ${user.isNotFriend() ? `<a class='action' id='_toggleFriend' data-val='0'> ${_('users_relations.start_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 1 ? `<a class='action' id='_toggleFriend' data-val='1'> ${_('users_relations.cancel_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='4'> ${_('users_relations.accept_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='2'> ${_('users_relations.decline_friendship')}</a>` : ''}
                                ${user.getFriendStatus() == 3 ? `<a class='action' id='_toggleFriend' data-val='3'> ${_('users_relations.destroy_friendship')}</a>` : ''}
                                ${!user.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='user' data-addid='${user.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
                                ${user.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='user' data-addid='${user.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
                                ${!user.isBlacklistedByMe() ? `<a class='action' id='_toggleBlacklist' data-val='0'> ${_('blacklist.add_to_blacklist')}</a>` : ''}
                                ${user.isBlacklistedByMe() ? `<a class='action' id='_toggleBlacklist' data-val='1'> ${_('blacklist.remove_from_blacklist')}</a>` : ''}
                                
                                ${user.isFriend() ? `
                                    ${!user.isHiddenFromFeed() ? `<a class='action' id='_toggleHiddeness' data-val='0'> ${_('user_page.hide_from_feed')}</a>` : ''}
                                    ${user.isHiddenFromFeed() ? `<a class='action' id='_toggleHiddeness' data-val='1'> ${_('user_page.unhide_from_feed')}</a>` : ''}
                                ` : ''}

                                ${!user.isClosed() && !user.isSubscribed() ? `<a class='action' id='_toggleSubscribe' data-val='0'> ${_('user_page.subscribe_to_new')}</a>` : ''}
                                ${!user.isClosed() && user.isSubscribed() ? `<a class='action' id='_toggleSubscribe' data-val='1'> ${_('user_page.unsubscribe_to_new')}</a>` : ''}
                                `
                            }
                        </div>
                    </div>
                </div>
                <div class="right_block">
                    <div class="info_block bordered_block">
                        <div class='upper_block'>
                            <div id="name_block">
                                <div class='name_with_smiley'>
                                    <span id='name' class='bolder'>${user.getFullName()}</span>

                                    ${user.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                                    `<div class='smiley' title='${user.getImageStatus().name}'>
                                        <img src='${user.getImageStatusURL()}'>
                                    </div>` : ``}
                                </div>
                                <span id='last_online' style='margin-top: 3px;'>${_('online_types.online_is_hidden')}</span>
                            </div>
                            <div id='status_block'>
                                <span>${user.getTextStatus()}</span>
                            </div>
                        </div>

                        <div class='more_info_block'>
                            <div class='mini_info_block'>
                                <div class='tilte_cover'>
                                    <b class='title'>${_('user_page.personal_info')}</b>
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
                                        <tr>
                                            <td>
                                                <span>${_('user_page.register_date')}</span>
                                            </td>
                                            <td>
                                                <span><a href='https://vk.com/foaf.php?id=${user.getId()}#ya:created'>?</a></span>
                                            </td>
                                        </tr>
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
                            <div class='mini_info_block'>
                                <div class='tilte_cover'>
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
                            </div>
                            ${user.hasInterests() ? `<div class='mini_info_block' id='_interestsBlock'>
                                <div class='tilte_cover'>
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
                            ${user.has('career') ? `<div class='mini_info_block' id='_carrerBlock'>
                                <div class='tilte_cover'>
                                    <b class='title'>${_('user_page.career')}</b>
                                    <hr class='hidden_line'>
                                </div>
                                <div class='insert_carerr' style='padding: 1px 3px 7px 3px;'></div>
                            </div>` : ''}
                            ${user.hasEducation() ? `<div class='mini_info_block' id='_carrerBlock'>
                                <div class='tilte_cover'>
                                    <b class='title'>${_('user_page.education')}</b>
                                    <hr class='hidden_line'>
                                </div>
                                <div id='insert_education' style='padding: 1px 3px 7px 3px;'>
                                    <table><tbody></tbody></table>
                                </div>
                            </div>` : ''}
                            ${user.hasRelatives() ? `<div class='mini_info_block' id='_carrerBlock'>
                                <div class='tilte_cover'>
                                    <b class='title'>${_('user_page.relatives')}</b>
                                    <hr class='hidden_line'>
                                </div>
                                <div id='insert_relatives' style='padding: 1px 3px 7px 3px;'>
                                    <table><tbody></tbody></table>
                                </div>
                            </div>` : ''}
                            ${user.hasMilitary() ? `<div class='mini_info_block' id='_carrerBlock'>
                                <div class='tilte_cover'>
                                    <b class='title'>${_('user_page.military')}</b>
                                    <hr class='hidden_line'>
                                </div>
                                <div id='insert_military' style='padding: 1px 3px 7px 3px;'>
                                    <table><tbody></tbody></table>
                                </div>
                            </div>` : ''}
                            ${user.has('personal') ? `
                            <div class='mini_info_block' id='_lifeBlock'>
                                <div class='tilte_cover'>
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
                            <div class='mini_info_block'>
                                <div class='tilte_cover'>
                                    <b class='title'>${_('user_page.counters')}</b>
                                    <hr class='hidden_line'>
                                </div>

                                <div id='_counters'>
                                    ${user.has('counters') && user.info.counters.albums ? `<a href='#'>${_('counters.albums_count', user.info.counters.albums)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.audios ? `<a href='#'>${_('counters.audios_count', user.info.counters.audios)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.badges ? `<a href='#'>${_('counters.badges_count', user.info.counters.badges)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.friends ? `<a href='#'>${_('counters.friends_count', user.info.counters.friends)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.online_friends ? `<a href='#'>${_('counters.online_friends_count', user.info.counters.online_friends)}</a>` : ''}
                                    ${user.has('common_count') && user.info.common_count && user.info.common_count > 0 ? `<a href='#'>${_('counters.mutual_friends_count', user.info.common_count)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.gifts ? `<a href='#'>${_('counters.gifts_count', user.info.counters.gifts)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.groups ? `<a href='#'>${_('counters.groups_count', user.info.counters.groups)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.pages ? `<a href='#'>${_('counters.interesting_pages_count', user.info.counters.pages)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.photos ? `<a href='#'>${_('counters.photos_count', user.info.counters.photos)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.posts ? `<a href='site_pages/wall.html?id=${user.getId()}'>${_('counters.posts_on_wall_count', user.info.counters.posts)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.subscriptions ? `<a href='#'>${_('counters.subscriptions_count', user.info.counters.subscriptions)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.video_playlists ? `<a href='#'>${_('counters.video_playlists_count', user.info.counters.video_playlists)}</a>` : ''}
                                    ${user.has('counters') && user.info.counters.videos ? `<a href='#'>${_('counters.added_videos_count', user.info.counters.videos)}</a>` : ''}
                                    ${user.has('followers_count') && user.info.followers_count ? `<a href='#'>${_('counters.followers_count', user.info.followers_count)}</a>` : ''}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `

    let user_template = document.createElement('div')
    user_template.innerHTML = template

    if(user.info.last_seen) {
        user_template.querySelector('#last_online').innerHTML = user.getFullOnline()
    }

    if(user.has('career')) {
        for(const work of user.info.career) {
            user_template.querySelector('#_carrerBlock .insert_carerr').innerHTML += await work_template(work)
        }
    }

    if(user.hasEducation()) {
        for(const school of user.info.schools) {
            user_template.querySelector('#insert_education tbody').insertAdjacentHTML('beforeend', `
                <tr>
                    <td>
                        <span><b>${_('user_page.school')}</b></span>
                    </td>
                </tr>
                <tr>
                    <td>${_('user_page.school_name')}</td>
                    <td>${escape_html(school.name)}</td>
                </tr>
                ${school.city ? `<tr>
                    <td>
                        <span>${_('user_page.city')}</span>
                    </td>
                    <td>
                        <span>${escape_html(await resolve_city(school.city))}</span>
                    </td>
                </tr>` : ''}
                ${school.year_from ? `<tr>
                    <td>
                        <span>${_('user_page.school_start_year')}</span>
                    </td>
                    <td>
                        <span>${school.year_from}</span>
                    </td>
                </tr>` : ''}
                ${school.year_to ? `<tr>
                    <td>
                        <span>${_('user_page.school_end_year')}</span>
                    </td>
                    <td>
                        <span>${school.year_to}</span>
                    </td>
                </tr>` : ''}
                ${school.year_graduated ? `<tr>
                    <td>
                        <span>${_('user_page.school_graduation_year')}</span>
                    </td>
                    <td>
                        <span>${school.year_graduated}</span>
                    </td>
                </tr>` : ''}
                ${school.class ? `<tr>
                    <td>
                        <span>${_('user_page.school_class')}</span>
                    </td>
                    <td>
                        <span>${escape_html(school.class)}</span>
                    </td>
                </tr>` : ''}
            `)
        }

        for(const university of user.info.universities) {
            user_template.querySelector('#insert_education tbody').insertAdjacentHTML('beforeend', `
                <tr>
                    <td>
                        <span><b>${_('user_page.university')}</b></span>
                    </td>
                </tr>
                <tr>
                    <td>${_('user_page.school_name')}</td>
                    <td>${escape_html(university.name)}</td>
                </tr>
                ${university.city ? `<tr>
                    <td>
                        <span>${_('user_page.city')}</span>
                    </td>
                    <td>
                        <span>${escape_html(await resolve_city(university.city))}</span>
                    </td>
                </tr>` : ''}
                ${university.faculty_name ? `<tr>
                    <td>
                        <span>${_('user_page.university_faculty')}</span>
                    </td>
                    <td>
                        <span>${escape_html(university.faculty_name)}</span>
                    </td>
                </tr>` : ''}
                ${university.chair_name ? `<tr>
                    <td>
                        <span>${_('user_page.university_chair')}</span>
                    </td>
                    <td>
                        <span>${escape_html(university.chair_name)}</span>
                    </td>
                </tr>` : ''}
                ${university.graduation ? `<tr>
                    <td>
                        <span>${_('user_page.school_graduation_year')}</span>
                    </td>
                    <td>
                        <span>${university.graduation}</span>
                    </td>
                </tr>` : ''}
                ${university.education_form ? `<tr>
                    <td>
                        <span>${_('user_page.education_form')}</span>
                    </td>
                    <td>
                        <span>${university.education_form}</span>
                    </td>
                </tr>` : ''}
                ${university.education_status ? `<tr>
                    <td>
                        <span>${_('user_page.education_status')}</span>
                    </td>
                    <td>
                        <span>${escape_html(university.education_status)}</span>
                    </td>
                </tr>` : ''}
            `)
        }
    }

    if(user.hasRelatives()) {
        for(const relative of user.getRelatives()) {
            user_template.querySelector('#insert_relatives tbody').insertAdjacentHTML('beforeend', 
                `
                    <tr>
                        <td>${_('user_page.relative_' + relative.type)}</td>
                        <td>${relative.id > 0 ? `<a href='site_pages/user_page.html?id=${relative.id}'>${relative.id}</a>` : escape_html(relative.name)}</td>
                    </tr>
                `
            )
        }
    }

    if(user.hasMilitary()) {
        for(const mil of user.getMilitary()) {
            user_template.querySelector('#insert_military tbody').insertAdjacentHTML('beforeend', 
                `
                    <tr>
                        <td>${_('user_page.military_unit')}</td>
                        <td>${escape_html(mil.unit)}</td>
                    </tr>
                    ${mil.from ? `<tr>
                        <td>${_('user_page.military_year_start')}</td>
                        <td>${mil.from}</td>
                    </tr>` : ''}
                    ${mil.until ? `<tr class='end_of_mil'>
                        <td>${_('user_page.military_year_end')}</td>
                        <td><span>${mil.until}</span></td>
                    </tr>` : ''}
                `
            )
        }
    }

    return user_template.innerHTML
}

function club_template(club)
{
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
                        ${club.has('members_count') && club.info.members_count ? `<a href='#'>${_('counters.followers_count', club.info.members_count)}</a>` : ''}
                    </div>
                </div>
            </div>
            <div class="right_block bordered_block">
                <div class='block_parallax'>
                    <img id='avatar_img' src='${club.getAvatar()}' alt='${_('user_page.user_avatar')}'>
                    <div id='_actions'></div>
                </div>
            </div>
        </div>
    </div>
`

    let club_template = document.createElement('div')
    club_template.innerHTML = template

    return club_template.innerHTML
}

function process_attachments(attachments)
{
    let attachms = document.createElement('div')
    attachms.innerHTML = `
    <div class='attachments' ${attachments.length == 1 ? `style='text-align: center;'` : ''}>
        <div class='ordinary_attachments'></div>
        <div class='other_attachments'></div>
    </div>`

    if(attachments.length == 1 && attachments[0].type == 'photo') {
        let photo = new Photo(attachments[0].photo)
        
        attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
            `
            <img class='ordinary_attachment photo_attachment' data-full='${photo.getFullSizeURL()}' data-photoid='${photo.getId()}' src='${photo.getURL()}'>
            `
        )
    } else if(attachments.length == 1 && attachments[0].type == 'video') {
        let video = new Video(attachments[0].video)
        
        attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
            `
            <div class='ordinary_attachment video_attachment_viewer_open video_attachment_big big_attachment' data-videoid='${video.getId()}'>
                <div class='video_preview_block'>
                    <img src='assets/images/playicon.png' class='play_button'>

                    <div class='time_block'>
                        <span>${video.getDuration()}</span>
                    </div>
                    ${video.hasPreview() ? `<img class='video_preview' src='${video.getPreview(3)}'>` : ''}
                </div>
                <div class='video_attachment_info'>
                    <b><a href='site_pages/video.html?id=${video.getId()}'>${video.getTitle()}</a></b>
                    <p>${_('videos.views_count', video.getViews())}</p>
                </div>
            </div>
            `
        )
    } else {
        attachments.forEach(attachment => {
            switch(attachment.type) {
                case 'photo':
                    let photo = new Photo(attachment.photo)

                    attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <img class='ordinary_attachment photo_attachment' data-full='${photo.getFullSizeURL()}' data-photoid='${photo.getId()}' src='${photo.getURL()}'>
                        `
                    )
                    break
                case 'video':
                    let op_video = attachment.video
                    let video_id = op_video.owner_id + '_' + op_video.id
                    let preview = ''
    
                    if(op_video.image) {
                        if(op_video.image[3]) {
                            preview = op_video.image[3].url
                        } else if(op_video.image[2]) {
                            preview = op_video.image[2].url
                        } else {
                            preview = op_video.image[1].url
                        }
                    }
    
                    attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <div class='ordinary_attachment video_attachment_viewer_open video_attachment' data-videoid='${video_id}'>
                                <img src='assets/images/playicon.png' class='play_button'>
    
                                <div class='time_block'>
                                    <span>${format_seconds(op_video.duration)}</span>
                                </div>
                                ${op_video.image ? `<img src='${preview}'>` : ''}
                            </div>
                        `
                    )
                    break
                case 'doc':
                    let op_doc = attachment.doc
                    let doc_id = op_doc.owner_id + '_' + op_doc.id
                    
                    if(op_doc.ext == 'gif' || op_doc.ext == 'jpg' || op_doc.ext == 'png') {
                        attachms.querySelector('.ordinary_attachments').insertAdjacentHTML('beforeend',
                        `
                            <div class='ordinary_attachment doc_attachment' data-docid='${doc_id}'>
                                <div class='ext_block'>
                                    <span>${escape_html(op_doc.ext.toUpperCase())} | ${human_file_size(op_doc.size)}</span>
                                </div>
                                <img src='${op_doc.preview.photo.sizes[3].src}'>
                            </div>
                        `)
                    } else {
                        attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                        `
                            <a href='${op_doc.url}'>
                                <div class='list_attachment doc_list_attachment' data-docid='${doc_id}'>
                                    <div class='list_attachment_format'>${op_doc.ext}</div>
                                    <div class='list_attachment_info'>
                                        <p><b>${escape_html(op_doc.title)}</b></p>
                                        <p>${human_file_size(op_doc.size)}</p>
                                    </div>
                                </div>
                            </a>
                        `)
                    }
                    break
                case 'poll':
                    let op_poll = new Poll(attachment.poll)
    
                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        <div class='list_attachment poll_list_attachment' data-pollid='${op_poll.getId()}'>
                            <div class='poll_head'>
                                <span class='question'>${escape_html(op_poll.getQuestion())}</span>
                            </div>
                            <div class='poll_answers'></div>
                        </div>
                    `)
    
                    op_poll.getAnswers().forEach(answer => {
                        attachms.querySelector(`.poll_list_attachment[data-pollid='${op_poll.getId()}'] .poll_answers`).insertAdjacentHTML('beforeend', `
                            <label>
                                <input type='radio' name='poll_${op_poll.getId()}'>
                                ${escape_html(answer.text)}
                            </label>
                        `)
                    })
                    break
                case 'audio':
                    let op_audio = new Audio(attachment.audio)
    
                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        <div class='list_attachment audio_list_attachment audio_player' data-audioid='${op_audio.getId()}'>
                            <span>${op_audio.getName()}</span>
                            <span>${op_audio.getDuration()}</span>
                        </div>
                    `)
                    break
                default:
                    attachms.querySelector('.other_attachments').insertAdjacentHTML('beforeend',
                    `
                        Attachment type: ${attachment.type}
                    `)
                    break
            }
        })
    }

    return attachms.innerHTML
}

function post_template(post, additional_options = {})
{
    let owner = post.getOwner()
    let signer = post.getSigner()
    
    let template = ``
    template += 
    `
    <div class='post main_info_block' data-type='post' data-postid='${post.getId()}'>
        <div class='post_hidden_by_default post_restore_block'>
            ${_('wall.post_has_deleted')}
        </div>
        <div class='post_hidden_by_default post_archive_block'>
            ${_('wall.post_has_archived')}
        </div>
        <div class='post_hidden_by_default post_unarchive_block'>
            ${_('wall.post_has_unarchived')}
        </div>
        <div class='post_wrapper'>
        <div class='post_author'>
            <div class='post_avaname'>
        `

    template += `
            <div class='post_ava avatar'>
                <a href='${owner.getUrl()}'>
                    <img src='${owner.getAvatar(true)}'>
                </a>
            </div>
            <div class='post_name'>
                <p><b><a href='${owner.getUrl()}'>${owner.getName()}</a></b> ${post.hasUpperText() ? post.getUpperText() : ''}</p>
                <p><a href='site_pages/post.html?post=${post.getId()}'>${post.getDate()}</a><span class='pinned_indicator ${post.isPinned() ? '' : 'hidden'}'>${_('wall.pinned')}</span></p>
            </div>
            `

    template += `
                </div>
                
                ${post.isntRepost() ? 
                `
                <div class='post_toggle_wrap'>
                    <div class='posts_menu_toggle dropdown_toggle icons1' data-onid='_actposts${post.getId()}'></div>
                        <div class='post_upper_actions dropdown_wrapper'>
                            <div class='dropdown_menu' id='_actposts${post.getId()}'>
                                ${post.canEdit() ? `<p id='_postEdit'>${_('wall.edit_post')}</p>` : ''}
                                ${post.canDelete() ? `<p id='_postDelete'>${_('wall.delete_post')}</p>` : ''}
                                ${post.canArchive() && !post.isArchived() ? `<p id='_postArchiveAction' data-type='0'>${_('wall.archive_post')}</p>` : ''}
                                ${post.canArchive() && post.isArchived()? `<p id='_postArchiveAction' data-type='1'>${_('wall.unarchive_post')}</p>` : ''}
                                ${post.canPin() && post.isPinned() ? `<p id='_pinPost' data-act='unpin'>${_('wall.unpin_post')}</p>` : ''}
                                ${post.canPin() && !post.isPinned() ? `<p id='_pinPost' data-act='pin'>${_('wall.pin_post')}</p>` : ''}
                                ${post.canShut() ? `<p id='_changeComments' data-act='close'>${_('wall.disable_comments_post')}</p>` : ''}
                                ${post.canUp() ? `<p id='_changeComments' data-act='open'>${_('wall.enable_comments_post')}</p>` : ''}
                                ${!post.canDelete() ? `<p>${_('wall.report_post')}</p>` : ''}
                                ${post.isFaved() ? `<p id='_toggleFave' data-val='1' data-type='post' data-addid='${post.getId()}'>${_('faves.remove_from_faves')}</p>` : ''}
                                ${!post.isFaved() ? `<p id='_toggleFave' data-val='0' data-type='post' data-addid='${post.getId()}'>${_('faves.add_to_faves')}</p>` : ''}
                                <a href='https://vk.com/wall${post.getId()}' target='_blank'><p>${_('wall.go_to_vk')}</p></a>
                            </div>
                        </div>
                    </div>` : ''}
            </div>

            <div class='post_content'>
                <span>${post.getText()}</span>

                ${post.hasAttachments() ? process_attachments(post.getAttachments()) : ''}
                <div class='repost_block'></div>

                ${post.hasSigner() ? `<div class='post_signer special_post_block'>
                    ${_('wall.author')}:
                    <a href='${signer.getUrl()}'>${signer.getName()}</a>
                </div>` : ''}
                ${post.hasSource() ? `<div class='post_source special_post_block'>
                    ${_('wall.source')}:
                    ${post.getSource()}
                </div>` : ''}
                ${post.isAd() ? `<div class='is_ad special_post_block'>
                    <span>${_('wall.is_ad')}</span>
                </div>` : ''}
            </div>

            ${post.info.likes ?
            `<div class='post_actions'>
                <div class='post_actions_wr'>
                    <a class='like ${post.info.likes.user_likes == 1 ? 'activated' : '' }'>
                        <div class='like_icon icons1'></div>
                        <span>${post.getLikes()}</span>
                    </a>
                    ${!additional_options.hide_comments ? `
                    <a href='site_pages/post.html?post=${post.getId()}' class='comment'>
                        <div class='comment_icon icons1'></div>
                        <span>${post.getCommentsCount()}</span>
                    </a>` : ''}
                    <a class='repost'>
                        <div class='repost_icon icons1'></div>
                        <span>${post.getRepostsCount()}</span>
                    </a>
                </div>
                ${post.hasViews() ? `<div class='views_block'>
                    <div class='eye_icon icons1'></div>
                    <span>${post.getViews()}</span>
                </div>` : ''}
            </div>` : ''}
        </div>
        </div>
    `

    let post_class = document.createElement('div')
    post_class.innerHTML = template

    // proccess attachments

    if(post.isCopy()) {
        let reposted_post = new Post()

        reposted_post.hydrate(post.getRepost(), post.profiles, post.groups)
        post_class.querySelector('.repost_block').innerHTML = post_template(reposted_post, additional_options)
    }

    return post_class.innerHTML
}

function comment_template(object)
{
    let owner = object.getOwner()
    let template = `
        <div class='main_comment_block' ${object.hasThread() ? `data-commscount='${object.info.thread.count}'` : ''} data-ownerid='${object.info.owner_id}' data-cid='${object.getCorrectID()}'>
            <div class='comment_block main_info_block' data-type='comment' data-postid='${object.getId()}'>
                <div class='comment_author'>
                    <div class='comment_avaname avatar'>
                        <a href='${owner ? owner.getUrl() : ''}'>
                            <img src='${owner ? owner.getAvatar(true) : ''}'>
                        </a>
                    </div>
                </div>
                <div class='comment_info'>
                    <div class='comment_upper_author'>
                        <div>
                            <b><a href='${owner ? owner.getUrl() : ''}'>${owner ? owner.getName() : ''}</a></b>
                            ${object.isAuthor() ? `<span class='comment_op'>OP</span>` : ''}
                        </div>
                        
                        <div class='comment_upper_actions'>
                            <div class='icons1' id='_reportComment'></div>
                            ${object.canEdit() ? `<div class='icons1' id='_commentEdit'></div>` : ''}
                            ${object.canDelete() ? `<div class='icons1' id='_commentDelete'></div>` : ''}
                        </div>
                    </div>

                    <div class='comment_content'>
                        <p>${object.getText()}</p>
                        ${object.hasAttachments() ? process_attachments(object.getAttachments()) : ''}
                    </div>

                    <div class='comment_bottom'>
                        <span><a href='#'>${object.getDate()}</a></span>
                        <div class='post_actions_no_frame'>
                            <div class='like ${object.isLiked() ? 'activated' : '' }'>
                                <div class='like_icon ${object.info.likes.user_likes == 1 ? 'activated' : '' } icons1'></div>
                                <span>${object.getLikes()}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            ${object.hasThread() ? `
            <div class='comment_thread_block'>
                <div class='comment_thread_block_title'>
                    <span>${_('wall.thread_count', object.getThreadCount())}</span>
                </div>

                <div class='comments_thread_insert_block'></div>
            </div>
            ` : ''}
        </div>
    `

    let temp_l = document.createElement('div')
    temp_l.innerHTML = template

    if(object.hasThread()) {
        object.info.thread.items.forEach(el => {
            let comment = new Comment()
            comment.hydrate(el, object.profiles, object.groups)

            temp_l.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', comment.getTemplate())
        })

        if(object.info.thread.count > 3) {
            temp_l.querySelector('.comments_thread_insert_block').insertAdjacentHTML('beforeend', `
                <span id='shownextcomms'>${_('wall.show_next_comments')}</span>
            `)
        }
    }

    return temp_l.innerHTML
}

async function wall_template(owner_id, tabs, default_tab = 'all')
{
    let template = `
        <div class="wall_block">
            <div class='wall_select_block bordered_block'>
                <div id='_shown_layer'>
                    <div class='tabs flexer'>
                        <div id='_insertTabs'></div>
                    </div>
                </div>
                <div id='_search_layer' style='display:none;'>
                    <input type='query' placeholder='${_('wall.search')}'>
                </div>
                <div class='right_side'>
                    <label>
                        ${_('wall.posts_invert')}
                        <input type='checkbox' id='_invert_wall' ${window.s_url.searchParams.get('wall_invert') == 'yes' ? 'checked' : ''}>
                    </label>
                    <div class='icons1 searchIcon'></div>
                </div>
            </div>
            <div class='wall_block_insert'></div>
        </div>
    `
    let template_div = document.createElement('div')
    template_div.innerHTML = template

    tabs.forEach(el => {
        template_div.querySelector('.tabs #_insertTabs').insertAdjacentHTML('beforeend', `
            <a href='site_pages/wall.html?id=${owner_id}&wall_section=${el}' data-ignore='1' data-section='${el}' ${default_tab == el ? `class='selectd'` : ''}>${_(`wall.${el}_posts`)}</a>
        `)
    })

    return template_div.innerHTML
}

// вообще в ахуе что оно работает
function paginator_template(pagesCount, activePage, stepCount = 3) 
{
    let template = `
        <div class='paginator'></div>
    `

    //pagesCount -= 1

    let template_div = document.createElement('div')
    template_div.innerHTML = template

    let pages = []
    let temp_url = new URL(location.href)

    for(let t_page = (activePage - (stepCount - 1)); t_page <= (activePage + (stepCount - 1)); t_page++) {
        if(t_page < 1 || t_page > pagesCount) {
            continue
        }

        pages.push(t_page)
    }
        
    if(activePage > stepCount - 1) {
        temp_url.searchParams.set('page', 1)
        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='1' href='${temp_url}'>«</a>
        `
    }

    if(activePage > 1) {
        temp_url.searchParams.set('page', activePage - 1)
        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${activePage - 1}' href='${temp_url}'>‹</a>
        `
    }

    pages.forEach(page => {
        temp_url.searchParams.set('page', page)

        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${page}' data-page='${activePage}' href='${temp_url}' ${activePage == page ? `class='active'` : ''}>${page}</a>
        `
    })

    if(activePage < pagesCount) {
        temp_url.searchParams.set('page', activePage + 1)
        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${activePage + 1}' href='${temp_url}'>›</a>
        `
    }

    if(activePage < pagesCount - (stepCount - 1)) {
        temp_url.searchParams.set('page', pagesCount)
        template_div.querySelector('.paginator').innerHTML += `
            <a data-ignore='1' data-page='${pagesCount - 1}' href='${temp_url}'>»</a>
        `
    }

    return template_div.innerHTML
}