// Função para criar gráfico circular simples
function criarGrafico(ctx, porcentagem) {
    const angulo = (porcentagem / 100) * 2 * Math.PI;
    const w = ctx.canvas.width;
    const h = ctx.canvas.height;
    const r = Math.min(w, h) / 2 - 10;

    ctx.clearRect(0, 0, w, h);

    // Fundo
    ctx.beginPath();
    ctx.arc(w / 2, h / 2, r, 0, 2 * Math.PI);
    ctx.fillStyle = "#e6e6e6";
    ctx.fill();

    // Parte preenchida
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    ctx.arc(w / 2, h / 2, r, -Math.PI / 2, angulo - Math.PI / 2, false);
    ctx.fillStyle = "#ff9900";
    ctx.fill();

    // Texto
    ctx.fillStyle = "#333";
    ctx.font = "bold 22px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(`${porcentagem}%`, w / 2, h / 2);
}

// Atualiza progresso geral de um checklist
function atualizarProgresso(prefixo) {
    const checkboxes = document.querySelectorAll(`input[data-prefix="${prefixo}"]`);

    const total = checkboxes.length;
    const marcados = [...checkboxes].filter(c => c.checked).length;

    const porcentagem = total === 0 ? 0 : Math.round((marcados / total) * 100);

    const canvas = document.getElementById(`grafico_${prefixo}`);
    if (canvas) {
        const ctx = canvas.getContext("2d");
        criarGrafico(ctx, porcentagem);
    }
}

// Ouve qualquer alteração
document.addEventListener("change", () => {
    atualizarProgresso("conteudo");
    atualizarProgresso("gestao");
});

// Render inicial
window.onload = () => {
    atualizarProgresso("conteudo");
    atualizarProgresso("gestao");
};
