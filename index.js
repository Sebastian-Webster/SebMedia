let darkModeSwitch = document.querySelector("input[name=darkModeSwitch]");


function onSiteFirstLoad() {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setElementsToDarkMode();
        darkModeSwitch.checked = true;
    } else {
        setElementsToLightMode();
        darkModeSwitch.checked = false;
    }

    get24HCryptoData()

    setUpLiveBitcoinData()
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
            let listItem = document.getElementById('24HCryptoDataItem')
            let clone = listItem.content.cloneNode(true)

            let symbol = item.symbol
            let symbolSplitArray = symbol.split('')
            
            for (let i = symbolSplitArray.length - 1; i > symbolSplitArray.length - 5; i--) {
                delete symbolSplitArray[i]
            }

            symbol = symbolSplitArray.join('')

            clone.querySelector('.tickerSymbol-24HCryptoDataItem').textContent = symbol
            clone.querySelector('.lastPrice-24HCryptoDataItem').textContent = parseFloat(item.lastPrice).toFixed(3)

            let percentageDifferenceText = clone.querySelector('.percentagePriceChange-24HCryptoDataItem')

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

            clone.querySelector('.arrow-24HCryptoDataItem').appendChild(arrowSpan)

            percentageDifferenceText.textContent = item.priceChangePercent + '%'

            itemContainer.appendChild(clone)
        }

        document.body.appendChild(sebCard)
    })
    .catch(error => {
        console.error(error)
    })
}

async function setUpLiveBitcoinData() {
    console.log(await fetchBitcoinLivePrice())
    let sebCardTemplate = document.getElementById('sebCardItem')
    let sebCard = sebCardTemplate.content.cloneNode(true);
}

async function fetchBitcoinLivePrice() {
    return await fetch('https://api.binance.com/api/v3/ticker/price?symbol=BTCUSDT')
    .then(response => response.json())
    .then(result => result.price)
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