
let cards = [
    // {
    //     "message": "teste",
    //     "id": 1
    // },
    // {
    //     "message": "teste1",
    //     "id": 2
    // }
]

function verifyCompanyInfos(){
    window.location.href = '../view/testeSoftSkillCompany.html';
}

function addCards(message) {

    document.getElementById('inputForCard').value = ''
   
    let lastCard = cards.slice(-1)

    if (lastCard == '') {
        cards.push({'message': message, 'id': 1})
    } else {
        var lastId = lastCard[0].id
        var id = lastId + 1
        cards.push({'message': message, 'id': id})
        console.log(cards)
    }

    renderCards()
}

function deleteCard(id) {
    console.log(id)

    var cardDeleted = cards.filter((card) => {
        return card.id == id        
    })

    const index = cards.indexOf(cardDeleted[0]);

    if (index > -1) {
        cards.splice(index, 1); // 2nd parameter means remove one item only
    }

    renderCards()
}

function renderCards() {
    document.getElementById('skillCard').innerHTML = ''

    cards.map((card) => {

        console.log('teste') 

        document.getElementById('skillCard').innerHTML += `
        <div class="balao-skill d-flex">
            <p>${card.message}</p><button type = 'button' onclick = deleteCard(${card.id})>x</button>
        </div>
        `
    })
}

let cards1 = [
    // {
    //     "message": "teste",
    //     "id": 1
    // },
    // {
    //     "message": "teste1",
    //     "id": 2
    // }
]


function addCards1(message) {

    document.getElementById('inputForCard1').value = ''
   
    let lastCard1 = cards1.slice(-1)

    if (lastCard1 == '') {
        cards1.push({'message': message, 'id': 1})
    } else {
        var lastId1 = lastCard1[0].id
        var id1 = lastId1 + 1
        cards1.push({'message': message, 'id': id1})
        console.log(cards1)
    }

    renderCards1()
}

function deleteCard1(id) {
    console.log(id)

    var cardDeleted1 = cards1.filter((card) => {
        return card.id == id        
    })

    const index = cards1.indexOf(cardDeleted1[0]);

    if (index > -1) {
        cards1.splice(index, 1); // 2nd parameter means remove one item only
    }

    renderCards1()
}

function renderCards1() {
    document.getElementById('skillCard1').innerHTML = ''

    cards1.map((card) => {
        document.getElementById('skillCard1').innerHTML += `
        <div class="balao-skill d-flex">
            <p>${card.message}</p><button type = 'button' onclick = deleteCard1(${card.id})>x</button>
        </div>
        `
    })
}

let name_company
let id
let auth

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        console.log('teste')
        auth = window.sessionStorage.getItem('auth')
        $.ajax({
            url: "http://localhost:3001/Company",
            headers: {"Authorization": `Bearer ${auth}`},
            method: "GET",
            success: function(resul) { 
                name_company = resul.name_company,
                id = resul.id_company
                document.getElementById("userNameNavBar").innerHTML = `${name_company}`
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message)
            window.location.href = '/view/login.html'
        })
    }
}

function saveInfos() {
    const name = document.getElementById('nomeCargo').value;
    const type = document.getElementById('typeVaga').value;
    const local = document.getElementById('localVaga').value;
    const description = document.getElementById('descriptionVaga').value;
    let hardSkills = []
    let requirements = []
    cards.map((card) => {
        hardSkills.push(card.message)
    })
    cards1.map((card) => {
        requirements.push(card.message)
    })

    console.log(name)
    console.log(type)
    console.log(local)
    console.log(description)
    console.log(hardSkills)
    console.log(requirements)

    $.ajax({
        url: "http://localhost:3001/Offer/Create",
        type: "POST",
        headers: {"Authorization": `Bearer ${auth}`},
        data: {
            name: name,
            type: type,
            local: local,
            description: description,
            requirements: requirements,
            hardSkills: hardSkills,
            name_company: name_company,
            id_company: id
        },
        success: async function(resul) {
            console.log(resul.message)
            await Swal.fire({
                position: 'center',
                icon: 'success',
                title: "Vaga criada com sucesso!",
                showConfirmButton: false,
                timer: 2000
            })
            window.sessionStorage.setItem('idOfferForSK', resul.id_offer)
            window.location.href = '/view/testeSoftSkillCompany.html'
        },
        error: function(err) {
            console.log(err.responseJSON.error)
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: err.responseJSON.error,
                showConfirmButton: false,
                timer: 2000
            })
        }
    })
}