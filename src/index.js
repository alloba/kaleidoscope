const DEBUG_LIMIT_PAGE_RESULTS = false
const xmlParser = new DOMParser()
const LOADING_MESSAGE = 'Fetching Content. Please Wait...'

async function listObjectsInS3Bucket() {
    let allContent = []
    let nextMarker = null
    let pagingCount = 1
    while (true){
        console.log(`Fetching content: page ${pagingCount}`)
        updateCounter(LOADING_MESSAGE + ` page ${pagingCount}`) //breaks my separation between pure and stateful ish, but it's nice to get loading updates on the page.
        pagingCount += 1

        const res = await makePagedCall(nextMarker)
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

async function makePagedCall(marker){
    let requestUrl = 'https://kaleidoscope-media.s3.us-east-1.amazonaws.com/'
    if (marker != null){
        requestUrl += `?marker=${marker}`
    }
    const requestBody = await fetch(requestUrl, {method: 'GET'})
        .then(res => res.text())
    return new S3ListResults(requestBody)
}

function prepareCategories(allContentEntries){
    const categories = new Map()

    // always include an artificial 'all' category
    categories.set('all', allContentEntries.map(x => x.key))

    allContentEntries.forEach(x => {
        const category = x.key.split("/")[0]
        if (! categories.has(category)){
            categories.set(category, [])
        }
        categories.get(category).push(x.key)
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
        radioButton.onclick = setActiveCategoryByRadioButton
        
        const label = document.createElement('label');
        label.textContent = option;
        
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
    const fileType = contentKey.split('.').slice(-1)[0]

    // not sure if these two lines actually work. but all the content is webm, so it's not a big deal at the moment
    const videoSrc = document.createElement('source')
    videoSrc.setAttribute('type', `video/${fileType}`)

    updateCounter()
    videoContainer.src = `https://kaleidoscope-media.s3.us-east-1.amazonaws.com/${contentKey}`
}

function initializePage(){
    const videoElement = document.getElementById('video-area')
    videoElement.volume = 0.2
    videoElement.addEventListener('ended', (e) => {
        activeContentIndex += 1
        if(activeContentIndex >= activeContent.length){
            activeContentIndex = 0
        }
        setCurrentlyPlayingMedia(activeContent[activeContentIndex])
    })

    listObjectsInS3Bucket()
        .then(allContent => {
            categories = prepareCategories(allContent)
            initializeRadioButtons([...categories.keys()])
        })


    const previousButton = document.getElementById('previous-button');
    const nextButton = document.getElementById('next-button');
    previousButton.addEventListener('click', () => {
        if (activeContentIndex > 0){
            activeContentIndex -= 1
        }
        setCurrentlyPlayingMedia(activeContent[activeContentIndex]);
    });

    nextButton.addEventListener('click', () => {
        if (activeContentIndex < activeContent.length - 1){
            activeContentIndex += 1
        }
        setCurrentlyPlayingMedia(activeContent[activeContentIndex]);
    });
}

let categories = new Map()
let activeContent = []
let activeContentIndex = 0

updateCounter(LOADING_MESSAGE)
initializePage()
