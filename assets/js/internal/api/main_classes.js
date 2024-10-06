class Hasable {
    has(field = '') {
        try {
            const key = this.info[field]
            if(Array.isArray(key)) {
                return key.length > 0
            }

            return Boolean(key)
        } catch(e) {
            console.error(e)
            return false
        }
    }

    hydrate(data) {
        this.info = data

        return this
    }

    cacheEntity(extended = false) {
        if(extended != null) {
            this.info.is_extended_info = extended
        }
        
        this.info.caching_time = moment().unix()

        window.cache.add(this.table, this.info)
    }

    async findInCache(search_data, ignore_timeout = false) {
        const find_item = await window.cache.findItem(this.table, search_data)
        if(!find_item || find_item.caching_time < (moment().unix() - window.consts.INDEX_DB_CACHE_LIFETIME) && !ignore_timeout) {
            return null
        }

        return find_item
    }

    getStringInfo() {
        return JSON.stringify(this.info)
    }

    _getInternalType() {
        return this.type
    }
}

class Faveable extends Hasable {
    isFaved() {
        return this.info.is_favorite == window.consts.FAVES_IS_FAVED
    }
}

class PostLike extends Faveable {
    constructor(info) {
        super(info)
        
        this.info = info
    }
    
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
            let uwser = Utils.find_owner_in_arrays(this.getOwnerID(), this.profiles, this.groups)
            let user_obj = new User
            user_obj.hydrate(uwser)

            return user_obj
        } else if(this.getOwnerID() < 0) {
            let cwub = Utils.find_owner_in_arrays(this.getOwnerID(), this.profiles, this.groups)
            let club_obj = new Club
            club_obj.hydrate(cwub)

            return club_obj
        } else {
            let fake_user = new User

            return fake_user
        }
    }

    getDate() {
        return Utils.short_date(this.info.date)
    }
    
    getDateForTitle() {
        return Utils.short_date(this.info.date, false, false, 'default')
    }

    getURL() {
        return ''
    }

    getText() {
        return Utils.format_text(this.info.text)
    }
    
    getRawText() {
        return this.info.text
    }

    getAttachments() {
        return this.info.attachments
    }

    getLikes() {
        return this.info.likes.count
    }

    hasLikes() {
        return this.getLikes() > 0
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
