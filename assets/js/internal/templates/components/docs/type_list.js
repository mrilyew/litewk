window.templates.doc_list_view = (doc, additional = {}) => {
    let tags_html = ``
    let tags = doc.getTags()
    let iter = 1

    tags.forEach(tag => {
        tags_html += `
            <object>
                <a ${!additional.tags_to ? `href='#search/docs?query=${encodeURIComponent(tag)}'` : `id='__tagadder' href='javascript:void(0)' data-tag='${Utils.escape_html(tag)}' data-ignore='1'`}>${Utils.escape_html(tag)}</a>
                <span style='margin-left: -2px;'>${iter < tags.length ? ',' : ''}</span>
            </object>
        `

        iter += 1
    })
    
    return `
        <a class='document_block flex_row justifier' data-docid='${doc.getId()}' data-url='${doc.getURL()}' ${doc.isImage() ? /*`id='not_gif_attachment'`*/ '' : ''} href='#doc${doc.getId()}'>
            <div class='document_block_full_info'>
                ${doc.getHTMLPreview()}

                <div class='document_block_info'>
                    <b>${doc.getTitle()}</b>
                    
                    <div>
                        <span>${doc.getFileSize()},</span>
                        <span>${doc.getDate()}</span>
                    </div>

                    ${tags.length > 0 && !additional.hideTags ? `<div class='document_block_tags'>
                        ${tags_html}
                    </div>` : ''}
                </div>
            </div>

            ${!additional.hide_acts ? `<div class='document_block_actions'>
                ${!doc.canEdit() ? `
                    <object class='outline_object'>
                        <a class='doc_list_button add_doc_button' data-type='add' data-docid='${doc.getId()}'>
                            <svg viewBox="0 0 41 41"><polygon points="41 19 22 19 22 0 19 0 19 19 0 19 0 22 19 22 19 41 22 41 22 22 41 22 41 19"/></svg>
                        </a>
                    </object>
                `: `
                    <object class='outline_object edit_doc_button_wrap'>
                        <a class='doc_list_button edit_doc_button' data-inform='${doc.getStringInfo()}'>
                            <svg viewBox="0 0 44.32 44.17"><polygon points="40.88 11.87 32.95 3.9 32.95 3.9 40.88 11.87 40.88 11.87"/><polygon points="35.36 0.5 4.95 30.77 0.5 43.66 13.42 39.27 43.82 9.01 35.36 0.5"/></svg>
                        </a>
                    </object>
                    <object class='outline_object delete_doc_button_wrap'>
                        <a class='doc_list_button delete_doc_button' data-type='delete' data-docid='${doc.getId()}'>
                            <svg viewBox="0 0 45.12 45.12"><line x1="1.07" y1="1.07" x2="43.07" y2="44.07"/><line x1="44.07" y1="1.07" x2="1.07" y2="43.07"/></svg>
                        </a>
                    </object>
                `}
            </div>` : ''}
        </a>
    `
}
