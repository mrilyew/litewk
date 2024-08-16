if(!window.templates) {
    window.templates = {}
}

window.templates.wall = (owner_id, tabs, default_tab = 'all', has_invert = false) => {
    let template = `
        <div class="wall_block">
            <div class='wall_select_block bordered_block'>
                <div id='_shown_layer'>
                    <div class='tabs flexer'>
                        <div id='_insertTabs'></div>
                    </div>
                </div>
                <div id='_search_layer'>
                    <input type='query' placeholder='${_('wall.search')}'>
                </div>
                <a data-ignore='1' href='#wall${owner_id}?section=search' class='right_side'>
                    <!--<label>
                        ${_('wall.posts_invert')}
                        <input type='checkbox' id='_invert_wall' ${has_invert ? 'checked' : ''}>
                    </label>-->

                    <svg class='searchIcon_clicked search_icon' viewBox="0 0 11.71 11.71"><path d="M2.54,2.81" transform="translate(-2.15 -2.15)"/><line x1="11.35" y1="11.35" x2="0.35" y2="0.35"/><line x1="11.35" y1="0.35" x2="0.35" y2="11.35"/></svg>
                    <svg class='searchIcon search_icon' viewBox="0 0 12.85 12.85"><line x1="12.5" y1="12.5" x2="7.5" y2="7.5"/><circle cx="4.5" cy="4.5" r="4"/></svg>
                </a>
            </div>
            <div class='wall_block_insert'></div>
        </div>
    `

    let template_div = document.createElement('div')
    template_div.innerHTML = template

    tabs.forEach(el => {
        template_div.querySelector('.wall_select_block .tabs').insertAdjacentHTML('beforeend', `
            <a class='wall_section ${default_tab == el ? 'selected' : ''}' href='#wall${owner_id}?section=${el}' data-ignore='1' data-section='${el}'>${_(`wall.${el}_posts`)}</a>
        `)
    })

    return template_div.innerHTML
}

window.templates.wall_skeleton = () => {
    return `
        ${window.templates.post_skeleton()}
        ${window.templates.post_skeleton()}
        ${window.templates.post_skeleton()}
        ${window.templates.post_skeleton()}
        ${window.templates.post_skeleton()}
        ${window.templates.post_skeleton()}
        ${window.templates.post_skeleton()}
    `
}
