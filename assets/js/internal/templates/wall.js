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
                <div id='_search_layer' style='display:none;'>
                    <input type='query' placeholder='${_('wall.search')}'>
                </div>
                <div class='right_side'>
                    <label>
                        ${_('wall.posts_invert')}
                        <input type='checkbox' id='_invert_wall' ${has_invert ? 'checked' : ''}>
                    </label>
                    <div class='icons1 searchIcon'></div>
                </div>
            </div>
            <div class='wall_block_insert'></div>
        </div>
    `
    let template_div = document.createElement('div')
    template_div.innerHTML = template

    tabs.forEach(el => {
        template_div.querySelector('.tabs #_insertTabs').insertAdjacentHTML('beforeend', `
            <a href='#wall${owner_id}/${el}' data-ignore='1' data-section='${el}' ${default_tab == el ? `class='selectd'` : ''}>${_(`wall.${el}_posts`)}</a>
        `)
    })

    return template_div.innerHTML
}
