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

                    <svg class='searchIcon_clicked hidden search_icon' viewBox="0 0 11.71 11.71"><path class="cls-1" d="M2.54,2.81" transform="translate(-2.15 -2.15)"/><line class="cls-1" x1="11.35" y1="11.35" x2="0.35" y2="0.35"/><line class="cls-1" x1="11.35" y1="0.35" x2="0.35" y2="11.35"/></svg>
                    <svg class='searchIcon search_icon' viewBox="0 0 12.85 12.85"><line class="cls-1" x1="12.5" y1="12.5" x2="7.5" y2="7.5"/><circle class="cls-1" cx="4.5" cy="4.5" r="4"/></svg>
                </div>
            </div>
            <div class='wall_block_insert'></div>
        </div>
    `
    let template_div = document.createElement('div')
    template_div.innerHTML = template

    tabs.forEach(el => {
        template_div.querySelector('.wall_select_block .tabs').insertAdjacentHTML('beforeend', `
            <a href='#wall${owner_id}/${el}' data-ignore='1' data-section='${el}' ${default_tab == el ? `class='selectd'` : ''}>${_(`wall.${el}_posts`)}</a>
        `)
    })

    return template_div.innerHTML
}
