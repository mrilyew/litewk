window.templates.doc_image_attachment = (doc) => {
    const preview = doc.getPreview()

    return `
    <a href='#doc${doc.getId()}' data-width='${preview.width}' data-height='${preview.height}' data-ignore='1' class='ordinary_attachment doc_attachment doc_attachment_tall' id='not_gif_attachment' data-url='${doc.getURL()}' data-docid='${doc.getId()}' title='${doc.getTitle()}'>
        <div class='doc_list_button add_icon add_doc_button' data-type='add' data-docid='${doc.getId()}' id='_add_doc_fast'>    
            <svg viewBox='0 0 41 41'><polygon points="41 19 22 19 22 0 19 0 19 19 0 19 0 22 19 22 19 41 22 41 22 22 41 22 41 19"/></svg>
        </div>
    
        <div class='ext_block'>
            <span>${Utils.escape_html(doc.getExtension().toUpperCase())} | ${doc.getFileSize()}</span>
        </div>
        <img loading='lazy' class='outliner' src='${preview.src}'>
    </a>
    `
}
