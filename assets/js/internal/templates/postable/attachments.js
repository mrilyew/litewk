window.templates.attachments = (attachments, additional = {}) => {
    if(!attachments || attachments.length < 1) {
        return ''
    }

    const attachments_block = document.createElement('div')
    const attachments_ordinary = (attachments.filter(item => item.type == 'photo' || item.type == 'video' || (item.type == 'doc' && item.doc.type == 3) || (item.type == 'doc' && item.doc.type == 4)))
    const attachments_list = (attachments.filter(item => item.type != 'photo' && item.type != 'video' && (item.type != 'doc' || item.doc.type != 3) && (item.type != 'doc' || item.doc.type != 4)))

    attachments_block.innerHTML = `
        <div class='attachments'>
            ${attachments_ordinary.length > 0 ? `<div class='ordinary_attachments'></div>` : ``}
            ${attachments_list.length > 0 ? `<div class='other_attachments'></div>` : ``}
        </div>
    `

    /*if(additional.carousel == 1) {
        attachments_block.innerHTML = `
            <div class='attachments'>
                ${attachments_ordinary.length > 0 ? `<div class='ordinary_attachments'></div>` : ``}
                ${attachments_list.length > 0 ? `<div class='other_attachments'></div>` : ``}
            </div>
        `

        return
    }*/
    
    attachments_block.innerHTML = `
        <div class='attachments'>
            ${attachments_ordinary.length > 0 ? `<div class='ordinary_attachments'></div>` : ``}
            ${attachments_list.length > 0 ? `<div class='other_attachments'></div>` : ``}
        </div>
    `

    if(attachments_ordinary.length == 1) {
        const att = attachments_ordinary[0]
        const entity = new (Utils.getClassByType(att.type))((att)[att.type])
        const block = attachments_block.querySelector('.ordinary_attachments')

        attachments_block.setAttribute('style', 'text-align:center;')
        //block.classList.add('padded')
        block.innerHTML = entity.getFullsizeTemplate(additional)
    } 
    
    if(attachments_list.length == 1) {
        const att = attachments_list[0]
        const entity = new (Utils.getClassByType(att.type))((att)[att.type])
        const block = attachments_block.querySelector('.other_attachments')

        block.innerHTML = entity.getFullsizeTemplate(additional)
    }

    if(attachments_ordinary.length > 1) {
        let masonry_array = []
            
        attachments_ordinary.forEach(att => {
            const entity = new (Utils.getClassByType(att.type))((att)[att.type])
            
            masonry_array.push(entity.getGridTemplate(additional))
        })
        
        try {
            attachments_block.querySelector('.ordinary_attachments').outerHTML = window.templates._masonry(masonry_array)
            attachments_block.querySelectorAll('.remove_if_small').forEach(attachmenter => {
                attachmenter.style = 'display:none;'
            })
        } catch(e) {
            console.error(e)
        }
    }
        
    if(attachments_list.length > 1) {
        attachments_list.forEach(att => {
            const entity = new (Utils.getClassByType(att.type))((att)[att.type])

            attachments_block.querySelector('.other_attachments').insertAdjacentHTML('beforeend', entity.getFullsizeTemplate())
        })
    }

    return attachments_block.innerHTML
}
