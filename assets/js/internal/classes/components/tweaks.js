window.tweaks = [
    {
        'name': 'settings_ui_tweaks.vk_like_padding',
        'internal_name': 'Remove page padding',
        'author': 'litewk',
        'code': `/* Remove page padding */
.wrapper {
    padding: unset !important;
}

.wrapper .menu {
    background: var(--main-elements-color);
    height: 100%;
    width: 156px;
    border-left: unset !important;
    border-right: 1px solid var(--main-text-lighter-color);
    position: fixed;
}

.to_the_sky {
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
    color: var(--main-friendly-color);
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
