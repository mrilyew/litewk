// API Objects

class Faveable {
    FAVED_STATUS_NOT = 0
    FAVED_STATUS_YES = 1
    
    isFaved() {
        return this.info.is_favorite == 1
    }

    has(field = '') {
        try {
            return Boolean(this.info[field])
        } catch(e) {
            return false
        }
    }

    hydrate(data) {
        this.info = data
    }
}

class PostLike extends Faveable {
    getTemplate() {
        return ''
    }

    getId() {
        return this.getOwnerID() + '_' + this.getCorrectID()
    }

    getCorrectID() {
        return this.info.id
    }

    getOwnerID() {
        if(this.has('from_id')) {
            return this.info.from_id
        } else {
            return this.info.owner_id
        }
    }

    getOwner() {
        if(this.getOwnerID() > 0) {
            let uwser = find_owner(this.getOwnerID(), this.profiles, this.groups)
            let user_obj = new User
            user_obj.hydrate(uwser)

            return user_obj
        } else if(this.getOwnerID() < 0) {
            let cwub = find_owner(this.getOwnerID(), this.profiles, this.groups)
            let club_obj = new Club
            club_obj.hydrate(cwub)

            return club_obj
        } else {
            let fake_user = new User

            return fake_user
        }
    }

    getDate() {
        return short_date(this.info.date)
    }

    getURL() {
        return ''
    }

    getText() {
        return format_text(this.info.text)
    }

    getAttachments() {
        return this.info.attachments
    }

    getLikes() {
        return this.info.likes.count
    }

    canEdit() {
        return this.info.can_edit == 1
    }

    canDelete() {
        return this.info.can_delete == 1
    }

    isLiked() {
        return this.info.likes.user_likes == 1
    }
}

class User extends Faveable {
    FRIEND_STATUS_NOT = 0
    FRIEND_STATUS_REQUEST_FROM_ME = 1
    FRIEND_STATUS_REQUEST_FROM_USER = 2
    FRIEND_STATUS_IS_FRIEND = 3

    constructor() {
        super()
        this.info = {
            'id': 0,
            'first_name': 'DELETED',
            'friend_status': 0,
            'is_closed': true,
            'last_name': '',
            'can_access_closed': true,
            'photo_50': 'https://vk.com/images/deactivated_50.png',
            'photo_200': 'https://vk.com/images/deactivated_50.png',
            'sex': 3,
        }
    }

    async fromId(id = 0) {
        let info = await window.vk_api.call('users.get', {'user_ids': id, 'fields': 'about,activities,bdate,blacklisted,blacklisted_by_me,books,can_see_all_posts,career,city,common_count,connections,contacts,counters,country,cover,crop_photo,domain,education,exports,followers_count,friend_status,games,has_photo,has_mobile,has_mail,house,home_town,interests,is_subscribed,is_no_index,is_nft,is_favorite,is_friend,image_status,is_hidden_from_feed,is_verified,last_seen,maiden_name,movies,music,military,nickname,online,occupation,personal,photo_200,photo_50,photo_max_orig,quotes,relatives,relation,schools,sex,site,status,tv,universities,verified,wall_default'})
        
        this.info = info.response[0]
    }

    hydrate(data) {
        super.hydrate(data)

        if(!this.has('career') && this.has('occupation') && this.info.occupation.type == 'work') {
            this.info.career = [
                {'group_id': this.info.occupation.id}
            ]
        }

        if(!this.has('id') && this.has('user_id')) {
            this.info.id = this.info.user_id
        }

        if(!this.has('common_count')) {
            this.info.common_count = 0
        }
    }

    isThisUser() {
        if(!window.active_account) {
            return false
        }

        return this.getId() == window.active_account.vk_info.id
    }

    isWoman() {
        return this.info.sex == 1
    }

    getId() {
        return this.info.id
    }

    getRealId() {
        return this.getId()
    }

    getCover() {
        return this.info.cover
    }

    getCoverURL(size = 1) {
        let base = this.getCover()

        if(size > 4) {
            return base.images[1].url
        }

        try {
            return base.images[size].url
        } catch(e) {
            return base.images[1].url
        }
    }
    
    getName() {
        return escape_html(this.info.first_name + ' ' + this.info.last_name)
    }

    getFullName() {
        return escape_html(this.info.first_name + (this.info.nickname ? ` (${this.info.nickname}) ` : ' ') + this.info.last_name + (this.info.maiden_name ? ` (${this.info.maiden_name})` : ''))
    }

    getTextStatus() {
        return format_emojis(escape_html(this.info.status ?? _('user_page.no_status')))
    }

    getDomain() {
        return escape_html(this.info.domain)
    }

    getBdate() {
        return escape_html(format_birthday(this.info.bdate))
    }

    getSex() {
        return this.info.sex == 2 ? _('user_page.male') : _('user_page.female')
    }

    getFriendStatus() {
        return this.info.friend_status
    }

    getAvatar(mini = false) {
        if(mini) {
            return this.info.photo_50
        } else {
            return this.info.photo_200
        }
    }

    getRelationStatus() {
        let is_woman = this.info.sex == 1
        let partner = null

        if(this.info.relation_partner) {
            partner  = new User
            partner.hydrate(this.info.relation_partner)
        }

        switch(this.info.relation) {
            default:
            case 0:
                return _('relation.not_picked')
            case 1:
                return is_woman ? _('relation.female_single') : _('relation.male_single')
            case 2:
                return _('relation.meets_with') + (partner ? ` ${_('prepositions.with_rus_preposition')} <a href='site_pages/user_page.html?id=${partner.getId()}'>` + partner.getName() + '</a>' : '') // "есть друг/есть подруга" в документации кстати
            case 3:
                return (is_woman ? _('relation.female_engaged') : _('relation.male_engaged')) + (partner ? ` ${_('with_rus_preposition')} <a href='site_pages/user_page.html?id=${partner.getId()}'>` + partner.getName() + '</a>' : '')
            case 4:
                let preposition = !is_woman ? _('prepositions.for_rus_preposition') : _('prepositions.on_rus_preposition')
                return is_woman ? _('relation.female_married') : _('relation.male_married') + (partner ? ` ${preposition} <a href='site_pages/user_page.html?id=${partner.getId()}'>` + partner.getName() + '</a>' : '')
            case 5:
                return _('relation.relations_complicated') + (partner ? ` ${_('prepositions.with_rus_preposition')} <a href='site_pages/user_page.html?id=${partner.getId()}'>` + partner.getName() + '</a>' : '')
            case 6:
                return _('relation.active_search')
            case 7:
                return is_woman ? _('relation.female_inlove') : _('relation.male_inlove') + (partner ? ` ${_('prepositions.another_on_rus_preposition')} <a href='site_pages/user_page.html?id=${partner.getId()}'>` + partner.getName() + '</a>' : '')
            case 8:
                return _('relation.in_a_civil_marriage') + (partner ? ` ${_('prepositions.with_rus_preposition')} <a href='site_pages/user_page.html?id=${partner.getId()}'>` + partner.getName() + '</a>' : '')
        }
    }

    getLangs() {
        return escape_html(this.info.personal.langs.join(', '))
    }

    getCity() {
        return escape_html(this.info.city.title) 
    }

    getCountry() {
        return escape_html(this.info.country.title)
    }

    getCountryncity() {
        return (this.has('country') ? this.getCountry() + ', ' : '') + (this.has('city') ? this.getCity() : '')
    }
    
    getHometown() {
        return escape_html(this.info.home_town)
    }

    getMobile() {
        return escape_html(this.info.mobile_phone)
    }

    getHomephone() {
        return escape_html(this.info.home_phone)
    }

    getSkype() {
        return escape_html(this.info.skype)
    }

    getSite() {
        let site = this.info.site
        return escape_html((site.indexOf('https') == -1 && site.indexOf('http') == -1) ? 'https://' + site : site)
    }

    getInterests(type = 'activities') {
        let bad_habits_attitude = [_('attitudes.strongly_negative_views'), _('attitudes.negative_views'), _('attitudes.compromise_views'), _('attitudes.neutral_views'), _('attitudes.positive_views')]

        switch(type) {
            default:
            case 'activities':
                return escape_html(this.info.activities)
            case 'interests':
                return escape_html(this.info.interests)
            case 'music':
                return escape_html(this.info.music)
            case 'movies':
                return escape_html(this.info.movies)
            case 'tv':
                return escape_html(this.info.tv)
            case 'books':
                return escape_html(this.info.books)
            case 'games':
                return escape_html(this.info.games)
            case 'quotes':
                return escape_html(this.info.quotes)
            case 'political':
                let political_views = [_('political_views.communistic_views'), _('political_views.socialistic_views'), _('political_views.moderate_views'), _('political_views.liberal_views'), _('political_views.conservative_views'), _('political_views.monarchic_views'), _('political_views.ultraconservative_views'), _('political_views.indifferent_views'), _('political_views.libertarian_views')]
                return escape_html(political_views[this.info.personal.political - 1] ?? _('political_views.centrist_views'))
            case 'religion':
                return escape_html(this.info.personal.religion)
            case 'life_main':
                let life_mains = [_('life_opinion.family_and_kids'), _('life_opinion.career_and_money'), _('life_opinion.entertainment_and_rest'), _('life_opinion.science_and_investigation'), _('life_opinion.world_imporement'), _('life_opinion.self_development'), _('life_opinion.beauty_and_art'), _('life_opinion.fame_and_influence')]
                return escape_html(life_mains[this.info.personal.life_main - 1] ?? '??')
            case 'people_main':
                let people_mains = [_('life_opinion.mind_and_creativity'), _('life_opinion.kindness_and_honestness'), _('life_opinion.beautiness_and_health'), _('life_opinion.authority_and_richness'), _('life_opinion.courage_and_tenacity'), _('life_opinion.humor_and_life_loving')]
                return escape_html(people_mains[this.info.personal.people_main - 1] ?? '??')
            case 'smoking':
                return escape_html(bad_habits_attitude[this.info.personal.smoking - 1] ?? '??')
            case 'alcohol':
                return escape_html(bad_habits_attitude[this.info.personal.alcohol - 1] ?? '??')
            case 'inspired_by':
                return escape_html(this.info.personal.inspired_by)
        }
    }

    getOnlineType() {
        switch(this.info.last_seen.platform)
        {
            case 1:
                return _('online_types.online_from_mobile_version')
            case 2:
                return _('online_types.online_from_iphone')
            case 3:
                return _('online_types.online_from_ipad')
            case 4:
                return _('online_types.online_from_android')
            case 5:
                return _('online_types.online_from_wp')
            case 6:
                return _('online_types.online_from_w10')
            default:
            case 7:
                return _('online_types.online_from_web')
        }
    }

    getFullOnline() {
        let gend = 'male'

        if(!this.info.last_seen) {
            return _('online_types.online_is_hidden')
        }

        if(this.isWoman()) {
            gend = 'female'
        }

        let verb = _('user_page.came_on_site_'+gend) + ' '
        if(this.info.online == 1) {
            verb = _('online_types.now_online') + ' '
        }
        
        return verb + (this.info.online == 0 ? short_date(this.info.last_seen.time) : '') + ' ' + this.getOnlineType()
    }

    getImageStatus() {
        return this.info.image_status
    }

    getImageStatusURL() {
        return this.info.image_status.images[4].url
    }

    getRelatives() {
        return this.info.relatives
    }

    getMilitary() {
        return this.info.military
    }

    getUrl() {
        return 'site_pages/user_page.html?id=' + this.getId()
    }

    isFriend() {
        if(this.getId() == window.active_account.vk_info.id) {
            return true
        }

        if(!this.info.friend_status) {
            return false
        }

        return this.getFriendStatus() == this.FRIEND_STATUS_IS_FRIEND
    }

    isNotFriend() {
        return this.getFriendStatus() == this.FRIEND_STATUS_NOT
    }

    isBlacklistedByMe() {
        return this.info.blacklisted_by_me == 1
    }

    isVerified() {
        return this.info.verified == 1
    }

    isVerifiedInEsia() {
        return this.info.is_verified
    }

    isPhoneVerified() {
        return this.info.has_mobile == 1
    }

    isIndexing() {
        return !this.info.is_no_index
    }

    isHiddenFromFeed() {
        return this.info.is_hidden_from_feed == 1
    }

    isSubscribed() {
        return this.info.is_subscribed == 1
    }

    isClosed() {
        return this.info.is_closed
    }

    isDeactivated() {
        return this.info.deactivated
    }

    isOnline() {
        return this.info.online == 1
    }

    hasCover() {
        return this.getCover() && this.getCover().enabled == 1 && this.getCover().images
    }

    hasInterests() {
        return this.has('activities') || this.has('interests') || this.has('music') || this.has('movies') || this.has('tv') || this.has('books') || this.has('games') || this.has('quotes')
    }
    
    hasAccess() {
        return this.info.can_access_closed
    }

    hasEducation() {
        return (this.has('universities') && this.info.universities.length > 0) || (this.has('schools') && this.info.schools.length > 0)
    }

    hasRelatives() {
        return this.has('relatives') && this.info.relatives.length > 0
    }

    hasMilitary() {
        return this.has('military') && this.info.military.length > 0
    }

    async getTemplate() {
        return await user_page_template(this)
    }
}

class UserListView extends User {
    getTemplate() {
        return `
            <div class='short_list_item'>
                <div class='short_list_item_avatar avatar'>
                    <a href='${this.getUrl()}'>
                        <img src='${this.info.photo_100}'>
                    </a>
                </div>

                <div class='short_list_item_name'>
                    <div style='display: flex;'>
                        <a href='${this.getUrl()}' ${this.isFriend() ? `class='friended'` : ''}>
                            <b>${this.getName()}</b>
                        </a>

                        ${this.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
                        `<div class='smiley' data-id='${this.getId()}' title='${this.getImageStatus().name}'>
                            <img src='${this.getImageStatusURL()}'>
                        </div>` : ``}
                    </div>

                    ${this.has('status') ? `<span>"${this.getTextStatus()}"</span>` : ''}
                    <span>${this.getFullOnline()}</span>
                    ${this.has('city') ? `<span>${this.getCountryncity()}</span>` : ''}
                    ${!this.isFriend() ? `<a href='site_pages/friends.html?id=${this.getId()}&section=mutual'>${_('counters.mutual_friends_count', this.info.common_count)}</a>` : ''}
                </div>

                <div class='short_list_item_actions' id='_actions'>
                    ${!this.isThisUser() ?
                    `
                    ${this.isNotFriend() ? `<a class='action' id='_toggleFriend' data-val='0' data-addid='${this.getId()}'> ${_('users_relations.start_friendship')}</a>` : ''}
                    ${this.getFriendStatus() == 1 ? `<a class='action' id='_toggleFriend' data-val='1' data-addid='${this.getId()}'> ${_('users_relations.cancel_friendship')}</a>` : ''}
                    ${this.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='4' data-addid='${this.getId()}'> ${_('users_relations.accept_friendship')}</a>` : ''}
                    ${this.getFriendStatus() == 2 ? `<a class='action' id='_toggleFriend' data-val='2' data-addid='${this.getId()}'> ${_('users_relations.decline_friendship')}</a>` : ''}
                    ${this.getFriendStatus() == 3 ? `<a class='action' id='_toggleFriend' data-val='3' data-addid='${this.getId()}'> ${_('users_relations.destroy_friendship')}</a>` : ''}
                    <a class="action">${_('user_page.create_message')}</a>
                    <a class="action" href='site_pages/friends.html?id=${this.getId()}'>${_('user_page.list_friends')}</a>
                    ${!this.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='user' data-addid='${this.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
                    ${this.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='user' data-addid='${this.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
                    ` : ''}
                </div>
            </div>
        `
    }
}

class Club extends Faveable {
    async fromId(id = 0) {
        let info = await window.vk_api.call('groups.getById', {'group_id': id, 'fields': 'activity,addresses,age_limits,ban_info,can_create_topic,can_message,can_post,can_suggest,can_see_all_posts,can_upload_doc,can_upload_story,can_upload_video,city,contacts,counters,country,cover,crop_photo,description,fixed_post,has_photo,is_favorite,is_hidden_from_feed,is_subscribed,is_messages_blocked,links,main_album_id,main_section,member_status,members_count,place,photo_50,photo_200,photo_max_orig,public_date_label,site,start_date,finish_date,status,trending,verified,wall,wiki_page'}, false)

        if(info.error || !info.response.groups) {
            return
        }
        
        this.info = info.response.groups[0]
    }

    hydrate(info) {
        super.hydrate(info)
    }

    getAvatar(mini = false) {
        if(mini) {
            return this.info.photo_50
        } else {
            return this.info.photo_200
        }
    }
    
    getUrl() {
        return 'site_pages/club_page.html?id=' + this.getId()
    }

    getId() {
        return Math.abs(this.info.id)
    }

    getRealId() {
        return this.getId() * -1
    }

    getName() {
        return escape_html(this.info.name)
    }

    getTextStatus() {
        return escape_html(this.info.status)
    }

    getTemplate() {
        return club_template(this)
    }
    
    getCover() {
        return this.info.cover
    }

    getCoverURL(size = 1) {
        let base = this.getCover()

        if(size > 4) {
            return base.images[1].url
        }

        try {
            return base.images[size].url
        } catch(e) {
            return base.images[1].url
        }
    }

    getDescription(cut = 0) {
        let str = this.info.description
        if(cut > 0) {
            str = cut_string(str, cut)
        }

        return format_text(str)
    }
    
    getDomain() {
        return this.info.screen_name
    }

    getActivity() {
        return this.info.activity
    }

    getCounters() {
        return this.info.counters
    }

    getCity() {
        return (this.has('city') ? escape_html(this.info.city.title) : '') + (this.has('city') && this.has('country') ? ', ' : '') + (this.has('country') ? escape_html(this.info.country.title) : '')
    }

    getAgeLimits() {
        if(this.info.age_limits == 2) {
            return '16+'
        } else if(this.info.age_limits == 3) {
            return '18+'
        } else {
            return '0+'
        }
    }

    hasAccess() {
        return true
    }

    hasCover() {
        return this.getCover() && this.getCover().enabled == 1 && this.getCover().images
    }

    hasAccess() {
        if(!this.isClosed()) {
            return true
        } else {
            return this.isMember()
        }
    }
    
    isHiddenFromFeed() {
        return this.info.is_hidden_from_feed == 1
    }

    isFriend() {
        return false
    }
    
    isSubscribed() {
        return this.info.is_subscribed == 1
    }

    isAdmin() {
        return this.info.is_admin == 1
    }
    
    isVerified() {
        return this.info.verified == 1
    }

    isClosed() {
        return this.info.is_closed
    }

    isMember() {
        return this.info.is_member
    }

    isOnline() {
        return false
    }
}

class ClubListView extends Club {
    getTemplate() {
        return `
            <div class='short_list_item'>
                <div class='short_list_item_avatar avatar'>
                    <a href='${this.getUrl()}'>
                        <img src='${this.info.photo_100}'>
                    </a>
                </div>

                <div class='short_list_item_name'>
                    <div style='display: flex;'>
                        <a href='${this.getUrl()}'>
                            <b>${this.getName()}</b>
                        </a>
                    </div>

                    ${this.has('activity') ? `<span>${this.getActivity()}</span>` : ''}
                    ${this.has('description') ? `<span>"${this.getDescription(200)}"</span>` : ''}
                    <a href='site_pages/members.html?id=${this.getId()}'>${_('counters.subscriptions_count', this.info.members_count)}</a>
                </div>

                <div class='short_list_item_actions' id='_actions'>
                    ${this.isClosed() == 0 ? `
                        ${!this.isMember() ? `<a class='action' id='_toggleSub' data-val='0' data-addid='${this.getId()}'> ${_('groups.subscribe')}</a>` : ''}
                        ${this.isMember() ? `<a class='action' id='_toggleSub' data-val='1' data-addid='${this.getId()}'> ${_('groups.unsubscribe')}</a>` : ''}
                    ` : ``}
                    ${!this.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='club' data-addid='${this.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
                    ${this.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='club' data-addid='${this.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
                </div>
            </div>
        `
    }
}

class UnknownListView extends Faveable {
    getTemplate() {
        return `${JSON.stringify(this.info)}`
    }
}

// западло
class ArticleListView extends Faveable {
    getTemplate() {
        return `${this.info.title}`
    } 
}

class Post extends PostLike {
    hydrate(info, profiles, groups) {
        this.info = info
        this.profiles = profiles
        this.groups   = groups
    }

    getId() {
        return this.info.owner_id + '_' + this.info.id
    }

    getGeo() {
        return this.info.geo
    }

    getShortGeo() {
        let geo = this.getGeo()

        return `<a href='https://www.google.com/maps/place/${geo.coordinates}' target='_blank'>${escape_html(geo.place.title)}, ${escape_html(geo.place.country)}</a>`
    }

    getViews() {
        if(!this.hasViews()) {
            return 0
        } else {
            return this.info.views.count
        }
    }

    getCommentsCount() {
        return this.info.comments.count
    }

    getRepostsCount() {
        return this.info.reposts.count
    }

    getRepost() {
        return this.info.copy_history[0]
    }

    getUpperText() {
        let source = this.info.post_source

        // почему не в post_source?
        if(this.info.final_post == 1) {
            let silently = ''
            let gen = 'male'
            
            if(this.info.message.length < 1) {
                silently = '_silently'
            }

            if(this.getOwner().info.sex != 2) {
                gen = 'female'
            }

            return _(`wall.deleted_page${silently}_${gen}`)
        }

        if(!source || !source.data) {
            return null
        }

        switch(source.data) {
            case 'profile_photo':
                if(this.getOwnerID() < 0) {
                    return _('wall.updated_photo_group')
                } else {
                    if(this.getOwner().info.sex == 2) {
                        return _('wall.updated_photo_user_male')
                    } else {
                        return _('wall.updated_photo_user_female')
                    }
                }
            case 'profile_activity':
                if(this.getOwner().info.sex == 2) {
                    return _('wall.updated_status_user_male')
                } else {
                    return _('wall.updated_status_user_female')
                }
            case 'comments':
                let zab = _('wall.left_status_female')
                if(this.getOwner().info.sex == 2) {
                    zab = _('wall.left_status_male')
                }

                return `${zab} <a href='${source.link.url}' target='_blank'>${escape_html(source.link.title)}</a>`
            case 'added_photos':
                return _('newsfeed.added_photos')
            case 'added_videos':
                return _('newsfeed.added_videos')
            case 'tagged_on_photos':
                return _('newsfeed.tagged_on_photos')
            default:
                return source.data
        }
    }

    getSigner() {
        if(!this.info.signer_id) {
            return null
        } else {
            let user = new User
            user.hydrate(find_owner(this.info.signer_id, this.profiles, this.groups))

            return user
        }
    }

    getSource() {
        let copyright = this.info.copyright

        if(copyright.type == "external_link") {
            return `<a href='${copyright.link}' target='_blank'>${escape_html(copyright.name)}</a>`
        } else {
            let sub_link = ''
            if(copyright.link.indexOf('wall')) {
                let subid = (new URL(copyright.link).pathname).replace('/wall', '')
                return `<a href='site_pages/post.html?post=${subid}'>${escape_html(copyright.link)}</a>`
            }
        }
    }
    
    getTemplate(anything_else = {}) {
        return post_template(this, anything_else)
    }
    
    needToHideComments() {
        if(!this.info.comments) {
            return true
        }

        return this.info.comments.can_post == 0 && this.info.comments.count < 1
    }

    isAd() {
        return this.info.marked_as_ads == 1
    }

    isPinned() {
        return this.info.is_pinned == 1
    }

    isntRepost() {
        return this.info.is_favorite != null
    }

    isArchived() {
        return this.info.is_archived
    }

    isCopy() {
        return this.info.copy_history
    }

    canArchive() {
        return this.info.can_archive
    }

    canPin() {
        return this.info.can_pin == 1
    }

    canShut() {
        return this.info.comments && this.info.comments.can_close == 1
    }

    canUp() {
        return this.info.comments && this.info.comments.can_open == 1
    }

    hasRepost() {
        return this.info.copy_history != null && this.info.copy_history.length > 0
    }

    hasSigner() {
        return this.has('signer_id')
    }

    hasGeo() {
        return this.has('geo')
    }
    
    hasAttachments() {
        return this.info.attachments && this.info.attachments.length > 0
    }

    hasViews() {
        return this.has('views') && this.info.views.count > 0
    }

    hasUpperText() {
        return this.has('post_source') && this.info.post_source.data
    }

    hasSource() {
        return this.has('copyright')
    }
}

class Photo extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getURL() {
        return this.getUrlBySize('p')
    }

    getFullSizeURL() {
        if(this.hasSize('w')) {
            return this.getUrlBySize('w')
        } else if(this.hasSize('z')) {
            return this.getUrlBySize('z')
        } else if(this.hasSize('y')) {
            return this.getUrlBySize('y')
        } else if(this.hasSize('r')) {
            return this.getUrlBySize('r')
        } else {
            return this.getUrlBySize('q')
        }
    }

    getUrlBySize(type = 'q') {
        if(!this.hasSize(type)) {
            return this.info.sizes.find(size => size.type == 'x').url
        }

        return this.info.sizes.find(size => size.type == type).url
    }

    hasSize(type = 'z') {
        return this.info.sizes.find(size => size.type == type)
    }

    isVertical() {
        try {
            let size = this.info.sizes[0]
            return size.height > size.width
        } catch(e) {
            return false
        }
    }
}

class Video extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getURL() {
        return this.info.sizes[4].url
    }

    getDuration() {
        return format_seconds(this.info.duration)
    }

    getPreview(num = 3) {
        if(!this.hasPreview()) {
            return ''
        }

        if(!this.info.image[num]) {
            try {
                return this.info.image[3].url
            } catch(e) {
                return this.info.image[0].url
            }
        } else {
            return this.info.image[num].url
        }
    }

    getTitle() {
        return escape_html(this.info.title)
    }

    getViews() {
        return this.info.views
    }
    
    getLocalViews() {
        return this.info.local_views
    }

    hasPreview() {
        return this.has('image')
    }
}

class Audio extends PostLike {
    constructor(info) {
        super(info)
        this.info = info
    }

    getName() {
        return escape_html(this.info.artist + ' — ' + this.info.title)
    }

    getDuration() {
        return format_seconds(this.info.duration)
    }
}

class Poll extends PostLike {
    getQuestion() {
        return escape_html(this.info.question)
    }

    getAnswers() {
        return this.info.answers
    }
}

class Link extends PostLike {
    hasPhoto() {
        return this.has('photo')
    }

    getPhoto() {
        let photo = new Photo
        photo.hydrate(this.info.photo)

        return photo
    }

    getURL() {
        return 'site_pages/resolve_link.html?id=' + this.info.url
    }

    getTitle() {
        return this.info.title
    }
    
    getCaption() {
        return this.info.caption
    }
}

class LinkListView extends Link {
    getTemplate() {
        return `
        <div class='list_attachment link_attachment link_attachment_vertical'>
            ${this.hasPhoto() ? `
            <div class='link_attachment_photo'>
                <img class='photo_attachment' data-type='attached_link' data-full='${this.getPhoto().getURL()}' src='${this.getPhoto().getURL()}'>
            </div>` : ''}

            <div class='link_attachment_info'>
                ${this.has('caption') ? `<a href='${this.getURL()}' target='_blank'><b>${this.getTitle()}</b></a>` : ''}
                <a href='site_pages/resolve_link.html?id=${this.getCaption()}' target='_blank'><span>${this.getCaption()}</span></a>
            </div>

            <div class='link_attachment_actions' id='_actions'>
                ${!this.isFaved() ? `<a class='action' id='_toggleFave' data-link='${this.info.url}' data-val='0' data-type='link'> ${_('faves.add_to_faves')}</a>` : ''}
                ${this.isFaved() ? `<a class='action' id='_toggleFave' data-link='${this.info.url}' data-val='1' data-type='link'> ${_('faves.remove_from_faves')}</a>` : ''}
            </div>
        </div>`
    } 
}

class VideoListView extends Video {
    getTemplate() {
        return `
            ${this.getTitle()}
        `
    }
}

class Doc extends PostLike {
    getExtension() {
        return this.info.ext
    }

    getFileSize() {
        return human_file_size(this.info.size)
    }

    getTitle() {
        return escape_html(this.info.title)
    }

    getURL() {
        return this.info.url
    }

    getPreview() {
        if(this.info.preview.photo) {
            if(this.info.preview.photo.sizes[3]) {
                return this.info.preview.photo.sizes[3].src
            } else {
                return this.info.preview.photo.sizes[0].src
            }
        }

        return ''
    }
}
class Comment extends PostLike {
    hydrate(info, profiles, groups) {
        this.info = info
        this.profiles = profiles
        this.groups = groups

        if(this.info.deleted) {
            this.info.likes = {
                'user_likes': 0,
                'count': 0,
            }
        }
    }

    isAuthor() {
        return this.info.is_from_post_author
    }

    isLiked() {
        return this.info.likes.user_likes == 1
    }

    getId() {
        return this.info.owner_id + '_' + this.info.id
    }

    getOwner() {
        /*if(this.info.deleted) {
            return null
        }*/

        return super.getOwner()
    }

    getTemplate() {
        return comment_template(this)
    }

    getThreadCount() {
        return this.info.thread.count
    }

    hasAttachments() {
        return this.info.attachments && this.info.attachments.length > 0
    }

    hasThread() {
        return this.info.thread && this.getThreadCount() > 0
    }

    canDelete() {
        if(!this.info.can_delete) {
            return this.getOwnerID() == window.active_account.vk_info.id
        }

        return this.info.can_delete == 1
    }
}

// Newsfeed classess

class NewsfeedClass extends Post {
    hydrate(info, profiles, groups) {
        this.info = info
        this.profiles = profiles
        this.groups   = groups
    }

    getOwnerID() {
        return this.info.source_id
    }
}

class WallPhoto extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = post_template(this, {'added_photos': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        this.info.photos.items.forEach(att => {
            att.photo = att
            att.type = 'photo'
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', process_attachments(this.info.photos.items))

        return diver.innerHTML
    }
}

class WallTag extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = post_template(this, {'tagged_photo': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        this.info.photo_tags.items.forEach(att => {
            att.photo = att
            att.type = 'photo'
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', process_attachments(this.info.photo_tags.items))

        return diver.innerHTML
    }
}

class WallVideo extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = post_template(this, {'uploaded_videos': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        this.info.video.items.forEach(att => {
            att.video = att
            att.type = 'video'
        })

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', process_attachments(this.info.video.items))

        return diver.innerHTML
    }
}

class WallAudio extends NewsfeedClass {
    getTemplate() {
        let diver = document.createElement('div')
        diver.innerHTML = post_template(this, {'uploaded_videos': 1})

        diver.querySelector('.contenter').insertAdjacentHTML('beforeend', `
            <div class='attachments'>
                <div class='ordinary_attachments'></div>
            </div>
        `)

        diver.querySelector('.contenter .attachments').insertAdjacentHTML('beforeend', process_attachments(this.info.attachments))

        return diver.innerHTML
    }
}

// Site logic

class ClassicListView {
    constructor(object_class, insert_node)
    {
        this.objects = {
            'count': null,
            'page': -1,
            'pagesCount': null,
            'perPage': 10
        }

        this.object_class = object_class
        this.insert_node  = insert_node
    }

    setParams(method_name, method_params, inverse = false) 
    {
        this.method_name       = method_name
        this.method_params     = method_params
        this.objects.perPage   = method_params.count ?? 10
        method_params.count    = this.objects.perPage ?? 10
        this.inverse           = inverse
    }

    getInsertNode() {
        if(typeof(this.insert_node) == 'string') {
            return document.querySelector(this.insert_node)
        } else {
            return this.insert_node
        }
    }

    createNextPage() {
        if(!$('.show_more')[0]) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `<div class='show_more'>${_('pagination.show_more')}</div>`)
            
            if(window.site_params.get('ux.auto_scroll', '1') == '1') {
                init_observers()
            }
        } else {
            this.getInsertNode().append($('.show_more')[0])
        }
    }

    async nextPage()
    {
        let page_condition = false
        // ой биляя накостылял я тут
        if(this.inverse) {
            if(!this.objects.count) {
                await new Promise(pr => setTimeout(pr, 3000))
                let count = await window.vk_api.call(this.method_name, this.method_params) 

                this.objects.count = count.response.count
            }

            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)

            if(this.objects.page == -1) {
                this.objects.page = this.objects.pagesCount - 1
            }

            if(this.objects.page < 0) {
                console.info('Last page reached. Do not care.')
                $('.show_more').remove()
                return
            }

            try {
                await this.page(this.objects.page)
            } catch(e) {
                return 'ERR'
            }

            page_condition = this.objects.page >= 0
        } else {
            if(this.objects.pagesCount < this.objects.page + 1) {
                console.info('Last page reached. Do not care.')
                $('.show_more').remove()
                return
            }

            if(this.objects.page == -1) {
                this.objects.page = 0
            }

            try {
                await this.page(this.objects.page)
            } catch(e) {
                log(e)

                return 'ERR'
            }
            
            page_condition = this.objects.pagesCount > this.objects.page
        }

        if(page_condition) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.s_url.searchParams.set('page', this.objects.page)
            history.pushState({}, '', window.s_url)
        }
    }

    async page(number = 0)
    {
        if(number < 0) {
            number = 0
        }
        
        let objects_data = null
        this.method_params.offset = number * this.objects.perPage + (this.objects.special_offset ?? 0)

        let error = () => {
            this.objects.count = 0
            this.objects.pagesCount = 0

            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_wall', objects_data.error.error_msg ? objects_data.error.error_msg : 'unknown error :( maybe timeout')}</div>
            `)
        }

        try {
            objects_data = await window.vk_api.call(this.method_name, this.method_params, false)

            if(!objects_data.response) {
                objects_data.response = {}
                objects_data.count = 0
            }
        } catch(e) {
            error()
            return
        }

        let messej = _('wall.no_posts_in_tab')
        let items  = objects_data.response.items
        let count  = objects_data.response.count

        switch(this.method_name) {
            default:
                messej  = _('wall.no_posts_in_tab')
                break
            case 'wall.getComments':
                count = objects_data.response.current_level_count
                break
            case 'wall.search':
                messej = _('wall.no_posts_in_search')
                break
            case 'friends.get':
            case 'friends.getRequests':
            case 'friends.getSuggestions':
            case 'friends.getFriendsDeletionSuggestions':
            case 'friends.search':
            case 'execute':
                messej = _('errors.friends_not_found')
                break
            case 'friends.getOnline':
                // сака
                items = objects_data.response.profiles
                count = objects_data.response.total_count
                messej = _('errors.friends_online_not_found')
                break
            case 'users.getFollowers':
                messej = _('errors.followers_not_found')
                break
            case 'groups.get':
            case 'groups.getRecents':
                messej = _('errors.groups_not_found')
                break
        }

        this.objects.count = count

        log(objects_data)
        if(objects_data.error) {
            error()
            return
        }

        if(this.method_name != 'wall.getComments' && this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${messej}</div>
            `)
        }

        if(this.inverse) {
            objects_data.response.items = objects_data.response.items.reverse()
        } else {
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }

        let templates = ''

        if(items) {
            items.forEach(obj => {
                let ob_j = new this.object_class
                ob_j.hydrate(obj, objects_data.response.profiles, objects_data.response.groups)
    

                try {
                    templates += ob_j.getTemplate()
                } catch(e) {
                    log(e)
    
                    templates += `
                        <div class='error_template bordered_block'>
                            <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
                        </div>
                    `
                }
            })
        }

        if(this.inverse) {
            this.objects.page = Number(number) - 1
        } else {
            this.objects.page = Number(number) + 1
        }
        
        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if($('.paginator')[0]) {
            let parent = $('.paginator')[0].parentNode
            $('.paginator').remove()

            parent.insertAdjacentHTML('beforeend', paginator_template(this.objects.pagesCount, number + 1))
        }
    }

    setSection(section, query = null) 
    {
        if(query) {
            return this.search(query)
        }

        let temp_params = this.method_params
        temp_params.filter = section
        temp_params.offset = 0
        this.objects.page = -1

        this.setParams(this.method_name, temp_params)
        this.clear()

        this.nextPage()
    }

    async search(query) 
    {
        this.objects.perPage = 100
        let temp_params = this.method_params
        temp_params.owner_id = this.method_params.owner_id

        if(this.objects.page == -1) {
            temp_params.offset = 0
        } else {
            temp_params.offset = this.objects.page * this.objects.perPage
        }

        temp_params.query = query

        // Баг это или фича, но при вызове wall.search 'count' недействительный. Так что вот так вот.
        temp_params.count  = 100

        this.setParams('wall.search', temp_params)

        let temp_url = window.s_url
        temp_url.searchParams.set('wall_section', 'search')
        temp_url.searchParams.set('wall_query', query)

        replace_state(temp_url)
        
        temp_url = null

        this.clear()
        this.nextPage()
    }

    clear()
    {
        this.method_params.offset = 0
        this.objects.count = null
        this.objects.pagesCount = 10000

        this.getInsertNode().innerHTML = ''
    }
}

class Newsfeed extends ClassicListView {
    constructor(insert_node) {
        super(null, insert_node)
        this.insert_node  = insert_node
    }

    setParams(method_name, method_params) 
    {
        this.method_name       = method_name
        this.method_params     = method_params
    }

    async nextPage() {
        let objects_data = null

        let error = () => {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_news', objects_data.error.error_msg)}</div>
            `)
        }

        try {
            if(window.use_execute) {
                objects_data = await window.vk_api.call('execute', {'code': `
                    var all = []; 
                    var news = API.${this.method_name}(${JSON.stringify(this.method_params)}); 
                    var lists = API.newsfeed.getLists({"extended": 1}); 
                    all.news = news; 
                    all.lists = lists; 
                    
                    return all;
                `}, false)
            } else {
                objects_data = {'response': {}}
                let news = await window.vk_api.call(this.method_name, this.method_params)
                let lists = await window.vk_api.call('newsfeed.getLists', {"extended": 1})

                objects_data.response.news = news.response
                objects_data.response.lists = lists.response
            }
        } catch(e) {
            error()
            return
        }

        /* сегодня был хороший день и я доволен */
        let templates = ''
        this.lists = objects_data.response.lists

        if(objects_data.response.news.items.length < 1) {
            return
        }

        objects_data.response.news.items.forEach(obj => {
            let object_class = Post

            switch(obj.type) {
                case 'post':
                    object_class = Post
                    break
                case 'wall_photo':
                    object_class = WallPhoto
                    break
                case 'photo_tag':
                    object_class = WallTag
                    break
                case 'video':
                    object_class = WallVideo
                    break
                case 'audio':
                    object_class = WallAudio
                    break
                default:
                    return
            }

            let ob_j = new object_class
            ob_j.hydrate(obj, objects_data.response.news.profiles, objects_data.response.news.groups)

            try {
                templates += ob_j.getTemplate()
            } catch(e) {
                log(e)
                templates += `
                    <div class='error_template bordered_block'>
                        <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
                    </div>
                `
            }
        })

        this.method_params.start_from = objects_data.response.news.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.s_url.searchParams.set('start_hash', objects_data.response.news.next_from)
            push_state(window.s_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if(objects_data.response.news.items.length > 9) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }
    }

    clear() {
        delete this.method_params.start_from
        this.getInsertNode().innerHTML = ''
    }
}

class RecommendedGroups extends Newsfeed {
    t_count = 0
    
    async nextPage() {
        let recoms = await window.vk_api.call(this.method_name, this.method_params)
        let templates = ''
        this.t_count += 10

        if(recoms.response.items.length < 1 || this.t_count > recoms.response.count) {
            $('.show_more').remove()
            return
        }

        recoms.response.items.forEach(obj => {
            let ob_j = new ClubListView
            ob_j.hydrate(obj.group)

            try {
                templates += ob_j.getTemplate()
            } catch(e) {
                templates += `
                    <div class='error_template bordered_block'>
                        <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
                    </div>
                `
            }
        })

        this.method_params.start_from = recoms.response.next_from

        if(window.site_params.get('ux.save_scroll', '0') == '1') {
            window.s_url.searchParams.set('start_hash', recoms.response.next_from)
            push_state(window.s_url)
        }

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if(recoms.response.items.length > 8) {
            this.createNextPage()
        } else {
            $('.show_more').remove()
        }
    }
}

class Bookmarks extends ClassicListView {
    constructor(insert_node)
    {
        super(null, insert_node)
        
        this.objects_list = []
        this.objects.profiles = []
        this.objects.groups = []
    }

    async page(number = 0)
    {
        if(number < 0) {
            number = 0
        }
        
        let objects_data = null
        this.method_params.offset = number * this.objects.perPage + (this.objects.special_offset ?? 0)

        let error = () => {
            this.objects.count = 0
            this.objects.pagesCount = 0

            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block error_block'>${_('errors.error_getting_wall', objects_data.error.error_msg ? objects_data.error.error_msg : 'unknown error :( maybe timeout')}</div>
            `)
        }

        try {
            objects_data = await window.vk_api.call(this.method_name, this.method_params, false)

            if(!objects_data.response) {
                objects_data.response = {}
                objects_data.count = 0
            }
        } catch(e) {
            error()
            return
        }

        let messej = _('errors.bookmarks_all_not_found')
        let items  = objects_data.response.items
        let count  = objects_data.response.count
        this.objects.count = count
        this.objects.profiles = this.objects.profiles.concat(objects_data.response.profiles)
        this.objects.groups = this.objects.groups.concat(objects_data.response.groups)

        if(objects_data.error) {
            error()
            return
        }

        if(this.objects.count < 1) {
            this.getInsertNode().insertAdjacentHTML('beforeend', `
                <div class='bordered_block error_block'>${messej}</div>
            `)
        }

        if(items.length < 10) {
            this.objects.pagesCount = number + 1
        } else {
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }

        let templates = ''
        
        if(items) {
            items.forEach(obj => {
                templates += this.insertItem(obj)
            })
        }

        this.objects.page = Number(number) + 1
        this.objects_list = this.objects_list.concat(items)

        this.getInsertNode().insertAdjacentHTML('beforeend', templates)

        if($('.paginator')[0]) {
            let parent = $('.paginator')[0].parentNode
            $('.paginator').remove()

            parent.insertAdjacentHTML('beforeend', paginator_template(this.objects.pagesCount, number + 1))
        }
    }

    insertItem(obj) {
        let obj_class = null
        let return_template = ``

        switch(obj.type) {
            default:
                obj_class = UnknownListView
                break
            case 'user':
                obj_class = UserListView
                break
            case 'group':
                obj_class = ClubListView
                break
            case 'post':
                obj_class = Post
                break
            case 'article':
                obj_class = ArticleListView
                break
            case 'link':
                obj_class = LinkListView
                break
            case 'video':
                obj_class = VideoListView
                break
        }
        
        let obj_item = new obj_class
        obj_item.hydrate(obj[obj.type], this.objects.profiles, this.objects.groups)

        try {
            let templater = '<div>' 
            templater += obj_item.getTemplate()

            if(obj.tags && obj.tags.length > 0) {
                templater += `
                <div class='template_tags_inserter'>
                    <b>${_('bookmarks.tags')}:</b>
                `

                obj.tags.forEach(tag => {
                    templater += `
                        <div>
                            <a href='site_pages/faves.html?section=${obj.type}&tag_id=${tag.id}'>${escape_html(tag.name)}</a>
                        </div>
                    `
                })

                templater += `</div>`
            }

            templater += '</div>'
            return_template += templater
        } catch(e) {
            log(e)

            return_template += `
                <div class='error_template bordered_block'>
                    <span>${_('errors.template_insert_failed', escape_html(e.message))}</span>
                </div>
            `
        }

        return return_template
    }

    localSearch(query) {
        if(query.length < 1) {
            this.getInsertNode().innerHTML = this.old_templates
            this.old_templates = null
            showMoreObserver.observe($('.show_more')[0])

            return
        } else {
            if(this.old_templates == null || this.old_templates == undefined) {
                this.old_templates = this.getInsertNode().innerHTML
            }
        }

        let arr = this.objects_list.filter(obj => array_deep_search(obj, query));
        if(arr && arr.length > 0) {
            let all_templates = ''

            if($('.show_more')[0]) {
                showMoreObserver.unobserve($('.show_more')[0])
            }
            
            this.clear()

            arr.forEach(obj => {
                all_templates += this.insertItem(obj)
            })

            this.getInsertNode().insertAdjacentHTML('beforeend', all_templates)
        } else {
            return
        }
    }
}

class VkApi {
    constructor(url, token) {
        this.url = url
        this.token = token
    }

    async call(method, params = [], force = true) {
        let path = this.url + method + `?v=5.199&access_token=` + this.token + '&' + $.param(params)
        let result = null

        if(window.site_params.get('internal.use_proxy', '0') == '1') {
            path = `https://api.allorigins.win/get?url=${encodeURIComponent(path)}`
            result = JSON.parse(await jsonp(path))
            result = JSON.parse(result.contents)
        } else {
            result = JSON.parse(await jsonp(path))
        }
        
        log(`Called method ${method} with params ${JSON.stringify(params)} with force=${String(force)}`)
        
        if(!force) {
            //log(`NO FORCE, result: `)
            //log(result)

            document.cookie = ''
            return result
        }

        if(result.error) {
            switch(result.error.error_code) {
                default:
                case 0:
                    log(`${method} with params ${JSON.stringify(params)} caused error: ${result.error.error_code} '${result.error.error_msg}'`)
                    
                    add_error(_('errors.vk_api_error', result.error.error_msg), 'vkapierr')
                    document.cookie = ''
                    return result
                case 14:
                    log(`${method} caused captcha`)
                    return new Promise((resolve, reject) => {
                        let sid = result.error.captcha_sid

                        document.cookie = ''
                        let msg = new MessageBox(_('captcha.enter_captcha'), `
                            <div class='captcha_box'>
                                <div>
                                    <img src='${result.error.captcha_img}'>
                                </div>
                                <input type='text' id='_captchaEnter' placeholder='${_('captcha.enter_captcha_there')}'>
                            </div>
                        `, [_('messagebox.cancel'), _('messagebox.enter')], [
                            () => {
                                log('Captcha closed.')
                                msg.close()
                            },
                            () => {
                                let new_params = params

                                new_params.captcha_sid = sid
                                new_params.captcha_key = $('#_captchaEnter')[0].value

                                msg.close()

                                log('Entered captcha.')
                                resolve(this.call(method, new_params, force))
                            }
                        ])
                    })
            }
        } else {
            //log(`SUCCESS, result: `)
            //log(result)

            document.cookie = ''
            return result
        }
    }
}

class MessageBox {
    constructor(title, content, buttons, buttons_actions, additional = {}) {
        $('body').addClass('dimmed')
        $('.wrapper')[0].insertAdjacentHTML('beforeend', 
            `
                <div class='messagebox'>
                    <div class='messagebox_title'>
                        <span>${title}</span>

                        <a href='#' data-ignore='1' id='_close'>${_('messagebox.close')}</a>
                    </div>
                    <div class='messagebox_body'>
                        <span>${content}</span>
                    </div>
                    ${buttons ? `<div class='messagebox_buttons'></div>` : ''}
                </div>
            `
        )
        
        $('.dimmed .dimmer').on('click', (e) => {
            log(e)
            this.close()
        })
        
        document.onkeyup = (e) => {
            if(e.keyCode == 27) {
                this.close()
            }
        }

        if(buttons_actions) {
            let i = 0
            buttons.forEach(b => {
                let btn = document.createElement('input')
                //btn.setAttribute('class', 'showmore')
                btn.setAttribute('type', 'button')
                btn.setAttribute('value', b)
                btn.onclick = buttons_actions[i]
    
                $('.messagebox_buttons')[0].insertAdjacentElement('beforeend', btn)
                btn = null
                i += 1
            })
    
            i = null
        }

        $('.messagebox_title #_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
        document.onkeyup = null
        $('body').removeClass('dimmed')
        $('.wrapper .messagebox').remove()

        delete this
    }
}

class MessageWindow {
    constructor(title, func, additional = {}) {
        $('body').addClass('dimmed')
        $('.wrapper')[0].insertAdjacentHTML('beforeend', 
            `
            <div class='fullscreen_view'>
                <div class='fullscreen_view_title'>
                    <span>${title}</span>

                    <div class='fullscreen_buttons'>
                        <a href='#' data-ignore='1' id='_close'><span>${_('messagebox.close')}</span></a>
                    </div>
                </div>
                <div class='fullscreen_view_body'></div>
            </div>
            `
        )

        $('.dimmed .dimmer').on('click', (e) => {
            this.close()
        })

        document.onkeyup = (e) => {
            if(!this) {
                return
            }

            if(e.keyCode == 27) {
                this.close()
            }
        }

        func($('.fullscreen_view')[0], additional)

        $('#_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
        document.onkeyup = null
        $('body').removeClass('dimmed')
        $('.wrapper .fullscreen_view').remove()
    }
}

class Accounts {
    constructor()
    {
        return /*JSON.parse(window.site_params.get('accounts') ?? '{}')*/
    }

    async addAccount(path, token, make_active = true)
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')
        let acc = accs.find(acc => acc.vk_token == token)

        if(acc) {
            return
        }

        let temp_api = new VkApi(path, token)
        let res = await temp_api.call('account.getProfileInfo', {})

        if(res.error) {
            return false
        }
        
        accs.push({
            'vk_token': token,
            'vk_path': path,
            'vk_info': res.response,
        })
        
        window.site_params.set('accounts', JSON.stringify(accs))

        if(make_active) {
            window.site_params.set('active_account', token)
        }

        temp_api = null
        res = null

        return true
    }

    removeAccount(id)
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')
        let acc = accs.find(acc => acc.vk_info.id == token)
        let i = accs.indexOf(acc)

        if(!accs[i]) {
            return
        }

        window.site_params.set('accounts', JSON.stringify(accs.splice(i, 1)))
        return true
    }

    setActiveAccount(id)
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')
        let acc = accs.find(acc => acc.vk_token == id)

        if(!acc) {
            alert('бляха хорош пёс')
            return
        }
        
        window.site_params.set('active_account', acc.vk_token)
    }

    getAccount(token)
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')

        return accs.find(acc => acc.vk_token == token)
    }

    getActiveAccount()
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')

        return accs.find(acc => acc.vk_token == window.site_params.get('active_account'))
    }

    getAccountsCount()
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')
        if(!accs) {return 0}

        return accs.length
    }

    getAccounts()
    {
        return JSON.parse(window.site_params.get('accounts') ?? '[]')
    }
}

window.router = new class {
    save_page(url) {
        let maybe = window.saved_pages.find(el => el.url == url)
        let tempar = Object.assign({}, window.main_classes)

        let insert = {
            'url': url,
            'html': $('.page_content')[0].innerHTML,
            'classes': tempar,
            'scroll': window.scrollY,
            'temp_scroll': window.temp_scroll,
            'title': document.title
        }

        if(maybe) {
            window.saved_pages[window.saved_pages.indexOf(maybe)] = insert

            return true
        }
            
        window.saved_pages.push(insert)
        return true
    }

    load_saved_page(page) {
        window.main_classes = null
        window.main_classes = page.classes
        window.temp_scroll  = page.temp_scroll
        document.title = page.title
        
        replace_state(page.url)

        $('.page_content')[0].innerHTML = page.html
        init_observers()
        
        window.scrollTo(0, page.scrollY)
        $(document).trigger('scroll')
    }

    reset_page() {
        $('#_main_page_script').remove()
        $('.page_content')[0].innerHTML = ``
        
        window.page_class = null
        window.temp_scroll = null
    }
    
    restart(add) {
        let temp_menu = $('.menu')[0].innerHTML

        $('style').remove()
        $('div').remove()

        window.main_class.load_layout(add)
        $(document).trigger('scroll')
        $('.menu')[0].innerHTML = temp_menu
    }

    async route(url, history_log = true) {
        let may = window.saved_pages.find(page => page.url == url)

        if(window.s_url.href != url) {
            this.save_page(window.s_url.href)
        }

        if(may && may.url.indexOf('auth') == -1 && may.url.indexOf('settings') == -1 && may.url.indexOf('resolve') == -1) {
            this.load_saved_page(may)
            return
        }

        let main_part = ((new URL(url)).pathname.split('.')[0]).split('/')[2]
    
        if(main_part == 'site_pages') {
            main_part = ((new URL(url)).pathname.split('.')[0]).split('/')[3]
        }

        this.reset_page()

        if(history_log && window.s_url.href != url) {
            push_state(url)
        }

        await append_script(`assets/js/pages/${main_part}.js`, true) // т.н. костыль?
        this.save_page(url)

        init_observers()
        $(document).trigger('scroll')
    }
}

window.site_params = new class {
    constructor() {
        if(localStorage.params == undefined) {
            localStorage.params = '{}'
        }
    }

    set(param, value) {
        let params = JSON.parse(localStorage.params) ?? {}
        params[param] = value

        localStorage.setItem('params', JSON.stringify(params))
    }

    get(param, def = null) {
        let params = JSON.parse(localStorage.params ?? {})

        if(params[param] == '0') {
            return '0'
        }

        return params[param] ? params[param] : def
    }

    has(param) {
        let params = JSON.parse(localStorage.params ?? {})

        return params[param] != null || params[param] != undefined
    }

    is(param, value) {
        let params = JSON.parse(localStorage.params ?? {})

        return params[param] != value
    }

    delete(param) {
        this.set(param, undefined)
        return 1
    }

    deleteAll() {
        localStorage.removeItem('params')
    }
}
