//Classe exportada advinda de outro arquivo 
const matchGenerate = require('../services/Match')

//Controller para obter a porcentagem de match da usuária com a vaga 
const match = (req, res) => {
    let { userSoft, offerSoft, userHard, offerHard } = req.body;
    //Substitui todos os elementos indesejáveis e formata as variáveis em um array
    userSoft = userSoft.split(",")
    userHard = userHard.split(",")
    offerSoft = offerSoft.split(",")
    offerHard = offerHard.split(",")

    //Instancia a classe match exportada
    var matchCreate = new matchGenerate.Match(userSoft, offerSoft, userHard, offerHard);

    //Executa os métodos da classe previamente exportada
    var resulSoft = matchCreate.matchSoft();
    var resulHard = matchCreate.matchHard();


    //Calcula o resultadado final em decorrência dos resultados obtidos nas funções acima
    let resulFinal = (resulSoft + resulHard) / 2

    resulFinal = Number(resulFinal)

    res.status(200).json({
        percentage: resulFinal
    })
}

module.exports = {
    match
}
    