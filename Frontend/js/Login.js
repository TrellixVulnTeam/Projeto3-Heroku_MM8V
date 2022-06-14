// $(document).ready(function(){
//     //Inicia os valores quando o botão for clicado
//     $(".btnEntrarLogin").click(function(){
//         console.log('rodou')
//         var email = $(".inputLogin").val();
//         alert(email);
//     });

function verifyLogin() {
    $.post("http://localhost:3001/User/Login",
    {"email" : $("#email").val(), 
    "password" : $("#passWord").val()}
    , function(msg){
        if(msg.token) {
            window.sessionStorage.setItem('auth', msg.token)
            if (msg.typeOfUser == 'user') {
                $.ajax({
                    url: "http://localhost:3001/User/Verify/Curriculum",
                    type: "GET",
                    headers: {"Authorization": `Bearer ${msg.token}`},
                    success: function(resul) {
                        if (resul.haveCurriculum === true) {
                            document.location.href = '../view/hubVagas.html'
                        } else {
                            document.location.href = '../view/createCurriculum.html'
                        }
                    }
                }).fail(function(err) {
                    console.log(err.responseJSON.error)
                    errorMessage(err.responseJSON.error)
                })
            } else {
                document.location.href = '../view/myVagasCompany.html'
            }
        }
    }).fail(function(err) {
        errorMessage(err.responseJSON.error)
    })
}

function errorMessage(content) {

    //Define o erro na MODAL
    document.getElementById('contentError').innerHTML = content

    document.getElementById('alertContainer').style.display = 'flex';

    document.getElementById('alertContainer').scrollIntoView();
    window.scroll(0, -150)

    setTimeout(() => {
        document.getElementById('alertContainer').style.display = 'none'
    }, "4000")
}