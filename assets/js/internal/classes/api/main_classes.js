class Hasable {
    has(field = '') {
        try {
            if(Array.isArray(this.info[field])) {
                return this.info[field].length > 0
            }

            return Boolean(this.info[field])
        } catch(e) {
            console.error(e)
            return false
        }
    }

    hydrate(data) {
        this.info = data
    }
        
    getStringInfo() {
        return JSON.stringify(this.info)
    }
}

class Faveable extends Hasable {
    FAVED_STATUS_NOT = 0
    FAVED_STATUS_YES = 1
    
    isFaved() {
        return this.info.is_favorite == 1
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

    getURL() {
        return ''
    }

    getText() {
        return Utils.format_text(this.info.text)
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
