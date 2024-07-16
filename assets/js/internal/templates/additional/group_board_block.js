if(!window.templates) {
    window.templates = {}
}

window.templates.group_board_block = (items, title, link, group_id = 0) => {
    if(!items || !items.items || items.count < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
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
