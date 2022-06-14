async function verifyUserInfos() {
    var nome = document.getElementById("nomeUserCreateForm").value
    var email = document.getElementById("emailUserCreateForm").value
    var senha = document.getElementById("senhaUserCreateForm").value
    var bornDate = document.getElementById("bornDateUserCreateForm").value
    var gender = document.getElementById("genderUserCreateForm").value
    var cpf = cpfToDb(document.getElementById("cpfUserCreateForm").value)
    var number
    var prefixNumber = document.getElementById("number55Input").value
    var numberNormal = numberToDb(document.getElementById("number11Input").value);
    number = prefixNumber + numberNormal
    // var inputFile = document.getElementById('imageUser').files[0]

    // if (inputFile.type == 'image/jpeg' || inputFile.type == 'image/png') {
    //     readFile()
    // }
    const validate = validateInformations(email, cpf, senha)
    console.log(validate)

    if(validate === true) {
        $.ajax({
            url: "http://localhost:3001/User/Register",
            type: "POST",
            data: {
                name: nome,
                email: email,
                password: senha,
                bornDate: bornDate,
                gender: gender,
                cpf: cpf,
                phoneNumber: number,
                typeOfUser: "user"
            },
            success: async function(resul) {
                console.log(resul.message)
                await Swal.fire({
                    position: 'center',
                    icon: 'success',
                    title: "Conta criada com sucesso!",
                    showConfirmButton: false,
                    timer: 2000
                })
                window.location.href = '/view/login.html'
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
    } else {
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: validate,
            showConfirmButton: false,
            timer: 2000
        })
    }
}

function readFile() {
  
    if (!document.getElementById('imageUser').files || !document.getElementById('imageUser').files[0]) return;
        
    const FR = new FileReader();
        
    FR.addEventListener("load", function(evt) {
        console.log((evt.target.result))
    }); 
        
    FR.readAsDataURL(document.getElementById('imageUser').files[0]);
}

function numberFormat() {
    console.log('foi')
    const input = document.getElementById('number11Input');
    const formatado = formatacao(input.value);
    console.log(formatado)
    input.value = formatado;
}

function formatacao(num) {
    const phoneNumber = num.replace(/[^\d]/g, '');
    const length = phoneNumber.length;

    //Efetuando Validações
    if (length < 3) {
        return phoneNumber;
    } 


    if (length < 8) {
      return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(2)}`;
    }

    return `(${phoneNumber.slice(0, 2)}) ${phoneNumber.slice(
      2,
      7
    )}-${phoneNumber.slice(7, 10)}`;
}

function cpfFormat(i){
    var v = i.value;
    
    if(isNaN(v[v.length-1])){ // impede entrar outro caractere que não seja número
       i.value = v.substring(0, v.length-1);
       return;
    }
    
    i.setAttribute("maxlength", "14");
    if (v.length == 3 || v.length == 7) i.value += ".";
    if (v.length == 11) i.value += "-";
 
}

function numberToDb(number) {
    number = number.replaceAll('(', '');
    number = number.replaceAll(')', '');
    number = number.replaceAll('-', '');
    number = number.replaceAll(' ', '');
    return number
} 

function cpfToDb(cpf) {
    cpf = cpf.replaceAll('.', '');
    cpf = cpf.replaceAll('-', '');
    return cpf
}

function validateInformations(email, cpf, senha) {
    if(!/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
        return "Email inválido"
    }

    function CPF(){"user_strict";function r(r){for(var t=null,n=0;9>n;++n)t+=r.toString().charAt(n)*(10-n);var i=t%11;return i=2>i?0:11-i}function t(r){for(var t=null,n=0;10>n;++n)t+=r.toString().charAt(n)*(11-n);var i=t%11;return i=2>i?0:11-i}var n=false,i=true;this.gera=function(){for(var n="",i=0;9>i;++i)n+=Math.floor(9*Math.random())+"";var o=r(n),a=n+"-"+o+t(n+""+o);return a},this.valida=function(o){for(var a=o.replace(/\D/g,""),u=a.substring(0,9),f=a.substring(9,11),v=0;10>v;v++)if(""+u+f==""+v+v+v+v+v+v+v+v+v+v+v)return n;var c=r(u),e=t(u+""+c);return f.toString()===c.toString()+e.toString()?i:n}}

    let CPFvalidator = new CPF();

    if(!CPFvalidator.valida(cpf)) {
        return "CPF inválido"
    }

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