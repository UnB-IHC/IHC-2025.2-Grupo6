// Arquivo: grafico_p2.js

// Função para criar gráfico circular simples (seu desenho)
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

    // Parte preenchida (Progresso)
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
function atualizarProgresso(grupo) {
    // CORREÇÃO ESSENCIAL: Buscar o atributo 'data-group'
    const checkboxes = document.querySelectorAll(`input[data-group="${grupo}"]`); 

    const total = checkboxes.length;
    const marcados = [...checkboxes].filter(c => c.checked).length;

    const porcentagem = total === 0 ? 0 : Math.round((marcados / total) * 100);

    const canvas = document.getElementById(`grafico_${grupo}`); 
    if (canvas) {
        const ctx = canvas.getContext("2d");
        criarGrafico(ctx, porcentagem);
    }
}

// Ouve qualquer alteração em todo o documento
document.addEventListener("change", (event) => {
    // Roda a atualização para o grupo 'gestao'
    atualizarProgresso("gestao");
    // (Apenas se você tiver um checklist 'conteudo' em outra parte da página)
    // atualizarProgresso("conteudo"); 
});

// Render inicial
window.onload = () => {
    // Roda a atualização inicial para o grupo 'gestao'
    atualizarProgresso("gestao"); 
    // (Apenas se você tiver um checklist 'conteudo' em outra parte da página)
    // atualizarProgresso("conteudo");
};