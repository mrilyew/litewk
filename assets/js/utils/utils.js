function get_age(date)
{
    let age = moment().diff(moment(date, "DD-MM-YYYY"), 'years')

    return _('time.age', age)
}

function format_birthday(bdate)
{
    if(!bdate) {
        return _('hidden')
    }

    tempdate = bdate.split('.')

    if(tempdate[2]) {
        moment_tempdate = moment(bdate, 'DD.MM.YYYY')
        bdate = moment_tempdate.format('DD.MM.YYYY')

        bdate += ': ' + get_age(bdate)
    } else {
        moment_tempdate = moment(bdate, 'DD.MM')
        bdate = moment_tempdate.format('DD.MM')
    }

    return bdate
}

function log(txt)
{
    console.log(txt)
}

function init_observers()
{
    if(window.site_params.get('ux.auto_scroll', '1') == '0') {
        return 
    }
    
    showMoreObserver.observe($('.show_more')[0])
}

function short_date(unix_time, need_time = true, hide_year = false) 
{
    let date = new Date(unix_time * 1000)
    let current_date = new Date()
    
    switch(window.site_params.get('ui.date_format')) {
        default:
        case 'default':
            return `${String(date.getDate()).padStart(2, '0')}.${String(date.getMonth() + 1).padStart(2, '0')}${hide_year ? '' : '.' + date.getFullYear()} ` + (need_time ? `в ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
        case 'month':
            if(current_date.getFullYear() != date.getFullYear()) {
                return _('time.date_formatted_month', String(date.getDate()).padStart(2, '0'), _(`time.month_${date.getMonth()+1}_gen`), hide_year ? '' : '' + date.getFullYear(), need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
            } else {
                return _('time.date_formatted_month_no_year', String(date.getDate()).padStart(2, '0'), _(`time.month_${date.getMonth()+1}_gen`), need_time ? `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}` : '')
            }
            
    }
}

function find_owner(id, profiles = [], groups = []) 
{
    if(id < 0) {
        return groups.find(item => item.id == Math.abs(id))
    } else {
        return profiles.find(item => item.id == Math.abs(id))
    }
}

function random_int(min, max) {
    return Math.round(Math.random() * (max - min) + min)
}

function add_error(message, id, wait_time = 5000, type = '') 
{
    if(document.querySelectorAll(`*[data-errid='${id}']`).length > 0) {
        return
    }
    
    window.scrollTo(0, 0)
    $('.page_content')[0].insertAdjacentHTML('afterbegin', `
        <div class='head_error ${type}' data-errid='${id}'>
            <span>${message}</span>
        </div>
    `)

    setTimeout(() => {
        $(`div[data-errid='${id}']`).remove()
    }, wait_time)
}

function add_onpage_error(message)
{
    $('.page_content')[0].innerHTML = ''
    $('.page_content')[0].insertAdjacentHTML('beforeend', `
        <div class='onpage_error'>
            ${message}
        </div>
    `)
}

function escape_html(text) {
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

function nl2br(text)
{
    return text.replace(/(\r\n|\n\r|\r|\n)/g, '<br>')
}

function format_links(text)
{
    return text.replace(/(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig, 
    `<a href='site_pages/resolve_link.html?id=$1' target='_blank'>$1</a>`)
}

function format_hashtags(text) 
{
    return text.replace(/#(\S*)/g, `<a href='site_pages/search.html?section=posts&query=#$1'>#$1</a>`)
}

function format_mentions(text)
{
    return text.replace(/\[([^|]+)\|([^\]]+)\]/g, `<a href="site_pages/resolve_link.html?id=$1">$2</a>`)
}

function format_emojis(text)
{
    return twemoji.parse(text)
}

function format_text(text) {
    let formatted_text = text

    formatted_text = escape_html(formatted_text)
    formatted_text = nl2br(formatted_text)
    formatted_text = format_hashtags(formatted_text)
    formatted_text = format_mentions(formatted_text)
    formatted_text = format_links(formatted_text)
    formatted_text = format_emojis(formatted_text)

    return formatted_text
}

function format_seconds(duration) 
{
    let my_time = moment.duration(duration * 1000)
    let hours = String(my_time.hours()).padStart(2, '0')
    let minutes = String(my_time.minutes()).padStart(2, '0')
    let seconds = String(my_time.seconds()).padStart(2, '0')

    return `${hours && hours > 0 ? hours + ':' : ''}${minutes}:${seconds}`
}

// опять спиздил
function human_file_size(bytes, si = null) 
{
    let thresh = si ? 1000 : 1024;
    if(Math.abs(bytes) < thresh) {
        return bytes + ' B';
    }
    let units = si
        ? ['kB','MB','GB','TB','PB','EB','ZB','YB']
        : ['KiB','MiB','GiB','TiB','PiB','EiB','ZiB','YiB'];
    let u = -1;
    do {
        bytes /= thresh;
        ++u;
    } while(Math.abs(bytes) >= thresh && u < units.length - 1);
    return bytes.toFixed(1)+' '+units[u];
}

async function resolve_city(id)
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

async function resolve_club(id)
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

function append_script(link, toBody = false)
{
    return new Promise( function (resolve, reject) {
        let script = document.createElement('script')
        script.src = link
        script.async = "true";
        script.setAttribute('id', '_main_page_script')

        script.onerror = () => {
            reject( Error("Network error loading " + script.src) );
        }

        script.onload = async () => {
            await window.page_class.render_page()
            $('textarea').trigger('input')
            resolve(true);
        }

        if(!toBody) {
            document.head.appendChild(script)
        } else {
            document.body.appendChild(script)
        }
    }) 
}

// https://gist.github.com/walsh9/c4722c5f3c90e1cc0a5b
function jsonp(url, timeout = 1000) {
    function urlJoinChar(url) {
        return url.indexOf('?') >= 0 ? '&' : '?'
    }

    return new Promise( function (resolve, reject) {
        var timeout = timeout || 10000; // default timeout
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
            reject( Error("Network error loading " + script.src) )
        }

        head.appendChild(script)
        var timeoutFunction = setTimeout(function() {
            cleanUp();
            reject( Error("Request to " + url + " failed to execute callback after " + timeout + "ms.") )  
        }, timeout);
  
        function cleanUp() {
            timeoutFunction && clearTimeout(timeoutFunction)
            window[callbackName] && delete window[callbackName]
            script && head.removeChild(script)
        }
    } )
}

let showMoreObserver = new IntersectionObserver(entries => {
    entries.forEach(x => {
        if(x.isIntersecting) {
            $(".show_more").click()
        }
    })
}, {
    root: null,
    rootMargin: "0px",
    threshold: 0
})

function push_state(url)
{
    history.pushState({}, '', url)
    
    window.s_url = new URL(url)
}

function replace_state(url)
{
    history.replaceState({}, '', url)
    
    window.s_url = new URL(url)
}

// клянусь джаваскрипт ненавидеть
function array_splice(array, key)
{
    resultArray = [];

    for(let i = 0; i < array.length; i++){
        if(i != key){
            resultArray.push(array[i]);
        }
    }

    return resultArray;
}

function array_swap(array, first, last) 
{
    let temp = array[first]
    array[first] = array[last]
    array[last] = temp

    return array
}

function not_found_not_specified()
{
    window.location.assign('https://youtu.be/BHj7U_bQpkc')
}