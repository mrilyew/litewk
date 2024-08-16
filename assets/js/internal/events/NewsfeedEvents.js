u(document).on('click', '.newsfeed_wrapper #__newsfeedrefresh', async (e) => {
    window.main_classes['wall'].clear()
    await window.main_classes['wall'].nextPage()
})

u(document).on('change', '.newsfeed_wrapper #__newsfeedreturntype', async (e) => {
    window.main_classes['wall'].clear()
    if(e.target.value == 'all') {
        delete window.main_classes['wall'].method_params.filters
    } else {
        window.main_classes['wall'].method_params.filters = e.target.value
    }

    window.main_classes['wall'].nextPage()

    main_url.setParam('news_type', e.target.value)
    Utils.replace_state(window.main_url.href)
})

u(document).on('click', '.newsfeed_wrapper #__newsfeedreturnbanned', async (e) => {
    window.main_classes['wall'].clear()
    window.main_classes['wall'].method_params.return_banned = Number(e.target.checked)
    window.main_classes['wall'].nextPage()

    main_url.setParam('return_banned', Number(e.target.checked))
    Utils.replace_state(window.main_url.href)
})
