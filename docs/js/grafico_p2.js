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
    ctx.fillStyle = "#e6e6e6"; // Cor de fundo (pendente)
    ctx.fill();

    // Parte preenchida (Progresso)
    ctx.beginPath();
    ctx.moveTo(w / 2, h / 2);
    // Inicia em -90 graus (-Math.PI / 2) e desenha no sentido horário
    ctx.arc(w / 2, h / 2, r, -Math.PI / 2, angulo - Math.PI / 2, false);
    ctx.fillStyle = "#ff9900"; // Cor de preenchimento (progresso)
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
    // CORREÇÃO: Mudar a busca para o atributo 'data-group'
    const checkboxes = document.querySelectorAll(`input[data-group="${grupo}"]`); 

    const total = checkboxes.length;
    // Garante que só está contando inputs visíveis (se aplicável), mas a conversão [c.checked] é o essencial
    const marcados = [...checkboxes].filter(c => c.checked).length;

    const porcentagem = total === 0 ? 0 : Math.round((marcados / total) * 100);

    // CORREÇÃO: Mudar a busca para o ID do canvas no HTML
    const canvas = document.getElementById(`grafico_${grupo}`); 
    if (canvas) {
        const ctx = canvas.getContext("2d");
        criarGrafico(ctx, porcentagem);
    }
}

// Ouve qualquer alteração em todo o documento
document.addEventListener("change", (event) => {
    // Você só precisa rodar a atualização se o elemento alterado for um checkbox de gestão.
    // Isso é mais eficiente, mas manter a lógica simples de rodar ambos é seguro.
    atualizarProgresso("conteudo"); // Se você tiver um checklist 'conteudo'
    atualizarProgresso("gestao");
});

// Render inicial
window.onload = () => {
    atualizarProgresso("conteudo"); 
    atualizarProgresso("gestao");
};