if(!window.templates) {
    window.templates = {}
}

window.templates.main = (menu_html = '') => {
    return `
    <style id='_customcss'>
        ${window.site_params.get('ui.custom_css') ? Utils.escape_html(window.site_params.get('ui.custom_css')) : '{}'}
    </style>
    
    <div class='fast_errors'></div>
    <div class='background_fixed'></div>
    
    <div class='fullscreen_dimmer'></div>
    <div class='dimmer'></div>

    <div class='notification_global_wrap left'></div>
    <div class='notification_global_wrap right'></div>

    <div id='up_panel' class='menu_up_hover_click'>
        <div id='to_up'>
            <svg id="to_up_icon" viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
            <span>${_('navigation.to_up')}</span>
        </div>
        
        <div id='come_back'>
            <svg id="come_back_icon" viewBox="0 0 10 6"><polygon points="0 0 5 6 10 0 0 0"/></svg>
            <span>${_('navigation.come_back')}</span>
        </div>

        <div id='to_back'>
            <svg id="to_back_icon" viewBox="0 0 10 6"><polygon points="0 6 5 0 10 6 0 6"/></svg>
            <span>${_('navigation.to_back')}</span>
        </div>
    </div>

    <div class='main_wrapper'>
        <div class="navigation">
            ${menu_html}
            <div class='menu_up_hover menu_up_hover_click'></div>
        </div>

        <div class="page_content">

        </div>
    </div>
    `
}
