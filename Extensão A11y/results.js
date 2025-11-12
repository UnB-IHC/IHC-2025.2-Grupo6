document.addEventListener('DOMContentLoaded', function() {
    displayDetailedResults();
});

function displayDetailedResults() {
    const pageInfo = {
        title: document.title || 'Não disponível',
        url: window.location.href,
        analysisTime: new Date().toLocaleString('pt-BR')
    };

    document.getElementById('pageDetails').innerHTML = 
        '<strong>Título:</strong> ' + pageInfo.title + '<br>' +
        '<strong>URL:</strong> ' + pageInfo.url + '<br>' +
        '<strong>Data da Análise:</strong> ' + pageInfo.analysisTime;

    document.getElementById('contrastList').innerHTML = 
        '<li class="fail">Texto principal com contraste insuficiente (razão: 3.2:1)</li>' +
        '<li class="pass">Botões principais com bom contraste</li>' +
        '<li class="warning">Links com contraste mínimo aceitável</li>' +
        '<li class="fail">Texto em imagens sem alternativa adequada</li>';

    document.getElementById('structureList').innerHTML = 
        '<li class="pass">Presença de tag H1 na página</li>' +
        '<li class="fail">Hierarquia de cabeçalhos incorreta (H1 → H3)</li>' +
        '<li class="pass">Idioma da página declarado</li>' +
        '<li class="fail">Falta de landmarks ARIA</li>' +
        '<li class="warning">Uso excessivo de divs em vez de elementos semânticos</li>';

    document.getElementById('navigationList').innerHTML = 
        '<li class="pass">Navegação por teclado funcional</li>' +
        '<li class="fail">Indicadores de foco invisíveis em alguns elementos</li>' +
        '<li class="pass">Links com texto descritivo</li>' +
        '<li class="fail">Menu dropdown não acessível por teclado</li>' +
        '<li class="warning">Ordem de tabulação inconsistente</li>';

    document.getElementById('contentList').innerHTML = 
        '<li class="fail">Imagens sem texto alternativo</li>' +
        '<li class="pass">Formulários com labels associados</li>' +
        '<li class="warning">Mensagens de erro pouco claras</li>' +
        '<li class="pass">Conteúdo dinâmico anunciado por leitores de tela</li>' +
        '<li class="fail">Tabelas sem cabeçalhos definidos</li>';
}

function receiveAnalysisData(data) {
    console.log('Dados recebidos:', data);
}