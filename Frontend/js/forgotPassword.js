function recoveryPassword() {
    const email = document.getElementById('emailForgot').value;
    document.getElementById('loadTriangulo').style.display = 'flex';
    console.log('teste')

    $.ajax({
        url: "https://testematchagas.herokuapp.com/User/Reset/Password",
        method: "POST",
        data: {
            email: email
        },
        success: function(resul) { 
            if(resul.trueMessage === false) {
                Swal.fire({
                    position: 'center',
                    icon: 'error',
                    title: "Email informado não está verificado",
                    showConfirmButton: false,
                    timer: 1500
                })
            } else {
                document.getElementById('loadTriangulo').style.display = 'none';
                window.sessionStorage.setItem('emailForRecovery', email)
                window.location.href = '/view/changePassword.html'
            }
        }
    }).fail(function(err) {
        document.getElementById('loadTriangulo').style.display = 'none';
        console.log(err.responseJSON.message)
    })
}