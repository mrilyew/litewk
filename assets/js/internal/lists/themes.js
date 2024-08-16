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
            <div style='background:linear-gradient(138deg, #000000 19%, rgb(23 14 44) 100%)'>
                <div style='background:#060709;width:37px;height:80px;border-right:1px solid #b1b1b1;'></div>

                <div style='position: absolute;top: 3px;right: 3px;width: 83px;background: #060709;border: 1px solid #b1b1b1;'>
                    <span style='color:white'>...</span>
                </div>

                <div style='position: absolute;top: 27px;right: 57px;width: 29px;height: 51px;background: #060709;border: 1px solid #b1b1b1;'></div>
                <div style='position: absolute;top: 27px;right: 3px;width: 52px;height: 51px;background: #060709;border: 1px solid #b1b1b1;'></div>
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
            <div style='background:linear-gradient(138deg, #e0e0e0 19%, rgb(255, 223, 186) 100%)'>
                <div style='width:37px;height:80px;border-right:1px solid #4a4a4a;'></div>

                <div style='position: absolute;top: 3px;right: 3px;width: 83px;background: #ffffff;border: 1px solid #4a4a4a;'>
                    <span style='color:black'>...</span>
                </div>

                <div style='position: absolute;top: 27px;right: 57px;width: 29px;height: 51px;background: #ffffff;border: 1px solid #4a4a4a;'></div>
                <div style='position: absolute;top: 27px;right: 3px;width: 52px;height: 51px;background: #ffffff;border: 1px solid #4a4a4a;'></div>
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
            <div style='background:linear-gradient(138deg, var(--black) 0%, rgb(153, 0, 0) 100%);'>
                <div style='width:37px;height:80px;border-right:1px solid #ff3333;'></div>

                <div style='position: absolute;top: 3px;right: 3px;width: 83px;background: #2d0000;border: 1px solid #ff3333;'>
                    <span style='color:black'>...</span>
                </div>

                <div style='position: absolute;top: 27px;right: 57px;width: 29px;height: 51px;background: #2d0000;border: 1px solid #ff3333;'></div>
                <div style='position: absolute;top: 27px;right: 3px;width: 52px;height: 51px;background: #2d0000;border: 1px solid #ff3333;'></div>
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
