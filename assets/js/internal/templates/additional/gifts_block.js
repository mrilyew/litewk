if(!window.templates) {
    window.templates = {}
}

window.templates.gifts_block = (items, link, ref = '') => {
    if(!items || !items.items || items.items.length < 1) {
        return ''
    }
    
    let status = `
    <div class='entity_row bordered_block'>
    
    <div class='entity_row_title'>
        <a href='${link}' data-back='${ref}'>
            <b>${_('gifts.gifts')}</b>
            ${items.count}
        </a>
    </div>

    <div id='entity_row_insert' class='entity_row_list entity_gifts_list'>`

    items.items.forEach(item => {
        let gift = new Gift(item)

        status += `
            <div class='entity_row_insert_item'>
                <a title='${gift.getMessage()}' href='#${gift.info.from_id}'>
                    <img src='${gift.getURL()}'>
                </a>
            </div>
        `
    })

    status += '</div></div>'

    return status
}
