var APP_PREFIX = 'CommunismButton_'
var VERSION = '0.0.1'
var CACHE_NAME = APP_PREFIX + VERSION
var URLS = [                    // Add URL you want to cache in this list.
    '/dzierzanowski/',           // If you have separate JS/CSS files,
    '/dzierzanowski/index.html'  // add path to those files here
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('Fetch request: ' + e.request.url)
    e.respondWith(
        caches.match(e.request).then(function (request) {
            if (request) {
                console.log('Responding with cache: ' + e.request.url)
                return request
            } else {
                console.log('File is not cached, fetching: ' + e.request.url)
                return fetch(e.request)
            }
        })
    )
})

// Cache resources
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Installing cache: ' + CACHE_NAME)
            return cache.addAll(URLS)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {
    e.waitUntil(
        caches.keys().then(keyList => {
            var cacheWhitelist = keyList.filter(key => key.indexOf(APP_PREFIX))
            cacheWhitelist.push(CACHE_NAME)

            return Promise.all(keyList.map((key, i) => {
                if (cacheWhitelist.indexOf(key) === -1) {
                    console.log('Deleting cache: ' + keyList[i] )
                    return caches.delete(keyList[i])
                }
            }))
        })
    )
})
