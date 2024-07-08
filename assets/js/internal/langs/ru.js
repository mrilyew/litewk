if(!window.langs) {
    langs = []
}

window.langs.push({
    'lang_info': {
        'native_name': 'Русский',
        'eng_name': 'Russian',
        'author': 'litewk',
        'short_name': 'ru',
    },

    'prepositions': {
        'for_rus_preposition': 'на',
        'on_rus_preposition': 'за',
        'another_on_rus_preposition': 'в',
    },

    'main_page': {
        'hello_text': ``,
    },

    'navigation': {
        'my_page': 'Моя Страница',
        'my_news': 'Новости',
        'my_friends': 'Друзья',
        'my_groups': 'Группы',
        'my_messages': 'Сообщения',
        'my_photos': 'Фотографии',
        'my_audios': 'Аудиозаписи',
        'my_videos': 'Видеозаписи',
        'my_faves': 'Закладки',
        'my_notifications': 'Уведомления',
        'my_search': 'Поиск',
        'my_documents': 'Документы',
        'my_notes': 'Заметки',
        'my_wikipages': 'Вики-страницы',
        'my_settings': 'Настройки',
        'logout': 'Выйти',
        'authorize': 'Авторизация',

        'to_up': 'Наверх',
        'come_back': 'Назад',

        'suspicious_link': 'Ссылка, по мнению ВК, подозрительная. <br> Всё равно хочешь перейти?',
    },

    'pagination': {
        'show_more': 'Листать далее',
    },

    'time': {
        'month_1_gen': 'января',
        'month_2_gen': 'февраля',
        'month_3_gen': 'марта',
        'month_4_gen': 'апреля',
        'month_5_gen': 'мая',
        'month_6_gen': 'июня',
        'month_7_gen': 'июля',
        'month_8_gen': 'августа',
        'month_9_gen': 'сентября',
        'month_10_gen': 'октября',
        'month_11_gen': 'ноября',
        'month_12_gen': 'декабря',
        'date_formatted_month': '$1 $2 $3 г. в $4',
        'date_formatted_month_no_year': '$1 $2 в $3',
        'age_zero': '0 лет',
        'age_one': '$1 год',
        'age_few': '$1 года',
        'age_other': '$1 лет',
    },

    'settings': {
        'settings': 'Настройки',
        'settings_ui': 'Внешний вид',
        'settings_ux': 'Поведение',
        'settings_auth': 'Авторизация',
        'settings_language': 'Язык',
        'settings_accounts': 'Аккаунты',
        'settings_debug': 'Отладка',
        'settings_about': 'О сайте',
        'please_enter': 'вводи',
    },

    'settings_ui': {
        'settings_custom_css': 'Собственный CSS',
        'settings_custom_js': 'Собственный JS',
        'settings_custom_js_tip': 'Применится после перезагрузки страницы.',
        'settings_date_format': 'Формат даты',
        'settings_date_format_default': 'DD.MM.YYYY в HH:MM',
        'settings_date_format_day_month': 'DD mmmm ?(YYYY г.) в HH:MM',

        'settings_ui_other': 'Прочее',
        'settings_hide_image_statuses': 'Скрывать эмодзи у имени',

        'settings_ui_tweaks': 'Твики',
        'settings_ui_left_menu': 'Меню навигации',
        'settings_ui_left_authorize': 'Авторизуйся.',

        'settings_ui_left_reset_default': 'Сбросить',
        'settings_ui_left_add': 'Добавить',
        'settings_ui_left_menu_start_edit': 'Начать редактирование',
        'settings_ui_left_menu_stop_edit': 'Закончить редактирование',
        'settings_ui_left_delete': 'Удалить',
        'settings_ui_left_up': 'Вверх',
        'settings_ui_left_down': 'Вниз',

        'settings_ui_left_click_tip': 'Нажми по элементу в меню, чтобы отредактировать его.',
        'settings_ui_left_text': 'Надпись',
        'settings_ui_left_href': 'Ссылка',
        'settings_ui_left_new_page': 'Открывать в новой вкладке',
        'settings_ui_left_disabled': 'Отключён',
        'settings_ui_left_hidden': 'Скрыт',

        'settings_ui_i18n_tip': `Символ '_' в начале означает, что будет использоваться локализированная строка.`,
    },

    'settings_ui_tweaks': {
        'vk_like_padding': 'Расширить страницу на всю ширину монитора',
        'transitions_everywhere': 'Плавные переходы везде',
        'round_avatars': 'Круглые аватарки',
        'highlight_friends': 'Подсвечивать друзей зелёным цветом',
        'hide_onliner': `Скрыть отображение статуса "онлайн" у постов и комментариев`,

        'hide_counters': 'Скрыть счётчики в меню навигации',
    },
    
    'settings_ux': {
        'settings_save_hash_progress': 'Сохранять прогресс прокрутки страницы',
        'settings_auto_scroll': 'Автопрокрутка',
        'settings_send_online': 'Пробуждать аккаунт в онлайн каждые 5 минут',

        'settings_default_sort': 'Сортировка комментариев по умолчанию',
        'settings_use_proxy': 'Использовать allorigins.win (на ваш риск)',
        'settings_show_registration_date': 'Показывать дату регистрации пользователя',
    },

    'settings_language': {
        'applying_language_tip': 'Для применения языка перезагрузи страницу.',
        'lang_author': 'Автор',
    },

    'settings_accounts': {
        'accounts_count_zero': '0 аккаунтов',
        'accounts_count_one': '$1 аккаунт',
        'accounts_count_few': '$1 аккаунта',
        'accounts_count_other': '$1 аккаунтов',
        'accounts_logout': 'Выйти',
        'accounts_add': 'Добавить',
        'accounts_set_default': 'Войти',
    },

    'settings_debug': {
        'settings_cache': 'Кэш и LocalStorage',
        'settings_cache_cities': 'Кэш городов',
        'settings_cache_groups': 'Кэш групп',
        'settings_localstorage_download': 'Экспорт LocalStorage',
        'settings_localstorage_import': 'Импорт LocalStorage',
        'settings_localstorage_enter': 'Ввeди содержимое LocalStorage',

        'settings_api_test': 'Запуск методов API',
        'settings_method_name': 'Метод API',
        'settings_method_params': 'Параметры к API (в формате JSON)',
        'settings_method_result': 'Результат будет выведен здесь',
        'settings_method_send': 'Отправить',
        'settings_method_clear': 'Очистить',
        'settings_method_unspacify': 'Убрать пробелы',

        'settings_routing': 'Роутинг',

        'settings_use_execute': 'Использовать execute по возможности',
        'settings_restart_app': 'Перезапустить приложение',
    },

    'settings_about': {
        'settings_about_authors': 'Разработчики',
        'settings_about_main_code': 'Основной код',
        'settings_about_cover': 'Обложка',
        'settings_api_vk': 'VK API',
    },

    'messagebox': {
        'close': 'Закрыть',
        'cancel': 'Отмена',
        'enter': 'Ввести',
        'hide': 'Скрыть',

        'yes': 'Да',
        'no': 'Нет',
        'loading_shy': 'загружаю...',
    },

    'auth': {
        'path_to_api': 'Путь к API',
        'vk_api_token': 'Токен VK API',
        'vk_api_get_token': `Получить токен VK API ты можешь на сайте <a href="https://vkhost.github.io/" target='_blank'>vkhost.github.io</a>, следуя инструкциям, данным на нём.`,
        'vk_api_info_token': `Сайт хранит токен локально и не передаёт его третьим лицам, однако не исключены XSS-уязвимости.<br> Если вы почувствовали, что ваш токен украли, отключите приложение с авторизацией в <a href='https://vk.com/settings?act=apps' target='_blank'>настройках VK</a>, либо в VK ID > "Безопасность и вход" нажмите "Завершить другие сеансы".`,
        'vk_api_info_recommend': 'Рекомендую использовать первое приложение из списка.',
        'auth': 'Авторизоваться',

        'auth_choose_app': 'Какое приложение для авторизации будем использовать?',
        'auth_enter_token': 'Введи токен',
        'by_token': 'Использовать токен',

        'copy_token_from_address': 'Нужно будет скопировать токен из адресной строки и вставить в появившееся поле.',
        'auth_app_vk_calls': 'Звонки ВКонтакте',
        'auth_app_vk_com': 'vk.com (не рекомендую)',
    },

    'user_page': {
        'edit_page': 'Редактировать',
        'user_avatar': 'Аватар пользователя',
        'has_verification': 'Имеет галочку',
        'has_verification_esia': 'Подтвердил документы?',
        'has_verification_phone': 'Подтвердил номер телефона?',
        'has_indexing': 'Индексируется в поисковиках',
        'is_closed': 'Закрыт ли профиль',

        'user_no': 'Нет',
        'user_yes': `Да`,
        'hidden': 'скрыт',
        'online': 'В сети',
        'no_status': 'Нет статуса',
        'personal_info': 'Личная информация',
        'came_on_site': 'заходил(а)',
        'came_on_site_male': 'заходил',
        'came_on_site_female': 'заходила',
        'sex': 'Пол',
        'male': 'мужской',
        'female': 'женский',
        'birthdate': 'День рождения',
        "register_date": 'Дата регистрации',
        'marital_status': 'Семейное положение',
        'contacts': 'Контакты',
        'interests': 'Интересы',
        'career': 'Карьера',
        'life_position': 'Жизненная позиция',
        'education': 'Образование',
        'relatives': 'Родственники',
        'military': 'Военная служба',
        'counters': 'Счётчики',
        'page_link': 'Короткая ссылка',
        'known_languages': 'Владеет языками',
        'known_languages_pov': 'Владение языками',
        
        'show_more_information': 'Показать больше информации',
        'hide_more_information': 'Скрыть подробную информации',
        
        'job_post': 'Должность',
        'job_year_start': 'Год начала работы',
        'job_year_end': 'Год окончания работы',
        'job_city': 'Город',

        'political_views': 'Полит. предпочтения',
        'worldview': 'Мировозрение',
        'main_in_life': 'Главное в жизни',
        'main_in_people': 'Главное в людях',
        'attitude_towards_smoking': 'Отношение к курению',
        'attitude_towards_alcohol': 'Отношение к алкоголю',
        'inspired_by': 'Вдохновляют',

        'activities': 'Деятельность',
        'fav_music': 'Любимая музыка',
        'fav_films': 'Любимые фильмы',
        'fav_tv': 'Любимые телешоу',
        'fav_books': 'Любимые книги',
        'fav_games': 'Любимые игры',
        'fav_quotes': 'Любимые цитаты',

        'country': 'Страна',
        'city': 'Город',
        'hometown': 'Родной город',
        'mobile_phone': 'Мобильный телефон',
        'additional_phone': 'Дополнительный телефон',
        'personal_site': 'Личный сайт',

        'hide_from_feed': 'Скрыть из ленты',
        'unhide_from_feed': 'Показывать в ленте',

        'subscribe_to_new': 'Подписаться на новости',
        'unsubscribe_to_new': 'Отписаться от новостей',

        'school': 'Школа',
        'school_name': 'Название',
        'school_start_year': 'Год начала обучения',
        'school_end_year': 'Год окончания обучения',
        'school_graduation_year': 'Год выпуска',
        'school_speciality': 'Специализация',
        'school_class': 'Класс',

        'university': 'ВУЗ',
        'university_faculty': 'Факультет',
        'university_chair': 'Специальность',
        'education_form': 'Форма обучения',
        'education_status': 'Статус',

        'relatives': 'Родственники',
        'relative_child': 'Сын/дочь',
        'relative_sibling': 'Брат/сестра',
        'relative_parent': 'Отец/мать',
        'relative_grandparent': 'Дедушка/бабушка',
        'relative_grandchild': 'Внук/внучка',

        'relative_child_male': 'Сын',
        'relative_child_female': 'Дочь',
        
        'relative_sibling_male': 'Брат',
        'relative_sibling_female': 'Сестра',

        'relative_parent_male': 'Отец',
        'relative_parent_female': 'Мать',

        'relative_grandparent_male': 'Дедушка',
        'relative_grandparent_female': 'Бабушка',

        'relative_grandchild_male': 'Внук',
        'relative_grandchild_female': 'Внучка',

        'military_unit': 'Воинская часть',
        'military_year_start': 'Год начала службы',
        'military_year_end': 'Год окончания службы',

        'create_message': 'Написать сообщение',
        'list_friends': 'Посмотреть друзей',

        'go_to_user_page': 'перейти к странице',
        'error_getting_registration_date': 'Не удалось получить.',
    },

    'relation': {
        'not_picked': 'Не указано',
        'female_single': 'не замужем',
        'male_single': 'не женат',
        'meets_with': 'встречаюсь',
        'with_rus_preposition': 'с',
        'female_engaged': 'помолвлена',
        'male_engaged': 'помолвлен',
        'female_married': 'замужем',
        'male_married': 'женат',
        'relations_complicated': 'всё сложно',
        'active_search': 'в активном поиске',
        'female_inlove': 'влюблена',
        'male_inlove': 'влюблён',
        'in_a_civil_marriage': 'в гражданском браке',
    },

    'political_views': {
        'communistic_views': 'Коммунистические',
        'socialistic_views': 'Социалистические',
        'moderate_views': 'Умеренные',
        'liberal_views': 'Либеральные',
        'conservative_views': 'Консервативные',
        'monarchic_views': 'Монархические',
        'ultraconservative_views': 'Ультраконсервативные',
        'indifferent_views': 'Безразличные',
        'libertarian_views': 'Либертарианские',
        'centrist_views': 'Центристские',
    },

    'attitudes': {
        'strongly_negative_views': 'Резко негативное',
        'negative_views': 'Негативное',
        'compromise_views': 'Компромиссное',
        'neutral_views': 'Нейтральное',
        'positive_views': 'Положительное',
    },

    'life_opinion': {
        'family_and_kids': 'Семья и дети',
        'career_and_money': 'Карьера и деньги',
        'entertainment_and_rest': 'Развлечения и отдых',
        'science_and_investigation': 'Наука и исследования',
        'self_development': 'Саморазвитие',
        'world_imporement': 'Совершенствование мира',
        'beauty_and_art': 'Красота и искусство',
        'fame_and_influence': 'Слава и влияние',

        'mind_and_creativity': 'Ум и креативность',
        'kindness_and_honestness': 'Доброта и честность',
        'beautiness_and_health': 'Красота и здоровье',
        'authority_and_richness': 'Власть и богатство',
        'courage_and_tenacity': 'Смелость и упорство',
        'humor_and_life_loving': 'Юмор и жизнелюбие',
    },

    'counters': {
        'albums_count_zero': '0 альбомов',
        'albums_count_one': '$1 альбом',
        'albums_count_few': '$1 альбома',
        'albums_count_other': '$1 альбомов',

        'articles_count_zero': '0 статей',
        'articles_count_one': '$1 статья',
        'articles_count_few': '$1 статьи',
        'articles_count_other': '$1 статей',

        'audios_count_zero': '0 аудиозаписей',
        'audios_count_one': '$1 аудиозапись',
        'audios_count_few': '$1 аудиозаписи',
        'audios_count_other': '$1 аудиозаписей',

        'badges_count_zero': '0 значков',
        'badges_count_one': '$1 значок',
        'badges_count_few': '$1 значка',
        'badges_count_other': '$1 значков',

        'clips_count_zero': '0 вк-клипов',
        'clips_count_one': '$1 вк-клип',
        'clips_count_few': '$1 вк-клипа',
        'clips_count_other': '$1 вк-клипов',

        'friends_count_zero': '0 друзей',
        'friends_count_one': '$1 друг',
        'friends_count_few': '$1 друга',
        'friends_count_other': '$1 друзей',
        
        'online_friends_count_zero': '0 друзей в сети',
        'online_friends_count_one': '$1 друг в сети',
        'online_friends_count_few': '$1 друга в сети',
        'online_friends_count_other': '$1 друзей в сети',

        'mutual_friends_count_zero': '0 общих друзей',
        'mutual_friends_count_one': '$1 общий друг',
        'mutual_friends_count_few': '$1 общих друга',
        'mutual_friends_count_other': '$1 общих друзей',

        'gifts_count_zero': '0 подарков',
        'gifts_count_one': '$1 подарок',
        'gifts_count_few': '$1 подарка',
        'gifts_count_other': '$1 подарков',
        
        'groups_count_zero': '0 групп',
        'groups_count_one': '$1 группа',
        'groups_count_few': '$1 группы',
        'groups_count_other': '$1 групп',

        'interesting_pages_count_zero': '0 подписок',
        'interesting_pages_count_one': '$1 подписка',
        'interesting_pages_count_few': '$1 подписки',
        'interesting_pages_count_other': '$1 подписок',
        
        'photos_count_zero': '0 фотографий',
        'photos_count_one': '$1 фотография',
        'photos_count_few': '$1 фотографии',
        'photos_count_other': '$1 фотографий',

        'topics_count_zero': '0 обсуждений',
        'topics_count_one': '$1 обсуждение',
        'topics_count_few': '$1 обсуждения',
        'topics_count_other': '$1 обсуждений',

        'posts_on_wall_count_zero': '0 записей',
        'posts_on_wall_count_one': '$1 запись',
        'posts_on_wall_count_few': '$1 записи',
        'posts_on_wall_count_other': '$1 записей',
        
        'subscriptions_count': 'Нет подписчиков',
        'subscriptions_count_zero': '0 подписчиков',
        'subscriptions_count_one': '$1 подписчик',
        'subscriptions_count_few': '$1 подписчика',
        'subscriptions_count_other': '$1 подписчиков',
                
        'video_playlists_count_zero': '0 видеоальбомов',
        'video_playlists_count_one': '$1 видеоальбом',
        'video_playlists_count_few': '$1 видеоальбома',
        'video_playlists_count_other': '$1 видеоальбомов',
                        
        'added_videos_count_zero': '0 видеозаписей',
        'added_videos_count_one': '$1 видеозаписей',
        'added_videos_count_few': '$1 видеозаписи',
        'added_videos_count_other': '$1 видеозаписей',
                                    
        'followers_count_zero': '0 подписчиков',
        'followers_count_one': '$1 подписчик',
        'followers_count_few': '$1 подписчика',
        'followers_count_other': '$1 подписчиков',
    },

    'group_page': {
        'main_info': 'Основная информация',
        'is_closed': 'Группа закрыта?',
        'activity': 'Тематика',
        'description': 'Описание',
        'city': 'Город',
    },

    'faves': {
        'add_to_faves': 'Добавить в закладки',
        'remove_from_faves': 'Удалить из закладок', 
    },

    'blacklist': {
        'add_to_blacklist': 'Добавить в чёрный список',
        'remove_from_blacklist': 'Удалить из чёрного списка',
    },

    'users_relations': {
        'start_friendship': 'Добавить в друзья',
        'cancel_friendship': 'Отменить заявку',
        'decline_friendship': 'Отклонить заявку',
        'accept_friendship': 'Принять заявку',
        'destroy_friendship': 'Удалить из друзей',

        'block_user': 'Заблокировать пользователя',
    },

    'online_types': {
        'online_from_mobile_version': 'с m.vk.com',
        'online_from_iphone': 'с iPhone',
        'online_from_ipad': 'с iPad',
        'online_from_android': 'с Android',
        'online_from_wp': 'с Windows Phone',
        'online_from_wten': 'с Windows 10',
        'online_from_web': 'с веб-версии',
        'online_is_hidden': 'Онлайн скрыт',
        'now_online': 'Онлайн',
    },

    'groups': {
        'groups': 'Группы',

        'subscribe': 'Подписаться',
        'unsubscribe': 'Отписаться',
        'send_request': 'Подать заявку',
        'cancel_request': 'Отменить заявку',
        'recomend_to_friends': 'Рекомендовать друзьям',
        'invite_friends': 'Пригласить друзей',
        'age_limits': 'Возрастные ограничения',

        'all_groups': 'Все группы',
        'managed_groups': 'Управляемые',
        'events': 'События',
        'recommended': 'Рекомендуемое',
        'recent': 'Недавние',

        'managed_groups_title': 'Управляемые группы',
        'events_title': 'Ваши события',
        'recommended_title': 'Рекомендуемое вам',
        'recent_title': 'Недавно посещённые вами группы',

        'clear_recents': 'Очистить',
    },

    'wall': {
        'wall': 'Стена',
        'pinned': 'закреплено',
        'search': 'Поиск',
        'edit_post': 'Редактировать',
        'delete_post': 'Удалить запись',
        'archive_post': 'Архивировать запись',
        'unarchive_post': 'Убрать из архива',
        'pin_post': 'Закрепить запись',
        'unpin_post': 'Открепить запись',
        'disable_comments_post': 'Отключить комментарии',
        'enable_comments_post': 'Включить комментарии',
        'report_post': 'Пожаловаться на запись',
        'fave_post': 'Добавить в закладки',
        'unfave_post': 'Убрать из закладок',
        'go_to_vk': 'Перейти в ВК',
        'not_interesting': 'Не интересно',
        'geo': 'Геолокация',

        'all_posts': 'Все записи',
        'owner_posts': 'Свои записи',
        'others_posts': 'Чужие записи',
        'archived_posts': 'Архивированные записи',
        'search_posts': 'Поиск записей',
        'post_has_deleted': `Пост удалён. <a href='javascript:void(0)' id='_postRestore'>Восстановить?</a>`,
        'post_has_archived': `Пост был архивирован. <a href='javascript:void(0)' id='_postArchiveAction' data-ref='1' data-type='1'>Вернуть?</a>`,
        'post_has_unarchived': `Пост был возвращён из архива. <a href='javascript:void(0)' id='_postArchiveAction' data-ref='1' data-type='0'>Архивировать?</a>`,
        'post_has_ignored': `Пост был убран из ленты. <a href='javascript:void(0)' id='_toggleInteressness' data-val='1' data-type='$1'>Отменить?</a>`,
        
        'no_posts_in_tab': 'Постов не обнаружено.',
        'no_posts_in_search': 'По запросу ничего не найдено.',
        'no_comments': 'Комментариев нет.',
        'posts_invert': 'Инвертировать',

        'post': 'Пост',
        'updated_photo': 'обновлено фото',
        'updated_photo_group': 'обновили фото',
        'updated_photo_user_male': 'обновил фото',
        'updated_photo_user_female': 'обновила фото',

        'updated_status_user_male': 'обновил статус',
        'updated_status_user_female': 'обновила статус',

        'deleted_page_male': 'удалил страницу со словами:',
        'deleted_page_female': 'удалила страницу со словами:',

        'deleted_page_silently_male': 'молча удалил страницу.',
        'deleted_page_silently_female': 'молча удалила страницу.',

        'left_status_male': 'оставил комментарий на странице',
        'left_status_female': 'оставил комментарий на странице',
        
        'author': 'Автор',
        'source': 'Источник',
        'is_ad': 'Рекламная запись',

        'comments_count_zero': 'Нет комментариев',
        'comments_count_one': '$1 комментарий',
        'comments_count_few': '$1 комментария',
        'comments_count_other': '$1 комментариев',
        
        'comments_count_with_threads_zero': 'Нет комментариев',
        'comments_count_with_threads_one': '$1 комментарий ($2 всего)',
        'comments_count_with_threads_few': '$1 комментария ($2 всего)',
        'comments_count_with_threads_other': '$1 комментариев ($2 всего)',
        
        'thread_count_zero': 'Нет ответов',
        'thread_count_one': '$1 ответ',
        'thread_count_few': '$1 ответа',
        'thread_count_other': '$1 ответов',

        'show_next_comments': 'Показать следующие комментарии',
        'show_next_comments_count': 'Показать следующие 10 комментариев',
        'reply_to_comment': `<span>ответ на <a href='$1'>комментарий</a></span>`,

        'sort_new_first': 'Сначала новые',
        'sort_old_first': 'Сначала старые',
        'sort_interesting_first': 'Сначала интересные',
    },

    'newsfeed': {
        'newsfeed': 'Новости',
        'section_default': 'Новое',
        'section_smart_feed': 'Интересное',
        'section_recommend': 'Рекомендации',
        'section_friends': 'Новости друзей',

        'newsfeed_refresh': 'Обновить новости',
        'newsfeed_params': 'Параметры новостей',
        'newsfeed_lists': 'Списки новостей',
        'newsfeed_return_banned': 'Скрытые посты',

        'newsfeed_type': 'Тип новостей',
        'newsfeed_type_all': 'Все новости',
        'newsfeed_type_posts': 'Посты',
        'newsfeed_type_photo': 'Фотографии',
        'newsfeed_type_photo_tags': 'Отметки на фотографиях',
        'newsfeed_type_wall_photo': 'Новые фото',
        'newsfeed_type_friends': 'Друзья',
        'newsfeed_type_note': 'Заметки (устаревшие)',
        'newsfeed_type_audio': 'Аудиозаписи',
        'newsfeed_type_video': 'Видео',
        'newsfeed_type_clips': 'Клипы',

        'added_photos': 'добавлены фото',
        'added_videos': 'добавлены видео',
        'tagged_on_photos': 'отмечен на фото',

        'hide_source_from_feed': 'Скрыть из ленты',
        'hide_source_from_feed_on_week': 'Скрыть из ленты на неделю',
    },

    'photos': {
        'photo': 'Фотография',
        'graffiti': 'Граффити',
        'attached_link': 'Превью ссылки',
    },

    'videos': {
        'video': 'Видеозапись',

        'views_count_zero': 'Нет просмотров',
        'views_count_one': '$1 просмотр',
        'views_count_few': '$1 просмотра',
        'views_count_other': '$1 просмотров',
    },

    'captcha': {
        'enter_captcha': 'Введи капчу',
        'enter_captcha_there': 'Введи сюда капчу.',
    },

    'image_status': {
        'name': 'Статус',
        'get_status': 'Получить статус',
    },

    'friends': {
        'friends': 'Друзья',
        'came_last': 'был в сети',

        'all_friends': 'Все друзья',
        'users_friends': 'Друзья пользователя',
        'online_friends': 'Друзья онлайн',
        'friends_requests': 'Заявки',
        'recomended_friends': 'Рекомендуемые',
        'cleanup_friends': 'Редко взаимодействуете',
        'mutual_friends': 'Общие друзья',

        'incoming_requests': 'Входящие заявки',
        'outcoming_requests': 'Исходящие заявки',
        
        'incoming': 'Входящие',
        'outcoming': 'Исходящие',
        'followers': 'Подписчики',

        'search_friends': 'Поиск',
        'search_friends_longer': 'Поиск друзей',
        'friends_lists': 'Списки друзей',
        'friends_list': 'Список друзей',
    },

    'bookmarks': {
        'bookmarks': 'Закладки',
        'mark_as_viewed': 'Пометить прочитанными',

        'all_bookmarks': 'Контент',
        'pages_bookmarks': 'Страницы',
        'user_bookmarks': 'Пользователи',
        'group_bookmarks': 'Группы',
        'post_bookmarks': 'Посты',
        'article_bookmarks': 'Статьи',
        'link_bookmarks': 'Ссылки',
        'podcast_bookmarks': 'Подкасты',
        'video_bookmarks': 'Видео',
        'game_bookmarks': 'Игры',

        'content_bookmarks_title': 'Контент | Закладки',
        'pages_bookmarks_title': 'Страницы | Закладки',
        'user_bookmarks_title': 'Пользователи | Закладки',
        'group_bookmarks_title': 'Группы | Закладки',
        'post_bookmarks_title': 'Посты | Закладки',
        'article_bookmarks_title': 'Статьи | Закладки',
        'link_bookmarks_title': 'Ссылки | Закладки',
        'podcast_bookmarks_title': 'Подкасты | Закладки',
        'video_bookmarks_title': 'Видео | Закладки',
        'game_bookmarks_title': 'Игры | Закладки',

        'tags': 'Теги',
        'search_by_loaded_bookmarks': 'Поиск по прогруженным закладкам',
    },

    'search': {
        'search': 'Поиск',

        'search_all_section': 'Всё',
        'search_users_section': 'Пользователи',
        'search_groups_section': 'Группы',
        'search_posts_section': 'Записи',
        'search_audios_section': 'Аудиозаписи',
        'search_videos_section': 'Видеозаписи',
        'search_photos_section': 'Фотографии',
        'search_games_section': 'Игры',
    },

    'errors': {
        'not_all_fields_filled': 'Не все поля заполнены',
        'token_is_valid': 'Токен валидный. Вы будете перенаправлены на страницу через 5 секунд',
        'vk_api_error': 'VK API says: $1',
        'post_not_found': 'Пост не найден.',
        'post_access_denied': 'Нет доступа к записи.',
        'not_all_fields': 'Не все поля введены',
        'profile_not_found': `Запрашиваемый профиль не найден. <br> Может, ты имел ввиду <a href='site_pages/club_page.html?id=$1'>группу?</a>`,
        'group_not_found': `Запрашиваемая группа не найдена. <br> Может, ты имел ввиду <a href='site_pages/user_page.html?id=$1'>профиль?</a>`,
        'wall_not_found': 'Стена не найдена,',
        'post_not_found': `Пост не найден.`,
        'not_authorized': 'Ты не авторизовался.',
        'error_getting_wall': 'Ошибка при выполнении метода. Текст: $1',
        'error_getting_news': 'Ошибка при получении новостей. Текст: $1',

        'template_insert_failed': `Вставка шаблона не удалась по причине "$1". Расскажи разработчику.`,
        'friends_not_found': 'Друзей не найдено.',
        'friends_online_not_found': 'Друзей в онлайне не найдено.',
        'followers_not_found': 'Подписчиков не найдено.',
        'unable_to_add_acc': 'Не удалось добавить аккаунт.',
        'groups_not_found': 'Группы не найдены',

        'bookmarks_all_not_found': 'Никаких закладок не найдено.'
    },
})
