window.routes = [
    {
        'url': 'id{int|id}',
        'script_name': 'user_page'
    },
    {
        'url': 'search/{string|section}',
        'script_name': 'search_page'
    },
    {
        'url': 'groups{int|id}/{string|section}',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups{int|id}',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups/{string|section}',
        'script_name': 'groups_page'
    },
    {
        'url': 'event{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'public{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'group{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'club{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'login/{string|section}',
        'script_name': 'auth_page'
    },
    {
        'url': 'login',
        'script_name': 'auth_page'
    },
    {
        'url': 'fave/{int|tag}/{string|section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'fave/{string|section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'fave',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks/{int|tag}/{string|section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks/{string|section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks',
        'script_name': 'faves_page'
    },
    {
        'url': 'settings/{string|section}',
        'script_name': 'settings_page'
    },
    {
        'url': 'settings',
        'script_name': 'settings_page'
    },
    {
        'url': 'friends{int|id}/{string|section}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends{int|id}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends/{string|section}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends',
        'script_name': 'friends_page'
    },
    {
        'url': 'feed/{string|section}',
        'script_name': 'news_page'
    },
    {
        'url': 'feed',
        'script_name': 'news_page'
    },
    {
        'url': 'wall{int|owner_id}_{int|post_id}',
        'script_name': 'post_page'
    },
    {
        'url': 'wall{int|owner_id}/{string|section}',
        'script_name': 'wall_page'
    },
    {
        'url': 'wall{int|owner_id}',
        'script_name': 'wall_page'
    },
    {
        'url': 'away',
        'script_name': 'resolve_link'
    },
    {
        'url': 'search',
        'script_name': 'search_page'
    },
    {
        'url': '{string|id}',
        'script_name': 'resolve_link'
    },
]

class Router {
    reset_page() {
        $('.page_content')[0].innerHTML = ``

        window.temp_scroll = null
    }
    
    restart(add, condition = '') {
        let temp_menu = $('.navigation')[0].innerHTML

        $('style').remove()
        $('div').remove()
        
        window.main_class.load_layout(add)
        $(document).trigger('scroll')

        if(condition != 'ignore_menu') {
            $('.navigation')[0].innerHTML = temp_menu
        }
    }

    parse_route(input_url) {
        const temp_url = input_url.split('?')
        let url = temp_url[0]

        for(const route of window.routes) {
            const formatted_route = Utils.escape_html(route.url)
            const pattern = formatted_route.replace(/\{([^}]+)\}/g, '([^/]+)')
            const match = url.match(pattern)
            
            if(match) {
                const t_matches = route.url.match(/\{([^}]+)\}/g)

                let params = []
                let final_params = []
                let iter = 0

                if(t_matches && t_matches.length > 0) {
                    params = t_matches.map(placeholder => placeholder.slice(1, -1))
                }

                for(const param of params) {
                    const splitted_param = param.split('|')
                    const param_type = splitted_param[0]
                    let param_name = splitted_param[1]
                    const param_value = match[iter + 1]

                    if(!param_name) {
                        param_name = 'string'
                    }
                    
                    switch(param_type) {
                        default:
                        case 'int':
                            if(!isNaN(parseInt(param_value))) {
                                final_params.push(param_name)
                            }

                            break
                        case 'string':
                            final_params.push(param_name)

                            break
                    }
                }

                if(params.length > 0 && final_params.length < 1) {
                    continue
                }

                return {'route': route, 'params': final_params, 'match': match}
            }
        }

        return null
    }

    async route(input_url, history_log = true, back_url = null) {
        let url = input_url

        function back_button(url) {
            if(window.site_params.get('ux.hide_back_button', '0') == '1') {
                return
            }

            $('#up_panel')[0].classList.add('back')
            $('#up_panel')[0].classList.remove('hidden')
            $('#up_panel').removeClass('down')

            window.back_button = url
        }

        if(!url || url == '' || url == location.origin + location.pathname) {
            if(window.active_account) {
                url = location.origin + location.pathname + '#id0'
            } else {
                url = location.origin + location.pathname + '#settings'
            }
        }

        if(url.indexOf(location.origin) == -1) {
            url = location.origin + location.pathname + url
        }

        let may = SavedPage.find(url)

        if(may && may.info.url.indexOf('login') == -1 && may.info.url.indexOf('settings') == -1 && may.info.url.indexOf('away') == -1) {
            may.load()
            back_button(back_url)

            return
        }

        this.reset_page()

        let splitted_url = url.split('#')
        let found_route  = this.parse_route(splitted_url[1])

        if(found_route) {
            if(history_log && location.hash != url) {
                Utils.push_state(url)
            }

            let matches = found_route['match']
            let params  = found_route['params']
            let final_params = {}

            params.forEach((name, index) => {
                final_params[name] = matches[index + 1]
            })

            window.main_class['hash_params'] = final_params

            const insertScript = async function(name) {
                $('#_main_page_script').remove()
                window.page_class = null

                console.log(`Inserting script '${found_route['route'].script_name}'`)

                await Utils.append_script(`assets/js/pages/${name}.js`, true, name)
            }

            //debugger
            if(!$('#_main_page_script')[0]) {
                await insertScript(found_route['route'].script_name)
            } else {
                if($('#_main_page_script')[0].dataset.name != found_route['route'].script_name) {
                    await insertScript(found_route['route'].script_name)
                } else {
                    await window.page_class.render_page()
                }
            }

            SavedPage.save(url)
        } else {
            $('.page_content')[0].innerHTML = '404'
        }

        if(back_url) {
            back_button(back_url)
        } else {
            window.back_button = undefined
        }

        window.main_class.init_observers()
        $(document).trigger('scroll')
    }
}

class SavedPage {
    constructor(page) {
        if(!page) {
            return null
        }

        this.info = page
    }

    getInfo() {
        return {
            'url': this.info.url,
            'html': this.info.html,
            'classes': this.info.classes,
            'scroll': this.info.scroll,
            'temp_scroll': this.info.temp_scroll,
            'title': this.info.title
        }
    }

    load() {
        window.main_classes = null
        window.main_classes = this.info.classes
        window.temp_scroll  = this.info.temp_scroll
        document.title = this.info.title
        
        Utils.replace_state(this.info.url)

        $('.page_content')[0].innerHTML = this.info.html
        window.main_class.init_observers()

        window.scrollTo(0, this.info.scrollY)
        $(document).trigger('scroll')
    }

    static get() {
        let pages = []

        window.saved_pages.forEach(el => {
            pages.push(new this(el))
        })

        return pages
    }

    static find(url) {
        let found_page = window.saved_pages.find(el => el.url == url)

        if(!found_page || found_page == undefined) {
            return null
        }

        return new this(found_page)
    }

    static save(url) {
        let found_page = SavedPage.find(url)
        let copied_classes = Object.assign({}, window.main_classes)

        let insert = {
            'url': url,
            'html': $('.page_content')[0].innerHTML,
            'classes': copied_classes,
            'scroll': window.scrollY,
            'temp_scroll': window.temp_scroll,
            'title': document.title
        }

        let find_index = found_page ? window.saved_pages.findIndex(page => page.url == found_page.info.url) : -1
        
        if(found_page && window.saved_pages[find_index]) {
            window.saved_pages[find_index] = insert
        } else {
            window.saved_pages.push(insert)
        }

        return true
    }
}

class BetterURL extends URL {
    constructor(url) {
        super(url)
        this.hashParams = new URLSearchParams(this.hash.slice(1).split('?')[1] || '')
    }

    getParam(name, def = null) {
        return this.hashParams.get(name) ?? def
    }

    setParam(name, value) {
        this.hashParams.set(name, value)
        this.updateParams()
    }

    updateParams() {
        let [path, ] = this.hash.slice(1).split('?')
        let newHash = path;
        const params = this.hashParams.toString()

        if(params) {
            newHash += '?' + params;
        }

        this.hashParams = new URLSearchParams(newHash.slice(1).split('?')[1] || '')
        this.hash = newHash;
    }

    hasParam(name) {
        return Boolean(this.hashParams.get(name))
    }

    deleteParam(name) {
        this.hashParams.delete(name)
        this.updateParams()
    }

    getParams() {
        return this.hashParams
    }

    getHash() {
        return this.hash.replace('#', '')
    }
}