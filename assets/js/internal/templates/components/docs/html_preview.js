window.templates._doc_html_preview = (doc) => {
    if(doc.isImage()) {
        return `<div class='document_block_preview with_image' style='background-image: url("${doc.getPreview().src}")'></div>`
    } else {
        return `
        <div class='document_block_preview only_ext'>
            ${doc.getExtension()}
        </div>`
    }
}
