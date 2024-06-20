window.page_class = new class {
    async render_page() {
        let text = window.s_url.searchParams.get('id')
        let link_start = window.s_url.origin + '/litewk/'
        let link = ''

        if(!text) {
            not_found_not_specified()
        }

        text = text.replace('https://vk.com/', '')
        text = text.replace('https://vkontakte.ru/', '')
        text = text.replace('http://vk.com/', '')
        text = text.replace('http://vkontakte.ru/', '')

        if(text.indexOf('https://') != -1 || text.indexOf('http://') != -1) {
            let res = await window.vk_api.call('utils.checkLink', {'url': text})
            
            if(res.response.status != 'not_banned') {
                $('.page_content')[0].insertAdjacentHTML('beforeend', `
                    <div class="onpage_error" style='width: 400px;'>
                        ${_('navigation.suspicious_link')}

                        <div class='away_buttons'>
                            <input type='button' id='__awayno' value='${_('messagebox.no')}'>
                            <input type='button' id='__awayes' value='${_('messagebox.yes')}'>
                        </div>
                    </div>
                `)

                $('#__awayno').on('click', (e) => {
                    window.router.route(window.s_url.origin + '/litewk/site_pages/user_page.html')
                })

                $('#__awayes').on('click', (e) => {
                    window.location.assign(text)
                })
            } else {
                window.location.assign(text)
            }

            return
        }

        if(Boolean(parseInt(text))) {
            let inter = parseInt(text)
            if(inter > 0) {
                link = link_start + 'site_pages/user_page.html?id='+inter
            } else {
                link = link_start + 'site_pages/club_page.html?id='+Math.abs(inter)
            }
        } else {
            if(text.indexOf('club') != -1) {
                let id = text.replace('club', '')
                link = link_start + 'site_pages/club_page.html?id='+id
            } else if(text.indexOf('id') != -1) {
                let id = text.replace('id', '')
                link = link_start + 'site_pages/user_page.html?id='+id
            } else if(text.indexOf('app') != -1) {
                let id = text.replace('app', '')
                link = link_start + 'site_pages/app_page.html?id='+id
            } else {
                let res = await window.vk_api.call('utils.resolveScreenName', {'screen_name': text})
                let page = ''
    
                if(!res.response.type) {
                    $('.page_content')[0].innerHTML = '404'
                    return
                }

                switch(res.response.type) {
                    case 'user':
                        page = 'user_page'
                        break
                    case 'group':
                    case 'event':
                    case 'page':
                        page = 'club_page'
                        break
                    case 'application':
                    case 'vk_app':
                        page = 'app_page'
                        break
                }
    
                link = link_start + `site_pages/${page}.html?id=${res.response.object_id}`
            }
        }
        
        window.router.route(link)
    }
}
