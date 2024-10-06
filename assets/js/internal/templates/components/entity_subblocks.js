window.templates.docs_block = (items, link, ref = '') => {
    if(!items || items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('docs.docs')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list'>`

    items.items.forEach(item => {
        let doc = new Doc
        doc.hydrate(item)

        status += `
            <div class='entity_row_insert_item'>
                ${doc.getTemplate({'hide_acts': 1})}
            </div>
        `
    })

    status += '</div></div>'

    return status
}

window.templates.albums = (items, link, ref = '') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('photos.albums')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list entity_albums'>`

    items.items.forEach(item => {
        let album = new Album
        album.hydrate(item)

        status += `
            <a class='album_item' href='#album${album.getId()}' data-back='${ref}'>
                <img loading='lazy' src='${album.getThumbnail()}' class='outliner'>

                <div class='small_album_info'>
                    <span class='title'>${album.getTitle()}</span>
                    <span>${album.getSize()}</span>
                </div>
            </a>
        `
    })

    status += '</div></div>'

    return status
}

window.templates.gifts_block = (items, link, ref = '') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row entity_subblock bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('gifts.gifts')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='flex flex_row space_between entity_gifts_list'>`

    items.items.forEach(item => {
        let gift = new Gift(item)

        status += `
            <div class='entity_row_insert_item'>
                <a title='${gift.getMessage()}' href='#${gift.info.from_id}'>
                    <img loading='lazy' src='${gift.getURL()}'>
                </a>
            </div>
        `
    })

    if(items.items.length < 3) {
        status += `
            <div class='entity_row_insert_item space_between_fix'></div>
        `
    }

    status += '</div></div>'

    return status
}

window.templates.group_board_block = (items, title, link, group_id = 0) => {
    if(!items || !items.items || items.count < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='club${group_id}'>
            <b>${title}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list' style='margin-bottom: 0px;'>`

    items.items.forEach(item => {
        let topic = new Topic(item, items.profiles, items.groups, group_id)

        status += topic.getTemplate()
    })

    status += '</div></div>'

    return status
}

window.templates.group_links = (items, title, link, ref = '') => {
    if(!items || items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${title}</b>
            ${items.length}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list'>`

    items.forEach(item => {
        let group_link = new GroupLink(item)

        status += `
            <div class='entity_row_insert_item'>
                <a href='${group_link.getURL()}'>
                    <img class='outliner avatar' src='${group_link.getIcon()}'>
                </a>

                <div class='entity_row_insert_item_info'>
                    <a href='${group_link.getURL()}'>${group_link.getName()}</a>
                    <p>${group_link.getDescription()}</p>
                </div>
            </div>
        `
    })

    status += '</div></div>'

    return status
}

window.templates.photo_status = (photos, ref = '', link = '') => {
    if(!photos || !photos.items || photos.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_photoblock padding_small entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a data-back='${ref}' href='${link}'>
            <b>${_('photos.photos')}</b>
            ${photos.count}
        </a>
    </div>

    <div id='entity_photoblock_insert'>`
    photos.items.forEach(photo => {
        let tmp_photo = new Photo(photo)

        status += `
            <div class='entity_photoblock_image clickable photo_viewer_open outliner' data-full='${tmp_photo.getFullSizeURL()}' style="background-image: url('${tmp_photo.getURL()}')"></div>
        `
    })

    if(photos.items.length < 6) {
        for(let i = 0; i < 6 - photos.items.length; i++) {
            status += `<div class='entity_row_insert_item space_between_fix'></div>`
        }
    }

    status += '</div></div>'

    return status
}

window.templates.row_block = (items, title, link) => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row entity_subblock bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}'>
            <b>${title}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_grid'>`

    items.items.forEach(item => {
        let user = new User
        user.hydrate(item)

        status += `
            <a class='entity_row_insert_item ${user.isFriend() ? 'friended' : ''}' href='${user.getUrl()}'>
                <div class='${user.isOnline() ? 'onliner' : ''}'>
                    <img class='outliner avatar' src='${user.getAvatar(true)}'>
                </div>

                <span class='${user.isFriend() ? 'friended' : ''}'>${user.getName()}</span>
            </a>
        `
    })
    
    // <3
    if(items.items.length < 3) {
        status += `
            <div class='entity_row_insert_item space_between_fix'></div>
        `
    }

    status += '</div></div>'

    return status
}

window.templates.row_list_block = (items, title, id, ref = '', handler = '_no') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${id}' data-id='${id}' data-back='${ref}' id='${handler}'>
            <b>${title}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list'>`

    items.items.forEach(item => {
        let entity = null
        
        if(item.type != 'page' && item.type != 'group' && item.type != 'event' && item.type != 'public') {
            entity = new User
        } else {
            entity = new Club
        }

        entity.hydrate(item)

        status += `
            <div class='entity_row_insert_item'>
                <a class='${entity.isOnline() ? 'onliner' : ''}' href='${entity.getUrl()}'>
                    <img class='outliner avatar' src='${entity.getAvatar(true)}'>
                </a>

                <div class='entity_row_insert_item_info'>
                    <a href='${entity.getUrl()}' class='${entity.isFriend() ? 'friended' : ''}'>${entity.getName()}</a>
                    <p>${entity.getTextStatus()}</p>
                </div>
            </div>
        `
    })
    
    if(items.items.length < 3) {
        status += `
            <div class='entity_row_insert_item space_between_fix'></div>
        `
    }

    status += '</div></div>'

    return status
}

window.templates.contacts_block = (items, link) => {
    if(!items || items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}'>
            <b>${_('groups.contacts')}</b>
            ${items.length}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list'>`

    items.forEach(item => {
        let contact_user = null

        if(item.user) {
            contact_user = new User
            contact_user.hydrate(item.user)
        }

        status += `
            <div class='entity_row_insert_item entity_contact'>
                <a class='${contact_user && contact_user.isOnline() ? 'onliner' : ''}' href='${contact_user ? contact_user.getUrl() : 'javascript:void(0)'}'>
                    <object type="image/jpeg" class='avatar' data='${contact_user ? contact_user.getAvatar(true) : 'https://vk.com/images/contact.png'}'></object>
                </a>

                <div class='entity_row_insert_item_info'>
                    <a href='${contact_user ? contact_user.getUrl() : 'javascript:void(0)'}' class='${contact_user && contact_user.isFriend() ? 'friended' : ''}'>${contact_user ? contact_user.getName() : ''}</a>
                    <p>${Utils.escape_html(item.desc)}</p>
                    ${item.email ? `<a href='mailto:${Utils.escape_html(item.email)}}'>${Utils.escape_html(item.email)}</a>` : ''}
                    ${item.phone ? `<p>${Utils.escape_html(item.phone)}</p>` : ''}
                </div>
            </div>
        `
    })

    status += '</div></div>'

    return status
}

window.templates.videos_block = (items, link, ref = '') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block padding_small'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('videos.videos')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list entity_albums'>`

    items.items.forEach(item => {
        let video = new Video
        video.hydrate(item)

        status += `
            <a data-ignore='1' class='video_item video_attachment_viewer_open' href='#video${video.getId()}' data-videoid='${video.getId()}'>
                <img src='${video.getPreview().url}' class='outliner'>

                <div class='small_video_info'>
                    <span class='title'>${video.getTitle()}</span>
                    <span class='size'>${video.getDuration()}</span>
                </div>
            </a>
        `
    })

    status += '</div></div>'

    return status
}
