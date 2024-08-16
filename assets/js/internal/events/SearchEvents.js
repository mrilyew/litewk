u(document).on('click', `#_global_search input[type='button']`, async (e) => {
    u(`#_global_search input[type='text']`).trigger('change')
})

u(document).on('change', `.search_params .search_param input[type='text'], .search_params .search_param input[type='date'], .search_params .search_param select`, (e) => {
    if(e.target.value == '' || e.target.value == null) {
        window.main_url.deleteParam('sp_' + e.target.dataset.setname)
    } else {
        window.main_url.setParam('sp_' + e.target.dataset.setname, e.target.value)
    }
    
    window.Utils.replace_state(window.main_url)
})

u(document).on('change', `.search_params .search_param input[type='radio']`, (e) => {
    window.main_url.setParam('sp_' + e.target.dataset.setname, u(`input[type='radio'][data-setname='${e.target.dataset.setname}']:checked`).nodes[0].value)
    window.Utils.push_state(window.main_url)
})

u(document).on('change', `.search_params .search_param input[type='checkbox']`, (e) => {
    if(!e.target.checked) {
        window.main_url.deleteParam('sp_' + e.target.dataset.setname)
    } else {
        window.main_url.setParam('sp_' + e.target.dataset.setname, 1)
    }

    window.Utils.push_state(window.main_url)
})

u(document).on('change', `#_global_search input[type='text']`, async (e) => {
    main_url.setParam('q', e.target.value)
    main_url.deleteParam('page')

    Utils.push_state(main_url)

    window.router.restart()
})
