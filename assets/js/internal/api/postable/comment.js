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
        return window.templates.comment(this)
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
            return this.getOwnerID() == window.active_account.info.id
        }

        return this.info.can_delete == 1
    }
}
