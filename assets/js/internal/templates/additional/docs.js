if(!window.templates) {
    window.templates = {}
}

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
