async function getData(url) {
    let response = await fetch(url, {
        mode: 'cors',
        headers: {
            'Origin': window.location.href
        }
    });
    let data = await response.json();
    return data;
}

let timer = 15

function parseISOString(s) {
    var b = s.split(/\D+/);
    return new Date(Date.UTC(b[0], --b[1], b[2], b[3], b[4], b[5], b[6]));
}

async function updateInfo() {
    document.querySelector('.error').style.display = 'none'
    document.querySelector('.no').style.display = 'none'
    const data = await getData('https://cors-anywhere.herokuapp.com/https://war-api.ukrzen.in.ua/alerts/api/alerts/active.json').catch(e => {
        document.querySelector('.error').style.display = 'block'
    })
    if(data.alerts.length) {
        const main = document.querySelector('.main')
        main.innerHTML = '<h2 class="no">Тревог немає</h2>\n' +
            '    <h2 class="error">Системна помилка, спробуйте пізніше.</h2>'
        for(let i = 0; i < data.alerts.length; i++) {
            const date = parseISOString(data.alerts[i].started_at)
            main.innerHTML += `<div class="alarm">
        <div class="cityname">
            <p>${data.alerts[i].location_title}</p>
        </div>
        <div class="descr">
            <p>Повітрянна тривога! Всі в укриття!</p>
        </div>
        <div class="started_at">
            <p>Почалася в ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}</p>
        </div>
    </div>`
        }
    } else {
        document.querySelector('.no').style.display = 'block'
    }
}

setInterval(async () => {
    timer--
    document.querySelector('.time').innerText = `| Оновлення інформації через ${timer} сек`
    if(!timer) {
        timer = 15
        await updateInfo()
    }
}, 1000)
