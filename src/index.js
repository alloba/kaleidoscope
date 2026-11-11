const DEBUG_LIMIT_PAGE_RESULTS = false
const xmlParser = new DOMParser()
const LOADING_MESSAGE = 'Fetching Content. Please Wait...'
const MEDIA_BASE_URL = 'https://kaleidoscope-media.s3.us-east-1.amazonaws.com/'
// Files that archivist keeps beside the media (hash manifest, published index). They are never media.
const SIDECAR_NAME_PREFIX = '.archivist-'
const INDEX_FILENAME = '.archivist-index.json'

function isSidecarKey(key){
    return key.split('/').pop().startsWith(SIDECAR_NAME_PREFIX)
}

// Slow path: pages through every key under the prefix (1000 per request, one after another).
async function listObjectsInS3Bucket(prefix = null) {
    let allContent = []
    let nextMarker = null
    let pagingCount = 1
    while (true){
        console.log(`Fetching content: page ${pagingCount}`)
        updateCounter(LOADING_MESSAGE + ` page ${pagingCount}`) //breaks my separation between pure and stateful ish, but it's nice to get loading updates on the page.
        pagingCount += 1

        const res = await makePagedCall(nextMarker, {prefix})
        allContent = allContent.concat(res.contents)

        if(! res.isTruncated){
            return allContent
        }
        if(DEBUG_LIMIT_PAGE_RESULTS){
            console.log('Debug setting - limiting content results to 1 page.')
            return allContent
        }

        const prevMarker = nextMarker
        // NextMarker is only returned when a delimiter is used. otherwise, the last key of the (alphabetical) page works.
        nextMarker = res.nextMarker ?? res.contents[res.contents.length - 1].key

        if (prevMarker === nextMarker){
            throw Error(`Duplicated marker -- will not continue, to prevent looping -> ${prevMarker}::${nextMarker}`)
        }
    }
}

async function makePagedCall(marker, {prefix = null, delimiter = null} = {}){
    const params = new URLSearchParams() // encodes for us. markers are raw keys, so that matters
    if (marker != null) params.set('marker', marker)
    if (prefix != null) params.set('prefix', prefix)
    if (delimiter != null) params.set('delimiter', delimiter)
    const query = params.toString()
    const res = await fetch(MEDIA_BASE_URL + (query ? `?${query}` : ''), {method: 'GET'})
    if (! res.ok) {
        throw Error(`S3 list request failed: ${res.status} ${res.statusText}`)
    }
    return new S3ListResults(await res.text())
}

// Fast path: archivist publishes a names-only index beside the media in each folder, so a handful of small parallel
// requests replace paging through the whole bucket. Folders without an index are listed directly instead.
async function listKeysViaIndexes() {
    const root = await makePagedCall(null, {delimiter: '/'}) // top-level folders (and any loose files), in one request
    if (root.isTruncated || root.commonPrefixes.length === 0) {
        throw Error('Top-level listing is not usable for index loading.')
    }
    updateCounter(LOADING_MESSAGE + ` ${root.commonPrefixes.length} folders`)
    const perFolder = await Promise.all(root.commonPrefixes.map(async prefix => {
        // no-cache: always revalidate (cheap, it is ETag based), so new files show up promptly
        const res = await fetch(MEDIA_BASE_URL + prefix + INDEX_FILENAME, {cache: 'no-cache'})
        if (res.status === 404 || res.status === 403) {
            console.log(`No index in ${prefix}, listing it directly.`)
            return (await listObjectsInS3Bucket(prefix)).map(x => x.key)
        }
        if (! res.ok) {
            throw Error(`Index request failed for ${prefix}: ${res.status} ${res.statusText}`)
        }
        const index = await res.json()
        if (index?.version !== 1 || ! Array.isArray(index.files)) {
            throw Error(`Unrecognized index format in ${prefix}`)
        }
        return index.files.map(name => prefix + name)
    }))
    return root.contents.map(x => x.key).concat(perFolder.flat())
}

async function loadMediaKeys() {
    let keys
    try {
        keys = await listKeysViaIndexes()
    } catch (err) {
        console.warn('Could not use the published indexes. Falling back to listing the whole bucket.', err)
        keys = (await listObjectsInS3Bucket()).map(x => x.key)
    }
    return keys.filter(key => ! isSidecarKey(key))
}

function prepareCategories(allKeys){
    const categories = new Map()

    // always include an artificial 'all' category
    categories.set('all', [...allKeys])

    allKeys.forEach(key => {
        const category = key.split("/")[0]
        if (! categories.has(category)){
            categories.set(category, [])
        }
        categories.get(category).push(key)
    })

    return categories
}

// Fisher-Yates shuffle, returns a new array and leaves the input alone.
function shuffleArrayIntoNew(arrayIn){
    const newArr = [...arrayIn]
    for (let i = newArr.length - 1; i > 0; i--){
        const j = Math.floor(Math.random() * (i + 1));
        [newArr[i], newArr[j]] = [newArr[j], newArr[i]]
    }
    return newArr
}

////////stateful or page-oriented functions below this point/////////////

function updateCounter(optionalText) {
    const counterElement = document.getElementById('counter');
    if (optionalText != null){
        counterElement.textContent = optionalText
    } else {
        counterElement.textContent = `${activeContentIndex + 1} / ${activeContent.length}`
    }
}

function initializeRadioButtons(optionsList){
    const radioButtonsContainer = document.getElementById('radio-buttons');
    
    optionsList.forEach(option => {
        const radioButton = document.createElement('input');
        radioButton.type = 'radio';
        radioButton.name = 'category';
        radioButton.value = option;
        radioButton.id = `category-${option}`;
        radioButton.onclick = setActiveCategoryByRadioButton
        
        const label = document.createElement('label');
        label.textContent = option;
        label.htmlFor = radioButton.id;
        
        radioButtonsContainer.appendChild(radioButton);
        radioButtonsContainer.appendChild(label);
    });

    if(optionsList.find(x => x === 'all')){
        document.querySelector('input[value="all"]').click()
    }
}

function setActiveCategoryByRadioButton(buttonEvent){
    const categoryName = buttonEvent.target.value
    console.log(`Changing active media category to ${categoryName}`)

    activeContentIndex = 0
    activeContent = shuffleArrayIntoNew(categories.get(categoryName))

    setCurrentlyPlayingMedia(activeContent[activeContentIndex])
}

function setCurrentlyPlayingMedia(contentKey){
    console.log(`Setting media playback to ${contentKey}`)
    const videoContainer = document.getElementById('video-area')

    updateCounter()
    videoContainer.src = MEDIA_BASE_URL + contentKey
}

function playNext(){
    activeContentIndex += 1
    if(activeContentIndex >= activeContent.length){
        activeContentIndex = 0
    }
    setCurrentlyPlayingMedia(activeContent[activeContentIndex])
}

function initializePage(){
    const videoElement = document.getElementById('video-area')
    videoElement.volume = 0.2
    videoElement.addEventListener('ended', playNext)
    videoElement.addEventListener('playing', () => consecutiveErrors = 0)
    // a file that fails to load shouldn't stall the stream. skip it, unless everything is failing (ex: offline).
    videoElement.addEventListener('error', () => {
        consecutiveErrors += 1
        console.log(`Failed to load ${activeContent[activeContentIndex]} (${consecutiveErrors} in a row)`)
        if (consecutiveErrors < activeContent.length) {
            playNext()
        } else {
            updateCounter('Unable to load media.')
        }
    })

    loadMediaKeys()
        .then(allKeys => {
            categories = prepareCategories(allKeys)
            initializeRadioButtons([...categories.keys()])
        })
        .catch(err => {
            console.error(err)
            updateCounter('Failed to load the media list. Try refreshing the page.')
        })


    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    previousButton.addEventListener('click', () => {
        if (activeContent.length === 0) return // nothing loaded yet
        if (activeContentIndex > 0){
            activeContentIndex -= 1
        }
        setCurrentlyPlayingMedia(activeContent[activeContentIndex]);
    });

    nextButton.addEventListener('click', () => {
        if (activeContent.length === 0) return // nothing loaded yet
        if (activeContentIndex < activeContent.length - 1){
            activeContentIndex += 1
        }
        setCurrentlyPlayingMedia(activeContent[activeContentIndex]);
    });
}

let categories = new Map()
let activeContent = []
let activeContentIndex = 0
let consecutiveErrors = 0

updateCounter(LOADING_MESSAGE)
initializePage()
