window.page_class = new class {
    render_page() 
    {
        document.title = _('auth.auth')
        let max_scope = 501202911
        let current_tab = window.main_class['hash_params'].section ?? 'oauth'

        $('.page_content')[0].insertAdjacentHTML('beforeend', `
            <div class='onpage_error auth_block'>
                <div class='tabs'>
                    <a href='#login/oauth' data-section='ouath' ${current_tab == 'oauth' ? `class='selected'` : ''}>OAuth</a>
                    <a href='#login/token' data-section='token' ${current_tab == 'token' ? `class='selected'` : ''}>${_('auth.by_token')}</a>
                </div>

                <div class='auth_block_input'></div>
            </div>
        `)

        switch(current_tab) {
            default:
            case 'oauth':
                $('.page_content .auth_block_input')[0].insertAdjacentHTML('beforeend', `
                    <p class='auth_bait'>${_('auth.auth_choose_app')}</p>

                    <input type='text' disabled id='__ouathUrl' value='https://oauth.vk.com/authorize'>

                    <select id='__appChoose'>
                        <option value='6121396' selected>VK Admin</option>
                        <option value='5776857'>VK Admin iOS</option>
                        <option value='7793118'>${_('auth.auth_app_vk_calls')}</option>
                        <option value='7799655'>VK Mail</option>
                        <option value='7497650'>VK Connect</option>
                        <option value='2685278'>Kate Mobile</option>
                        <option value='6287487'>${_('auth.auth_app_vk_com')}</option>
                    </select>

                    <input type='button' id='_aut' value='${_('auth.auth')}'>

                    <p style='margin-top: 6px;font-size: 10px;'>${_('auth.copy_token_from_address')}</p>
                `)
                                
                $('.auth_block_input #_aut').on('click', async () => {
                    if($(`#__ouathUrl`)[0].value == '') {
                        add_error(_('errors.not_all_fields'), 'fill_form')
                        return
                    }

                    let api_url = $(`#__ouathUrl`)[0].value
                    let app_id = $(`#__appChoose`)[0].value
                    let so_link = api_url + `?client_id=${app_id}&scope=${max_scope}&redirect_uri=https://oauth.vk.com/blank.html&display=page&response_type=token&revoke=1`
                    
                    window.open(so_link)

                    $(`.tabs a[data-section='token']`)[0].click()
                })

                break
            case 'token':
                $('.page_content .auth_block_input')[0].insertAdjacentHTML('beforeend', `
                    <p class='auth_bait'>${_('auth.auth_enter_token')}</p>
                    
                    <input type='text' id='__ouathToken' placeholder='${_('auth.auth_enter_token')}'>
                    <input type='text' id='__apiUrl' value='https://api.vk.com/method/'>

                    <input type='button' id='_aut' value='${_('auth.auth')}'>
                `)

                $('.auth_block_input #_aut').on('click', async () => {
                    if(await window.accounts.addAccount($('#__apiUrl')[0].value, $('#__ouathToken')[0].value)) {
                        window.router.route(document.querySelector('base').href + `#id0`)
                    }
                })

                break
        }
    }
}
