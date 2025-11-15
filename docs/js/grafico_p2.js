// Função para criar gráfico circular
function criarGrafico(ctx, porcentagem) {
    const angulo = (porcentagem / 100) * 2 * Math.PI;

    const largura = ctx.canvas.width;
    const altura = ctx.canvas.height;
    const raio = Math.min(largura, altura) / 2 - 10;

    ctx.clearRect(0, 0, largura, altura);

    // Fundo do gráfico
    ctx.beginPath();
    ctx.arc(largura / 2, altura / 2, raio, 0, 2 * Math.PI);
    ctx.fillStyle = "#eeeeee";
    ctx.fill();

    // Parte preenchida
    ctx.beginPath();
    ctx.moveTo(largura / 2, altura / 2);
    ctx.arc(largura / 2, altura / 2, raio, -Math.PI / 2, angulo - Math.PI / 2, false);
    ctx.fillStyle = "#ffa500";
    ctx.fill();

    // Texto
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(porcentagem + "%", largura / 2, altura / 2);
}

// Função que atualiza os gráficos de acordo com o checklist
function atualizarGraficos(prefixo) {
    const checkboxes = document.querySelectorAll('input[data-level]');

    // AGORA ESTÁ CORRETO: prefixo vem DEPOIS (A + prefixo)
    const totalA = [...checkboxes].filter(c => c.dataset.level === "A" + prefixo).length;
    const marcadosA = [...checkboxes].filter(c => c.dataset.level === "A" + prefixo && c.checked).length;

    const totalAA = [...checkboxes].filter(c => c.dataset.level === "AA" + prefixo).length;
    const marcadosAA = [...checkboxes].filter(c => c.dataset.level === "AA" + prefixo && c.checked).length;

    const totalAAA = [...checkboxes].filter(c => c.dataset.level === "AAA" + prefixo).length;
    const marcadosAAA = [...checkboxes].filter(c => c.dataset.level === "AAA" + prefixo && c.checked).length;

    const porcentagemA = totalA === 0 ? 0 : Math.round((marcadosA / totalA) * 100);
    const porcentagemAA = totalAA === 0 ? 0 : Math.round((marcadosAA / totalAA) * 100);
    const porcentagemAAA = totalAAA === 0 ? 0 : Math.round((marcadosAAA / totalAAA) * 100);

    const canvasA = document.getElementById("graficoA" + prefixo);
    const canvasAA = document.getElementById("graficoAA" + prefixo);
    const canvasAAA = document.getElementById("graficoAAA" + prefixo);

    if (canvasA) criarGrafico(canvasA.getContext("2d"), porcentagemA);
    if (canvasAA) criarGrafico(canvasAA.getContext("2d"), porcentagemAA);
    if (canvasAAA) criarGrafico(canvasAAA.getContext("2d"), porcentagemAAA);
}

// Atualiza ao clicar em qualquer checkbox
document.addEventListener("change", function () {
    atualizarGraficos("conteudo");
    atualizarGraficos("gestao");
});

// Render inicial ao carregar
window.onload = function () {
    atualizarGraficos("conteudo");
    atualizarGraficos("gestao");
};
