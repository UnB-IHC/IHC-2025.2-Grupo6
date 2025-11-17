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

    function normalizeColor(color) {
        if (!color) return null;
        const span = document.createElement('span');
        span.style.color = color;
        span.style.display = 'none';
        document.documentElement.appendChild(span);
        const computed = getComputedStyle(span).color;
        document.documentElement.removeChild(span);
        const nums = computed.match(/\d+(\.\d+)?/g);
        if (!nums || nums.length < 3) return null;
        return `rgb(${parseInt(nums[0])}, ${parseInt(nums[1])}, ${parseInt(nums[2])})`;
    }

    function rgbToHex(rgb) {
        if (!rgb) return '#000000';
        const nums = rgb.match(/\d+/g);
        if (!nums || nums.length < 3) return '#000000';
        return '#' + nums.slice(0,3).map(x => {
            const h = parseInt(x).toString(16);
            return h.length === 1 ? '0' + h : h;
        }).join('');
    }

    function getEffectiveBackgroundColor(element) {
        let el = element;
        while (el && el !== document) {
            const style = getComputedStyle(el);
            const bg = style.backgroundColor;
            if (bg && bg !== 'transparent' && !(bg === 'rgba(0, 0, 0, 0)')) {
                return normalizeColor(bg);
            }
            el = el.parentElement;
        }
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') {
            return normalizeColor(bodyBg);
        }
        const docBg = getComputedStyle(document.documentElement).backgroundColor;
        if (docBg && docBg !== 'transparent' && docBg !== 'rgba(0, 0, 0, 0)') {
            return normalizeColor(docBg);
        }
        return 'rgb(255, 255, 255)';
    }

    function getLuminance(rgb) {
        if (!rgb) return 0;
        const nums = rgb.match(/\d+/g);
        if (!nums || nums.length < 3) return 0;
        const [r, g, b] = nums.slice(0,3).map(v => parseInt(v) / 255);
        function comp(c) {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        }
        return 0.2126 * comp(r) + 0.7152 * comp(g) + 0.0722 * comp(b);
    }

    function contrastRatio(color1, color2) {
        const L1 = getLuminance(color1);
        const L2 = getLuminance(color2);
        const light = Math.max(L1, L2);
        const dark = Math.min(L1, L2);
        return (light + 0.05) / (dark + 0.05);
    }

    function generateColorSuggestions(currentColor, backgroundColor, currentRatio) {
        const suggestions = [];
        const highContrastColors = ['#000000', '#FFFFFF', '#1a1a1a', '#ffffff', '#003366', '#990000', '#003300', '#ffd700'];
        const bgNorm = normalizeColor(backgroundColor);
        highContrastColors.forEach(hex => {
            const rgb = normalizeColor(hex);
            if (!rgb) return;
            const ratio = contrastRatio(rgb, bgNorm);
            if (ratio >= 4.5) {
                suggestions.push({
                    suggestedColor: hex,
                    contrastRatio: ratio.toFixed(2),
                    improvement: (ratio - currentRatio).toFixed(2)
                });
            }
        });
        return suggestions;
    }

    try {
        const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, button, input, label, small, strong');
        let hasSufficientContrast = true;

        textElements.forEach(element => {
            try {
                const style = window.getComputedStyle(element);

                if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;
                if (!element.offsetParent && style.position !== 'fixed') return;

                const textContent = (element.textContent || '').trim();
                if (!textContent) return;

                const foreground = normalizeColor(style.color);
                const background = getEffectiveBackgroundColor(element);
                if (!foreground || !background) return;

                const ratio = contrastRatio(foreground, background);
                const fontSize = parseFloat(style.fontSize) || 16;
                let fontWeight = style.fontWeight;
                if (fontWeight === 'normal') fontWeight = 400;
                if (fontWeight === 'bold') fontWeight = 700;
                fontWeight = parseInt(fontWeight) || 400;

                const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
                const requiredRatio = isLargeText ? 3.0 : 4.5;

                if (ratio < requiredRatio) {
                    hasSufficientContrast = false;
                    results.contrastIssues.push({
                        element: element.outerHTML.substring(0, 200) + (element.outerHTML.length > 200 ? '...' : ''),
                        text: textContent.substring(0, 200) + (textContent.length > 200 ? '...' : ''),
                        currentColor: rgbToHex(foreground),
                        backgroundColor: rgbToHex(background),
                        currentRatio: ratio.toFixed(2),
                        requiredRatio: requiredRatio.toFixed(1),
                        fontSize: fontSize + 'px',
                        suggestions: generateColorSuggestions(foreground, background, ratio)
                    });
                }
            } catch (innerErr) {
                console.error('Erro ao processar elemento:', innerErr);
            }
        });

        results.contrast = hasSufficientContrast;

    } catch (e) {
        console.error('Erro na verificação de contraste:', e);
        results.contrast = false;
    }

    try {
        const focusableElements = document.querySelectorAll('a[href], button, input, textarea, select, [tabindex]:not([tabindex="-1"])');
        results.focus = Array.from(focusableElements).some(el => {
            const style = getComputedStyle(el);
            return !(style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0);
        });
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
    function normalizeColor(color) {
        if (!color) return null;
        const span = document.createElement('span');
        span.style.color = color;
        span.style.display = 'none';
        document.documentElement.appendChild(span);
        const computed = getComputedStyle(span).color;
        document.documentElement.removeChild(span);
        const nums = computed.match(/\d+(\.\d+)?/g);
        if (!nums || nums.length < 3) return null;
        return `rgb(${parseInt(nums[0])}, ${parseInt(nums[1])}, ${parseInt(nums[2])})`;
    }
    function rgbToHex(rgb) {
        if (!rgb) return '#000000';
        const nums = rgb.match(/\d+/g);
        if (!nums || nums.length < 3) return '#000000';
        return '#' + nums.slice(0,3).map(x => {
            const h = parseInt(x).toString(16);
            return h.length === 1 ? '0' + h : h;
        }).join('');
    }
    function getEffectiveBackgroundColor(element) {
        let el = element;
        while (el && el !== document) {
            const style = getComputedStyle(el);
            const bg = style.backgroundColor;
            if (bg && bg !== 'transparent' && !(bg === 'rgba(0, 0, 0, 0)')) {
                return normalizeColor(bg);
            }
            el = el.parentElement;
        }
        const bodyBg = getComputedStyle(document.body).backgroundColor;
        if (bodyBg && bodyBg !== 'transparent' && bodyBg !== 'rgba(0, 0, 0, 0)') return normalizeColor(bodyBg);
        const docBg = getComputedStyle(document.documentElement).backgroundColor;
        if (docBg && docBg !== 'transparent' && docBg !== 'rgba(0, 0, 0, 0)') return normalizeColor(docBg);
        return 'rgb(255, 255, 255)';
    }
    function getLuminance(rgb) {
        if (!rgb) return 0;
        const nums = rgb.match(/\d+/g);
        if (!nums || nums.length < 3) return 0;
        const [r, g, b] = nums.slice(0,3).map(v => parseInt(v) / 255);
        function comp(c) { return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4); }
        return 0.2126 * comp(r) + 0.7152 * comp(g) + 0.0722 * comp(b);
    }
    function contrastRatio(c1, c2) {
        const L1 = getLuminance(c1);
        const L2 = getLuminance(c2);
        const light = Math.max(L1, L2);
        const dark = Math.min(L1, L2);
        return (light + 0.05) / (dark + 0.05);
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
        background: rgba(0,0,0,0.65);
        z-index: 100000;
        overflow-y: auto;
        padding: 20px;
        box-sizing: border-box;
        font-family: Arial, sans-serif;
    `;

    heatmap.innerHTML = `
        <div style="background: white; padding: 20px; border-radius: 10px; max-width: 1000px; margin: 0 auto; max-height: 90vh; overflow-y: auto;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 16px;">
                <h2 style="margin:0;">Mapa de Calor de Contraste WCAG</h2>
                <button id="closeHeatmap" style="padding:8px 12px; background:#dc3545; color:white; border:none; border-radius:6px; cursor:pointer;">Fechar</button>
            </div>
            <div id="heatmapStats" style="background:#f8f9fa; padding:12px; border-radius:6px; margin-bottom:16px;">
                <div id="statsContent">Analisando...</div>
            </div>
            <div id="heatmapElements"></div>
        </div>
    `;

    document.body.appendChild(heatmap);
    document.getElementById('closeHeatmap').addEventListener('click', function() {
        heatmap.remove();
        removeHighlights();
    });

    const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, a, li, td, th, button, label, input[type="text"], input[type="email"], input[type="password"]');
    const elementsData = [];
    let goodContrast = 0, mediumContrast = 0, poorContrast = 0;

    textElements.forEach(element => {
        try {
            const style = getComputedStyle(element);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0) return;
            const text = (element.textContent || '').trim();
            if (!text) return;

            const fg = normalizeColor(style.color);
            const bg = getEffectiveBackgroundColor(element);
            if (!fg || !bg) return;

            const ratio = contrastRatio(fg, bg);
            const fontSize = parseFloat(style.fontSize) || 16;
            let fontWeight = style.fontWeight;
            if (fontWeight === 'normal') fontWeight = 400;
            if (fontWeight === 'bold') fontWeight = 700;
            fontWeight = parseInt(fontWeight) || 400;
            const isLargeText = fontSize >= 18 || (fontSize >= 14 && fontWeight >= 700);
            const requiredRatio = isLargeText ? 3.0 : 4.5;

            let status = 'poor', statusColor = '#dc3545', statusText = 'Ruim';
            if (ratio >= requiredRatio) {
                status = 'good'; statusColor = '#28a745'; statusText = 'Bom'; goodContrast++;
            } else if (ratio >= 3.0) {
                status = 'medium'; statusColor = '#ffc107'; statusText = 'Regular'; mediumContrast++;
            } else {
                poorContrast++;
            }

            elementsData.push({
                element,
                text: text.substring(0, 120) + (text.length > 120 ? '...' : ''),
                ratio: ratio.toFixed(2),
                requiredRatio: requiredRatio.toFixed(1),
                status,
                statusColor,
                statusText,
                fontSize: fontSize + 'px',
                color: rgbToHex(fg),
                bgColor: rgbToHex(bg),
                isLargeText
            });
        } catch (err) {
            console.error('Erro ao analisar elemento para heatmap:', err);
        }
    });

    const totalElements = goodContrast + mediumContrast + poorContrast;
    const statsContent = document.getElementById('statsContent');
    statsContent.innerHTML = `
        <div style="display:grid; grid-template-columns: repeat(3,1fr); gap:8px; text-align:center;">
            <div><div style="font-size:20px; font-weight:700; color:#28a745;">${goodContrast}</div><div>Bom contraste</div></div>
            <div><div style="font-size:20px; font-weight:700; color:#ffc107;">${mediumContrast}</div><div>Contraste regular</div></div>
            <div><div style="font-size:20px; font-weight:700; color:#dc3545;">${poorContrast}</div><div>Contraste ruim</div></div>
        </div>
        <div style="margin-top:8px; text-align:center;"><strong>Total analisado:</strong> ${totalElements}</div>
    `;

    const heatmapElements = document.getElementById('heatmapElements');
    const problematic = elementsData.filter(i => i.status !== 'good');

    if (problematic.length === 0) {
        heatmapElements.innerHTML = '<div style="padding:20px; text-align:center; color:#28a745;">Todos os elementos têm bom contraste.</div>';
    } else {
        let html = '<div style="display:grid; gap:10px;">';
        problematic.forEach(item => {
            html += `
                <div style="background:#fff; padding:12px; border-radius:8px; border-left:6px solid ${item.statusColor}; display:flex; justify-content:space-between; gap:10px;">
                    <div style="flex:1;">
                        <div style="font-weight:700; margin-bottom:6px;">"${item.text}"</div>
                        <div style="font-size:0.9em; color:#555;">
                            <strong>Contraste:</strong> ${item.ratio}:1 (Requer: ${item.requiredRatio}:1) • <strong>Tamanho:</strong> ${item.fontSize} ${item.isLargeText ? '(grande)' : ''}
                        </div>
                        <div style="display:flex; gap:8px; align-items:center; margin-top:8px;">
                            <div style="width:36px; height:24px; background:${item.bgColor}; border:1px solid #ccc;"></div>
                            <span>Fundo: ${item.bgColor}</span>
                            <div style="width:36px; height:24px; background:${item.color}; border:1px solid #ccc; margin-left:12px;"></div>
                            <span>Texto: ${item.color}</span>
                        </div>
                    </div>
                    <div style="align-self:flex-start; background:${item.statusColor}; color:white; padding:6px 8px; border-radius:6px; font-weight:700;">
                        ${item.ratio}:1
                    </div>
                </div>
            `;
        });
        html += '</div>';
        heatmapElements.innerHTML = html;
        highlightProblematicElements(problematic);
    }

    function highlightProblematicElements(items) {
        items.forEach(it => {
            try {
                const el = it.element;
                const prevOutline = el.style.outline || '';
                const prevZ = el.style.zIndex || '';
                el.setAttribute('data-a11y-prev-outline', prevOutline);
                el.setAttribute('data-a11y-prev-z', prevZ);
                el.style.outline = `3px solid ${it.statusColor}`;
                el.style.outlineOffset = '3px';
                el.style.zIndex = '99999';
                if (getComputedStyle(el).position === 'static') {
                    el.style.position = 'relative';
                }
            } catch (e) {
                console.error('Erro ao destacar elemento:', e);
            }
        });
    }

    function removeHighlights() {
        const highlighted = document.querySelectorAll('[data-a11y-prev-outline]');
        highlighted.forEach(el => {
            el.style.outline = el.getAttribute('data-a11y-prev-outline') || '';
            el.style.zIndex = el.getAttribute('data-a11y-prev-z') || '';
            el.removeAttribute('data-a11y-prev-outline');
            el.removeAttribute('data-a11y-prev-z');
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

    const suggestionsContainer = document.getElementById('colorSuggestions');
    if (results.contrastIssues && results.contrastIssues.length > 0) {
        showColorSuggestions(results.contrastIssues);
    } else if (suggestionsContainer) {
        suggestionsContainer.innerHTML = '';
    }
}

function showColorSuggestions(contrastIssues) {
    const suggestionsContainer = document.getElementById('colorSuggestions');
    if (!suggestionsContainer) return;

    let suggestionsHTML = '<h3>Sugestões Automáticas de Cores</h3>';
    
    contrastIssues.slice(0, 6).forEach(issue => {
        suggestionsHTML += `
            <div class="suggestion-item" style="border:1px solid #ddd; padding:10px; margin:10px 0; border-radius:6px;">
                <p><strong>Texto problemático:</strong> "${issue.text}"</p>
                <p><strong>Contraste atual:</strong> ${issue.currentRatio}:1 (requerido: ${issue.requiredRatio}:1)</p>
                <div style="display:flex; gap:10px; align-items:center; margin:8px 0;">
                    <div style="width:60px; height:30px; background:${issue.currentColor}; border:1px solid #000;"></div>
                    <span>Texto: ${issue.currentColor}</span>
                    <div style="width:60px; height:30px; background:${issue.backgroundColor}; border:1px solid #000; margin-left:10px;"></div>
                    <span>Fundo: ${issue.backgroundColor}</span>
                </div>
                <h4>Sugestões:</h4>
                <div style="display:grid; gap:6px;">
        `;
        
        issue.suggestions.slice(0, 4).forEach(suggestion => {
            suggestionsHTML += `
                <div style="display:flex; gap:10px; align-items:center; padding:6px; background:#f8f9fa; border-radius:4px;">
                    <div style="width:40px; height:20px; background:${suggestion.suggestedColor}; border:1px solid #000;"></div>
                    <span>${suggestion.suggestedColor} — Contraste: ${suggestion.contrastRatio}:1 (melhora: ${suggestion.improvement})</span>
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