if(!window.templates) {
    window.templates = {}
}

window.templates.group_links = (items, title, link) => {
    if(!items || items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a href='${link}'>
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
                    <img class='outliner' src='${group_link.getIcon()}'>
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
