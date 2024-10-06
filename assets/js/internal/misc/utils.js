window.Utils = new class {
    typical_fields = window.consts.TYPICAL_FIELDS
    typical_fields_min = window.consts.TYPICAL_FIELDS_MINIMUM
    typical_group_fields = window.consts.TYPICAL_GROUPS_FIELDS
    
    default_count = window.consts.DEFAULT_COUNT
    default_count_more = window.consts.DEFAULT_COUNT_MORE

    constructor() {
        String.prototype.removePart = function(to_remove) {
            return this.replace(to_remove, '')
        }

        String.prototype.removeAll = function(to_remove) {
            return this.replace(new RegExp(to_remove, 'g'), '')
        }

        String.prototype.escapeHtml = function() {
            try {
                return this.replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/>/g, "&gt;")
                .replace(/"/g, "&quot;")
                .replace(/'/g, "&#039;");
            } catch(e) {
                return ''
            }
        }

        String.prototype.parseInt = function() {
            return parseInt(this)
        }

        String.prototype.pushState = function() {
            return window.router.pushState(this)
        }
        
        String.prototype.replaceState = function() {
            return window.router.replaceState(this)
        }

        String.prototype.log = function() {
            console.log(this)
        }

        String.prototype.circum = function(length = 10) {
            const newString = this.substring(0, length)

            return newString + (this !== newString ? "…" : "")
        }

        String.prototype.formatText = function() {
            return window.Utils.format_text(this)
        }

        String.prototype.firstUpperLetter = function() {
            return this.charAt(0).toUpperCase() + this.slice(1);
        }

        Object.prototype.merge = function(another) {
            return Object.assign({}, this, another);
        }

        Array.prototype.arraySum = function() {
            let sum = 0
            this.forEach(num => {
                sum += parseFloat(num)
            })

            return sum
        }

        Array.prototype.sortNumeric = function() {
            return this.sort(function(a, b) {return a - b})
        }

        Array.prototype.isEqual = function(another_array) {
            return this.toString() == another_array.toString()
        }

        Array.prototype.sortByHeight = function() {
            return this.sort(function (a, b) {
                if(a.height > b.height) {
                    return -1;
                }
    
                if(a.height < b.height) {
                    return 1;
                }
    
                return 0
            })
        }

        Number.prototype.divideByDigit = function() {
            return this.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        }
    }

    compute_age(date) {
        let age = moment().diff(moment(date, "DD-MM-YYYY"), 'years')

        return _('time.age', age)
    }

    format_birthday(bdate) {
        let tempdate = bdate.split('.')

        if(tempdate[2]) {
            let moment_tempdate = moment(bdate, 'DD.MM.YYYY')
            bdate = moment_tempdate.format('DD.MM.YYYY')

            bdate += ': ' + this.compute_age(bdate)
        } else {
            let moment_tempdate = moment(bdate, 'DD.MM')
            bdate = moment_tempdate.format('DD.MM')
        }

        return bdate
    }

    find_owner_in_arrays(id, profiles = [], groups = []) {
        if(id < 0) {
            return groups.find(item => item.id == Math.abs(id))
        } else {
            return profiles.find(item => item.id == Math.abs(id))
        }
    }

    find_owner_in_arrays_and_return_entity(id, profiles = [], groups = []) {
        if(id < 0) {
            let res = groups.find(item => item.id == Math.abs(id))

            let entity = new Club
            entity.hydrate(res)

            return entity
        } else {
            let res = profiles.find(item => item.id == Math.abs(id))

            let entity = new User
            entity.hydrate(res)

            return entity
        }
    }

    random_int(min, max) {
        return Math.round(Math.random() * (max - min) + min)
    }

    nl2br(text) {
        return text.replace(/(\r\n|\n\r|\r|\n)/g, '<br>')
    }

    format_hashtags(text) 
    {
        return text.replace(window.consts.REGEX_HASHTAGS, (match, p1, p2) => {
            if(!match.match(/http/i)) {
                return `${p1}<a href='#search/posts?q=%23${p2}'>#${p2}</a>`
            }

            return match
        })
    }

    format_mentions(text)
    {
        let appendix = '#away?id='
        if(window.site_params.get('ux.navigation_away_enable', '1') == '0') {
            appendix = '#'
        }

        return text.replace(/\[([^\|``]+)\|([^\|``]+)\]/g, function(match, p1, p2) {
            return `<a class='formatted_link' href="${appendix}${encodeURIComponent(p1)}">${p2.escapeHtml()}</a>`
        })
    }

    format_links(text)
    {
        function __formatLink(url) {
            return url.replace(/^(https?:\/\/)?(www\.)?/, '');
        }

        let appendix = '#away?id='
        if(!window.settings_manager.getItem('ux.navigation_away_enable').isChecked()) {
            appendix = '#'
        }

        text = text.replace(/\b(https?:\/\/[^\s<]+)/g, function(match) {
            return `<a href='${appendix}${encodeURIComponent(match)}'>${__formatLink(match)}</a>`;
        })
    
        text = text.replace(/\b(www\.[^\s<]+)/g, function(match) {
            return `<a href='${appendix}${encodeURIComponent(match)}'>${__formatLink("http://" + match)}</a>`
        })
    
        /*text = text.replace(/\b([^\s<]+\.[a-z]{2,6})(\:[0-9]{1,5})?([\/\w \.-]*)*\/?/g, function(match) {
            console.log(match.removePart('href="'))
            if(text.includes(`${match.removePart('href="')}`)) {
                return match
            }

            return `<a href='${appendix}${encodeURIComponent(match)}'>${__formatLink("http://" + match)}</a>`
        })*/

        return text
    }

    escape_html(text) 
    {
        try {
            return text.replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
        } catch(e) {
            return ''
        }
    }

    format_emojis(text)
    {
        if(window.settings_manager.getItem('ux.twemojify').getValue() == '0') {
            return text
        }

        return twemoji.parse(text)
    }

    format_text(text) {
        let formatted_text = text

        formatted_text = this.escape_html(formatted_text)
        formatted_text = this.format_hashtags(formatted_text)
        formatted_text = this.format_mentions(formatted_text)
        formatted_text = this.format_links(formatted_text)
        formatted_text = this.format_emojis(formatted_text)
        formatted_text = this.nl2br(formatted_text)

        return formatted_text
    }

    format_seconds(duration) 
    {
        let my_time = moment.duration(duration * 1000)
        let hours = String(my_time.hours()).padStart(2, '0')
        let minutes = String(my_time.minutes()).padStart(2, '0')
        let seconds = String(my_time.seconds()).padStart(2, '0')

        return `${hours && hours > 0 ? hours + ':' : ''}${minutes}:${seconds}`
    }

    format_file_size(bytes, si = true) 
    {
        let thresh = si ? 1000 : 1024;
        if(Math.abs(bytes) < thresh) {
            return bytes + ' B';
        }
        let units = si
            ? [_('size.kb'),_('size.mb'),_('size.gb'),_('size.tb'),_('size.pb'),_('size.eb'),_('size.zb'),_('size.yb')]
            : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
        let u = -1;
        do {
            bytes /= thresh;
            ++u;
        } while(Math.abs(bytes) >= thresh && u < units.length - 1);
        return bytes.toFixed(1)+' '+units[u];
    }

    append_script(link, toBody = false) {
        return new Promise(function (resolve, reject) {
            let script = document.createElement('script')
            script.src = link
            script.async = 'true'

            script.onerror = () => {
                reject(Error("Network error loading " + script.src))
            }

            script.onload = async () => {
                console.log('Scripts | Loaded additional script ' + link)

                resolve(true)
            }

            if(!toBody) {
                document.head.appendChild(script)
            } else {
                document.body.appendChild(script)
            }
        }) 
    }

    append_style(url, from = null) {
        return new Promise((resolve, reject) => {
            const link = document.createElement('link')
            link.rel = 'stylesheet'
            link.href = url
            if(from) {
                link.setAttribute('data-from', from)
            }
            
            link.onload = async () => {
                resolve(true)
            }

            link.onerror = () => {
                reject()
            }

            document.head.appendChild(link)
        })
    }

    // Deprecated
    async resolve_city(id)
    {
        try {
            let cities_cache = JSON.parse(localStorage.cities_cache ?? `[{"id": "1", "name": "Москва"}]`)
            let seek_city = cities_cache.find(item => item.id == id)
            
            if(seek_city) {
                return seek_city.name
            } else {
                let city = await window.vk_api.call('database.getCitiesById', {'city_ids': id})

                cities_cache.push({'id': id, 'name': city.response[0].title})
                localStorage.cities_cache = JSON.stringify(cities_cache)
        
                return city.response[0].title
            }
        } catch(e) {
            console.error(e)

            return 'Воркута'
        }
    }

    // Deprecated
    async resolve_club(id)
    {
        let clubs_cache = JSON.parse(localStorage.clubs_cache ?? `[{"id": "0", "name": "API"}]`)
        let seek_club = clubs_cache.find(item => item.id == id)
        
        if(seek_club) {
            return seek_club
        } else {
            let club = await window.vk_api.call('groups.getById', {'group_id': id})

            clubs_cache.push(club.response.groups[0])
            localStorage.clubs_cache = JSON.stringify(clubs_cache)

            return club.response.groups[0]
        }
    }

    // https://gist.github.com/walsh9/c4722c5f3c90e1cc0a5b
    jsonp(url, def_timeout) {
        if(!def_timeout) {
            def_timeout = window.consts.DEFAULT_TIMEOUT
        }

        function urlJoinChar(url) {
            return url.indexOf('?') >= 0 ? '&' : '?'
        }

        return new Promise( function (resolve, reject) {
            var timeout = def_timeout; // default timeout
            var callbackName = 'jsonp_callback_' + Date.now();
            var head = document.getElementsByTagName('head')[0] || document.documentElement;
            var script = document.createElement('script');
            script.src = url +  urlJoinChar( url ) + 'callback=' + callbackName;
            script.async = "true";

            window[callbackName] = function(data) {
                cleanUp()
                resolve(JSON.stringify(data))
            }

            script.onerror = function() {
                cleanUp()
                reject(new Error("Network error loading " + script.src) )
            }

            head.appendChild(script)
            var timeoutFunction = setTimeout(function() {
                cleanUp();
                reject(new Error("Request to " + url + " failed to execute callback after " + timeout + "ms.") )  
            }, timeout);
    
            function cleanUp() {
                timeoutFunction && clearTimeout(timeoutFunction)
                window[callbackName] && delete window[callbackName]
                script && head.removeChild(script)

                document.cookie = ''
            }
        } )
    }

    push_state(url)
    {
        history.pushState({'go': 1}, null, url)
        
        window.main_url = new BetterURL(location.href)
    }

    replace_state(url)
    {
        history.replaceState({'go': 1}, null, url)

        window.main_url = new BetterURL(location.href)
    }
    
    array_splice(array, key)
    {
        let resultArray = [];

        for(let i = 0; i < array.length; i++){
            if(i != key){
                resultArray.push(array[i]);
            }
        }

        return resultArray;
    }

    array_swap(array, first, last) 
    {
        let temp = array[first]
        array[first] = array[last]
        array[last] = temp

        return array
    }

    not_found_not_specified()
    {
        window.location.assign('https://youtu.be/QR8PVIaqW_A?ref=litewk')
    }

    cut_string(string, length = 0) {
        const newString = string.substring(0, length)

        return newString + (string !== newString ? "…" : "")
    }

    array_deep_search(obj, query) 
    {
        if(typeof obj !== 'object' || obj === null) {
            return String(obj).toLowerCase().includes(query.toLowerCase())
        }
    
        return Object.values(obj).some(value => {
            if(Array.isArray(value)) {
                return value.some(item => Utils.array_deep_search(item, query))
            }

            return Utils.array_deep_search(value, query)
        })
    }

    short_date(unix_time, need_time = true, hide_year = false, force_type = null) {
        const date = new Date(unix_time * 1000)
        const current_date = new Date()
        
        switch(force_type ?? window.site_params.get('ui.date_format')) {
            default:
            case 'default':
                if(!hide_year) {
                    return _('time.date_formatted_default_year_time', 
                        String(date.getDate()).padStart(2, '0'),
                        String(date.getMonth() + 1).padStart(2, '0'),
                        date.getFullYear(),
                        String(date.getHours()).padStart(2, '0'),
                        String(date.getMinutes()).padStart(2, '0')
                    )
                } else {
                    return _('time.date_formatted_default_no_year', 
                        String(date.getDate()).padStart(2, '0'),
                        String(date.getMonth() + 1).padStart(2, '0'),
                        String(date.getHours()).padStart(2, '0'),
                        String(date.getMinutes()).padStart(2, '0')
                    )
                }
            case 'default_seconds':
                if(!hide_year) {
                    return _('time.date_formatted_default_seconds_year_time', 
                        String(date.getDate()).padStart(2, '0'),
                        String(date.getMonth() + 1).padStart(2, '0'),
                        date.getFullYear(),
                        String(date.getHours()).padStart(2, '0'),
                        String(date.getMinutes()).padStart(2, '0'),
                        String(date.getSeconds()).padStart(2, '0')
                    )
                } else {
                    return _('time.date_formatted_default_seconds_no_year', 
                        String(date.getDate()).padStart(2, '0'),
                        String(date.getMonth() + 1).padStart(2, '0'),
                        String(date.getHours()).padStart(2, '0'),
                        String(date.getMinutes()).padStart(2, '0'),
                        String(date.getSeconds()).padStart(2, '0')
                    )
                }
            case 'month':
                if(current_date.getFullYear() != date.getFullYear()) {
                    return _('time.date_formatted_month', 
                    String(date.getDate()).padStart(2, '0'), 
                    _(`time.month_${date.getMonth()+1}_gen`), 
                    hide_year ? '' : '' + date.getFullYear(), 
                    need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
                } else {
                    return _('time.date_formatted_month_no_year', 
                    String(date.getDate()).padStart(2, '0'), 
                    _(`time.month_${date.getMonth()+1}_gen`), 
                    need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
                }
            case 'month_seconds':
                if(current_date.getFullYear() != date.getFullYear()) {
                    return _('time.date_formatted_month', 
                    String(date.getDate()).padStart(2, '0'), 
                    _(`time.month_${date.getMonth()+1}_gen`), 
                    hide_year ? '' : '' + date.getFullYear(), 
                    need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}` : '')
                } else {
                    return _('time.date_formatted_month_no_year', 
                    String(date.getDate()).padStart(2, '0'), 
                    _(`time.month_${date.getMonth()+1}_gen`), 
                    need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}:${String(date.getSeconds()).padStart(2, '0')}` : '')
                }
        }
    }

    debounce(func, wait) {
        let timeout
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout)
                func(...args)
            };
            clearTimeout(timeout)
            timeout = setTimeout(later, wait)
        }
    }

    cut_vk(text) {
        window.consts.REMOVE_DOMAINS.forEach(address => {
            text = text.replace(address, '')
        })

        return text
    }

    async sleep(time) {
        return await new Promise(r => setTimeout(r, time));
    }

    download_file_by_link(url, filename) {
        let link = document.createElement('a')
        link.setAttribute('href', url)
        link.setAttribute('download', filename || '')

        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    singleQuotesToBold(text) {
        return text.replace(/&#039;&#039;&#039;(.*?)&#039;&#039;&#039;/g, '<b>$1</b>')
    }

    fastmessagebox_error(title = 'No title', message = 'No comments') {
        let msg = new MessageBox(title, message, ['OK'], [
            () => {
                msg.close()
            },
        ])
    }

    async getOwnerEntityById(id) {
        let owner_info = null
        let is_this = id == window.active_account.info.id

        if(!is_this) {
            if(id > 0) {
                owner_info = new User
            } else {
                owner_info = new Club
            }
    
            await owner_info.fromId(Math.abs(id))
        } else {
            owner_info = new User
            owner_info.hydrate(window.active_account.info)
        }

        return owner_info
    }

    vklikeError(text) {
        const rand = Utils.random_int(0, 1000)
        
        u('.fast_errors').append(`
            <div id='_fast_error${rand}' class='fast_error fast_error_exception'>${text.escapeHtml()}</div>
        `)

        setTimeout(() => {
            u(`#_fast_error${rand}`).remove()
        }, window.consts.VK_LIKE_TIMEOUT)
    }

    get_short_text(text = '', maxLines = 10, maxChars = 500, html = false) {
        const liners = text.split('\n');

        if(window.site_params.get('ux.shortify_text', '1') == '0') {
            return `<span>${text.formatText()}</span>`
        }

        let truncated = ''
        let lineCount = 0
        let charCount = 0
        let needsTruncation = false
        let final_text = text.formatText()
        let has_more = false

        for(let liner of liners) {
            if (lineCount >= maxLines || charCount > maxChars) {
                needsTruncation = true;
                break
            }

            truncated += liner + '\n'
            lineCount++
            charCount += liner.length + 1
        }

        truncated = truncated.trim()

        if(needsTruncation) {
            if(charCount > maxChars) {
                truncated = truncated.substring(0, maxChars - 3) + '...'
            } else {
                truncated += '...'
            }

            final_text = truncated.formatText()
            has_more = true
        }

        if(html) {
            if(!has_more) {
                return `<span>${text.formatText()}</span>`
            }

            return `
                <div class='content_text_wrapper'>
                    <span class='truncated_text'>
                        ${final_text}
                        <p><b>${_('common.show_next')}</b></p>
                    </span>
                    <span class='full_text'>${text.formatText()}</span>
                </div>
            `
        }

        return {
            'text': final_text,
            'hasMore': has_more,
            'full_text': text.formatText(),
        }
    }

    applyPostsSearchParams(url, method_params) {
        if(url.hasParam('sp_attachment')) {
            switch(url.getParam('sp_attachment')) {
                default:
                    break
                case '1':
                    method_params.q += ' has:photo'
                    break
                case '2':
                    method_params.q += ' has:video'
                    break
                case '3':
                    method_params.q += ' has:audio'
                    break
                case '4':
                    method_params.q += ' has:graffiti'
                    break
                case '5':
                    method_params.q += ' has:note'
                    break
                case '6':
                    method_params.q += ' has:poll'
                    break
                case '7':
                    method_params.q += ' has:link'
                    break
                case '8':
                    method_params.q += ' has:doc'
                    break
                case '9':
                    method_params.q += ' has:album'
                    break
                case '10':
                    method_params.q += ' has:article'
                    break
                case '12':
                    method_params.q += ' has:page'
                    break
                case '11':
                    method_params.q += ' has:none'
                    break
            }
        }

        if(url.hasParam('sp_type')) {
            switch(url.getParam('sp_type')) {
                default:
                    break
                case 'copy':
                    method_params.q += ' type:copy'
                    break
                case 'reply':
                    method_params.q += ' type:reply'
                    break
            }
        }

        if(url.hasParam('sp_link')) {
            method_params.q += ' url:' + url.getParam('sp_link')
        }
        
        if(url.hasParam('sp_exclude')) {
            const words = url.getParam('sp_exclude').split(' ')

            words.forEach(word => {
                method_params.q += ' -' + word
            })
        }
                        
        if(url.hasParam('sp_likes')) {
            if(parseInt(url.getParam('sp_likes')) > 0) {
                method_params.q += ' likes:' + url.getParam('sp_likes')
            }
        }

        if(url.hasParam('sp_show_trash')) {
            if(url.getParam('sp_show_trash') == '1') {
                method_params.q += ' rate:10'
            }
        }

        if(url.hasParam('sp_owners_only')) {
            if(url.getParam('sp_owners_only') == '1') {
                method_params.owners_only = 1
            }
        }

        return method_params
    }

    applyUsersSearchParams(url, method_params) 
    {
        if(url.hasParam('sp_cityid')) {
            method_params.city = window.main_url.getParam('sp_cityid')
        }

        if(url.hasParam('sp_age_from')) {
            method_params.age_from = url.getParam('sp_age_from')
        }
        
        if(url.hasParam('sp_age_to')) {
            method_params.age_to = url.getParam('sp_age_to')
        }
                        
        if(url.hasParam('sp_birth')) {
            let splitted_date = url.getParam('sp_birth').split('-')

            method_params.birth_year = splitted_date[0]
            method_params.birth_month = splitted_date[1]
            method_params.birth_day = splitted_date[2]
        }

        if(url.hasParam('sp_gender')) {
            if(Number(url.getParam('sp_gender')) > 0 && Number(url.getParam('sp_gender')) < 3) {
                method_params.sex = url.getParam('sp_gender')
            }
        }

        if(url.hasParam('sp_hometown')) {
            method_params.hometown = url.getParam('sp_hometown')
        }
        
        if(url.hasParam('sp_has_photo')) {
            method_params.has_photo = url.getParam('sp_has_photo')
        }
                        
        if(url.hasParam('sp_has_online')) {
            method_params.online = url.getParam('sp_has_online')
        }
                                        
        if(url.hasParam('sp_sort')) {
            method_params.sort = url.getParam('sp_sort')
        }
                                                        
        if(url.hasParam('sp_country')) {
            method_params.country = url.getParam('sp_country')
        }
                                                                       
        if(url.hasParam('sp_university')) {
            method_params.university = url.getParam('sp_university')
        }
                                                                                       
        if(url.hasParam('sp_relation')) {
            method_params.status = url.getParam('sp_relation')
        }
                                                                                                       
        if(url.hasParam('sp_school')) {
            method_params.school = url.getParam('sp_school')
        }
                                                                                                                       
        if(url.hasParam('sp_religion')) {
            method_params.religion = url.getParam('sp_religion')
        }

        return method_params
    }

    getClassByType(type = 'photo') 
    {
        let create_class = Photo
        switch(type) {
            case 'photo':
                create_class = Photo
                break
            case 'video':
                create_class = Video
                break
            case 'doc':
                create_class = Doc
                break
            case 'audio':
                create_class = Audio
                break
            case 'graffiti':
                create_class = ClassicGraffiti
                break
            case 'poll':
                create_class = Poll
                break
            case 'link':
                create_class = Link
                break
            case 'album':
                create_class = Album
                break
            case 'sticker':
                create_class = Sticker
                break
            default:
                create_class = Dummy
                break
        }

        return create_class
    }

    applyAnimation(umb, name, timeout = 200)
    {
        umb.nodes[0].style.animationDuration = `${timeout}ms`

        if(umb.hasClass('animated')) {
            umb.nodes[0].style.animationName = name + '_reverse'
            setTimeout(() => {
                umb.removeClass('animated')

                setTimeout(() => {
                    umb.nodes[0].style.animationDuration = ''
                    umb.nodes[0].style.animationName = ''
                }, 20)
            }, timeout - 20)
        } else {
            umb.nodes[0].style.animationName = name
            umb.addClass('animated')
        }
    }

    checkHeader() {
        // has scrollbar
        if(document.body.scrollHeight > document.body.clientHeight) {
            u('.header').attr('style', `padding: 10px calc(10% - 9px) 10px calc(10% + 1px);`)
            return
        }

        u('.header').attr('style', `padding: 10px 10% 10px 10%;`)
    }

    formatJson(json) {
        if(typeof json == 'object') {
            let html = `<div class='json_collapsable'>`
            html += `<div class='json_content'>`

            const {...keys} = json

            for(let key in keys) {
                if(typeof json[key] == 'function') {
                    continue
                }

                if(typeof json[key] == 'object') {
                    html += `<div class='json_padder'>${key}: { <div class='json_nested json_padder'>${window.Utils.formatJson(json[key])}</div> } </div>`
                } else {
                    html += `<div class='json_padder'>${key}: "${json[key]}"</div>`
                }
            }

            html += `</div></div>`
            return html
        } else {
            return String(json)
        }
    }

    async request(url, jsonp = true, formdata = null, headers = {}) {
        const call_time = Date.now()

        try {
            let result = null

            if(jsonp) {
                result = JSON.parse(await Utils.jsonp(url))
            } else {
                let results = null
                if(!formdata) {
                    results = await fetch(url)
                } else {
                    results = await fetch(url, {
                        body: new URLSearchParams([...formdata.entries()]),
                        mode: "cors",
                        headers: {
                            ...headers,
                            "Content-Type": "application/x-www-form-urlencoded"
                        },
                        method: 'POST',
                    })
                }

                result = await results.json()
            }
    
            if(result.contents) {
                result = JSON.parse(result.contents)
            }
    
            console.info(`XHR | Called ${url}, timestamp ${call_time}, result: `, result)
            return result
        } catch(e) {
            throw e
        }
    }
}
