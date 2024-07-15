window.tweaks = [
    {
        'name': 'settings_ui_tweaks.hide_image_status',
        'internal_name': 'Hide imagestatus',
        'code': `/* Hide imagestatus */
.image_status {
    display: none;
}

`
    },
    {
        'name': 'settings_ui_tweaks.vk_like_padding',
        'internal_name': 'Remove page padding',
        'author': 'litewk',
        'code': `/* Remove page padding */
.main_wrapper {
    padding: unset !important;
}

.main_wrapper .navigation {
    background: var(--elements-background-color);
    height: 100%;
    width: 156px;
    border-left: unset !important;
    border-right: 1px solid var(--elements-border-color);
    position: fixed;
}

#up_panel {
    display: none;
}

`,
    },
    {
        'name':  'settings_ui_tweaks.transitions_everywhere',
        'internal_name': 'Transitions everywhere',
        'code': `/* Transitions everywhere */
* {
    transition: 200ms all ease-in;
}

textarea {
    transition: unset !important;
}

`,
    },
    {
        'name': 'settings_ui_tweaks.round_avatars',
        'internal_name': 'Round avatars',
        'code': `/* Round avatars */
.avatar img {
    border-radius: 21px;
}

`
    },
    {
        'name': 'settings_ui_tweaks.highlight_friends',
        'internal_name': 'Highlight friends',
        'code': `/* Friends highlighter */
.friended {
    color: var(--friendly-color);
}

a.friended:hover {
    color: var(--friendly-hover-color);
}

`
    },
    {
        'name': 'settings_ui_tweaks.hide_onliner',
        'internal_name': 'Hide online square',
        'code': `/* Hide online square */
.onliner::before {
    display: none;
}
  
`
    },
    {
        'name': 'settings_ui_tweaks.hide_counters',
        'internal_name': 'Hide counters in navigation',
        'code': `/* Hide counters in navigation */
.counter {
    display: none;   
}        
`
    }
]
