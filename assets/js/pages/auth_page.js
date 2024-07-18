window.page_class = new class {
    render_page() 
    {
        document.title = _('auth.auth')
        let max_scope = 501202911
        let current_tab = window.main_class['hash_params'].section ?? 'oauth'

        $('.page_content')[0].insertAdjacentHTML('beforeend', `
            <div class='onpage_error auth_block'>
                <div class='tabs'>
                    <a href='#login/direct' data-section='direct' ${current_tab == 'direct' ? `class='selected'` : ''}>${_('auth.straight_auth')}</a>
                    <a href='#login/oauth' data-section='ouath' ${current_tab == 'oauth' ? `class='selected'` : ''}>OAuth</a>
                    <a href='#login/token' data-section='token' ${current_tab == 'token' ? `class='selected'` : ''}>${_('auth.by_token')}</a>
                </div>

                <div class='auth_block_input'></div>
            </div>
        `)

        switch(current_tab) {
            default:
            case 'direct':
                let limited = window.site_params.get('internal.use_proxy', '0') == '0'
                let apps = [
                    {
                        'name': 'VK Android',
                        'client_id': 2274003,
                        'client_secret': 'hHbZxrka2uZ6jB1inYsH',
                    },
                    {
                        'name': 'VK IPhone',
                        'client_id': 3140623,
                        'client_secret': 'VeWdmVclDCtn6ihuP1nt',
                    },
                    {
                        'name': 'VK IPad',
                        'client_id': 3682744,
                        'client_secret': 'mY6CDUswIVdJLCD3j15n',
                    },
                    {
                        'name': 'VK Desktop',
                        'client_id': 3697615,
                        'client_secret': 'AlVXZFMUqyrnABp8ncuU',
                    },
                    {
                        'name': 'VK Windows Phone',
                        'client_id': 3502557,
                        'client_secret': 'PEObAuQi6KloPM4T30DV',
                    },
                    {
                        'name': 'Kate Mobile',
                        'client_id': 2685278,
                        'client_secret': '',
                    },
                ]

                $('.page_content .auth_block_input')[0].insertAdjacentHTML('beforeend', `
                    <p class='auth_bait'>${limited ? _('auth.auth_enter_login_also') : _('auth.auth_enter_login')}</p>

                    <input type='text' style='margin-bottom: -4px;' disabled id='__authUrl' value='https://oauth.vk.com/token'>
                    <input type='text' disabled id='__authMethod' value='https://api.vk.com/method/'>

                    <div>
                        <input type='text' style='margin-bottom: -4px;' id='__authLogin' placeholder='${_('auth.login')}'>
                        <input type='password' id='__authPussword' placeholder='${_('auth.password')}'>
                    </div>

                    <select id='__appChooseStraight'></select>

                    <input style='margin-top: 6px;' type='button' id='_aut' value='${_('auth.auth')}'>
                `)

                apps.forEach(el => {
                    $('#__appChooseStraight')[0].insertAdjacentHTML('beforeend', `
                        <option value='${el.client_id}'>${el.name}</option>
                    `)
                })
                                
                $('.auth_block_input #_aut').on('click', async () => {
                    if($(`#__authUrl`)[0].value == '' || $(`#__authLogin`)[0].value == '') {
                        main_class.add_error(_('errors.not_all_fields'), 'fill_form')
                        return
                    }

                    let auth_url = $(`#__authUrl`)[0].value
                    let auth_method = $(`#__authMethod`)[0].value
                    let auth_login = $(`#__authLogin`)[0].value
                    let auth_pass = $(`#__authPussword`)[0].value
                    let app_id = $(`#__appChooseStraight`)[0].value

                    let app = apps.find(app => app.client_id == app_id)
                    let app_secret = app.client_secret

                    let so_link = auth_url + `?grant_type=password&client_id=${app_id}&client_secret=${app_secret}&scope=${max_scope}&username=${auth_login}&password=${auth_pass}&2fa_supported=1`
                
                    if(window.site_params.get('internal.use_proxy', '0') == '0') {
                        window.open(so_link)

                        $(`.tabs a[data-section='token']`)[0].click()
                    } else {
                        let path = `https://api.allorigins.win/get?url=${encodeURIComponent(so_link)}`
                        let result = JSON.parse(await Utils.jsonp(path))
                        result = JSON.parse(result.contents)

                        if(result.error) {
                            main_class.add_error(result.error_description, 'api-err')
                        } else {
                            let get_token = result.access_token
                        
                            if(await window.accounts.addAccount(auth_method, get_token)) {
                                window.router.restart('', 'ignore_menu')
                                window.router.route(document.querySelector('base').href + `#id0`)
                            }
                        }
                    }
                })

                break
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
                        main_class.add_error(_('errors.not_all_fields'), 'fill_form')
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
                        window.router.restart('', 'ignore_menu')
                        window.router.route(document.querySelector('base').href + `#id0`)
                    }
                })

                break
        }
    }
}
