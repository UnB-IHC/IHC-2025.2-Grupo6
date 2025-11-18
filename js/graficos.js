// graficos.js

// Função para desenhar gráfico de pizza
function desenharGrafico(canvasId, porcentagem, cor) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.error('Canvas não encontrado:', canvasId);
        return;
    }
    
    const ctx = canvas.getContext('2d');
    const centroX = canvas.width / 2;
    const centroY = canvas.height / 2;
    const raio = Math.min(centroX, centroY) - 10;
    
    // Limpa o canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Desenha o fundo (parte não preenchida)
    ctx.beginPath();
    ctx.arc(centroX, centroY, raio, 0, 2 * Math.PI);
    ctx.fillStyle = '#f0f0f0';
    ctx.fill();
    
    // Desenha a parte preenchida
    if (porcentagem > 0) {
        const angulo = (porcentagem / 100) * 2 * Math.PI;
        ctx.beginPath();
        ctx.moveTo(centroX, centroY);
        ctx.arc(centroX, centroY, raio, -0.5 * Math.PI, angulo - 0.5 * Math.PI);
        ctx.closePath();
        ctx.fillStyle = cor;
        ctx.fill();
    }
    
    // Texto da porcentagem
    ctx.fillStyle = '#333';
    ctx.font = 'bold 20px Arial';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(porcentagem + '%', centroX, centroY);
}

// Função para calcular porcentagem baseada no data-level
function calcularPorcentagem(level) {
    const seletor = `input[data-level="${level}"]`;
    const checkboxes = document.querySelectorAll(seletor);
    console.log(`Checkboxes ${level}:`, checkboxes.length);
    
    if (checkboxes.length === 0) return 0;
    
    const checked = document.querySelectorAll(seletor + ':checked');
    const porcentagem = Math.round((checked.length / checkboxes.length) * 100);
    
    console.log(`${level} - ${checked.length}/${checkboxes.length} = ${porcentagem}%`);
    return porcentagem;
}

// Função para atualizar todos os gráficos
function atualizarGraficos() {
    // Calcula porcentagens para cada nível usando data-level
    const porcentagemA = calcularPorcentagem('Adev');
    const porcentagemAA = calcularPorcentagem('AAdev');
    const porcentagemAAA = calcularPorcentagem('AAAdev');
    
    console.log('Porcentagens finais:', { A: porcentagemA, AA: porcentagemAA, AAA: porcentagemAAA });
    
    // Desenha os gráficos
    desenharGrafico('graficoAdev', porcentagemA, '#FF9800');
    desenharGrafico('graficoAAdev', porcentagemAA, '#FF9800');
    desenharGrafico('graficoAAAdev', porcentagemAAA, '#FF9800');
}

// Inicialização
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM carregado - Iniciando gráficos...');
    
    // Adiciona eventos a TODOS os checkboxes com data-level
    const checkboxes = document.querySelectorAll('input[data-level]');
    console.log('Checkboxes com data-level encontrados:', checkboxes.length);
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', atualizarGraficos);
    });
    
    // Desenha os gráficos pela primeira vez
    setTimeout(atualizarGraficos, 500);
});

// Também executa quando a página terminar de carregar
window.addEventListener('load', function() {
    console.log('Página carregada - Atualizando gráficos...');
    setTimeout(atualizarGraficos, 1000);
});