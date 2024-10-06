class Theme {
    constructor(info) {
        this.info = info
    }

    getName() {
        const short_lang_name = window.lang ? window.lang.lang_info.short_name : 'qqx'

        return (this.info[`${short_lang_name}_display_name`] ?? this.info['display_name']).escapeHtml()
    }

    getAuthor() {
        return this.info.author ?? ''
    }

    getId() {
        return this.info.id
    }

    getPreview() {
        return this.info.preview
    }

    getStylesList() {
        return this.info.include_styles
    }

    install() {
        if(Theme.getInstalledTheme().id == this.info.id) {
            return
        }

        window.site_params.set('ui.installed_theme', JSON.stringify(this.info))
        return true
    }

    isInheritsDefault() {
        return this.info.inherits_default
    }

    isRequiresJS() {
        return this.info.requires_js
    }

    static getInstalledTheme() {
        return JSON.parse(window.site_params.get('ui.installed_theme', '{}'))
    }
}

window.themes = [
    new Theme({
        'id': 'default',
        'display_name': '_dark_theme',
        'author': '-',

        'ru_display_name': 'Тёмная тема',
        'en_display_name': 'Dark theme',

        'inherits_default': true,
        'requires_js': false,
        'preview': `
            <div style='height: 100%;background: #141415;'>
                <div style='position: absolute;width: 128px;height: 15px;background: #31333f;'>
                    <span style='font-size: 10px;position: absolute;color:white;margin: 1px 0px 0px 4px;'>LiteWK Default</span>
                </div>
                <div style='position: absolute;top: 20px;width:37px;height:60px;border-right:1px solid #535561;height: 57px;'></div>

                <div style='position: absolute;top: 20px;right: 3px;width: 83px;height:57px;background: #31333f;border: 1px solid #535561;'>
                    <span style='color:white'>...</span>
                </div>
            </div>
        `,
        'include_styles': [],
        'include_scripts': [],
        'include_libs': [],
    }),
    new Theme({
        'id': 'light',
        'display_name': '_light_theme',
        'author': `<a href='https://claude.ai/' target='_blank'>Claude</a>, -`,
        'preview': `
            <div style='height: 100%;background:linear-gradient(138deg, #e0e0e0 19%, rgb(255, 223, 186) 100%)'>
                <div style='position: absolute;width: 128px;height: 15px;background: #31333f;'>
                    <span style='font-size: 10px;position: absolute;color:white;margin: 1px 0px 0px 4px;'>LiteWK Light</span>
                </div>    
                <div style='width:37px;height:80px;border-right:1px solid #4a4a4a;'></div>

                <div style='position: absolute;top: 20px;width:37px;height:60px;border-right:1px solid #535561;height: 57px;'></div>

                <div style='position: absolute;top: 20px;right: 3px;width: 83px;height:57px;background: #31333f;border: 1px solid #535561;'>
                    <span style='color:white'>...</span>
                </div>
            </div>
        `,

        'ru_display_name': 'Светлая тема',
        'en_display_name': 'Light theme',

        'inherits_default': true,
        'requires_js': false,
        'include_styles': [
            'themes/light_theme/style.css',
        ],
        'include_scripts': [],
        'include_libs': [],
    }),
    new Theme({
        'id': 'brutal',
        'display_name': '_brutal_theme',
        'author': `<a href='https://claude.ai/' target='_blank'>Claude</a>`,
        'preview': `
            <div style='height: 100%;background:red'>
                <div style='position: absolute;width: 128px;height: 15px;background: #31333f;'>
                    <span style='font-size: 10px;position: absolute;color:white;margin: 1px 0px 0px 4px;'>LiteWK Red</span>
                </div>    
                <div style='width:37px;height:80px;border-right:1px solid #4a4a4a;'></div>

                <div style='position: absolute;top: 20px;width:37px;height:60px;border-right:1px solid #535561;height: 57px;'></div>

                <div style='position: absolute;top: 20px;right: 3px;width: 83px;height:57px;background: #31333f;border: 1px solid #535561;'>
                    <span style='color:white'>...</span>
                </div>
            </div>
        `,

        'ru_display_name': 'Красная тема',
        'en_display_name': 'Brutal theme',

        'inherits_default': true,
        'requires_js': false,
        'include_styles': [
            'themes/brutal_theme/style.css',
        ],
        'include_scripts': [],
        'include_libs': [],
    }),
]
