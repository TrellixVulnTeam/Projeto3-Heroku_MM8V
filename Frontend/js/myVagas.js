let nome
let email
let id

let auth = window.sessionStorage.getItem('auth')
window.onload = (event) => {
    console.log('page is fully loaded');
};

function startTimer(duration) {
    var timer = duration, seconds;
    var setIntervalo = setInterval(function () {
        seconds = parseInt(timer % 60, 10);
        if (--timer <= 0) {
            clearInterval(setIntervalo);
            document.getElementById("curriculo").style.display = 'block';
            document.getElementById("loader").style.display = 'none';
        }
    }, 1000);
}
/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "https://testematchagas.herokuapp.com/User/Verify/Infos",
            type: "GET",
            headers: { "Authorization": `Bearer ${auth}` },
            success: function (resul) {
                console.log(resul)
                nome = resul.name
                email = resul.email,
                    id = resul.id
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                checkVagas()
            }
        }).fail(function (err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

let vagas = [
    {
        'nome': 'Analista de Sistemas 1',
        'matchPer': 60,
        'modelo': "Remoto",
        'status': "Aguardando"
    },
    {
        'nome': 'Analista de Sistemas 2',
        'matchPer': 60,
        'modelo': "Presencial",
        'status': "Aprovado"
    },
    {
        'nome': 'Analista de Sistemas 3',
        'matchPer': 50,
        'modelo': "Remoto",
        'status': "Rejeitado"
    },
    {
        'nome': 'Engenheiro de Software',
        'matchPer': 10,
        'modelo': "Presencial",
        'status': "Aguardando"
    },
    {
        'nome': 'Engenheiro da Computação',
        'matchPer': 20,
        'modelo': "Remoto",
        'status': "Aguardando"
    },
    {
        'nome': 'Analista de DB',
        'matchPer': 50,
        'modelo': "Remoto",
        'status': "Aguardando"
    },
]

async function checkVagas() {

    console.log(auth)

    await $.ajax({
        url: "https://testematchagas.herokuapp.com/Offer/OfferUser",
        headers: { "authorization": `Bearer ${auth}` },
        success: function (resul) {
            console.log(resul)
            vagas = resul.offers
        }
    }).fail(function (err) {
        console.log('teste')
        console.log(err.responseJSON.message)
    })

    console.log(nome, id, email)

    vagas.map((vaga) => {

        let color = 'black'

        document.getElementById('containerOfAll').innerHTML += `
        <div class = "col-sm-12 col-md-6 col-lg-4 bodyVagaComponent" id="vaga">
            <div class = 'vagaComponent' style="box-shadow:  2px 4px 5px var(--shadow-${color}), -2px 4px 5px var(--shadow-${color});">
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src = '../images/userTest.png' style = "width: 100px;">
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent">
                            <h1 class="nomeVagaHubVagas">${vaga.name}</h1>
                            <p class="pForHubVagas"><i class="fa fa-map-marker" aria-hidden="true"></i>São Paulo</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-briefcase briefcase-yellow" aria-hidden="true"></i>${vaga.type}</p>
                            <p class="pForHubVagas d-flex"><i class="fa fa-info-circle info-circle-yellow" aria-hidden="true"></i>${vaga.status}</p>
                            <div class = 'divBtnSeeMore'>
                                <button class="btnSeeMore" type="button" onclick="redirectToVagaId('${vaga.id}')">Ver Mais</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    })
}

function redirectToVagaId(param) {
    document.location.href = `../view/vagaExpandida.html?id=${param}`
}

function generateRandomNumber() {
    return Math.floor(Math.random() * 100)
}

function popUpVisibility(visible) {

    console.log('Foi')
    console.log(visible)

    let displayToEdit = ''

    if (visible == true) {
        document.getElementById('bodyFiltersHubVagas').style.display = 'flex'

        document.getElementById('toScroll').scrollIntoView();
    } else {
        displayToEdit = 'none'
        document.getElementById('bodyFiltersHubVagas').style.display = 'none'
    }
}