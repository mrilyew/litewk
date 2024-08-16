class VkApi {
    constructor(url, token) {
        this.api_url = url
        this.api_token = token
    }

    async call(method, params = [], process_problems = true) {
        const url = new URL(this.api_url + method)
        const call_time = Date.now()

        url.searchParams.set('v', window.consts.VK_API_VERSION)

        if(window.main_url.hasParam('v_override')) {
            url.searchParams.set('v', window.main_url.getParam('v_override'))
        }

        url.searchParams.set('access_token', this.api_token)
        url.searchParams.set('lang', window.lang.lang_info.short_name)

        if(window.main_url.hasParam('lang_override')) {
            url.searchParams.set('lang', window.main_url.getParam('lang_override'))
        }

        url.searchParams.set('https', 1)

        if(window.site_params.get('internal.enable_tracking', '0') == '1') {
            url.searchParams.set('track_events', 1)
        }

        Object.entries(params).forEach(([index, key]) => {
            url.searchParams.set(index, key)
        })

        let result = null
        try {
            if(window.site_params.get('internal.use_proxy_everywhere', '0') == '1') {
                let path = `${window.site_params.get('internal.proxy_url', 'https://api.allorigins.win/get?url=')}${encodeURIComponent(url.href)}`
                if(window.site_params.get('internal.proxy_useragent', '') != '') {
                    path += `&userAgent=` + window.site_params.get('internal.proxy_useragent', '')
                }
                
                result = JSON.parse(await Utils.jsonp(path))

                if(path.indexOf('allorigins.win') != -1) {
                    result = JSON.parse(result.contents)
                }
            } else {
                result = JSON.parse(await Utils.jsonp(url.href))
            }
        } catch(ex) {
            if(process_problems) {
                Utils.vklikeError(_('errors.network_error'), Utils.cut_string(ex.message, 500))
            }

            console.log(`VKAPI | ${method} did not respond; error: `, ex)
            return
        }

        console.log(`VKAPI | Called ${method} with params`, params, `with force=${String(process_problems)}, timestamp ${call_time}, result: `, result)

        if(window.site_params.get('ux.online_status', 'none') == 'method_call' && method != 'account.setOnline') {
            await this.call('account.setOnline')
        }
        
        if(!process_problems) {
            return result
        }
        
        if(result.error) {
            switch(result.error.error_code) {
                default:
                    console.log(`VKAPI | ${method} caused error: ${result.error.error_code} '${result.error.error_msg}'`)
                    document.cookie = ''
                    Utils.vklikeError(result.error.error_code + ': ' + result.error.error_msg)

                    throw new ApiError(result.error.error_msg, result.error.error_code)
                case 5:
                    if(!result.error.ban_info) {
                        break
                    }

                    let ban_info = result.error.ban_info
                    Utils.fastmessagebox_error(_('errors.page_has_blocked'), _('errors.page_has_blocked_desc', ban_info.restore_url))

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
                                resolve(this.call(method, new_params, process_problems))
                            }
                        ])
                    })
            }
        } else {
            document.cookie = ''

            return result.response
        }
    }

    async resolveScreenName(link) {
        let res = await this.call('utils.resolveScreenName', {'screen_name': link}, false)

        return res.response
    }
}
