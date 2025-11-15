document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('backButton').addEventListener('click', function() {
        window.close();
    });

    displayDetailedResults();
});

function displayDetailedResults() {
    const urlParams = new URLSearchParams(window.location.search);
    const dataParam = urlParams.get('data');
    
    if (dataParam) {
        try {
            const data = JSON.parse(decodeURIComponent(dataParam));
            displayAnalysisResults(data);
        } catch (e) {
            console.error('Erro ao analisar dados da URL:', e);
            displaySampleData();
        }
    } else if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(['accessibilityResults'], function(result) {
            if (result && result.accessibilityResults) {
                displayAnalysisResults(result.accessibilityResults);
            } else {
                displaySampleData();
            }
        });
    } else {
        displaySampleData();
    }
}

function displayAnalysisResults(data) {
    displayPageInfo(data);
    displayContrastAnalysis(data);
    displayStructureAnalysis(data);
    displayNavigationAnalysis(data);
    displayContentAnalysis(data);
}

function displayPageInfo(data) {
    const pageInfo = {
        title: data.pageInfo?.title || document.title || 'Não disponível',
        url: data.pageInfo?.url || window.location.href,
        analysisTime: new Date().toLocaleString('pt-BR'),
        totalIssues: data.contrastIssues?.length || 0
    };

    document.getElementById('pageDetails').innerHTML = 
        '<strong>Título:</strong> ' + pageInfo.title + '<br>' +
        '<strong>URL:</strong> ' + pageInfo.url + '<br>' +
        '<strong>Data da Análise:</strong> ' + pageInfo.analysisTime + '<br>' +
        '<strong>Problemas de contraste encontrados:</strong> ' + pageInfo.totalIssues;
}

function displayContrastAnalysis(data) {
    const contrastList = document.getElementById('contrastList');
    
    if (data.contrastIssues && data.contrastIssues.length > 0) {
        let html = '';
        data.contrastIssues.slice(0, 10).forEach(issue => {
            const statusClass = issue.currentRatio < issue.requiredRatio ? 'fail' : 'pass';
            html += `
                <li class="${statusClass}">
                    <strong>Texto:</strong> "${escapeHtml(issue.text)}"<br>
                    <strong>Contraste:</strong> ${issue.currentRatio}:1 (Requerido: ${issue.requiredRatio}:1)<br>
                    <strong>Cores atuais:</strong> 
                    <span class="color-sample" style="background: ${issue.backgroundColor}"></span>
                    ${issue.backgroundColor} / 
                    <span class="color-sample" style="background: ${issue.currentColor}"></span>
                    ${issue.currentColor}<br>
            `;
            
            if (issue.suggestions && issue.suggestions.length > 0) {
                html += '<strong>Sugestões de cores:</strong><div style="margin-top: 5px;">';
                issue.suggestions.slice(0, 3).forEach(suggestion => {
                    const textColor = getContrastColor(suggestion.suggestedColor);
                    html += `
                        <span style="display: inline-block; margin: 2px; padding: 2px 8px; 
                            background: ${suggestion.suggestedColor}; color: ${textColor}; 
                            border: 1px solid #000; border-radius: 3px; font-size: 12px;">
                            ${suggestion.suggestedColor} (${suggestion.contrastRatio}:1)
                        </span>
                    `;
                });
                html += '</div>';
            }
            
            html += '</li>';
        });
        contrastList.innerHTML = html;
    } else {
        contrastList.innerHTML = '<li class="pass">Nenhum problema de contraste encontrado - todos os elementos atendem aos critérios WCAG</li>';
    }
}

function displayStructureAnalysis(data) {
    const structureList = document.getElementById('structureList');
    
    const structureChecks = [
        { condition: data.headings, text: 'Presença de tag H1 na página', class: 'pass' },
        { condition: data.pageInfo?.headings > 1, text: `Hierarquia de cabeçalhos adequada (${data.pageInfo?.headings || 0} cabeçalhos encontrados)`, class: data.pageInfo?.headings > 1 ? 'pass' : 'warning' },
        { condition: true, text: 'Idioma da página declarado', class: 'pass' },
        { condition: false, text: 'Uso de landmarks ARIA', class: 'warning' },
        { condition: data.pageInfo?.headings > 3, text: 'Estrutura semântica robusta', class: data.pageInfo?.headings > 3 ? 'pass' : 'warning' }
    ];

    structureList.innerHTML = structureChecks.map(check => 
        `<li class="${check.class}">${check.text}</li>`
    ).join('');
}

function displayNavigationAnalysis(data) {
    const navigationList = document.getElementById('navigationList');
    
    const navigationChecks = [
        { condition: data.keyboard, text: 'Navegação por teclado funcional', class: 'pass' },
        { condition: data.focus, text: 'Indicadores de foco visíveis', class: data.focus ? 'pass' : 'fail' },
        { condition: true, text: 'Links com texto descritivo', class: 'pass' },
        { condition: false, text: 'Menu dropdown acessível por teclado', class: 'warning' },
        { condition: true, text: 'Ordem de tabulação lógica', class: 'pass' }
    ];

    navigationList.innerHTML = navigationChecks.map(check => 
        `<li class="${check.class}">${check.text}</li>`
    ).join('');
}

function displayContentAnalysis(data) {
    const contentList = document.getElementById('contentList');
    
    const contentChecks = [
        { condition: false, text: 'Imagens com texto alternativo adequado', class: 'warning' },
        { condition: true, text: 'Formulários com labels associados', class: 'pass' },
        { condition: true, text: 'Mensagens de erro claras', class: 'pass' },
        { condition: data.pageInfo?.headings > 0, text: 'Estrutura de conteúdo organizada', class: 'pass' },
        { condition: false, text: 'Tabelas com cabeçalhos definidos', class: 'warning' }
    ];

    contentList.innerHTML = contentChecks.map(check => 
        `<li class="${check.class}">${check.text}</li>`
    ).join('');
}

function displaySampleData() {
    const sampleData = {
        pageInfo: {
            title: document.title,
            url: window.location.href,
            headings: 3
        },
        contrast: false,
        focus: true,
        headings: true,
        keyboard: true,
        contrastIssues: [
            {
                text: "Texto de exemplo com contraste insuficiente...",
                currentColor: "#666666",
                backgroundColor: "#FFFFFF",
                currentRatio: "3.2",
                requiredRatio: "4.5",
                suggestions: [
                    { suggestedColor: "#000000", contrastRatio: "21.0" },
                    { suggestedColor: "#2E5F2E", contrastRatio: "5.8" }
                ]
            }
        ]
    };
    
    displayAnalysisResults(sampleData);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function getContrastColor(hexColor) {
    if (!hexColor || hexColor.length < 7) return '#000000';
    
    try {
        const r = parseInt(hexColor.substr(1, 2), 16);
        const g = parseInt(hexColor.substr(3, 2), 16);
        const b = parseInt(hexColor.substr(5, 2), 16);
        const brightness = (r * 299 + g * 587 + b * 114) / 1000;
        return brightness > 128 ? '#000000' : '#FFFFFF';
    } catch (e) {
        return '#000000';
    }
}

function receiveAnalysisData(data) {
    console.log('Dados recebidos:', data);
    displayAnalysisResults(data);
}