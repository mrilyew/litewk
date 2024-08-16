class IndexDBWrapper {
    constructor(db) {
        this.db = db
    }

    deleteStorage(name) {
        this.getConnection((event) => {
            const db = event.target.result
            db.deleteObjectStore(name)
        })
    }

    clearAllStores() {
        const connection = indexedDB.open(this.db)
        connection.onsuccess = (e) => {
            const db = e.target.result
            const transaction = db.transaction(db.objectStoreNames, 'readwrite')

            for(const storeName of db.objectStoreNames) {
                transaction.objectStore(storeName).clear()
            }

            console.info('IndexedDB | All stores have been cleared')
        }
    }

    transaction(table, type = 'readonly') {
        this.getConnection(null, (e) => {
            const db = e.target.result

            const transact = db.transaction([table], type)
            const store = transact.objectStore(table)
        })
    }

    add(table, item) {
        const connection = this.getConnection(null, (e) => {
            const db = e.target.result

            const transact = db.transaction([table], 'readwrite')
            const store = transact.objectStore(table)

            store.put(item)
        })
    }

    findItem(table, id) {
        return new Promise((resolve, reject) => {
            const connection = this.getConnection(null, (e) => {
                const db = e.target.result
                let transact = null
                try {
                    transact = db.transaction([table], 'readonly')
                } catch(e) {
                    resolve(null)
                    return null
                }

                const store = transact.objectStore(table)
                const request = store.openCursor()

                let found = false
    
                console.info(`IndexedDB | Searching in table "${table}" by id`)
                
                request.onsuccess = (eve) => {
                    const cursor = eve.target.result

                    if(cursor) {
                        if(cursor.value.id == Math.abs(id)) {
                            if(cursor.value.caching_time < moment().unix() - window.consts.INDEX_DB_CACHE_LIFETIME) {
                                console.info('IndexedDB | ☝️ Item was found, but it is stale.')
                                //alert('☝️')
                                cursor.continue()
                            } else {
                                found = true

                                console.info('IndexedDB | Item was found')
                                resolve(cursor.value)
                                return
                            }
                        } else {
                            cursor.continue()
                        }
                    } else {
                        if(!found) resolve(null)
                    }
                }

                request.onerror = () => { 
                    console.error('IndexedDB | Cursor returned error ' + request.error)
                    reject()
                }
            }, (e) => {
                console.error('IndexedDB | Connections returned error: ', e)

                reject(new Error('Search failed'))
            })
        })
    }

    getConnection(upgradeneeded = null, success = null, error = null) {
        const connection = indexedDB.open(this.db)

        if(upgradeneeded) {
            connection.onupgradeneeded = upgradeneeded
        } else {
            connection.onupgradeneeded = (e) => { 
                const db = e.target.result
                console.info(`IndexedDB | Created DB with name "${e.target.result.name}"`)
    
                db.createObjectStore('users', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('groups', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('posts', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('comments', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('photos', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('videos', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('audios', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('docs', {keyPath: 'id', autoIncrement: true})
                db.createObjectStore('notes', {keyPath: 'id', autoIncrement: true})
            }
        }

        if(success) {
            connection.onsuccess = success
        } else {
            connection.onsuccess = (e) => {
                const database = e.target.result
    
                console.info(`IndexedDB | Connected to DB with name "${database.name}" v${database.version}`)
            }
        }

        if(error) {
            connection.onerror = error
        } else {
            connection.onerror = (e) => {
                console.info(`IndexedDB | Error when connecting. `, e)
            }
        }

        return connection
    }

    deleteDB() {
        const req = indexedDB.deleteDatabase(this.db);
        req.onsuccess = () => {
            console.info(`IndexedDB | Database '${this.db}' has been deleted`);
        }

        req.onerror = (e) => {
            console.error('IndexedDB | Error deleting database: ', e);
        }

        req.onblocked = () => {
            console.warn('IndexedDB | Deletion blocked');
        }
    }
}
