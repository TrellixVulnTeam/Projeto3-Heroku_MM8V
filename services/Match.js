//Classe para o match da vaga com a usuária
class Match {
    constructor(userSoft, offerSoft, userHard, offerHard) {
        this.userSoft = userSoft,
        this.offerSoft = offerSoft,
        this.userHard = userHard,
        this.offerHard = offerHard
    }

    //Método para obter a porcentagem de compatibilidade das soft skills da vaga com as soft skills da vaga
    matchSoft() {
        let porcentagemTotal = 0
        let match = 0

        //Loop para pegar o índex de cada elemento do array das soft skills da vaga
        for (let i in this.offerSoft){
            //Checagem se a escolha para a vaga não foi uma posição neutra 
            if (this.offerSoft[i] != 2){
                if (this.offerSoft[i] == this.userSoft[i]){
                    porcentagemTotal += 100
                }
                //Calcular o desvio padrão da escolha do candidato com a escolha para vaga
                let subtracao = this.offerSoft[i] - this.userSoft[i]
                if (subtracao < 0) {
                    subtracao = String(subtracao).slice(1)
                }
                //Cáculo da compatibilidade com os respectivos percentis 
                if (subtracao == 0){
                    porcentagemTotal += 100
                } else if (subtracao == 1){
                    porcentagemTotal += 95
                } else if (subtracao == 2) {
                    porcentagemTotal += 68
                } else {
                    porcentagemTotal += 0
                }
            } 
            //Cálculo da porcentagem caso a posição para a vaga foi neutra
            else {
                if (this.offerSoft[i] == this.userSoft[i]){
                    porcentagemTotal += 100
                }
                let subtracao = this.offerSoft[i] - this.userSoft[i]
                if (subtracao < 0) {
                    subtracao = String(subtracao).slice(1)
                }
                if (subtracao == 1) {
                    porcentagemTotal += 95
                } else {
                    porcentagemTotal += 0
                }
            }
        }
        //Cálculo final da compatibilidade das soft skills da usuária com as da vaga
        match = porcentagemTotal/10
        return match
    }

    //Método para obter a porcentagem de compatibilidade das hard skills da vagacom as hard skills da usuária
    matchHard() {
        let porcentagem = 0
        let equals = 0

        //Loop para pegar cada elemento do array de hardSkill da vaga 
        for (let x of this.offerHard){
            //Loop para pegar cada elemento do array de hardSkill da usuária
            for (let hard of this.userHard){
                //Checagem se é igual
                if (String(x).toLowerCase() == String(hard).toLowerCase()) {
                    //Se for, variável "equals" recebe + 1
                    equals ++
                    break
                }
            }
        }
        //Cálculo da porcentagem final da compatibilidade das hardSkills da usuária com a vaga
        porcentagem = (equals/this.offerHard.length) * 100

        return porcentagem
    }
}

module.exports = { Match }