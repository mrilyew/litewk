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
        return '#club' + this.getId()
    }

    getId() {
        return Math.abs(this.info.id)
    }

    getRealId() {
        return this.getId() * -1
    }

    getName() {
        return Utils.escape_html(this.info.name)
    }

    getTextStatus() {
        return Utils.escape_html(this.info.status)
    }

    getTemplate() {
        return window.templates.club_page(this)
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
            str = Utils.cut_string(str, cut)
        }

        return Utils.format_text(str)
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
        return (this.has('city') ? Utils.escape_html(this.info.city.title) : '') + (this.has('city') && this.has('country') ? ', ' : '') + (this.has('country') ? Utils.escape_html(this.info.country.title) : '')
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