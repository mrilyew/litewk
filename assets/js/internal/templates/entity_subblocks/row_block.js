if(!window.templates) {
    window.templates = {}
}

window.templates.row_block = (items, title, link) => {
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

    <div id='entity_row_insert' class='entity_row_grid'>`

    items.items.forEach(item => {
        let user = new User
        user.hydrate(item)

        status += `
            <a class='entity_row_insert_item ${user.isFriend() ? 'friended' : ''}' href='${user.getUrl()}'>
                <div class='${user.isOnline() ? 'onliner' : ''}'>
                    <img class='outliner' src='${user.getAvatar(true)}'>
                </div>

                <span class='${user.isFriend() ? 'friended' : ''}'>${user.getName()}</span>
            </a>
        `
    })

    status += '</div></div>'

    return status
}
