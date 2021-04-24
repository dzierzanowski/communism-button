var CACHE_NAME = 'communism-button-v4'
var urlsToCache = [
    "/communism-button/",
    "/communism-button/index.html",
    "/communism-button/manifest.json",
    "/communism-button/communism.mp3",
    "/communism-button/button.svg",
    "/communism-button/info.svg",
    "/communism-button/nano+mark.svg",
    "/communism-button/fonts/OrelegaOne-Regular.ttf",
    "/communism-button/images/homescreen48.png",
    "/communism-button/images/homescreen72.png",
    "/communism-button/images/homescreen96.png",
    "/communism-button/images/homescreen128.png",
    "/communism-button/images/homescreen192.png",
    "/communism-button/images/homescreen256.png",
    "/communism-button/images/homescreen384.png",
    "/communism-button/images/homescreen512.png",
    "/communism-button/images/homescreen1024.png",
    "/communism-button/images/favicon-16x16.png",
    "/communism-button/images/favicon-32x32.png",
    "/communism-button/images/tile.jpg"
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('Fetch request: ' + e.request.url)
    if (e.request.headers.get('range')) {
        var pos = Number(/^bytes\=(\d+)\-$/g.exec(e.request.headers.get('range'))[1]);
        console.log('Range request for', e.request.url, ', starting position:', pos);
        e.respondWith(
            caches.open(CACHE_NAME)
            .then(cache => {
                return cache.match(e.request.url);
            })
            .then(res => {
                if (!res) {
                    return fetch(e.request).then(res => { return res.arrayBuffer() });
                }
                return res.arrayBuffer();
            }).then(function(ab) {
                return new Response(
                    ab.slice(pos),
                    {
                        status: 206,
                        statusText: 'Partial Content',
                        headers: [
                            ['Content-Range', 'bytes ' + pos + '-' + (ab.byteLength - 1) + '/' + ab.byteLength]
                        ]
                    });
            })
        );
    } else {
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
    }
})

// Cache resources
self.addEventListener('install', e => {
    e.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Installing cache: ' + CACHE_NAME)
            return cache.addAll(urlsToCache)
        })
    )
})

// Delete outdated caches
self.addEventListener('activate', function (e) {

    const cacheAllowList = [ CACHE_NAME ]

    e.waitUntil(
        caches.keys().then(cacheNames => {
            // var cacheWhitelist = cacheNames.filter(/*key => key.indexOf(APP_PREFIX)*/ true)
            // cacheWhitelist.push(CACHE_NAME)
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheAllowList.indexOf(cacheName) === -1) {
                        console.log('Deleting cache: ', cacheName)
                        return caches.delete(cacheName)
                    }
                })
            )
        })
    )
})
