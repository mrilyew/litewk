u(document).on('click', '.document_block .document_block_actions .add_doc_button, #_add_doc_fast', async (e) => {
    e.preventDefault()

    let target = e.target

    if(!target.classList.contains('doc_list_button')) {
        target = e.target.closest('.doc_list_button')
    }

    const id = target.dataset.docid.split('_')

    if(target.dataset.type == 'add') {
        let res = await window.vk_api.call('docs.add', {'owner_id': id[0], 'doc_id': id[1], 'access_key': id[2]})

        if(!res.error) {
            target.setAttribute('data-type', 'remove')
            target.setAttribute('data-secondid', res)

            target.innerHTML = `
                <svg class='checkmark_icon' viewBox="0 0 44.36 44.63"><polyline points="1.02 22.68 22.02 42.18 43.02 0.68"/></svg>
            `
        }
    } else {
        let res = await window.vk_api.call('docs.delete', {'owner_id': window.active_account.info.id, 'doc_id': target.dataset.secondid})

        if(!res.error) {
            target.setAttribute('data-type', 'add')
            target.innerHTML = `
                <svg viewBox="0 0 41 41"><polygon points="41 19 22 19 22 0 19 0 19 19 0 19 0 22 19 22 19 41 22 41 22 22 41 22 41 19"/></svg>
            `
        }
    }
})

u(document).on('click', '.delete_doc_button', async (e) => {
    e.preventDefault()

    let target = e.target

    if(!target.classList.contains('doc_list_button')) {
        target = e.target.closest('.doc_list_button')
    }

    let origin = target.closest('.document_block')

    let id = target.dataset.docid.split('_')

    if(target.dataset.type == 'delete') {
        let res = await window.vk_api.call('docs.delete', {'owner_id': id[0], 'doc_id': id[1], 'access_key': id[2]})

        if(!res.error) {
            target.setAttribute('data-type', 'restore')

            origin.querySelector('.document_block_actions .edit_doc_button_wrap').style.display = 'none'
            origin.querySelector('.document_block_actions .delete_doc_button_wrap').style.display = 'none'
            origin.querySelector('.document_block_actions').innerHTML += `
                <object class='delete_doc_button_wrapper'>
                    <a class='doc_list_button delete_doc_button' data-docid='${id[0]}_${id[1]}' data-type='restore'>
                        <input type='button' value='${_('messagebox.restore')}'>
                    </a>
                </object>
            `
        }
    } else {
        let res = await window.vk_api.call('docs.restore', {'owner_id': id[0], 'doc_id': id[1], 'access_key': id[2]})

        if(!res.error) {
            target.setAttribute('data-type', 'delete')

            origin.querySelector('.document_block_actions .edit_doc_button_wrap').style.display = 'block'
            origin.querySelector('.document_block_actions .delete_doc_button_wrap').style.display = 'block'
            origin.querySelector('.document_block_actions .delete_doc_button_wrapper').outerHTML = ''
        }
    }
})

u(document).on('click', '.edit_doc_button_wrap', async (e) => {
    e.preventDefault()

    let target = e.target
    let origin = null

    if(!target.classList.contains('doc_list_button') || !target.classList.contains('edit_doc_button_wrap')  ) {
        target = e.target.closest('.doc_list_button')
    }

    if(target.classList.contains('edit_doc_button_wrap')) {
        target = e.target.querySelector('.doc_list_button')
    }

    origin = target.closest('.document_block')

    const info = JSON.parse(target.dataset.inform)
    let doc = new Doc
    doc.hydrate(info)

    let msg = new MessageBox(_('docs.edit'), `
        <div id='doc_edit_box'>
            <div>
                <span>${_('docs.title')}</span>
                <input name='title' type='text' placeholder='${_('docs.title')}' value='${doc.getTitle()}'>
            </div>
            <div>
                <label>
                    <input name='sn_folder' ${doc.getFolderId() == 0 ? 'checked' : ''} type='radio' value='0'>
                    ${_('docs.private_file')}
                </label>
                <label>
                    <input name='sn_folder' ${doc.getFolderId() == 2 ? 'checked' : ''} type='radio' value='2'>
                    ${_('docs.study_file')}
                </label>
                <label>
                    <input name='sn_folder' ${doc.getFolderId() == 3 ? 'checked' : ''} type='radio' value='3'>
                    ${_('docs.book_file')}
                </label>
                <label>
                    <input name='sn_folder' ${doc.getFolderId() == 4 ? 'checked' : ''} type='radio' value='4'>
                    ${_('docs.another_file')}
                </label>
            </div>
            <div>
                <span>${_('docs.tags')}</span>
                <input name='tags' type='text' placeholder='${_('docs.tags')}' value='${doc.getCSVTags()}'>
            </div>
        </div>
    `, [_('messagebox.cancel'), _('messagebox.save')], [() => {
        msg.close()
    }, async () => {
        const name  = u(`#doc_edit_box input[name='title']`).nodes[0].value
        const normal_tags = u(`#doc_edit_box input[name='tags']`).nodes[0].value
        const type = u(`input[type='radio'][name='sn_folder']:checked`).val()
        const arrayed_tags = []
        let tags = ''

        if(normal_tags != '') {
            if(normal_tags.split(', ').length > 0) {
                normal_tags.split(', ').forEach(tag => {
                    tags += tag + ','

                    arrayed_tags.push(tag)
                })
            } else {
                normal_tags.split(',').forEach(tag => {
                    arrayed_tags.push(tag)
                })
            }
        }

        msg.getNode().querySelectorAll(`.messagebox_buttons input[type='button']`)[1].classList.add('stopped')

        let result = await window.vk_api.call('docs.edit', {'owner_id': doc.info.owner_id, 'doc_id': doc.info.id, 'title': name, 'tags': tags, 'folder_id': type})
        
        if(!result.error) {
            doc.info.title = name
            doc.info.tags  = arrayed_tags
            doc.info.folder_id  = Number(type)

            origin.outerHTML = doc.getTemplate()
        }
        //msg.getNode().querySelectorAll(`.messagebox_buttons input[type='button']`)[1].classList.remove('stopped')
        msg.close()
    }])
})

u(document).on('click', '#__tagadder', (e) => {
    let tag = e.target.dataset.tag
    let inputer = document.querySelector(`input[data-setname='tags']`)

    if(inputer.value[inputer.value.length - 1] == ',' || inputer.value[inputer.value.length - 1] == undefined) {
        inputer.value += tag + ','
    } else {
        inputer.value += ',' + tag + ','
    }
    
    u(inputer).trigger('change')
})
