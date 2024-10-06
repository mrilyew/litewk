u(document).on('click', '#docums_menu_insert .rsp_main > a', (e) => {
    e.preventDefault()

    const target = u(e.target).closest('.rsp')
    target.toggleClass('arrowed')
    target.find('.sub_tabs').nodes[0].classList.toggle('shown')
})

u(document).on('click', '#docums_menu_insert .no_rsp', async (e) => {
    e.preventDefault()
    
    const tabl = u(`#docums_menu_insert a[data-href='${e.target.dataset.href}']`)
    u('#docums_menu_insert a').removeClass('selected')
    u('.additional_buttons a').attr('href', 'https://dev.vk.com/ru' + e.target.dataset.href)
    tabl.addClass('selected').addClass('stopped').addClass('but_not_visible')

    u('.dev_page').html('')
    u('.dev_page_wrapper').addClass('filler')

    const path = e.target.dataset.href
    const page = new Documentation()
    await page.fromId(path)

    window.router.pushState(e.target.href)
    window.controllers['DocumentationController']._EmptyPage()
    window.controllers['DocumentationController']._BuildPage(page)
    await window.controllers['DocumentationController']._BuildImages()

    u('.dev_page_wrapper').removeClass('filler')
    tabl.removeClass('stopped').removeClass('but_not_visible')
    window.scrollTo(0, 0)
})

u(document).on('click', '#_dev_vkapi_run', async (e) => {
    const params = u(`#execution_params input[type='text']`)
    const params_array = {}
    const method = u('#_execute_method_name').nodes[0].value

    params.nodes.forEach(param => {
        if(param.value == '') {
            return
        }

        params_array[param.dataset.name] = param.value
    })

    const result = await window.vk_api.call(method, params_array, true)
    u('#_result_api').html(Utils.formatJson(result))
})
