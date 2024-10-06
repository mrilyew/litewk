u(document).on('click', '#_lang_change_button', (e) => {
    const msg = new MessageBox(_('settings_language.change_language'), `
        <div id='_lang_change' class='flex flex_column'></div>
    `)

    window.langs.forEach(lang => {
        if(!lang.lang_info) {
            return
        }

        u('#_lang_change').append(`
            <label class='lang_block flex flex_row align_center' data-id='${lang.lang_info.short_name}' title='${_('settings_language.lang_author')}: ${lang.lang_info.author.escapeHtml()}'>
                <div class='flag' style='background-position:${lang.lang_info.flag};'></div>
                <span>${Utils.escape_html(lang.lang_info.native_name)}</span>
            </label>
            `
        )
    })

    u('#_lang_change .lang_block').on('click', (e) => {
        const target = e.target.closest('.lang_block')

        msg.close()
        window.site_params.set('lang', target.dataset.id)
        window.lang = null
        window.lang = window.langs.find(item => item.lang_info.short_name == window.site_params.get('lang'))
        
        setTimeout(() => {window.router.restart('language', 'ignore_menu')}, 50)
    })

    msg.getNode().style.width = '230px'
    msg.getNode().querySelector('.messagebox_body').style.height = '190px'
})

u(document).on('click', '#toggle_menu_edit', (e) => {
    window.main_class.toggleMenuEditMode()
})

u(document).on('click', '.main_wrapper.editing .navigation #_resetdef', (e) => {
    window.left_menu.reset()

    u('.navigation .navigation_list').html(window.left_menu.getHTML(true))
    u(`.navigation a[data-uid='-1']`).trigger('click')
})

u(document).on('click', '.main_wrapper.editing .navigation #_addnav', (e) => {
    window.selected_tab = window.left_menu.append()

    u('.navigation .navigation_list').html(window.left_menu.getHTML(true))
    u(`.navigation a[data-uid='${window.selected_tab.getUid()}']`).trigger('click')
    // он написал одно слово за всю школу
})

u(document).on('click', '.main_wrapper.editing .navigation a', (e) => {
    u('.main_wrapper.editing .navigation a').removeClass('editing')
    e.target.classList.toggle('editing')

    const tab = window.left_menu.findItem(e.target.dataset.uid)
    window.selected_tab = new LeftMenuItem(tab)

    u('.navigation_list_editor_info #i18n_menu_tip').html(_('settings_ui.settings_ui_i18n_tip'))
    u('.navigation_list_editor_info #_leftmenu_text').nodes[0].value = window.selected_tab.info.name
    u('.navigation_list_editor_info #_leftmenu_href').nodes[0].value = window.selected_tab.info.href
    u('.navigation_list_editor_info #_leftmenu_anchor').nodes[0].value = window.selected_tab.info.anchor ?? ''
    u('.navigation_list_editor_info #_leftmenu_type').nodes[0].value = window.selected_tab.info.type

    u('.navigation_list_editor_info #_leftmenu_newpage').nodes[0].checked = window.selected_tab.info.new_page
    u('.navigation_list_editor_info #_leftmenu_newpage').trigger('change')

    u('.navigation_list_editor_info #_leftmenu_disabled').nodes[0].checked = window.selected_tab.info.disabled
    u('.navigation_list_editor_info #_leftmenu_disabled').trigger('change')

    u('.navigation_list_editor_info #_leftmenu_hidden').nodes[0].checked = window.selected_tab.info.hidden
    u('.navigation_list_editor_info #_leftmenu_hidden').trigger('change')
})

u(document).on('input', '.main_wrapper.editing .navigation_list_editor_info input, .main_wrapper.editing .navigation_list_editor_info select', (e) => {
    if(!window.selected_tab) {
        return
    }

    window.selected_tab.info.name = u('.navigation_list_editor_info #_leftmenu_text').nodes[0].value

    if(window.selected_tab.info.name[0] == '_' && e.target.matches('#_leftmenu_text')) {
        u('.navigation_list_editor_info #i18n_menu_tip').html(_(window.selected_tab.info.name.substr(1)))
    }

    window.selected_tab.info.href = u('.navigation_list_editor_info #_leftmenu_href').nodes[0].value
    window.selected_tab.info.anchor = u('.navigation_list_editor_info #_leftmenu_anchor').nodes[0].value
    window.selected_tab.info.new_page = u('.navigation_list_editor_info #_leftmenu_newpage').nodes[0].checked
    window.selected_tab.info.disabled = u('.navigation_list_editor_info #_leftmenu_disabled').nodes[0].checked
    window.selected_tab.info.hidden = u('.navigation_list_editor_info #_leftmenu_hidden').nodes[0].checked
    window.selected_tab.info.type = u('.navigation_list_editor_info #_leftmenu_type').nodes[0].value

    window.left_menu.list[window.left_menu.list.indexOf(window.selected_tab)] = window.selected_tab
    window.left_menu.save()

    u('.navigation .navigation_list').html(window.left_menu.getHTML(true))
})

u(document).on('click', '.main_wrapper.editing #_delnav', (e) => {
    if(!window.selected_tab) {
        return
    }

    const next_item = window.left_menu.deleteItem(window.selected_tab)
    u('.navigation .navigation_list').html(window.left_menu.getHTML(true))

    if(next_item) {
        u(`.navigation a[data-uid='${next_item.info.uid}']`).trigger('click')
    }
})
                
u(document).on('click', '.main_wrapper.editing #_upnav', (e) => {
    if(!window.selected_tab) {
        return
    }

    window.left_menu.moveItem(selected_tab, 'up')
    u('.navigation .navigation_list').html(window.left_menu.getHTML(true))

    u(`.navigation a[data-uid='${window.selected_tab.info.uid}']`).addClass('editing')
})

u(document).on('click', '.main_wrapper.editing #_downnav', (e) => {
    if(!window.selected_tab) {
        return
    }

    window.left_menu.moveItem(window.selected_tab, 'down')
    u('.navigation .navigation_list').html(window.left_menu.getHTML(true))

    u(`.navigation a[data-uid='${window.selected_tab.info.uid}']`).addClass('editing')
})
