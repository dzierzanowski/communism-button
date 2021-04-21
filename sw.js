var CACHE_NAME = 'communism-button-v1'
var urlsToCache = [             // Add URL you want to cache in this list.
    "/communism-button/",          // If you have separate JS/CSS files,
    "/communism-button/index.html", // add path to those files here
    "/communism-button/bs/css/bootstrap.min.css",
    "/communism-button/bs/js/bootstrap.bundle.min.js",
    "/communism-button/manifest.json",
    "/communism-button/communism.mp3",
    "/communism-button/button.svg",
    "/communism-button/info.svg"
]

// Respond with cached resources
self.addEventListener('fetch', function (e) {
    console.log('Fetch request: ' + e.request.url)
    if (event.request.headers.get('range')) {
        var pos = Number(/^bytes\=(\d+)\-$/g.exec(event.request.headers.get('range'))[1]);
        console.log('Range request for', event.request.url, ', starting position:', pos);
        e.respondWith(
            caches.open(CURRENT_CACHES.prefetch)
            .then(cache => {
                return cache.match(event.request.url);
            })
            .then(res => {
                if (!res) {
                    return fetch(event.request).then(res => { return res.arrayBuffer() });
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
