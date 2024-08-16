window.templates._faves_page_layout = (tabs_html, sections, section, tags, tag_id) => {
    const show_markseen = u('#_faves .counter').length > 0
    let sections_list = ``

    sections.forEach(el => {
        if(el == 'divider') {
            sections_list += `
                <hr>
            `
            
            return
        }

        sections_list += `
            <a href='#fave/${el}${tag_id ? '?tag=' + tag_id : ''}' ${section == el ? 'class=\'selected\'' : ''}>${_(`bookmarks.${el}_bookmarks`)}</a>
        `
    })

    const final_html = u(`
    <div class='default_wrapper layer_two_columns'>
        <div>
            <div class='layer_two_columns_up_panel bordered_block' id='insert_paginator_here_bro'>
                <div class='tabs'>${tabs_html}</div>
            </div>

            <div class='flex_row flex_nowrap' id='_bookmarks_search' style='margin-bottom: 10px;'>
                <input type='text' placeholder='${_('bookmarks.search_by_loaded_bookmarks')}'>
                <input type='button' style='margin-left: 5px;' value='${_('wall.search')}'>
            </div>

            <div class='bookmarks_insert bordered_block short_list'></div>
        </div>
        <div class='layer_two_columns_tabs bordered_block'>
            <div>
                ${sections_list}

                <div class='layer_two_columns_params'>
                    ${show_markseen ? `
                        <input type='button' id='__markbookmarks' value='${_('bookmarks.mark_as_viewed')}'>
                    ` : ''}

                    <span>${_('bookmarks.tags')}</span>
                </div>
                <div id='__inserttags'></div>
            </div>
        </div>
    </div>`)

    if(tags.count > 0) {
        tags.items.forEach(tag => {
            const is_this = Number(window.main_url.getParam('tag')) == tag.id
    
            final_html.find('#__inserttags').append(`
                <a href='#fave/${section}${!is_this ? '?tag=' + tag.id : ''}' class=\'${is_this ? 'selected' : ''} tag_selector\'>${tag.name.escapeHtml()}</a>`)
        })
    }

    const tab_dom = final_html.find(`a[data-section='${section}']`)
    tab_dom.addClass('selected')

    return final_html.nodes[0].outerHTML
}
