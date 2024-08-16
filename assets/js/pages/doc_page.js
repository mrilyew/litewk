if(!window.pages) {
    window.pages = {}
}

window.pages['doc_page'] = new class {
    async render_page() {
        main_class.changeTitle(_('docs.doc'))

        let owner_id = Number(window.main_class['hash_params'].owner)
        let item_id = Number(window.main_class['hash_params'].id)
        let doc_api = await window.vk_api.call('docs.getById', {'docs': owner_id + '_' + item_id, 'return_tags': 1})
        let content_html = ``

        window.main_class['doc'] = new Doc
        window.main_class['doc'].hydrate(doc_api[0])

        if(!window.main_class['doc'].info) {
            main_class.add_onpage_error(_('errors.doc_not_found'))
        }

        main_class.changeTitle(window.main_class['doc'].getTitle())

        switch(window.main_class['doc'].getType()) {
            default:
                content_html = `<div class='document_body_panel'>${_('errors.docs_load_error', 'https://vk.com/doc' + window.main_class['doc'].getId())}</div>`
                break
            case 4:
            case 3:
                content_html = `
                    <div class='document_body_panel'>
                        <a href='${window.main_class['doc'].getURL()}'>
                            <img src='${window.main_class['doc'].getURL()}'>
                        </a>
                    </div>
                `
                break
            case 7:
                content_html = `
                    <iframe src='${window.main_class['doc'].getURL()}'>
                `
                break
        }

        u('body .page_content').html(`
            <div class='document_single_view'>
                <div class='document_upper_panel'>
                    <a data-ignore='1' href='javascript:void(0)' id='_titler'>${window.main_class['doc'].getTitle()}</a>

                    <div>
                        ${owner_id != window.active_account.info.id ? 
                            `<input type='button' id='_save_doc' value='${_('docs.save_to_self')}'>`
                            : ''}
                        <input type='button' id='_download_doc' download value='${_('docs.download_file')}'>
                    </div>
                </div>

                <div>
                    ${content_html}
                </div>
            </div>
        `
        )
    }

    execute_buttons() {
        u('.document_single_view #_titler').on('click', (e) => {
            let msg = new MessageBox(_('docs.doc'), `
                <table class='straight_table'>
                    <tbody>
                        <tr>
                            <td>${_('docs.title')}</td>
                            <td>${window.main_class['doc'].getTitle()}</td>
                        </tr>
                        <tr>
                            <td>${_('docs.size')}</td>
                            <td>${window.main_class['doc'].getFileSize()}</td>
                        </tr>
                        <tr>
                            <td>${_('docs.ext')}</td>
                            <td>${window.main_class['doc'].getExtension()}</td>
                        </tr>
                        <tr>
                            <td>${_('docs.date')}</td>
                            <td>${window.main_class['doc'].getDate()}</td>
                        </tr>
                        <tr>
                            <td>${_('docs.type')}</td>
                            <td>${window.main_class['doc'].getTextType()}</td>
                        </tr>
                        <tr>
                            <td>${_('docs.tags')}</td>
                            <td>${window.main_class['doc'].getCSVTags()}</td>
                        </tr>
                        ${window.main_class['doc'].info.owner_id != window.active_account.info.id ? `<tr>
                            <td>${_('docs.uploader')}</td>
                            <td><a id='_onclickcloseme' href='#${window.main_class['doc'].info.owner_id}'>${window.main_class['doc'].info.owner_id}</a></td>
                        </tr>` : ''}
                    </tbody>
                </table>
            `, ['OK'], [() => {msg.close()}])

            msg.getNode().style.width = '250px'

            u('#_onclickcloseme').on('click', () => {
                msg.close()
            })
        })

        u('.document_single_view').on('click', '#_download_doc', (e) => {
            Utils.download_file_by_link(window.main_class['doc'].getURL(), window.main_class['doc'].getTitleWithExt())
        })
        
        u('.document_single_view').on('click', '#_save_doc', async (e) => {
            e.target.classList.add('stopped')

            let result = await window.vk_api.call('docs.add', {'owner_id': window.main_class['doc'].info.owner_id, 'doc_id': window.main_class['doc'].info.id, 'access_key': window.main_class['doc'].info.access_key})
        
            e.target.classList.remove('stopped')

            window.tmp_doc = result.response
            e.target.value = _('docs.added')
            e.target.setAttribute('id', '_delete_doc_')
        })
                
        u('.document_single_view').on('click', '#_delete_doc_', async (e) => {
            e.target.classList.add('stopped')
            await window.vk_api.call('docs.delete', {'owner_id': window.active_account.info.id, 'doc_id': window.tmp_doc})
        
            e.target.classList.remove('stopped')
            e.target.value = _('docs.save_to_self')
            e.target.setAttribute('id', '_save_doc')
        })
    }
}
