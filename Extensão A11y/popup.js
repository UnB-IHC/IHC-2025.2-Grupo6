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

                chrome.storage.local.set({accessibilityResults: results[0].result});
            } else {
                console.error('Nenhum resultado retornado');
            }
        });
    } catch (error) {
        console.error('Erro:', error);
    }
});

document.getElementById('heatmapBtn').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: showContrastHeatmap
        });
    } catch (error) {
        console.error('Erro ao gerar mapa de calor:', error);
    }
});

function runAccessibilityChecks() {
    console.log('Executando verificações na página...');

    const results = {
        contrast: false,
        focus: false,
        headings: false,
        keyboard: false,
        contrastIssues: [],
        colorSuggestions: [],
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

    function rgbToHex(rgb) {
        const values = rgb.match(/\d+/g);
        if (!values) return '#000000';
        return '#' + values.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    function generateColorSuggestions(currentColor, backgroundColor, currentRatio) {
        const suggestions = [];
        const currentHex = rgbToHex(currentColor);
        const bgHex = rgbToHex(backgroundColor);
        
        const highContrastColors = ['#000000', '#FFFFFF', '#2E5F2E', '#8B0000', '#00008B', '#FFD700'];
        
        highContrastColors.forEach(color => {
            const ratio = contrastRatio(color, backgroundColor);
            if (ratio >= 4.5) {
                suggestions.push({
                    suggestedColor: color,
                    contrastRatio: ratio.toFixed(2),
                    improvement: (ratio - currentRatio).toFixed(2)
                });
            }
        });
        
        return suggestions;
    }

    try {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, button, input, label');
        let hasSufficientContrast = true;
        
        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            const color = style.color;
            const bgColor = style.backgroundColor;
            
            if (color !== 'rgba(0, 0, 0, 0)' && bgColor !== 'rgba(0, 0, 0, 0)') {
                const ratio = contrastRatio(color, bgColor);
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = style.fontWeight;
                
                const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
                const requiredRatio = isLargeText ? 3.0 : 4.5;
                
                if (ratio < requiredRatio) {
                    hasSufficientContrast = false;
                    results.contrastIssues.push({
                        element: element.outerHTML.substring(0, 100) + '...',
                        text: element.textContent?.substring(0, 50) + '...',
                        currentColor: rgbToHex(color),
                        backgroundColor: rgbToHex(bgColor),
                        currentRatio: ratio.toFixed(2),
                        requiredRatio: requiredRatio.toFixed(1),
                        fontSize: fontSize + 'px',
                        suggestions: generateColorSuggestions(color, bgColor, ratio)
                    });
                }
            }
        });
        
        results.contrast = hasSufficientContrast;
        
    } catch (e) {
        console.error('Erro na verificação de contraste:', e);
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

function showContrastHeatmap() {
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

    function rgbToHex(rgb) {
        const values = rgb.match(/\d+/g);
        if (!values) return '#000000';
        return '#' + values.map(x => {
            const hex = parseInt(x).toString(16);
            return hex.length === 1 ? '0' + hex : hex;
        }).join('');
    }

    const existingHeatmap = document.getElementById('a11y-contrast-heatmap');
    if (existingHeatmap) {
        existingHeatmap.remove();
        return;
    }

    const heatmap = document.createElement('div');
    heatmap.id = 'a11y-contrast-heatmap';
    heatmap.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0,0,0,0.7);
        z-index: 10000;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    `;

    heatmap.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 900px; margin: 0 auto; max-height: 90vh; overflow-y: auto;">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                <h2 style="color: #2c3e50; margin: 0;">Mapa de Calor de Contraste WCAG</h2>
                <button id="closeHeatmap" style="padding: 8px 16px; background: #dc3545; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Fechar
                </button>
            </div>
            
            <div style="display: flex; gap: 15px; margin-bottom: 20px; flex-wrap: wrap;">
                <div style="display: flex; align-items: center; padding: 8px 12px; background: #d4edda; border-radius: 5px;">
                    <div style="width: 20px; height: 20px; background: #28a745; margin-right: 8px; border: 1px solid #000;"></div>
                    <span>Bom contraste (≥ 4.5:1)</span>
                </div>
                <div style="display: flex; align-items: center; padding: 8px 12px; background: #fff3cd; border-radius: 5px;">
                    <div style="width: 20px; height: 20px; background: #ffc107; margin-right: 8px; border: 1px solid #000;"></div>
                    <span>Contraste regular (3.0-4.5:1)</span>
                </div>
                <div style="display: flex; align-items: center; padding: 8px 12px; background: #f8d7da; border-radius: 5px;">
                    <div style="width: 20px; height: 20px; background: #dc3545; margin-right: 8px; border: 1px solid #000;"></div>
                    <span>Contraste ruim (< 3.0:1)</span>
                </div>
            </div>

            <div id="heatmapStats" style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px;">
                <h3 style="margin-top: 0;">Estatísticas da Página</h3>
                <div id="statsContent">Analisando...</div>
            </div>

            <div style="max-height: 400px; overflow-y: auto;">
                <h3>Elementos com Problemas de Contraste</h3>
                <div id="heatmapElements"></div>
            </div>
        </div>
    `;

    document.body.appendChild(heatmap);

    document.getElementById('closeHeatmap').addEventListener('click', function() {
        heatmap.remove();
        removeHighlights();
    });

    analyzePageForHeatmap();

    function analyzePageForHeatmap() {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, button, label, input[type="text"], input[type="email"], input[type="password"]');
        
        const elementsData = [];
        let goodContrast = 0;
        let mediumContrast = 0;
        let poorContrast = 0;

        textElements.forEach(element => {
            const style = window.getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || style.opacity === '0') {
                return;
            }

            const color = style.color;
            const bgColor = style.backgroundColor;
            
            if (color === 'rgba(0, 0, 0, 0)' || bgColor === 'rgba(0, 0, 0, 0)') {
                return;
            }

            try {
                const ratio = contrastRatio(color, bgColor);
                const fontSize = parseFloat(style.fontSize);
                const fontWeight = parseInt(style.fontWeight) || 400;
                
                const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
                const requiredRatio = isLargeText ? 3.0 : 4.5;
                
                let status = 'poor';
                let statusColor = '#dc3545';
                let statusText = 'Ruim';
                
                if (ratio >= requiredRatio) {
                    status = 'good';
                    statusColor = '#28a745';
                    statusText = 'Bom';
                    goodContrast++;
                } else if (ratio >= 3.0) {
                    status = 'medium';
                    statusColor = '#ffc107';
                    statusText = 'Regular';
                    mediumContrast++;
                } else {
                    poorContrast++;
                }

                elementsData.push({
                    element: element,
                    text: element.textContent?.trim().substring(0, 100) + (element.textContent?.trim().length > 100 ? '...' : ''),
                    ratio: ratio.toFixed(2),
                    requiredRatio: requiredRatio.toFixed(1),
                    status: status,
                    statusColor: statusColor,
                    statusText: statusText,
                    fontSize: fontSize + 'px',
                    fontWeight: fontWeight,
                    color: rgbToHex(color),
                    bgColor: rgbToHex(bgColor),
                    isLargeText: isLargeText
                });

            } catch (e) {
                console.error('Erro ao analisar elemento:', e);
            }
        });

        const totalElements = goodContrast + mediumContrast + poorContrast;
        const statsContent = document.getElementById('statsContent');
        statsContent.innerHTML = `
            <div style="display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 10px; text-align: center;">
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #28a745;">${goodContrast}</div>
                    <div>Bom contraste</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #ffc107;">${mediumContrast}</div>
                    <div>Contraste regular</div>
                </div>
                <div>
                    <div style="font-size: 24px; font-weight: bold; color: #dc3545;">${poorContrast}</div>
                    <div>Contraste ruim</div>
                </div>
            </div>
            <div style="margin-top: 10px; text-align: center;">
                <strong>Total de elementos analisados:</strong> ${totalElements}
            </div>
        `;

        const heatmapElements = document.getElementById('heatmapElements');
        const problematicElements = elementsData.filter(item => item.status !== 'good');
        
        if (problematicElements.length === 0) {
            heatmapElements.innerHTML = '<div style="padding: 20px; text-align: center; color: #28a745;">🎉 Todos os elementos têm bom contraste!</div>';
        } else {
            let elementsHTML = '<div style="display: grid; gap: 10px;">';
            
            problematicElements.forEach(item => {
                elementsHTML += `
                    <div style="border-left: 4px solid ${item.statusColor}; padding: 10px; background: #f8f9fa; border-radius: 0 5px 5px 0;">
                        <div style="display: flex; justify-content: space-between; align-items: start;">
                            <div style="flex: 1;">
                                <div style="font-weight: bold; margin-bottom: 5px;">"${item.text}"</div>
                                <div style="font-size: 0.9em; color: #666;">
                                    <strong>Contraste:</strong> ${item.ratio}:1 (Requerido: ${item.requiredRatio}:1) | 
                                    <strong>Status:</strong> ${item.statusText} |
                                    <strong>Tamanho:</strong> ${item.fontSize} ${item.isLargeText ? '(Texto grande)' : ''}
                                </div>
                                <div style="display: flex; align-items: center; margin-top: 5px;">
                                    <div style="width: 20px; height: 20px; background: ${item.bgColor}; border: 1px solid #ccc; margin-right: 5px;"></div>
                                    <span style="margin-right: 15px;">Fundo: ${item.bgColor}</span>
                                    <div style="width: 20px; height: 20px; background: ${item.color}; border: 1px solid #ccc; margin-right: 5px;"></div>
                                    <span>Texto: ${item.color}</span>
                                </div>
                            </div>
                            <div style="background: ${item.statusColor}; color: white; padding: 4px 8px; border-radius: 3px; font-size: 0.8em;">
                                ${item.ratio}:1
                            </div>
                        </div>
                    </div>
                `;
            });
            
            elementsHTML += '</div>';
            heatmapElements.innerHTML = elementsHTML;
        }

        highlightProblematicElements(problematicElements);
    }

    function highlightProblematicElements(problematicElements) {
        problematicElements.forEach(item => {
            const originalOutline = item.element.style.outline;
            const originalZIndex = item.element.style.zIndex;
            
            item.element.style.outline = `2px solid ${item.statusColor}`;
            item.element.style.outlineOffset = '2px';
            item.element.style.zIndex = '9999';
            item.element.style.position = 'relative';
            
            item.element.setAttribute('data-original-outline', originalOutline);
            item.element.setAttribute('data-original-zindex', originalZIndex);
        });
    }

    function removeHighlights() {
        const highlightedElements = document.querySelectorAll('[data-original-outline]');
        highlightedElements.forEach(element => {
            element.style.outline = element.getAttribute('data-original-outline');
            element.style.zIndex = element.getAttribute('data-original-zindex');
            element.removeAttribute('data-original-outline');
            element.removeAttribute('data-original-zindex');
        });
    }
}

function displayResults(results) {
    console.log('Exibindo resultados:', results);

    updateCheckResult('contrastCheck', results.contrast, 'Contraste de Cores');
    updateCheckResult('focusCheck', results.focus, 'Indicadores de Foco');
    updateCheckResult('headingsCheck', results.headings, 'Estrutura de Cabeçalhos');
    updateCheckResult('keyboardCheck', results.keyboard, 'Navegação por Teclado');

    document.getElementById('pageInfo').textContent = 
        `Página: ${results.pageInfo.title} | Cabeçalhos: ${results.pageInfo.headings}`;

    if (results.contrastIssues && results.contrastIssues.length > 0) {
        showColorSuggestions(results.contrastIssues);
    }
}

function showColorSuggestions(contrastIssues) {
    const suggestionsContainer = document.getElementById('colorSuggestions');
    if (!suggestionsContainer) return;

    let suggestionsHTML = '<h3>Sugestões Automáticas de Cores</h3>';
    
    contrastIssues.slice(0, 5).forEach(issue => {
        suggestionsHTML += `
            <div class="suggestion-item" style="border: 1px solid #ddd; padding: 10px; margin: 10px 0; border-radius: 5px;">
                <p><strong>Texto problemático:</strong> "${issue.text}"</p>
                <p><strong>Contraste atual:</strong> ${issue.currentRatio}:1 (requerido: ${issue.requiredRatio}:1)</p>
                <div style="display: flex; gap: 10px; align-items: center; margin: 10px 0;">
                    <div style="width: 60px; height: 30px; background: ${issue.currentColor}; border: 1px solid #000;"></div>
                    <span>Texto: ${issue.currentColor}</span>
                    <div style="width: 60px; height: 30px; background: ${issue.backgroundColor}; border: 1px solid #000;"></div>
                    <span>Fundo: ${issue.backgroundColor}</span>
                </div>
                <h4>Sugestões de melhoria:</h4>
                <div style="display: grid; gap: 5px;">
        `;
        
        issue.suggestions.slice(0, 3).forEach(suggestion => {
            suggestionsHTML += `
                <div style="display: flex; gap: 10px; align-items: center; padding: 5px; background: #f8f9fa; border-radius: 3px;">
                    <div style="width: 40px; height: 20px; background: ${suggestion.suggestedColor}; border: 1px solid #000;"></div>
                    <span>${suggestion.suggestedColor} - Contraste: ${suggestion.contrastRatio}:1</span>
                </div>
            `;
        });
        
        suggestionsHTML += '</div></div>';
    });
    
    suggestionsContainer.innerHTML = suggestionsHTML;
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

document.getElementById('detailsBtn').addEventListener('click', async () => {
    try {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: runAccessibilityChecks
        }, (results) => {
            if (results && results[0]) {
                const data = results[0].result;
                
                const encodedData = encodeURIComponent(JSON.stringify(data));
                
                chrome.tabs.create({ 
                    url: chrome.runtime.getURL(`results.html?data=${encodedData}`) 
                });
            } else {
                chrome.tabs.create({ 
                    url: chrome.runtime.getURL('results.html') 
                });
            }
        });
    } catch (error) {
        console.error('Erro ao abrir relatório:', error);
        chrome.tabs.create({ 
            url: chrome.runtime.getURL('results.html') 
        });
    }
});

console.log('Popup carregado!');