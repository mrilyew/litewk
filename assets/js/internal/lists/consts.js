window.consts = {
    'LAST_UPDATE': 1724462400,

    'TYPICAL_FIELDS': 'first_name_gen,first_name_acc,last_name_gen,last_name_acc,first_name_ins,last_name_ins,first_name_abl,last_name_abl,common_count,country,city,id,is_favorite,is_hidden_from_feed,image_status,last_seen,online,lists,friend_status,photo_50,photo_100,photo_200,photo_orig,status,is_followers_mode_on,sex',
    'TYPICAL_FIELDS_MINIMUM': 'first_name_gen,first_name_acc,last_name_gen,last_name_acc,first_name_ins,last_name_ins,first_name_abl,last_name_abl,sex,image_status,photo_50,photo_100,photo_200,last_seen,online,blacklisted_by_me',
    'TYPICAL_GROUPS_FIELDS': 'activity,photo_100,description,members_count',
    'USER_FULL_FIELDS': 'first_name_gen,first_name_acc,last_name_gen,last_name_acc,first_name_ins,last_name_ins,first_name_abl,last_name_abl,about,activities,bdate,blacklisted,blacklisted_by_me,books,can_see_all_posts,career,city,common_count,connections,contacts,counters,country,cover,crop_photo,domain,education,exports,employee_mark,employee_working_state,is_service_account,educational_profile,name,type,reposts_disabled,followers_count,friend_status,games,has_photo,has_mobile,has_mail,house,home_town,interests,is_subscribed,is_no_index,is_nft,is_favorite,is_friend,is_followers_mode_on,bdate_visibility,is_dead,image_status,is_hidden_from_feed,is_verified,last_seen,maiden_name,movies,music,military,nickname,online,online_info,occupation,owner_state,personal,photo_200,photo_50,photo_max_orig,quotes,relatives,relation,schools,sex,site,status,tv,universities,verified,wall_default',
    'CLUB_FULL_FIELDS': 'activity,addresses,age_limits,ban_info,can_create_topic,can_message,can_post,can_suggest,can_see_all_posts,can_upload_doc,can_upload_story,can_upload_video,city,contacts,counters,country,cover,crop_photo,description,fixed_post,has_photo,is_favorite,is_hidden_from_feed,is_subscribed,is_messages_blocked,links,main_album_id,main_section,member_status,members_count,place,photo_50,photo_200,photo_max_orig,public_date_label,site,start_date,finish_date,status,trending,verified,wall,wiki_page',

    'VK_API_VERSION': '5.238',
    'DEFAULT_COUNT': 10,
    'DEFAULT_COUNT_MORE': 20,
    'DEFAULT_TIMEOUT': 20000,

    'ACCOUNTS_MAX_COUNT': 1000,
    'ACCOUNTS_MAX_SCOPE': 501202911,
    'ACCOUNTS_COUNTERS_REFRESH_TIMEOUT': 60000,
    'ACCOUNTS_ONLINE_TIMEOUT': 300000,
    'ACCOUNTS_DIRECT_AUTH_APPS': [
        {
            'name': 'VK Android',
            'client_id': 2274003,
            'client_secret': 'hHbZxrka2uZ6jB1inYsH',
        },
        {
            'name': 'VK IPhone',
            'client_id': 3140623,
            'client_secret': 'VeWdmVclDCtn6ihuP1nt',
        },
        {
            'name': 'VK IPad',
            'client_id': 3682744,
            'client_secret': 'mY6CDUswIVdJLCD3j15n',
        },
        {
            'name': 'VK Desktop',
            'client_id': 3697615,
            'client_secret': 'AlVXZFMUqyrnABp8ncuU',
        },
        {
            'name': 'VK Windows Phone',
            'client_id': 3502557,
            'client_secret': 'PEObAuQi6KloPM4T30DV',
        },
        {
            'name': 'Kate Mobile',
            'client_id': 2685278,
            'client_secret': '',
        },
    ],
    'ACCOUNTS_OAUTH_APPS': [
        {
            'name': 'VK Admin',
            'app_id': 6121396,
        },
        {
            'name': 'VK Admin iOS',
            'app_id': 5776857,
        },
        {
            'name': 'VK Calls',
            'app_id': 7793118,
        },
        {
            'name': 'VK Mail',
            'app_id': 7799655,            
        },
        {
            'name': 'VK Connect',
            'app_id': 7497650
        },
        {
            'name': 'Kate Mobile',
            'app_id': 2685278
        },
        {
            'name': 'VK.com (web-token)',
            'app_id': 6287487
        }
    ],
    'SETTINGS_README_LINK': 'https://github.com/litewk/litewk/blob/main/README.md',
    'SETTINGS_GITHUB_LINK': 'https://github.com/litewk/litewk',

    'ACCOUNT_NO_AVATAR': 'https://vk.com/images/camera_200.png',

    'DEFAULT_ROUTE': '#id0',
    'DEFAULT_ROUTE_UNLOGGED': '#login',

    'REGEX_HASHTAGS': /(^|\s)#([^\s#\n]+)/g,
    'REGEX_ROUTE_PATTERN': /\{([^}]+)\}/g,
    'REGEX_REMOVE_COUNTERS': /^\([0-9]+\) |\([0-9]+\)/g,
    'REMOVE_DOMAINS': [
        'https://vk.com/', 
        'https://vkontakte.ru/', 
        'http://vk.com/', 
        'http://vkontakte.ru/', 
        'https://m.vk.com/', 
        'http://m.vk.com/',
        'https://new.vk.com/',
        'http://new.vk.com/',
        'https://wap.vk.com/',
        'http://wap.vk.com/',
        'https://0.vk.com/',
        'http://0.vk.com/',
        location.origin,
        location.pathname,
        location.pathname + '#',
        '#'
    ],

    'DEBUG_SANDBOX_DEFAULT_CODE': `let user = new User()\nawait user.fromId(1)\n\nreturn window.templates.user_page(user)`,
    'VK_LIKE_TIMEOUT': 5000,
    'CSS_FOCUS_NAVIGATION': `
    .navigation {
        background: var(--elements-background-color-opacity);
    }
    `,
    'SELECTOR_INSERT_MAIN': '#page_content',

    'MASONRY_MARGIN_WIDTH': 2,
    'MASONRY_MARGIN_HEIGHT': 2,
    'MASONRY_WIDE_RATIO': 1.2,
    'MASONRY_REGULAR_RATIO': 0.8,
    'MASONRY_MAX_WIDTH_DEFAULT': 510,
    'MASONRY_MAX_HEIGHT_DEFAULT': 320,

    'INDEX_DB_CACHE_LIFETIME': 500,
    'FAVES_IS_FAVED': 1,

    'FRIEND_STATUS_NOT': 0,
    'FRIEND_STATUS_REQUEST_FROM_ME': 1,
    'FRIEND_STATUS_REQUEST_FROM_USER': 2,
    'FRIEND_STATUS_IS_FRIEND': 3,

    'FAVE_SECTIONS': ['all', 'pages', 'divider', 'user', 'group', 'post', 'article', 'link', 'video']
}