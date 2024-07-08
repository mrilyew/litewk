if(!window.templates) {
    window.templates = {}
}

window.templates.main = (menu_html = '') => {
    return `
    <style id='_customcss'>
        ${window.site_params.get('ui.custom_css') ? Utils.escape_html(window.site_params.get('ui.custom_css')) : '{}'}
    </style>
    
    <div class='dimmer'></div>
    <div class='to_the_sky menu_up_hover_click'>
        <span class='to_up'>${_('navigation.to_up')}</span>
        <span class='come_back'>${_('navigation.come_back')}</span>
    </div>
    <div class="wrapper">
        <div class="menu">
            ${menu_html}
            <div class='menu_up_hover menu_up_hover_click'></div>
        </div>

        <div class="page_content">

        </div>
    </div>
    `
}
