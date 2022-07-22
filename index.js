let darkModeSwitch = document.querySelector("input[name=darkModeSwitch]");

let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
let signedInAs = JSON.parse(localStorage.getItem('signedInAs')) || null;


function onSiteFirstLoad() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setElementsToDarkMode();
        darkModeSwitch.checked = true;
    } else {
        setElementsToLightMode();
        darkModeSwitch.checked = false;
    }

    actUponLoginStatus();

    get24HCryptoData()

    setUpLiveBitcoinData()

    setUpRandomActivityGenerator()

    setUpHTTPCat()

    getPublicIP()
}

function actUponLoginStatus() {
    let signupForm = document.getElementById('signupFormCard')
    if (typeof signedInAs == 'object' && signedInAs != null) {
        //Signed in
        if (signupForm) {
            signupForm.remove()
        }
        document.getElementById('loggedInAs-Header').textContent = `Signed in as ${signedInAs.name}`
        document.getElementById('logoutLink-Header').textContent = 'Logout'
    } else if (accounts) {
        //Show sign up form with option to signin
        showSignupForm(true)
        document.getElementById('loggedInAs-Header').textContent = ''
        document.getElementById('logoutLink-Header').textContent = ''
    } else {
        //Not signed in and there are no accounts so show signup form
        //Show signup form without sign in option
        showSignupForm(false)
        document.getElementById('loggedInAs-Header').textContent = ''
        document.getElementById('logoutLink-Header').textContent = ''
    }
}

function showSignupForm() {
    let sebCardTemplate = document.getElementById('sebCardItem')
    let sebCard = sebCardTemplate.content.cloneNode(true);

    sebCard.querySelector('div').id = 'signupFormCard'

    let title = document.createElement('h1')
    title.textContent = 'Sign up to create notes'
    title.classList.add('darkMode', 'headerTitle')

    sebCard.querySelector('.sebCardTitle').appendChild(title)

    let signupFormTemplate = document.getElementById('signupFormTemplate')
    let signupForm = signupFormTemplate.content.cloneNode(true)
    signupForm.querySelector('.card').classList.add('darkMode')
    signupForm.querySelector('.card').style.border = 'none'
    sebCard.querySelector('.sebCardItemsContainer').appendChild(signupForm)

    document.body.appendChild(sebCard)
}

function updateThemeOfElements() {
    if (darkModeSwitch.checked) {
        setElementsToDarkMode()
    } else {
        setElementsToLightMode()
    }
}

function getPublicIP() {
    fetch('https://api.ipify.org?format=json')
    .then(response => response.json())
    .then(result => {
        let sebCardTemplate = document.getElementById('sebCardItem')
        let sebCard = sebCardTemplate.content.cloneNode(true);

        let titleDiv = document.createElement('div')
        let title = document.createElement('h1')
        title.textContent = 'Public IP'
        title.classList.add('darkMode', 'headerTitle')
        titleDiv.appendChild(title)

        sebCard.querySelector('.sebCardTitle').appendChild(titleDiv)

        let IPItemTemplate = document.getElementById('PublicIPItem')
        let IPItem = IPItemTemplate.content.cloneNode(true)

        IPItem.querySelector('.IPTitle-PublicIPItem').textContent = 'Your public IP address:'
        IPItem.querySelector('.IP-PublicIPItem').textContent = result.ip

        sebCard.querySelector('.sebCardItemsContainer').appendChild(IPItem)

        document.body.append(sebCard)
        updateThemeOfElements()
    }).catch(error => console.error(error))
}

function setUpHTTPCat() {
    let sebCardTemplate = document.getElementById('sebCardItem')
    let sebCard = sebCardTemplate.content.cloneNode(true);

    sebCard.querySelector('div').id = 'httpCat'

    let title = document.createElement('h1')
    title.textContent = 'Generate a HTTP Cat'
    title.classList.add('darkMode', 'headerTitle')

    sebCard.querySelector('.sebCardTitle').appendChild(title)

    let HTTPCatImage = document.createElement('img')
    HTTPCatImage.setAttribute('src', 'https://http.cat/200')
    HTTPCatImage.style.maxWidth = '100%'

    sebCard.querySelector('.sebCardItemsContainer').appendChild(HTTPCatImage)

    let HTTPInput = document.createElement('input')
    HTTPInput.classList.add('form-control', 'darkMode', 'mx-4')
    HTTPInput.id = 'HTTPInput'
    HTTPInput.setAttribute('placeholder', 'Enter a HTTP Status Code')
    HTTPInput.setAttribute('type', 'number')
    HTTPInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            updateHTTPCat()
        }
    })
    sebCard.querySelector('.sebCardBottom').appendChild(HTTPInput)

    document.body.appendChild(sebCard)
    addButton(document.getElementById('httpCat').querySelector('.sebCardBottom'), 'Generate Cat', false, 'updateHTTPCat()')
    updateThemeOfElements()
}

function updateHTTPCat() {
    let HTTPCatItem = document.getElementById('httpCat')
    let HTTPCode = HTTPCatItem.querySelector('#HTTPInput').value

    if (HTTPCode != '') {
        HTTPCatItem.querySelector('img').setAttribute('src', 'https://http.cat/' + HTTPCode)
    }
}

function get24HCryptoData() {
    fetch('https://api2.binance.com/api/v3/ticker/24hr')
    .then(response => response.json())
    .then(result => {
        console.log(result)
        const dataToDisplay = [
            result[result.findIndex(item => item.symbol === 'BTCUSDC')],
            result[result.findIndex(item => item.symbol === 'ETHUSDC')],
            result[result.findIndex(item => item.symbol === 'USDCUSDT')],
            result[result.findIndex(item => item.symbol === 'DOGEUSDT')],
            result[result.findIndex(item => item.symbol === 'FILUSDT')],
        ]

        const sebCardTemplate = document.getElementById('sebCardItem')
        let sebCard = sebCardTemplate.content.cloneNode(true);

        let title = document.createElement('h1')
        title.textContent = '24 Hour Crypto Data'
        title.classList.add('darkMode', 'headerTitle')
        sebCard.querySelector('.sebCardTitle').appendChild(title)

        let itemContainer = sebCard.querySelector('.sebCardItemsContainer')
        for (item of dataToDisplay) {
            let listItem = document.getElementById('CryptoDataItem')
            let clone = listItem.content.cloneNode(true)

            let symbol = item.symbol
            let symbolSplitArray = symbol.split('')
            
            for (let i = symbolSplitArray.length - 1; i > symbolSplitArray.length - 5; i--) {
                delete symbolSplitArray[i]
            }

            symbol = symbolSplitArray.join('')

            clone.querySelector('.tickerSymbol-CryptoDataItem').textContent = symbol
            clone.querySelector('.lastPrice-CryptoDataItem').textContent = parseFloat(item.lastPrice).toFixed(3)

            let percentageDifferenceText = clone.querySelector('.percentagePriceChange-CryptoDataItem')

            let priceDifference = parseFloat(item.priceChangePercent)
            let arrowSpan = document.createElement('span')
            arrowSpan.classList.add('iconify')
            arrowSpan.setAttribute('data-width', '26')

            if (priceDifference > 0) {
                arrowSpan.style.color = 'green'
                arrowSpan.setAttribute('data-flip', 'vertical')
                arrowSpan.setAttribute('data-icon', 'bi:arrow-down')
                percentageDifferenceText.style.color = 'green'
            } else if (priceDifference < 0) {
                arrowSpan.style.color = 'red'
                arrowSpan.setAttribute('data-icon', 'bi:arrow-down')
                percentageDifferenceText.style.color = 'red'
            } else {
                arrowSpan.style.color = 'gray'
                arrowSpan.setAttribute('data-icon', 'bi:dash-lg')
                percentageDifferenceText.style.color = 'gray'
            }

            clone.querySelector('.arrow-CryptoDataItem').appendChild(arrowSpan)

            percentageDifferenceText.textContent = item.priceChangePercent + '%'

            itemContainer.appendChild(clone)
        }

        document.body.appendChild(sebCard)
        updateThemeOfElements()
    })
    .catch(error => {
        console.error(error)
    })
}

async function setUpLiveBitcoinData() {
    let price = await fetchBitcoinLivePrice()
    let sebCardTemplate = document.getElementById('sebCardItem')
    let sebCard = sebCardTemplate.content.cloneNode(true);

    sebCard.querySelector('.sebCard').id = 'liveBitcoinData'

    let titleDiv = document.createElement('div')
    let title = document.createElement('h1')
    title.textContent = 'Live Bitcoin Data'
    title.classList.add('darkMode', 'headerTitle')
    titleDiv.appendChild(title)

    sebCard.querySelector('.sebCardTitle').appendChild(titleDiv)

    let priceItemTemplate = document.getElementById('CryptoDataItem')
    let priceItem = priceItemTemplate.content.cloneNode(true)

    priceItem.querySelector('div').classList.add('py-5')

    priceItem.querySelector('.tickerSymbol-CryptoDataItem').textContent = 'BTC'
    price = parseFloat(parseFloat(price).toFixed(3))
    priceItem.querySelector('.lastPrice-CryptoDataItem').textContent = (price > -0.011 && price < 0.011 ? '0.00' : price) + '%'

    let percentageDifferenceText = priceItem.querySelector('.percentagePriceChange-CryptoDataItem')
    percentageDifferenceText.textContent = '-%'
    percentageDifferenceText.style.color = 'gray'

    let arrowSpan = document.createElement('span')
    arrowSpan.classList.add('iconify')
    arrowSpan.setAttribute('data-width', '26')

    arrowSpan.style.color = 'gray'
    arrowSpan.setAttribute('data-icon', 'bi:dash-lg')

    priceItem.querySelector('.arrow-CryptoDataItem').appendChild(arrowSpan)

    sebCard.querySelector('.sebCardItemsContainer').appendChild(priceItem)


    document.body.append(sebCard)
    updateThemeOfElements()

    setInterval(() => {
        updateLiveBitcoinData()
    }, 500);
}

async function updateLiveBitcoinData() {
    const bitcoinDataItem = document.getElementById('liveBitcoinData')
    const oldPrice = parseFloat(bitcoinDataItem.querySelector('.lastPrice-CryptoDataItem').textContent)
    const newPrice = parseFloat(await fetchBitcoinLivePrice()).toFixed(3)

    const percentageDifference = ((newPrice - oldPrice) / oldPrice * 100).toFixed(2)

    const percentageDifferenceText = bitcoinDataItem.querySelector('.percentagePriceChange-CryptoDataItem')
    percentageDifferenceText.textContent = percentageDifference + '%'

    let arrowSpan = bitcoinDataItem.querySelector('.arrow-CryptoDataItem').firstChild
    let lastPrice = bitcoinDataItem.querySelector('.lastPrice-CryptoDataItem')
    lastPrice.textContent = newPrice

    if (percentageDifference > 0) {
        arrowSpan.style.color = 'green'
        arrowSpan.setAttribute('data-icon', 'bi:arrow-up')
        percentageDifferenceText.style.color = 'green'
        lastPrice.style.color = 'green'
    } else if (percentageDifference < 0) {
        arrowSpan.style.color = 'red'
        arrowSpan.setAttribute('data-icon', 'bi:arrow-down')
        percentageDifferenceText.style.color = 'red'
        lastPrice.style.color = 'red'
    } else {
        arrowSpan.style.color = 'gray'
        arrowSpan.setAttribute('data-icon', 'bi:dash-lg')
        percentageDifferenceText.style.color = 'gray'
        lastPrice.style.color = 'gray'
    }
}

async function fetchBitcoinLivePrice() {
    return await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    .then(response => response.json())
    .then(result => result.price)
    .catch(error => console.error(error))
}

async function setUpRandomActivityGenerator() {
    const {activity, type, participants, price} = await getRandomActivity()
    let sebCardTemplate = document.getElementById('sebCardItem')
    let sebCard = sebCardTemplate.content.cloneNode(true);

    sebCard.querySelector('.sebCard').id = 'randomActivity'

    let title = document.createElement('h1')
    title.textContent = 'Random Activity'
    title.classList.add('darkMode', 'headerTitle')

    sebCard.querySelector('.sebCardTitle').appendChild(title)

    let randomActivityTemplate = document.getElementById('RandomActivityItem')
    let randomActivityItem = randomActivityTemplate.content.cloneNode(true)

    randomActivityItem.querySelector('.Activity-RandomActivityItem').textContent = 'Activity: ' + activity
    randomActivityItem.querySelector('.Type-RandomActivityItem').textContent = 'Type: ' + type
    randomActivityItem.querySelector('.Participants-RandomActivityItem').textContent = 'Participants: ' + participants
    randomActivityItem.querySelector('.Price-RandomActivityItem').textContent = 'Price: $' + price

    sebCard.querySelector('.sebCardItemsContainer').appendChild(randomActivityItem)

    let itemFooter = sebCard.querySelector('.sebCardBottom')
    addButton(itemFooter, 'Generate New Activity', true, 'showNewActivity()')

    document.body.append(sebCard)
    updateThemeOfElements()
}

function addButton(element, text, removeFirstChild, onclick) {
    if (element.firstChild && removeFirstChild) element.removeChild(element.firstChild)
    let newActivityButton = document.createElement('button')
    newActivityButton.classList.add('btn', 'darkMode', 'btn-lg', 'mx-3')
    newActivityButton.textContent = text
    newActivityButton.setAttribute('onclick', onclick)

    element.appendChild(newActivityButton)
    updateThemeOfElements()
}

async function showNewActivity() {
    let activityItem = document.getElementById('randomActivity')
    let sebCardFooter = activityItem.querySelector('.sebCardBottom')
    sebCardFooter.removeChild(sebCardFooter.firstChild)
    let loadingTitle = document.createElement('h1')
    loadingTitle.textContent = 'Generating New Activity...'
    loadingTitle.classList.add('flashingElement', 'darkMode', 'mx-3')
    sebCardFooter.appendChild(loadingTitle)
    updateThemeOfElements()

    const {activity, type, participants, price} = await getRandomActivity()

    activityItem.querySelector('.Activity-RandomActivityItem').textContent = 'Activity: ' + activity
    activityItem.querySelector('.Type-RandomActivityItem').textContent = 'Type: ' + type
    activityItem.querySelector('.Participants-RandomActivityItem').textContent = 'Participants: ' + participants
    activityItem.querySelector('.Price-RandomActivityItem').textContent = 'Price: $' + price
    addButton(sebCardFooter, 'Generate New Activity', true, 'showNewActivity()')
}

async function getRandomActivity() {
    return await fetch('https://www.boredapi.com/api/activity')
    .then(response => response.json())
    .catch(error => console.error(error))
}

onSiteFirstLoad()

function setElementsToDarkMode() {
    document.body.style.backgroundColor = 'black';
    document.body.style.color = 'white';

    var lightModeElements = document.querySelectorAll('.lightMode')

    for (element of lightModeElements) {
        element.classList.remove('lightMode');
        element.classList.add('darkMode');
    }
}

function setElementsToLightMode() {
    document.body.style.backgroundColor = 'white';
    document.body.style.color = 'black';

    var darkModeElements = document.querySelectorAll('.darkMode')

    for (element of darkModeElements) {
        element.classList.remove('darkMode');
        element.classList.add('lightMode');
    }
}


darkModeSwitch.addEventListener('change', function() {
  if (this.checked) {
    //User has selected dark mode
    setElementsToDarkMode()
  } else {
    //User has selected light mode
    setElementsToLightMode()
  }
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    if (event.matches) {
        setElementsToDarkMode();
        darkModeSwitch.checked = true
    } else {
        setElementsToLightMode();
        darkModeSwitch.checked = false
    }
});

function signup(e) {
    e.preventDefault();

    let form = document.getElementById('signupForm')
    let nameWarning = document.getElementById('nameWarning-signupForm')
    let emailWarning = document.getElementById('emailWarning-signupForm')
    let passwordWarning = document.getElementById('passwordWarning-signupForm')
    let repeatPasswordWarning = document.getElementById('repeatPasswordWarning-signupForm')
    let behaviourAgreementWarning = document.getElementById('behaviourAgreementWarning-signupForm')

    nameWarning.textContent = ''
    emailWarning.textContent = ''
    passwordWarning.textContent = ''
    repeatPasswordWarning.textContent = ''
    behaviourAgreementWarning.textContent = ''

    let userName = form.name.value
    let userEmail = form.email.value
    let userPassword = form.password.value
    let userRepeatPassword = form.repeatPassword.value
    let userBehaviourAgreement = form.behaviourAgreement.checked

    if (userName == '') {
        nameWarning.textContent = 'Please enter a name'
    }

    if (userEmail == '') {
        emailWarning.textContent = 'Please enter an email'
    }

    if (userPassword == '') {
        passwordWarning.textContent = 'Please enter a password'
    }

    if (userRepeatPassword == '') {
        repeatPasswordWarning.textContent = 'Please repeat your password'
    }

    if (!userBehaviourAgreement) {
        behaviourAgreementWarning.textContent = 'Please agree to the behaviour agreement'
    }

    if (userName == '' || userEmail == '' || userPassword == '' || userRepeatPassword == '' || !userBehaviourAgreement) {
        return
    }

    if (userPassword != userRepeatPassword) {
        passwordWarning.textContent = 'Passwords do not match'
        repeatPasswordWarning.textContent = 'Passwords do not match'
        return
    }

    const nameAlreadyExists = accounts.findIndex(account => account.name == userName) != -1
    const emailAlreadyExists = accounts.findIndex(account => account.email === userEmail) != -1

    if (nameAlreadyExists) {
        nameWarning.textContent = 'Name already exists'
    }

    if (emailAlreadyExists) {
        emailWarning.textContent = 'Email already exists'
    }

    if (nameAlreadyExists || emailAlreadyExists) {
        return
    }

    let userObject = {
        name: userName,
        email: userEmail,
        password: userPassword,
        notes: {}
    }


    accounts.push(userObject)
    localStorage.setItem('accounts', JSON.stringify(accounts))
    signedInAs = userObject;
    localStorage.setItem('signedInAs', JSON.stringify(signedInAs))

    actUponLoginStatus()
}

function logout() {
    accounts.splice(accounts.findIndex(account => account.name == signedInAs.name), 1)
    if (accounts.length == 0) localStorage.removeItem('accounts')
    else localStorage.setItem('accounts', JSON.stringify(accounts))
    signedInAs = null;
    localStorage.removeItem('signedInAs')

    actUponLoginStatus()
}

let signupForm = document.getElementById('signupForm')
if (signupForm) {
    signupForm.addEventListener('submit', signup)
}