u(document).on('click', 'a', async (e) => {
    let target = e.target
    if(target.tagName != 'A') {
        target = e.target.closest('a')
    }

    if(window.edit_mode) {
        if(!e.target.parentNode.classList.contains('tabs')) {
            e.preventDefault()
            return
        } else {
            window.edit_mode = false
            u('#__menupostedit').addClass('hidden')
            u('.navigation').removeClass('editing')
            u('.navigation').html(window.left_menu.getHTML())
        }
    }

    if(target.getAttribute('target') == '_blank') {
        return
    }

    if(target.dataset.ignore == '1' || !target.href || target.href.indexOf(location.origin) == -1) {
        return
    }

    e.preventDefault()
    await window.router.route(target.href, true, target.dataset.back)
})

/*window.addEventListener("focus", () => {
    window.main_class.removeCountersTitle()
})*/

window.addEventListener('hashchange', async (e) => {
    e.preventDefault()

    if(history.state != null) {
        return
    }

    if(window.edit_mode) {
        e.preventDefault()

        return
    }

    console.log('Hashchange event go.')
    window.main_url = new BetterURL(location.href)

    await window.router.route(location.href)
})

window.addEventListener('popstate', async (e) => {
    e.preventDefault()
    
    if(e.state == null) {
        return
    }

    console.log('Popstate event go.')

    Utils.replace_state(location.href)
    await window.router.route(location.href, false)
})

u(document).on('click', '.menu_up_hover_click', (e) => {
    if(scrollY > 1000) {
        window.temp_scroll = scrollY

        // smooth effect like как в вк
        window.scrollTo(0, 10)
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        })
    } else {
        if(window.back_button) {
            window.router.route('#' + window.back_button)
    
            window.back_button = null
            u(document).trigger('scroll')
            return
        }

        if(window.temp_scroll) {
            window.scrollTo(0, window.temp_scroll - 10)

            window.scrollTo({
                top: window.temp_scroll,
                behavior: "smooth"
            });
        }
    }

    u(document).trigger('scroll')
})

u(document).on('scroll', () => {
    if(scrollY < 1000) {
        if(window.back_button) {
            u('#up_panel').addClass('back') 
            u('#up_panel').removeClass('hidden')
        } else {
            if(!window.temp_scroll) {
                u('#up_panel').addClass('hidden')
            } else {
                u('#up_panel').addClass('down')
            }
        }
    } else {
        u('#up_panel').removeClass('hidden').removeClass('down')
        u('#up_panel').removeClass('back').addClass('to_up')
    }
})

u(document).on('input', 'textarea', (e) => {
    let boost = 5
    let textArea = e.target
    textArea.style.height = "5px"
    let newHeight = textArea.scrollHeight
    textArea.style.height = newHeight + boost + "px"

    return;
})

u(document).on('keydown', 'textarea', (e) => {
    if(e.keyCode == 9) {
        let v = e.target.value, s = e.target.selectionStart, end = e.target.selectionEnd
        e.target.value = v.substring(0, s) + '    ' + v.substring(end)
        e.target.selectionStart = e.target.selectionEnd = s + 4
        return false
    }

    return
})

u(document).on('click', '.dropdown_toggle', (e) => {
    let target = e.target

    if(target.tagName != 'svg') {
        target = target.closest('svg')
    }

    let dropdown = u('#' + target.dataset.onid).nodes[0]
    let root = dropdown.closest('.dropdown_root')

    u('.dropdown_menu.visible').removeClass('visible')
    u('.__dropdown_toggled').removeClass('__dropdown_toggled')
    
    if(!dropdown) {
        return
    }

    dropdown.classList.add('visible')
    root.classList.toggle('__dropdown_toggled')
})

u(document).on('click', 'body > *, .dropdown_menu p', (e) => {
    if(e.target.getAttribute('class') && e.target.getAttribute('class').indexOf('dropdown') != -1 || e.target.classList.contains('dropdown_toggle')) {
        return
    }

    if(e.target.tagName == 'polyline' || e.target.tagName == 'g' || e.target.tagName == 'svg') {
        return
    }

    u('.dropdown_menu.visible').removeClass('visible')
    u('.__dropdown_toggled').removeClass('__dropdown_toggled')
})

u(document).on('click', '.show_more', async (e) => {
    if(e.target.dataset.clicked == '1') {
        e.preventDefault()
        return
    }

    e.target.setAttribute('data-clicked', '1')
    
    if(!e.target.dataset.handler) {
        await window.main_classes['wall'].nextPage()
    } else {
        await window.main_classes[e.target.dataset.handler].nextPage()
    }

    //showMoreObserver.unobserve(u('.show_more')[0])

    e.target.setAttribute('data-clicked', '0')
    SavedPage.save(location.href)
})

u(document).on('click', '.paginator a', async (e) => {
    e.preventDefault()
    
    if(e.target.tagName == 'INPUT') {
        return
    }

    if(e.target.classList.contains('active')) {
        e.target.innerHTML = `
            <input type='text' value='${e.target.dataset.page}' id='__enterpage' maxlength='5' data-pagescount=${e.target.closest('.paginator').dataset.pagescount}>
        `

        u('.paginator #__enterpage').on('input', (e) => {
            e.target.style.width = (e.target.value.length * 4) + 19 + 'px'
        })

        u('.paginator #__enterpage').trigger('input')

        return
    }

    const page = Number(e.target.dataset.page) - 1

    window.main_classes['wall'].clear()
    await window.main_classes['wall'].page(page)

    const temper_url = new BetterURL(e.target.href)
    temper_url.setParam('page', page)
    
    Utils.push_state(temper_url.href)

    u('.paginator').remove()
    window.main_classes['wall'].createNextPage()

    u('#insert_paginator_here_bro').append(window.templates.paginator(window.main_classes['wall'].getPagesCount(), window.main_classes['wall'].getPage()))
})

u(document).on('change', '#__enterpage', async (e) => {
    const new_page = Number(e.target.value)

    if(isNaN(new_page) || new_page < 1 || new_page > e.target.dataset.pagescount) {
        e.target.parentNode.innerHTML = e.target.parentNode.dataset.page

        return
    }

    window.main_classes['wall'].clear()
    await window.main_classes['wall'].page(new_page - 1)

    main_url.setParam('page', new_page)
    Utils.push_state(window.main_url)

    u('.paginator').remove()
    window.main_classes['wall'].createNextPage()

    u('#insert_paginator_here_bro').append(window.templates.paginator(window.main_classes['wall'].objects.pagesCount, Number(window.main_url.getParam('page'))))
})

u(document).on('click', '#__comeback', (e) => {
    history.back()
})
