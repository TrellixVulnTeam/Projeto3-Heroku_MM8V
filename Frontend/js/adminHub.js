function redirectPage(page) {
    document.location.href = `../view/${page}`
}

let nome
let email
let id
let isAdmin

let auth = window.sessionStorage.getItem('auth')

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        $.ajax({
            url: "https://testematchagas.herokuapp.com/User/Verify/Infos",
            headers: {"Authorization": `Bearer ${auth}`},
            success: function(resul) { 
                nome = resul.name
                email = resul.email,
                id = resul.id
                isAdmin = Boolean(resul.isAdmin)
                if (isAdmin == false) {
                    window.location.href = '../view/hubVagas.html'
                }
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                checkVagas()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '../view/login.html'
        })
    }
}

let companiesAndUsers = []
let users = []
let companies = []

async function checkVagas() {

    await $.ajax({
        url: "https://testematchagas.herokuapp.com/User/Users",
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            users = resul.message
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    await $.ajax({
        url: "https://testematchagas.herokuapp.com/Company/Companies",
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            companies = resul.message
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    users.map((user) => {
        document.getElementById('containerOfAll').innerHTML += `
        <div class="col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
            <div class='vagaComponent'>
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src='../images/userTest.png'>
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent" style="justify-content: space-between;">
                            <h1 class="nomeVagaHubVagas" style="font-size: 15pt;">${user.name}</h1>
                            <div class='divBtnSeeMore'>
                                <button class="btnSeeMore">Ver Mais</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `
    })

    companies.map((company) => {
        document.getElementById('containerOfAll').innerHTML += `
        <div class="col-sm-12 col-md-6 col-lg-4 bodyVagaComponent">
            <div class='vagaComponent'>
                <div class="row mainWidGet">
                    <div class="col-5 imgHubVagas">
                        <img src='../images/userTest.png'>
                    </div>
                    <div class="col-7">
                        <div class="divRightHubVagasComponent" style="justify-content: space-between;">
                            <h1 class="nomeVagaHubVagas" style="font-size: 15pt;">${company.name}</h1>
                            <div class='divBtnSeeMore'>
                                <button class="btnSeeMore">Ver Mais</button>
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

function popUpVisibility(visible) {

    console.log('Foi')
    console.log(visible)

    let displayToEdit = ''

    if(visible == true) {
        document.getElementById('bodyFiltersHubVagas').style.display = 'flex'

        document.getElementById('toScroll').scrollIntoView();
    } else {
        displayToEdit = 'none'
        document.getElementById('bodyFiltersHubVagas').style.display = 'none'
    }

    
}