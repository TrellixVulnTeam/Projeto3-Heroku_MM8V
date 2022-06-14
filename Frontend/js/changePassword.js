let emailExists

/* A adição dessa função que "escuta" um evento permite que verifiquemos se a página foi carregada */
document.onreadystatechange = async function () {
    if (document.readyState == "complete") {
        emailExists = window.sessionStorage.getItem('emailForRecovery');

        if (!emailExists) {
            window.location.href = '/view/forgotPassword.html'
        }
    }
}

function changeCode(key, event) {
    if (event.keyCode == 8) {
        if (key != 1) {
            key = key - 1;
        }
        document.getElementById("code" + key).focus();
    } else {
        key = key + 1;
        document.getElementById("code" + key).focus();
    }

}

async function saveChange() {
    console.log(emailExists)
    let code = document.getElementById('code1').value + document.getElementById('code2').value + document.getElementById('code3').value + document.getElementById('code4').value
    code = Number(code)
    const passWord = document.getElementById('newPass').value
    const confirmPass = document.getElementById('confirmNewPass').value

    const isValid = validatePass(passWord)

    if(isValid != true) {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: isValid,
            showConfirmButton: false,
            timer: 2000
        })
    } else {
        if (passWord === confirmPass) {
            $.ajax({
                url: "https://testematchagas.herokuapp.com/User/Redefine/Password",
                type: "PUT",
                data: { 
                    email: emailExists,
                    code: code,
                    newPass: confirmPass
                },
                success: async function(resul) {
                    console.log(resul.message)
                    await Swal.fire({
                        position: 'center',
                        icon: 'success',
                        title: "Senha alterado com sucesso",
                        showConfirmButton: false,
                        timer: 2000
                    })
                    window.location.href = '/view/login.html'
                    window.sessionStorage.removeItem('emailForRecovery')
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
    }
}

// function saveChange(){
//     window.location.href = '../view/Login.html';
// }

function validatePass(senha) {
    if (!senha.match(/[a-z]+/)) {
        return "Senha deve possuir letras minúsculas"
    }
    if (!senha.match(/[A-Z]+/)) {
        return "Senha deve possuir letras maiúsculas"
    }
    if (!senha.match(/[0-9]+/)) {
        return "Senha deve possuir números"
    }
    if (!senha.match(/[$@#&!]+/)) {
        return "Senha deve possuir caracteres especíais"
    }
    return true
}