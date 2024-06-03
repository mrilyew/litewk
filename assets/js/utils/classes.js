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
        if(this.info.from_id) {
            return this.info.from_id
        } else {
            return this.info.owner_id
        }
    }

    getOwner() {
        if(this.getOwnerID() > 0) {
            let uwser = find_owner(this.getOwnerID(), this.profiles, this.groups)
            return new User(uwser)
        } else {
            let cwub = find_owner(this.getOwnerID(), this.profiles, this.groups)
            return new Club(cwub)
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

    constructor(info) {
        super(info)
        this.info = info

        // occupation2work
        if(!this.has('career') && this.has('occupation') && this.info.occupation.type == 'work') {
            this.info.career = [
                {'group_id': this.info.occupation.id}
            ]
        }
    }

    isThisUser() {
        if(!window.active_account) {
            return false
        }

        return this.getId() == window.active_account.vk_info.id
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
        return escape_html(this.info.status ?? _('user_page.no_status'))
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
            partner  = new User(this.info.relation_partner)
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
                let preposition = is_woman ? _('prepositions.for_rus_preposition') : _('prepositions.on_rus_preposition')
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
    
    getHometown() {
        return escape_html(this.info.hometown)
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
        let verb = _('user_page.came_on_site') + ' '
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

class Club extends Faveable {
    constructor(info) {
        super(info)
        this.info = info
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

    getDescription() {
        return format_text(this.info.description)
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
        return this.info.age_limits
    }

    hasAccess() {
        return true
    }

    hasCover() {
        return this.getCover() && this.getCover().enabled == 1 && this.getCover().images
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
}

class Post extends PostLike {
    constructor(info, profiles, groups) {
        super(info)
        this.info = info
        this.profiles = profiles
        this.groups   = groups
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
                
            default:
                return source.data
        }
    }

    getSigner() {
        if(!this.info.signer_id) {
            return null
        } else {
            return new User(find_owner(this.info.signer_id, this.profiles, this.groups))
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
        return post_template(this, this.profiles, this.groups, anything_else)
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

    hasSigner() {
        return this.has('signer_id')
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
            return this.info.image[6].url
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
    constructor(info) {
        super(info)
        this.info = info
    }

    getQuestion() {
        return escape_html(this.info.question)
    }

    getAnswers() {
        return this.info.answers
    }
}

class Comment extends PostLike {
    constructor(info, profiles, groups) {
        super(info)
        this.info = info
        this.profiles = profiles
        this.groups = groups
    }

    isAuthor() {
        return this.info.is_from_post_author
    }

    getTemplate() {
        return comment_template(this, this.getOwner())
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
}

// Без дублирования кода никак.
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

    createNextPage() {
        let rand_id = random_int(0, 5000)

        let div_showmore = document.createElement('div')
        div_showmore.setAttribute('class', 'show_more')
        div_showmore.setAttribute('data-rand', rand_id)
        div_showmore.innerHTML = `<span>${_('pagination.show_more')}</span>`

        div_showmore.onclick = async () => {
            div_showmore.onclick = null
            await this.nextPage()
            $(`.show_more[data-rand=${rand_id}]`).remove()
        }

        this.insert_node.insertAdjacentElement('beforeend', div_showmore)
        showMoreObserver.observe($(`.show_more[data-rand=${rand_id}]`)[0])
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
                return
            }

            await this.page(this.objects.page)

            page_condition = this.objects.page >= 0
        } else {
            if(this.objects.pagesCount < this.objects.page + 1) {
                console.info('Last page reached. Do not care.')
                return
            }

            if(this.objects.page == -1) {
                this.objects.page = 0
            }

            await this.page(this.objects.page)

            page_condition = this.objects.pagesCount > this.objects.page
        }

        if(page_condition) {
            this.createNextPage()
        }

        /*if(window.s_url.searchParams.has('page')) {
            window.s_url.searchParams.set('page', this.objects.page)
            history.pushState({}, '', window.s_url)
        }*/
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

            this.insert_node.insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_wall', objects_data.error.error_msg)}</div>
            `)
        }

        try {
            objects_data = await window.vk_api.call(this.method_name, this.method_params, false)
        } catch(e) {
            error()
            return
        }

        if(objects_data.response.current_level_count) {
            this.objects.count = objects_data.response.current_level_count
        } else {
            this.objects.count = objects_data.response.count
        }
        
        if(objects_data.error) {
            error()
            return
        }

        if(this.method_name != 'wall.getComments' && this.objects.count < 1) {
            let messej = _('wall.no_posts_in_tab')
            if(this.method_name == 'wall.search') {
                messej = _('wall.no_posts_in_search')
            }

            this.insert_node.insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${messej}</div>
            `)
        }

        if(this.inverse) {
            objects_data.response.items = objects_data.response.items.reverse()
        } else {
            this.objects.pagesCount = Math.ceil(this.objects.count / this.objects.perPage)
        }

        let templates = ''
        
        objects_data.response.items.forEach(obj => {
            let ob_j = new this.object_class(obj, objects_data.response.profiles, objects_data.response.groups)
            templates += ob_j.getTemplate()
        })

        if(this.inverse) {
            this.objects.page = Number(number) - 1
        } else {
            this.objects.page = Number(number) + 1
        }
        
        this.insert_node.insertAdjacentHTML('beforeend', templates)

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

        this.setParams('wall.get', temp_params)
        this.clear()

        let temp_url = window.s_url
        temp_url.searchParams.delete('wall_query')
        temp_url.searchParams.set('wall_section', section)
        push_state(temp_url)

        temp_url = null

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

        temp_params.query  = query

        // Баг это или фича, но при вызове wall.search 'count' недействительный. Так что вот так вот.
        temp_params.count  = 100

        this.setParams('wall.search', temp_params)

        /*let temp_url = window.s_url
        temp_url.searchParams.set('wall_section', 'search')
        temp_url.searchParams.set('wall_query', query)
        push_state(temp_url)
        temp_url = null*/

        this.clear()
        this.nextPage()
    }

    clear()
    {
        this.method_params.offset = 0
        this.objects.count = null
        this.objects.pagesCount = 10000

        this.insert_node.innerHTML = ''
    }
}

class Newsfeed extends ClassicListView {
    constructor(type_class, insert_node) {
        super(type_class, insert_node)
        this.object_class = type_class
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
            this.insert_node.insertAdjacentHTML('beforeend', `
                <div class='bordered_block'>${_('errors.error_getting_news', objects_data.error.error_msg)}</div>
            `)
        }

        try {
            objects_data = await window.vk_api.call(this.method_name, this.method_params, false)
        } catch(e) {
            error()
            return
        }

        let templates = ''
        objects_data.response.items.forEach(obj => {
            let ob_j = new this.object_class(obj, objects_data.response.profiles, objects_data.response.groups)
            templates += ob_j.getTemplate()
        })

        this.method_params.start_from = objects_data.response.next_from

        window.s_url.searchParams.set('start_hash', objects_data.response.next_from)
        push_state(window.s_url)

        this.insert_node.insertAdjacentHTML('beforeend', templates)
        this.createNextPage()
    }
}

class VkApi {
    constructor(url, token) {
        this.url = url
        this.token = token
    }

    async call(method, params = [], force = true) {
        let path = this.url + method + `?v=5.199&access_token=` + this.token + '&' + $.param(params)
        let result = JSON.parse(await jsonp(path))
        
        log(`Called method ${method} with params ${JSON.stringify(params)} with force=${String(force)}`)

        if(!force) {
            log(`NO FORCE, result: `)
            log(result)
            return result
        }

        if(result.error) {
            switch(result.error.error_code) {
                default:
                case 0:
                    log(`${method} with params ${JSON.stringify(params)} caused error: ${result.error.error_code} '${result.error.error_msg}'`)
                    
                    add_error(_('errors.vk_api_error', result.error.error_msg), 'vkapierr')
                    return result
                case 14:
                    log(`${method} caused captcha`)
                    return new Promise((resolve, reject) => {
                        let sid = result.error.captcha_sid
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
            log(`SUCCESS, result: `)
            log(result)
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
                        <span style='margin-top: 3px;'>${title}</span>

                        <a href='#' data-ignore='1' id='_close'><span>${_('messagebox.close')}</span></a>
                    </div>
                    <div class='messagebox_body'>
                        <span>${content}</span>
                    </div>
                    <div class='messagebox_buttons'></div>
                </div>
            `
        )

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

        $('#_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
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
                    <span style='margin-top: 3px;'>${title}</span>

                    <a href='#' data-ignore='1' id='_close'><span>${_('messagebox.close')}</span></a>
                </div>
                <div class='fullscreen_view_body'></div>
            </div>
            `
        )

        func($('.fullscreen_view')[0], additional)

        $('#_close').on('click', (e) => {
            e.preventDefault()

            this.close()
        })
    }

    close()
    {
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
            window.site_params.set('active_account', res.response.id)
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
        let acc = accs.find(acc => acc.vk_info.id == id)

        if(!acc) {
            alert('ты чёт попутал')
            return
        }
        
        window.site_params.set('active_account', acc.vk_info.id)
    }

    getActiveAccount()
    {
        let accs = JSON.parse(window.site_params.get('accounts') ?? '[]')

        return accs.find(acc => acc.vk_info.id == Number(window.site_params.get('active_account') ?? 0))
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

window.site_params = new class {
    constructor() {
        if(localStorage.params == undefined) {
            localStorage.params = '{}'
        }
    }

    set(param, value) {
        let params = JSON.parse(localStorage.params) ?? {}
        params[param] = value

        localStorage.params = JSON.stringify(params)
    }

    get(param, def = null) {
        let params = JSON.parse(localStorage.params ?? {})

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

window.s_url = new URL(location.href)
window.accounts = new Accounts
