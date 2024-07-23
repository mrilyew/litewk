class VkApi {
    constructor(url, token) {
        this.url = url
        this.token = token
    }

    async call(method, params = [], force = true) {
        let url = new URL(this.url + method)
        url.searchParams.set('v', window.consts.VK_API_VERSION)
        url.searchParams.set('access_token', this.token)
        url.searchParams.set('lang', window.lang.lang_info.short_name)

        if(window.main_url.hasParam('lang_override')) {
            url.searchParams.set('lang', window.main_url.getParam('lang_override'))
        }

        url.searchParams.set('https', 1)

        if(window.site_params.get('internal.enable_tracking', '0') == '1') {
            url.searchParams.set('track_events', 1)
        }

        let path = url.href + '&' + $.param(params)
        let result = null
        try {
            if(window.site_params.get('internal.use_proxy', '0') == '1') {
                path = `https://api.allorigins.win/get?url=${encodeURIComponent(path)}`
                result = JSON.parse(await Utils.jsonp(path))
                result = JSON.parse(result.contents)
            } else {
                result = JSON.parse(await Utils.jsonp(path))
            }
        } catch(ex) {
            if(!force) {
                let msg = new MessageBox(_('errors.network_error'), Utils.cut_string(ex.message, 500), ['OK'], [() => {msg.close()}])
            }

            console.error(ex)
            return
        }

        if(window.site_params.get('ux.online_status', 'none') == 'method_call' && method != 'account.setOnline') {
            await this.call('account.setOnline')
        }
        
        console.log(`Called method ${method} with params ${JSON.stringify(params)} with force=${String(force)}`)
        
        if(!force) {
            //log(`NO FORCE, result: `)
            //log(result)

            return result
        }

        if(result.error) {
            switch(result.error.error_code) {
                default:
                case 0:
                    console.log(`${method} with params ${JSON.stringify(params)} caused error: ${result.error.error_code} '${result.error.error_msg}'`)
                    
                    window.main_class.add_error(_('errors.vk_api_error', result.error.error_msg), 'vkapierr')
                    document.cookie = ''
                    return result
                case 5:
                    if(!result.error.ban_info) {
                        break
                    }

                    let ban_info = result.error.ban_info
                    let msg = new MessageBox(_('errors.page_has_blocked'), _('errors.page_has_blocked_desc', ban_info.restore_url), ['OK'], [
                        () => {
                            msg.close()
                        },
                    ])
                    break
                case 14:
                    console.log(`${method} caused captcha`)

                    return new Promise((resolve, reject) => {
                        let sid = result.error.captcha_sid

                        document.cookie = ''
                        let msg = new MessageBox(_('captcha.enter_captcha'), `
                            <div class='captcha_box'>
                                <div>
                                    <img src='${result.error.captcha_img}'>
                                </div>
                                <input type='text' id='_captchaEnter' placeholder='${_('captcha.enter_captcha_there')}'>
                            </div>
                        `, [_('messagebox.cancel'), _('messagebox.enter')], [
                            () => {
                                console.log('Captcha closed.')
                                msg.close()
                            },
                            () => {
                                let new_params = params

                                new_params.captcha_sid = sid
                                new_params.captcha_key = $('#_captchaEnter')[0].value

                                msg.close()

                                console.log('Entered captcha.')
                                resolve(this.call(method, new_params, force))
                            }
                        ])
                    })
            }

            throw new ApiError(result.error.error_msg, result.error.error_code)
        } else {
            document.cookie = ''
            return result
        }
    }

    async resolveScreenName(link) {
        let res = await this.call('utils.resolveScreenName', {'screen_name': link}, false)
        res = res.response

        return res
    }
}
