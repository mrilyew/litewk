window.routes = [
    {
        'url': 'id{int|id}',
        'script_name': 'user_page'
    },
    {
        'url': 'search/{string|section}',
        'script_name': 'search_page'
    },
    {
        'url': 'groups{int|id}/{string|section}',
        'script_name': 'groups_page'
    },
    {
        'url': 'subscriptions{int|id}',
        'script_name': 'subscriptions_page'
    },
    {
        'url': 'gifts{int|id}',
        'script_name': 'gifts_page'
    },
    {
        'url': 'groups{int|id}',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups',
        'script_name': 'groups_page'
    },
    {
        'url': 'groups/{string|section}',
        'script_name': 'groups_page'
    },
    {
        'url': 'event{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'public{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'group{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'club{int|id}',
        'script_name': 'club_page'
    },
    {
        'url': 'login/{string|section}',
        'script_name': 'auth_page'
    },
    {
        'url': 'login',
        'script_name': 'auth_page'
    },
    {
        'url': 'fave/{string|section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'fave',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks/{string|section}',
        'script_name': 'faves_page'
    },
    {
        'url': 'bookmarks',
        'script_name': 'faves_page'
    },
    {
        'url': 'settings/{string|section}',
        'script_name': 'settings_page',
        'ignore_save': true,
    },
    {
        'url': 'settings',
        'script_name': 'settings_page',
        'ignore_save': true,
    },
    {
        'url': 'debug/{string|section}',
        'script_name': 'debug_page',
        'ignore_save': true,
    },
    {
        'url': 'debug',
        'script_name': 'debug_page',
        'ignore_save': true,
    },
    {
        'url': 'friends{int|id}/{string|section}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends{int|id}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends/{string|section}',
        'script_name': 'friends_page'
    },
    {
        'url': 'friends',
        'script_name': 'friends_page'
    },
    {
        'url': 'feed/notifications',
        'script_name': 'notifications_page'
    },
    {
        'url': 'feed/{string|section}',
        'script_name': 'news_page'
    },
    {
        'url': 'feed',
        'script_name': 'news_page'
    },
    {
        'url': '{string|type}/{int|owner_id}_{int|item_id}/likes',
        'script_name': 'likes_page'
    },
    {
        'url': 'wall{int|owner_id}_{int|post_id}',
        'script_name': 'post_page'
    },
    {
        'url': 'wall{int|owner_id}/{string|section}',
        'script_name': 'wall_page'
    },
    {
        'url': 'wall{int|owner_id}',
        'script_name': 'wall_page'
    },
    {
        'url': 'away',
        'script_name': 'resolve_link',
        'ignore_save': true,
        'dont_pushstate': false,
    },
    {
        'url': 'search',
        'script_name': 'search_page'
    },
    {
        'url': 'edit/{string|section}',
        'script_name': 'edit_page',
        'ignore_save': true
    },
    {
        'url': 'edit',
        'script_name': 'edit_page'
    },
    {
        'url': 'note{int|owner}_{int|id}',
        'script_name': 'note_page',
    },
    {
        'url': 'notes{int|owner}',
        'script_name': 'notes_page',
    },
    {
        'url': 'notes',
        'script_name': 'notes_page',
    },
    {
        'url': 'doc{int|owner}_{int|id}',
        'script_name': 'doc_page',
        'hide_menu': true,
    },
    {
        'url': 'docs{int|owner}',
        'script_name': 'docs_page',
    },
    {
        'url': 'docs',
        'script_name': 'docs_page',
    },
    {
        'url': 'photo{int|owner}_{int|id}',
        'script_name': 'photo_page',
    },
    {
        'url': 'error/{int|error}',
        'script_name': 'error_page',
        'ignore_save': true,
        'dont_pushstate': true,
    },
    {
        'url': 'poll{int|owner_id}_{int|poll_id}',
        'script_name': 'poll_voters_page',
    },
    {
        'url': '{string|id}',
        'script_name': 'resolve_link',
        'ignore_save': true,
        'dont_pushstate': true,
    },
    {
        'url': '',
        'script_name': 'user_page',
    },
]
