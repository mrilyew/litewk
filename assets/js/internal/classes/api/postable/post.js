
class Post extends PostLike {
    hydrate(info, profiles, groups) {
        this.info = info
        this.profiles = profiles
        this.groups   = groups
    }

    async fromId(id) {
        let info = await window.vk_api.call('wall.getById', {'posts': id, 'extended': 1, 'fields': window.typical_fields})
        info = info.response

        this.hydrate(info.items[0], info.profiles, info.groups)
    }

    getId() {
        return this.info.owner_id + '_' + this.info.id
    }

    getGeo() {
        return this.info.geo
    }

    getShortGeo() {
        let geo = this.getGeo()

        return `<a href='https://www.google.com/maps/place/${geo.coordinates}' target='_blank'>${Utils.escape_html(geo.place.title)}, ${Utils.escape_html(geo.place.country)}</a>`
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

                return `${zab} <a href='${source.link.url}' target='_blank'>${Utils.escape_html(source.link.title)}</a>`
            // todo добавить пол к этим строкам
            case 'added_photos':
                return _('newsfeed.added_photos')
            case 'added_videos':
                return _('newsfeed.added_videos')
            case 'tagged_on_photos':
                return _('newsfeed.tagged_on_photos')
            case 'added_audios':
                return _('newsfeed.added_audios')
            default:
                return source.data
        }
    }

    getSigner() {
        if(!this.info.signer_id) {
            return null
        } else {
            let user = new User
            user.hydrate(Utils.find_owner_in_arrays(this.info.signer_id, this.profiles, this.groups))

            return user
        }
    }

    getSource() {
        let copyright = this.info.copyright

        if(copyright.type == "external_link") {
            return `<a href='${copyright.link}' target='_blank'>${Utils.escape_html(copyright.name)}</a>`
        } else {
            let sub_link = ''
            if(copyright.link.indexOf('wall')) {
                let subid = (new URL(copyright.link).pathname).replace('/wall', '')
                return `<a href='#wall${subid}'>${Utils.escape_html(copyright.link)}</a>`
            }
        }
    }
    
    getTemplate(anything_else = {}) {
        return window.templates.post(this, anything_else)
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
