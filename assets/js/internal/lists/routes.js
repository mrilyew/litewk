window.routes = [
    {
        'url': 'id{int|id}',
        'script_name': 'UserController.UserPage'
    },
    {
        'url': 'search/{string|section}',
        'script_name': 'search_page'
    },
    {
        'url': 'groups{int|id}/{string|section}',
        'script_name': 'GroupsController.GroupsList'
    },
    {
        'url': 'groups{int|id}',
        'script_name': 'GroupsController.GroupsList'
    },
    {
        'url': 'groups',
        'script_name': 'GroupsController.GroupsList'
    },
    {
        'url': 'groups/{string|section}',
        'script_name': 'GroupsController.GroupsList'
    },
    {
        'url': 'event{int|id}',
        'script_name': 'GroupsController.GroupPage'
    },
    {
        'url': 'public{int|id}',
        'script_name': 'GroupsController.GroupPage'
    },
    {
        'url': 'group{int|id}',
        'script_name': 'GroupsController.GroupPage'
    },
    {
        'url': 'club{int|id}',
        'script_name': 'GroupsController.GroupPage'
    },
    {
        'url': 'settings/{string|section}',
        'script_name': 'SettingsController.Settings',
        'ignore_save': true,
    },
    {
        'url': 'settings',
        'script_name': 'SettingsController.Settings',
        'ignore_save': true,
    },
    {
        'url': 'debug/{string|section}',
        'script_name': 'DebugController.Debug',
        'ignore_save': true,
    },
    {
        'url': 'debug',
        'script_name': 'DebugController.Debug',
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
        'script_name': 'NewsController.News'
    },
    {
        'url': 'feed',
        'script_name': 'NewsController.News'
    },
    {
        'url': 'wall{int|owner_id}_{int|post_id}',
        'script_name': 'WallController.Post'
    },
    {
        'url': 'wall{int|owner_id}/{string|section}',
        'script_name': 'WallController.Wall'
    },
    {
        'url': 'wall{int|owner_id}',
        'script_name': 'WallController.Wall'
    },
    {
        'url': 'away',
        'script_name': 'UtilsController.Away',
        'ignore_save': true,
        'dont_pushstate': false,
    },
    {
        'url': 'search',
        'script_name': 'search_page'
    },
    {
        'url': 'edit/{string|section}',
        'script_name': 'EditController.Edit',
        'ignore_save': true
    },
    {
        'url': 'edit',
        'script_name': 'EditController.Edit'
    },
    {
        'url': 'dev/query',
        'script_name': 'DocumentationController.SearchPage',
    },
    {
        'url': 'dev',
        'script_name': 'DocumentationController.DocumentationPage',
    },
    {
        'url': '{string|id}',
        'script_name': 'UtilsController.Away',
        'ignore_save': true,
        'dont_pushstate': true,
    },
]
