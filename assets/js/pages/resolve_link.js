window.pages['resolve_link']  = new class {
    async render_page() {
        let text = window.main_url.getParam('id') ?? window.main_class['hash_params'].id

        if(text == '#') {
            text = '#id0'
        }
        
        let link_start = window.main_url.origin + window.main_url.pathname
        let link = null

        if(!text) {
            Utils.not_found_not_specified()
            return
        }

        text = Utils.cut_vk(text)

        if(text.indexOf('https://') != -1 || text.indexOf('http://') != -1) {
            if(window.site_params.get('ux.navigation_away_enable', '1') == '0') {
                window.location.assign(text)
                return
            }

            let res = await window.vk_api.call('utils.checkLink', {'url': text})
            
            if(res.status != 'not_banned') {
                u('.page_content').append(`
                    <div class="onpage_error" style='width: 400px;'>
                        ${_('navigation.suspicious_link')}

                        <div class='away_buttons'>
                            <input type='button' id='__awayno' value='${_('messagebox.no')}'>
                            <input type='button' id='__awayes' value='${_('messagebox.yes')}'>
                        </div>
                    </div>
                `)

                u('#__awayno').on('click', (e) => {
                    window.router.route(link_start + '#id0')
                })

                u('#__awayes').on('click', (e) => {
                    window.open(text, '_blank')
                })
            } else {
                window.location.assign(text)
            }

            return
        }

        if(Boolean(parseInt(text))) {
            let inter = parseInt(text)
            if(inter > 0) {
                link = link_start + '#id'+inter
            } else {
                link = link_start + '#club'+Math.abs(inter)
            }
        } else {
            let id = null

            if(text.indexOf('club') != -1) {
                id = text.replace('club', '')

                if(!isNaN(parseInt(id))) {
                    link = link_start + '#club'+id
                }
            } else if(text.indexOf('id') != -1) {
                id = text.replace('id', '')
                
                if(!isNaN(parseInt(id))) {
                    link = link_start + '#id'+id
                }
            } else if(text.indexOf('app') != -1) {
                id = text.replace('app', '')
                
                if(!isNaN(parseInt(id))) {
                    link = link_start + '#app'+id
                }
            } else if(text.indexOf('wall') != -1) {
                id = text.replace('wall', '')

                if(!isNaN(parseInt(id))) {
                    link = link_start + '#wall'+id
                }
            }

            if(!link) {
                let res = await window.vk_api.call('utils.resolveScreenName', {'screen_name': text})
                let page = ''
    
                if(!res.type) {
                    u('.page_content').append(`
                        <div class="onpage_error" style='width: 400px;'>
                            ${_('navigation.not_found_shortcode')}
        
                            <div class='away_buttons'>
                                <input type='button' id='__gono' value='${_('messagebox.no')}'>
                                <input type='button' id='__goyes' value='${_('messagebox.yes')}'>
                            </div>
                        </div>
                    `)
        
                    u('#__gono').on('click', (e) => {
                        history.back()
                    })
        
                    u('#__goyes').on('click', (e) => {
                        window.open('https://vk.com/' + text, '_blank')
                    })
                    return
                }

                switch(res.type) {
                    case 'user':
                        page = 'id'
                        break
                    case 'group':
                    case 'event':
                    case 'page':
                        page = 'club'
                        break
                    case 'application':
                    case 'vk_app':
                        page = 'app'
                        break
                }
    
                link = link_start + `#${page}${res.object_id}`
            }
        }
        
        window.router.route(link)
    }
}
