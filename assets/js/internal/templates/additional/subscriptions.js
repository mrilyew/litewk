if(!window.templates) {
    window.templates = {}
}

window.templates.row_list_block = (items, title, link) => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a href='${link}'>
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
                    <img class='outliner' src='${entity.getAvatar(true)}'>
                </a>

                <div class='entity_row_insert_item_info'>
                    <a href='${entity.getUrl()}' class='${entity.isFriend() ? 'friended' : ''}'>${entity.getName()}</a>
                    <p>${entity.getTextStatus()}</p>
                </div>
            </div>
        `
    })

    status += '</div></div>'

    return status
}

window.templates.contacts_block = (items, link) => {
    console.log(items)
    if(!items || items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
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
                    <object type="image/jpeg" class='outliner' data='${contact_user ? contact_user.getAvatar(true) : 'https://vk.com/images/contact.png'}'></object>
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
