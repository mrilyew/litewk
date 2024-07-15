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

    async fromId(id = 0, need_blocks = false) {
        let filds = 'about,activities,bdate,blacklisted,blacklisted_by_me,books,can_see_all_posts,career,city,common_count,connections,contacts,counters,country,cover,crop_photo,domain,education,exports,followers_count,friend_status,games,has_photo,has_mobile,has_mail,house,home_town,interests,is_subscribed,is_no_index,is_nft,is_favorite,is_friend,image_status,is_hidden_from_feed,is_verified,last_seen,maiden_name,movies,music,military,nickname,online,occupation,personal,photo_200,photo_50,photo_max_orig,quotes,relatives,relation,schools,sex,site,status,tv,universities,verified,wall_default'
        let info = null
        if(!window.use_execute) {
            info = await window.vk_api.call('users.get', {'user_ids': id, 'fields': filds})
            info = info.response[0]

            let users_to_insert = ''
            let groups_to_insert = ''
            let cities_to_insert = ''

            if(info.career) {
                info.career.forEach(car => {
                    if(car.group_id) {
                        groups_to_insert += car.group_id + ",";
                    }

                    if(car.city_id) {
                        cities_to_insert += car.city_id + ",";
                    }
                })
            }

            if (info.relatives) {
                info.relatives.forEach(rel => {
                    users_to_insert += rel.id + ",";
                })
            }

            if (info.schools) {
                info.schools.forEach(sch => {
                    if(sch.id) {
                        cities_to_insert += sch.city + ",";
                    }
                })
            }
            
            if (info.universities) {
                //                       k
                info.universities.forEach(uni => {
                    if(uni.id) {
                        cities_to_insert += uni.city + ",";
                    }
                })
            }

            if (info.relation_partner) {
                users_to_insert += info.relation_partner.id + ",";
            }

            info.additional = {
                'groups': [],
                'users': [],
                'cities': [],
            }

            info.additional.groups = await window.vk_api.call('groups.getById', {'group_ids': groups_to_insert}, false)
            
            try {
                info.additional.groups = info.additional.groups.response.groups
            } catch(e){}

            info.additional.users = await window.vk_api.call('users.get', {'user_ids': users_to_insert}, false)

            try {
                info.additional.users = info.additional.users.response
            } catch(e){}

            info.additional.cities = await window.vk_api.call('database.getCitiesById', {'city_ids': cities_to_insert}, false)

            try {
                info.additional.cities = info.additional.cities.response
            } catch(e){}

            if(need_blocks) {
                info.main_photos = await window.vk_api.call('photos.getAll', {"owner_id": info.id, "count": 6, "skip_hidden": 1}, false)
                
                info.main_photos = info.main_photos.response

                info.friends = await window.vk_api.call('friends.get', {"user_id": info.id, "count": 6, "order": window.site_params.get('ux.friends_block_sort', 'hints'), 'fields': Utils.typical_fields}, false)
                
                info.friends = info.friends.response
                
                info.friends_online = await window.vk_api.call('friends.getOnline', {"user_id": info.id, "count": 6, "order": 'random', 'extended': 1, 'fields': Utils.typical_fields}, false)
                
                info.friends_online = info.friends_online.response

                try {
                    info.friends_online = {
                        'count': info.friends_online.total_count,
                        'items': info.friends_online.profiles
                    }
                } catch(e) {}

                if(window.site_params.get('internal.use_proxy', '0') == '1') {
                    await Utils.sleep(3000)
                }

                info.subscriptions = await window.vk_api.call('users.getSubscriptions', {"user_id": info.id, "extended": 1, 'count': 6, "fields": Utils.typical_fields + ',' + Utils.typical_group_fields}, false);
                
                try {
                    info.subscriptions = info.subscriptions.response
                } catch(e) {}

                info.gifts = await window.vk_api.call('gifts.get', {"user_id": info.id, 'count': 6}, false);
                
                try {
                    info.gifts = info.gifts.response
                } catch(e) {}

                info.videos = await window.vk_api.call('video.get', {"owner_id": info.id, 'count': 2}, false);
                
                try {
                    info.videos = info.videos.response
                } catch(e) {}

                if(window.site_params.get('internal.use_proxy', '0') == '1') {
                    await Utils.sleep(3000)
                }

                info.albums = await window.vk_api.call('photos.getAlbums', {"owner_id": info.id, 'count': 2, 'need_covers': '1'}, false);
                
                try {
                    info.albums = info.albums.response
                } catch(e) {}
            }

            this.info = info
        } else {
            // Вк не возвращает по умолчанию в некоторых местах так нужные объекты.
            // Придётся получать их вручную(
            
            info = await window.vk_api.call('execute', {'code': `
                var user = API.users.get({"user_ids": "${id}", "fields": "${filds}"})[0];
                var additional_arrays = {"groups": [], "users": [], "cities": []};

                var groups_to_insert = "";
                var users_to_insert = "";
                var cities_to_insert = "";
                
                if (user.career) {
                    var j = 0;
                    while (j < user.career.length) {
                        if (user.career[j].group_id) {
                            groups_to_insert = groups_to_insert + user.career[j].group_id + ",";
                        }

                        if (user.career[j].city_id) {
                            cities_to_insert = cities_to_insert + user.career[j].city_id + ",";
                        }
                        j = j + 1;
                    }
                }

                if (user.relatives) {
                    var k = 0;
                    while (k < user.relatives.length) {
                        if (user.relatives[k].id) {
                            users_to_insert = users_to_insert + user.relatives[k].id + ",";
                        }
                        k = k + 1;
                    }
                }

                if (user.schools) {
                    var q = 0;
                    while (q < user.schools.length) {
                        if (user.schools[q].id) {
                            cities_to_insert = cities_to_insert + user.schools[q].city + ",";
                        }
                        q = q + 1;
                    }
                }
                
                if (user.universities) {
                    var z = 0;
                    while (z < user.universities.length) {
                        if (user.universities[z].id) {
                            cities_to_insert = cities_to_insert + user.universities[z].city + ",";
                        }
                        z = z + 1;
                    }
                }

                if (user.relation_partner) {
                    users_to_insert = users_to_insert + user.relation_partner.id + ",";
                }

                additional_arrays.groups = API.groups.getById({"group_ids": groups_to_insert, "fields": "${window.Utils.typical_group_fields}"}).groups;
                additional_arrays.users = API.users.get({"user_ids": users_to_insert, "fields": "${window.Utils.typical_fields}"});
                additional_arrays.cities = API.database.getCitiesById({"city_ids": cities_to_insert});

                user.additional = additional_arrays;

                ${need_blocks ? `
                    user.main_photos = API.photos.getAll({"owner_id": user.id, "count": 6, "skip_hidden": 1});
                    user.friends = API.friends.get({"user_id": user.id, "count": 6, "order": "${window.site_params.get('ux.friends_block_sort', 'hints')}", "fields": "${Utils.typical_fields}"});
                    user.friends_online = API.friends.getOnline({"user_id": user.id, "count": 6, "order": "random", "extended": 1, "fields": "${Utils.typical_fields}"});
                    user.friends_online = {
                        "count": user.friends_online.total_count,
                        "items": user.friends_online.profiles,
                    };

                    user.subscriptions = API.users.getSubscriptions({"user_id": user.id, "count": 6, "extended": 1, "fields": "${Utils.typical_fields + ',' + Utils.typical_group_fields}"});
                    user.gifts = API.gifts.get({"user_id": user.id, "count": 6});
                    user.videos = API.video.get({"owner_id": user.id, "count": 2});
                    user.albums = API.photos.getAlbums({"owner_id": user.id, "count": 2, "need_covers": 1});
                ` : ''}
                
                return user;
            `})

            info = info.response
        }
        
        // А ещё execute не позволяет вставлять значения в полученный объект, так что ещё, блять, костылим.

        if(info.career && info.career.length > 0) {
            info.career.forEach(career => {
                let career_index =  info.career.indexOf(career)
            
                if(info.career[career_index].group_id) {
                    let group_id = info.career[career_index].group_id
            
                    info.career[career_index].group = info.additional.groups.find(el => el.id == group_id)
                }
            
                if(info.career[career_index].city_id) {
                    let city_id = info.career[career_index].city_id
            
                    info.career[career_index].city = info.additional.cities.find(el => el.id == city_id)
                }
            })
        }
        
        if(info.schools && info.schools.length > 0) {
            info.schools.forEach(school => {
                let school_index = info.schools.indexOf(school)
            
                if(info.schools[school_index].city) {
                    let city = info.schools[school_index].city
            
                    info.schools[school_index].city_name = info.additional.cities.find(el => el.id == city).title
                }
            })
        }
                    
        if(info.universities && info.universities.length > 0) {
            info.universities.forEach(univer => {
                let university_index = info.universities.indexOf(univer)
            
                if(info.universities[university_index].city) {
                    let city = info.universities[university_index].city
            
                    info.universities[university_index].city_name = info.additional.cities.find(el => el.id == city).title
                }
            })
        }
        
        if(info.relatives && info.relatives.length > 0) {
            info.relatives.forEach(relative => {
                let relative_index = info.relatives.indexOf(relative)
                if(relative.id && relative.id > 0) {
                    let relative_id = info.relatives[relative_index].id
            
                    info.relatives[relative_index].user = info.additional.users.find(el => el.id == relative_id)
                }
            })
        }

        if(info.relation_partner) {
            info.relation_partner.user_object = info.additional.users.find(el => el.id == info.relation_partner.id)
        }
                
        this.info = info
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

        return this.getId() == window.active_account.info.id
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

    async getRegistrationDate()
    {
        const path = `https://api.allorigins.win/get?url=${encodeURIComponent('https://vk.com/foaf.php?id='+this.getId())}`
        const parser = new DOMParser()

        let result = JSON.parse(await Utils.jsonp(path))
        result = parser.parseFromString(result.contents, "text/xml")

        let date = result.getElementsByTagName('ya:created')[0]
        date = date.getAttribute('dc:date')

        if(date) {
            let js_date = moment(date, 'YYYY.MM.DDThh:mm:ss')
            
            return Utils.short_date(js_date.unix(), true)
        } else {
            return '01.01.1970'
        }
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

    getFirstName() {
        return Utils.escape_html(this.info.first_name)
    }
    
    getName() {
        return Utils.escape_html(this.info.first_name + ' ' + this.info.last_name)
    }

    getFullName() {
        return Utils.escape_html(this.info.first_name + (this.info.nickname ? ` (${this.info.nickname}) ` : ' ') + this.info.last_name + (this.info.maiden_name ? ` (${this.info.maiden_name})` : ''))
    }

    getHTMLName() {
        return `
        <div class='user_info_with_name'>
            <span class='user_name ${this.isFriend() ? ' friended' : ''}'>${this.getFullName()}</span>

            ${this.has('image_status') && window.site_params.get('ui.hide_image_statuses') != '1' ? 
            `<div class='image_status' data-id='${this.getId()}' title='${this.getImageStatus().name}'>
                <img src='${this.getImageStatusURL()}'>
            </div>` : ``}
        </div>
        `
    }

    getTextStatus() {
        return Utils.format_emojis(Utils.escape_html(this.info.status ?? _('user_page.no_status')))
    }

    getDomain() {
        return Utils.escape_html(this.info.domain)
    }

    getBdate() {
        return Utils.escape_html(Utils.format_birthday(this.info.bdate))
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
        let partner_html = ``

        if(this.info.relation_partner) {
            partner  = new User
            partner.hydrate(this.info.relation_partner.user_object)

            partner_html = `
                <a class='relation_partner ${partner.isFriend() ? ' friended' : ''}' href='#id${partner.getId()}'>
                    <img src='${partner.getAvatar(true)}'>
                    ${partner.getName()}
                </a>
            `
        }

        switch(this.info.relation) {
            default:
            case 0:
                return _('relation.not_picked')
            case 1:
                return is_woman ? _('relation.female_single') : _('relation.male_single')
            case 2:
                return _('relation.meets_with') + (partner ? ` ${_('prepositions.with_rus_preposition')} ${partner_html}` : '') // "есть друг/есть подруга" в документации кстати
            case 3:
                return (is_woman ? _('relation.female_engaged') : _('relation.male_engaged')) + (partner ? ` ${_('relation.with_rus_preposition')} ${partner_html}` : '')
            case 4:
                let preposition = !is_woman ? _('prepositions.for_rus_preposition') : _('prepositions.on_rus_preposition')
                return is_woman ? _('relation.female_married') : _('relation.male_married') + (partner ? ` ${preposition} ${partner_html}` : '')
            case 5:
                return _('relation.relations_complicated') + (partner ? ` ${_('prepositions.with_rus_preposition')} ${partner_html}` : '')
            case 6:
                return _('relation.active_search')
            case 7:
                return is_woman ? _('relation.female_inlove') : _('relation.male_inlove') + (partner ? ` ${_('prepositions.another_on_rus_preposition')} ${partner_html}` : '')
            case 8:
                return _('relation.in_a_civil_marriage') + (partner ? ` ${_('prepositions.with_rus_preposition')} ${partner_html}` : '')
        }
    }

    getLangs() {
        return Utils.escape_html(this.info.personal.langs.join(', '))
    }

    getCity() {
        return Utils.escape_html(this.info.city.title) 
    }

    getCountry() {
        return Utils.escape_html(this.info.country.title)
    }

    getCountryncity() {
        return (this.has('country') ? this.getCountry() + ', ' : '') + (this.has('city') ? this.getCity() : '')
    }
    
    getHometown() {
        return Utils.escape_html(this.info.home_town)
    }

    getMobile() {
        return Utils.escape_html(this.info.mobile_phone)
    }

    getHomephone() {
        return Utils.escape_html(this.info.home_phone)
    }

    getSkype() {
        return Utils.escape_html(this.info.skype)
    }

    getSite() {
        let site = this.info.site
        return Utils.escape_html((site.indexOf('https') == -1 && site.indexOf('http') == -1) ? 'https://' + site : site)
    }

    getInterests(type = 'activities') {
        let bad_habits_attitude = [_('attitudes.strongly_negative_views'), _('attitudes.negative_views'), _('attitudes.compromise_views'), _('attitudes.neutral_views'), _('attitudes.positive_views')]

        switch(type) {
            default:
            case 'activities':
                return Utils.escape_html(this.info.activities)
            case 'interests':
                return Utils.escape_html(this.info.interests)
            case 'music':
                return Utils.escape_html(this.info.music)
            case 'movies':
                return Utils.escape_html(this.info.movies)
            case 'tv':
                return Utils.escape_html(this.info.tv)
            case 'books':
                return Utils.escape_html(this.info.books)
            case 'games':
                return Utils.escape_html(this.info.games)
            case 'quotes':
                return Utils.escape_html(this.info.quotes)
            case 'political':
                let political_views = [_('political_views.communistic_views'), _('political_views.socialistic_views'), _('political_views.moderate_views'), _('political_views.liberal_views'), _('political_views.conservative_views'), _('political_views.monarchic_views'), _('political_views.ultraconservative_views'), _('political_views.indifferent_views'), _('political_views.libertarian_views')]
                return Utils.escape_html(political_views[this.info.personal.political - 1] ?? _('political_views.centrist_views'))
            case 'religion':
                return Utils.escape_html(this.info.personal.religion)
            case 'life_main':
                let life_mains = [_('life_opinion.family_and_kids'), _('life_opinion.career_and_money'), _('life_opinion.entertainment_and_rest'), _('life_opinion.science_and_investigation'), _('life_opinion.world_imporement'), _('life_opinion.self_development'), _('life_opinion.beauty_and_art'), _('life_opinion.fame_and_influence')]
                return Utils.escape_html(life_mains[this.info.personal.life_main - 1] ?? '??')
            case 'people_main':
                let people_mains = [_('life_opinion.mind_and_creativity'), _('life_opinion.kindness_and_honestness'), _('life_opinion.beautiness_and_health'), _('life_opinion.authority_and_richness'), _('life_opinion.courage_and_tenacity'), _('life_opinion.humor_and_life_loving')]
                return Utils.escape_html(people_mains[this.info.personal.people_main - 1] ?? '??')
            case 'smoking':
                return Utils.escape_html(bad_habits_attitude[this.info.personal.smoking - 1] ?? '??')
            case 'alcohol':
                return Utils.escape_html(bad_habits_attitude[this.info.personal.alcohol - 1] ?? '??')
            case 'inspired_by':
                return Utils.escape_html(this.info.personal.inspired_by)
        }
    }

    getOnlineType() {
        switch(this.info.last_seen.platform) {
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
        
        return verb + (this.info.online == 0 ? Utils.short_date(this.info.last_seen.time) : '') + ' ' + this.getOnlineType()
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
        return '#id' + this.getId()
    }

    isFriend() {
        if(this.getId() == window.active_account.info.id) {
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

    hasContacts() {
        return this.has('country') || this.has('city') || this.has('home_town') || this.has('mobile_phone') || this.has('home_phone') || this.has('skype') || this.has('site')
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

    getTemplate() {
        return window.templates.user_page(this)
    }
}
