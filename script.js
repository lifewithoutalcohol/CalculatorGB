const storageNumber = document.getElementById('storage__number')
const storageScale = document.getElementById('storage__scale')
const transferNumber = document.getElementById('transfer__number')
const transferScale = document.getElementById('transfer__scale')
const paramsArray = [
    document.getElementById('backblaze__item').children,
    document.getElementById('bunny__item').children,
    document.getElementById('scaleway__item').children,
    document.getElementById('vultr__item').children,
]
const paramsRadio = document.querySelectorAll('.logic__input-item input')

storageNumber.oninput = getGBValue;
storageScale.oninput = getGBValue;
transferNumber.oninput = getGBValue;
transferScale.oninput = getGBValue;
paramsRadio.forEach(item => item.onchange = () => changeScale(storageValue, transferValue))
window.onresize = () => changeScale(storageValue, transferValue)

storageScale.value = storageNumber.value;
transferScale.value = transferNumber.value;
let storageValue = storageNumber.value;
let transferValue = transferNumber.value;

function getGBValue(event) {
    if (event.target.closest('.schedule__storage') ) {
        storageValue =  event.target.value;
        if (event.target.value >= 1000) {
            storageValue = 1000
        } else if (event.target.value <= 0) {
            storageValue = 0
        }
        storageNumber.value = storageValue;
        storageScale.value = storageValue
    } else {
        transferValue =  event.target.value;
        if (event.target.value >= 1000) {
            transferValue = 1000
        } else if (event.target.value <= 0) {
            transferValue = 0
        }
        transferNumber.value = transferValue;
        transferScale.value = transferValue
    }
    changeScale(storageValue, transferValue)
}

function calcBackblaze (storageGB, transferGB) {
    const storagePrice = 0.005;
    const transferPrice = 0.01;
    const minPrice = 7;
    let price = (storagePrice * storageGB + transferPrice * transferGB).toFixed(2);
    if (price <= minPrice) price = minPrice.toFixed(2);
    paramsArray[0][1].innerHTML = price + '$';
    return price
}

function calcBunny (storageGB, transferGB) {
    let storagePrice = 0.01;
    if (document.getElementById('ssd').checked) storagePrice = 0.02;
    const transferPrice = 0.01;
    const maxPrice = 10;
    let price = (storagePrice * storageGB + transferPrice * transferGB).toFixed(2);
    if (price >= maxPrice) price = maxPrice.toFixed(2)
    paramsArray[1][1].innerHTML = price + '$';
    return price

}

function calcScaleway(storageGB, transferGB) {
    let storagePrice = 0.03;
    if(document.getElementById('multi').checked) storagePrice = 0.06;
    let transferPrice = 0.02;
    const minValue = 75;
    if (storageGB <= minValue) {
        storagePrice = 0;
        transferPrice = 0
    }
    if (transferGB <= minValue) {
        transferPrice = 0
    }
    let price = (storagePrice * (storageGB - minValue) + transferPrice * (transferGB - minValue)).toFixed(2);
    paramsArray[2][1].innerHTML = price + '$';
    return price
}

function calcVultr(storageGB, transferGB) {
    const storagePrice = 0.01;
    const transferPrice = 0.01;
    const minPrice = 5;
    let price = (storagePrice * storageGB + transferPrice * transferGB).toFixed(2);
    if (price <= minPrice) price = minPrice.toFixed(2)
    paramsArray[3][1].innerHTML = price + '$';
    return price
}

function changeScale(storageGB, transferGB) {
    const priceAr = [
        +calcBackblaze(storageGB, transferGB),
        +calcBunny(storageGB, transferGB),
        +calcScaleway(storageGB, transferGB),
        +calcVultr(storageGB, transferGB)
    ]

    const maxPrice = Math.max(...priceAr);
    const minPrice = Math.min(...priceAr);
    const maxWidthScale = window.innerWidth * 0.6 - paramsArray[0][1].offsetWidth;
    const maxHeightScale = window.innerHeight * 0.3 - paramsArray[0][1].offsetWidth;

    paramsArray.forEach(item => {
        item[0].style.width = '';
        item[0].style.height = '';
        let value = parseFloat(item[1].innerHTML).toFixed(2);
        if (+value === minPrice) {
            item[0].style.background = '#a349a4'
        } else {
            item[0].style.background = '#c3c3c3'
        }
        if (window.innerWidth > 767.98) {
            const cof = maxWidthScale / maxPrice;
            const width = cof * value;
            item[0].style.width = width + 'px'
        } else {
            const cof = maxHeightScale / maxPrice;
            const height = cof * value
            item[0].style.height = height + 'px'
        }
    })
}
changeScale(storageValue, transferValue)

