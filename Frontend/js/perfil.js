let nome
let email
let id

const auth = window.sessionStorage.getItem('auth')

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
                document.getElementById('userNameNavBar').innerHTML = `${nome}`
                checkUser()
            }
        }).fail(function(err) {
            console.log(err.responseJSON.message);
            window.location.href = '../view/login.html'
        })
    }
}

let User

async function checkUser() {

    await $.ajax({
        url: "https://testematchagas.herokuapp.com/User/User",
        type: "POST",
        data: { 
            id: id
        },
        headers: {"Authorization": `Bearer ${auth}`},
        success: function(resul) { 
            User = resul.user
        }
    }).fail(function(err) {
        console.log(err.responseJSON.message)
    })

    document.getElementById('nomePerfil').innerHTML = User.name

    let hardSkills = User.hardSkills.split(",")
    hardSkills.map((skill) => {
       document.getElementById('hardSkillList').innerHTML += `<li>${skill}</li>`
    })
    

    const curriculum = JSON.parse(User.curriculum)

    console.log(curriculum)

    document.getElementById('descricaoUser').innerHTML = curriculum.descricao
    document.getElementById('objetivoUser').innerHTML = curriculum.objetivo
}

function logOut() {
    window.sessionStorage.removeItem('auth')
    window.location.href = '../view/Login.html'
}