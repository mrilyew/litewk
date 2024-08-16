class UserListView extends User {
    getTemplate() {
        return window.templates._user_list_view(this)
    }
}

class ClubListView extends Club {
    getTemplate() {
        return window.templates._club_list_view(this)
    }
}

class EntityListView {
    hydrate(info) {
        this.info = info
    }

    getTemplate() {
        let type = null
        if(this.info.type == 'page' || this.info.type == 'group' || this.info.type == 'event' || this.info.type == 'public') {
            type = new ClubListView(this.info)
        } else {
            type = new UserListView(this.info)
        }

        type.hydrate(this.info)

        return type.getTemplate()
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

class VideoListView extends Video {
    getTemplate() {
        return `
            ${this.getTitle()}
        `
    }
}

class PhotoListView extends Photo {
    getTemplate() {
        return this.getFullsizeTemplate()
    }
}
