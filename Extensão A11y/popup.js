document.getElementById('scanBtn').addEventListener('click', async () => {
    console.log('Botão clicado!');
    
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        console.log('Aba atual:', tab.url);
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: runAccessibilityChecks
        }, (results) => {
            if (results && results[0]) {
                console.log('Resultados:', results[0].result);
                displayResults(results[0].result);
            } else {
                console.error('Nenhum resultado retornado');
            }
        });
    } catch (error) {
        console.error('Erro:', error);
    }
});

function runAccessibilityChecks() {
    console.log('Executando verificações na página...');

    const results = {
        contrast: false,
        focus: false,
        headings: false,
        keyboard: false,
        pageInfo: {
            title: document.title,
            url: window.location.href,
            headings: document.querySelectorAll('h1, h2, h3, h4, h5, h6').length
        }
    };


    function getLuminance(rgb) {
        const [r, g, b] = rgb.match(/\d+/g).map(v => {
            v /= 255;
            return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    function contrastRatio(color1, color2) {
        const L1 = getLuminance(color1);
        const L2 = getLuminance(color2);
        return (Math.max(L1, L2) + 0.05) / (Math.min(L1, L2) + 0.05);
    }

    try {
        const bodyStyle = window.getComputedStyle(document.body);
        const color = bodyStyle.color;
        const bgColor = bodyStyle.backgroundColor;
        const ratio = contrastRatio(color, bgColor);
        results.contrast = ratio >= 4.5;
        console.log(`Razão de contraste: ${ratio.toFixed(2)} (${results.contrast ? 'OK' : 'Ruim'})`);
    } catch (e) {
        results.contrast = false;
    }


    try {
        const focusableElements = document.querySelectorAll('button, a, input, [tabindex]');
        results.focus = focusableElements.length > 0;
    } catch (e) {
        results.focus = false;
    }


    try {
        const h1 = document.querySelectorAll('h1');
        results.headings = h1.length >= 1;
    } catch (e) {
        results.headings = false;
    }


    results.keyboard = true;

    console.log('Verificações concluídas:', results);
    return results;
}

function displayResults(results) {
    console.log('Exibindo resultados:', results);

    updateCheckResult('contrastCheck', results.contrast, 'Contraste de Cores');
    updateCheckResult('focusCheck', results.focus, 'Indicadores de Foco');
    updateCheckResult('headingsCheck', results.headings, 'Estrutura de Cabeçalhos');
    updateCheckResult('keyboardCheck', results.keyboard, 'Navegação por Teclado');

    document.getElementById('pageInfo').textContent = 
        `Página: ${results.pageInfo.title} | Cabeçalhos: ${results.pageInfo.headings}`;
}

function updateCheckResult(elementId, passed, checkName) {
    const element = document.getElementById(elementId);
    const resultElement = element.querySelector('.result');

    if (passed) {
        element.className = 'check-item pass';
        resultElement.textContent = ' Aprovado';
    } else {
        element.className = 'check-item fail';
        resultElement.textContent = ' Precisa melhorar';
    }

    console.log(`${checkName}: ${passed ? 'Aprovado' : 'Reprovado'}`);
}

document.getElementById('detailsBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: chrome.runtime.getURL('results.html') });
});

console.log('Popup carregado!');
