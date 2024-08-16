
class Post extends PostLike {
    hydrate(info, profiles, groups, reaction_sets) {
        this.info = info
        this.profiles = profiles
        this.groups   = groups
        this.reaction_sets = reaction_sets
    }

    async fromId(id) {
        let info = await window.vk_api.call('wall.getById', {'posts': id, 'extended': 1, 'fields': window.Utils.typical_fields})
        this.hydrate(info.items[0], info.profiles, info.groups, info.reaction_sets)
    }

    getId() {
        return this.info.owner_id + '_' + this.info.id
    }

    getGeo() {
        return this.info.geo
    }

    getShortGeo() {
        const geo = this.getGeo()

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

    hasReposts() {
        return this.getRepostsCount() > 0
    }

    hasCommentsCount() {
        return this.getCommentsCount() > 0
    }

    getReactionsArray() {
        return JSON.stringify(this.reaction_sets)
    }

    getReactionSet() {
        if(!this.reaction_sets || !this.info.reaction_set_id) {
            return []
        }

        const id = this.info.reaction_set_id
        const set = this.reaction_sets.find(item => item.id == id)
        const formatted_set = []
        set.items.forEach(item => {
            formatted_set.push(new PostReaction(item, this.info.reactions))
        })

        return formatted_set
    }

    getRepost() {
        return this.info.copy_history[0]
    }

    getUpperText() {
        const source = this.info.post_source

        // почему не в post_source?
        if(this.info.final_post == 1) {
            let silently = ''
            let gen = 'male'
            
            if(!this.info.message || this.info.message.length < 1) {
                silently = '_silently'
            }

            if(this.getOwner().info.sex != 2) {
                gen = 'female'
            }

            return _(`wall.deleted_page${silently}_${gen}`)
        }

        if(this.isF2f()) {
            const owner = this.getF2fOwner()
            const post_id = this.getF2fOwnerId() + '_' + this.getF2fPostId()

            return _('wall.in_reply_of_post') + ` <a class='f2f_mark' href='#wall${post_id}'><img src='${owner.getAvatar(true)}'>${owner.getFullNameCase('gen')}</a>`
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
            const user = new User
            user.hydrate(Utils.find_owner_in_arrays(this.info.signer_id, this.profiles, this.groups))

            return user
        }
    }

    getSource() {
        const copyright = this.info.copyright

        if(copyright.type == "external_link") {
            return `<a href='${copyright.link}' target='_blank'>${Utils.escape_html(copyright.name)}</a>`
        } else {
            if(copyright.link.indexOf('wall')) {
                let subid = (new URL(copyright.link).pathname).replace('/wall', '')
                return `<a href='#wall${subid}'>${Utils.escape_html(copyright.link)}</a>`
            }
        }
    }
    
    getTemplate(anything_else = {}) {
        return window.templates.post(this, anything_else)
    }

    getF2fOwnerId() {
        return this.info.reply_owner_id
    }

    getF2fPostId() {
        return this.info.reply_post_id
    }

    getF2fOwner() {
        return Utils.find_owner_in_arrays_and_return_entity(this.getF2fOwnerId(), this.profiles, this.groups)
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

    isF2f() {
        return this.info.reply_owner_id != null
    }

    isCopy() {
        return this.info.copy_history && this.info.copy_history.length > 0
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
        return (this.has('post_source') && this.info.post_source.data) || (this.info.final_post != null) || this.isF2f()
    }

    hasSource() {
        return this.has('copyright')
    }
}

class PostReaction {
    constructor(reaction, reactions_post) {
        this.info = reaction

        if(!reactions_post) {
            reactions_post = {
                'count': 0,
                'items': [],
            }
        }

        this.reactions_post = reactions_post
    }

    getTitle() {
        return this.info.title.escapeHtml()
    }

    getId() {
        return this.info.id
    }

    getImage(id = 0) {
        return this.info.asset.images[id]
    }

    getImageURL() {
        return this.getImage().url
    }

    getCount() {
        const found_rec = this.reactions_post.items.find(item => item.id == this.getId())

        if(!found_rec) {
            return 0
        }

        return found_rec.count
    }

    isSet() {
        return this.reactions_post.user_reaction == this.getId()
    }
}