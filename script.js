let Tabuleiro = [];
let Qtd_Barcos = 10;
let Qtd_Jogadas = 12;
let Qtd_Tiros = 12;
let JogadaX = 0;
let JogadaY = 0;
let Pontos = 0;

for (let i = 0; i < 5; i++) {
    Tabuleiro[i] = [];
    for (let j = 0; j < 5; j++) {
        Tabuleiro[i][j] = false;
    }
}
console.log(Tabuleiro);
for(let i=0;i<Qtd_Barcos;i++){
    let posX = parseInt(Math.floor(Math.random() * 5));
    let posY = parseInt(Math.floor(Math.random() * 5));  
    Tabuleiro[posX][posY] = true;
    } 
    console.log(Tabuleiro);



function atirar(imgElement) {
    let tabelagermano = document.getElementById("maicolcareca");
    let entradamaicol = tabelagermano.getElementsByTagName("tr");

    Array.from(entradamaicol).forEach((linha, i) => {
        let tatefoda = linha.getElementsByTagName("td");

        Array.from(tatefoda).forEach((td, j) => {
            if (td.contains(imgElement)){
                if (Tabuleiro[i] [j]) {
                    imgElement.src = "imagem/barco.jpg"; 
                    Pontos += 10; 
                } else {
                    imgElement.src = "imagem/erro.jpeg";
                }
                Qtd_Tiros -= 1;
                document.getElementById("score").innerHTML = `score: ${Pontos}`;
            }
        });
    });
}



 if (Tabuleiro[i][j]) {
    imgElement.src="/imagem/barco.jpg"
 }
 else [
    imgElement.src="/imagem/erro.jpeg"
 ]

    