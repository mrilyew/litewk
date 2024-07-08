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
                    ${!this.isFriend() && this.info.common_count > 0 ? `<a href='#friends${this.getId()}/mutual'>${_('counters.mutual_friends_count', this.info.common_count)}</a>` : ''}
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
                    <a class="action" href='#friends${this.getId()}'>${_('user_page.list_friends')}</a>
                    ${!this.isFaved() ? `<a class='action' id='_toggleFave' data-val='0' data-type='user' data-addid='${this.getId()}'> ${_('faves.add_to_faves')}</a>` : ''}
                    ${this.isFaved() ? `<a class='action' id='_toggleFave' data-val='1' data-type='user' data-addid='${this.getId()}'> ${_('faves.remove_from_faves')}</a>` : ''}
                    ` : ''}
                </div>
            </div>
        `
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
                    <a href='?group_id=${this.getId()}#search/users'>${_('counters.subscriptions_count', this.info.members_count)}</a>
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
                <a href='?id=${this.getCaption()}#away' target='_blank'><span>${this.getCaption()}</span></a>
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
