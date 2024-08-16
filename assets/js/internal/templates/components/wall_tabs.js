if(!window.templates) {
    window.templates = {}
}

window.templates.wall_tabs = (owner_id, tabs = [], active_tab = '') => {
    let tabs_html = ''

    tabs.forEach(tab => {
        tabs_html += `<a href='#wall${owner_id}?section=${tab}' ${active_tab == tab ? `class='selected'` : ''}>${_(`wall.${tab}_posts`)}</a>`
    })

    return tabs_html
}
