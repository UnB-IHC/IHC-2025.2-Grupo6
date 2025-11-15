<h2>Gestão de Projeto</h2>

<p>
Esta seção apresenta recomendações para integrar acessibilidade desde a fase inicial de um projeto, passando pelo planejamento, definição de requisitos, gestão de cronograma e organização das equipes.
É destinada a gestores de projeto, líderes técnicos, product owners, scrum masters, analistas de requisitos e stakeholders.
</p>

<h3>Por que é importante?</h3>

<p>
A acessibilidade não deve ser tratada como etapa final ou opcional.
Planejar desde o começo reduz custos, evita retrabalho, aumenta a qualidade geral do produto, melhora a experiência de todos os usuários e garante conformidade com normas e legislações.
</p>

<hr>

<!-- GRÁFICOS -->
<div class="progress-sidebar" style="display: flex; flex-direction: row; gap: 40px; justify-content:center;">
    <div style="text-align: center;">
        <h3>Nível A</h3>
        <canvas id="graficoAgestao" width="200" height="200"></canvas>
    </div>
    <div style="text-align: center;">
        <h3>Nível AA</h3>
        <canvas id="graficoAAGestao" width="200" height="200"></canvas>
    </div>
    <div style="text-align: center;">
        <h3>Nível AAA</h3>
        <canvas id="graficoAAAGestao" width="200" height="200"></canvas>
    </div>
</div>

<hr>

<!-- CHECKLIST DE GESTÃO DE PROJETO -->

<h3>Gestão Técnica</h3>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    Personas incluem usuários com deficiência visual (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    Personas incluem usuários com deficiência física (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    Personas incluem usuários com deficiência auditiva (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    Personas contemplam perfis neurodiversos (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    A equipe conhece e aplica WCAG níveis A e AA (A). 
    [<a href="#ref3">WCAG 2.2</a>]
</label>

<hr>

<h3>Conscientização</h3>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    A equipe possui conhecimento sobre estatísticas globais de PCDs (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    A equipe conhece dados nacionais (IBGE) (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    A equipe entende tipos de deficiência: congênita, adquirida, hereditária ou temporária (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    A equipe tem conhecimento sobre custos, tempo e impacto de implementar acessibilidade (A). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="Agestao">
    A equipe conhece legislações aplicáveis (ONU, Portaria 3/2007) (A). 
    [<a href="#ref4">ONU</a>] [<a href="#ref5">Portaria 3/2007</a>]
</label>

<hr>

<h3>Planejamento</h3>

<label class="criterio">
    <input type="checkbox" data-level="AAgestao">
    Cronograma considera atividades e responsáveis de acessibilidade (AA). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="AAgestao">
    Recursos definidos (equipe, ferramentas, capacitação) (AA). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<label class="criterio">
    <input type="checkbox" data-level="AAgestao">
    Planejamento considera necessidades de diferentes deficiências (AA). 
    [<a href="#ref1">Guia UK-BR</a>]
</label>

<hr><hr>

<h2>Referências</h2>

<p id="ref1">[1] DINIZ, V. et al. Guia de Boas Práticas para Acessibilidade Digital — UK-BR (2023). Disponível em: 
<a target="_blank" href="https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/guiaboaspraaticasparaacessibilidadedigital.pdf">link</a>.
</p>

<p id="ref2">[2] ABNT. NBR 17225 — Acessibilidade Digital (2023). Disponível em: 
<a target="_blank" href="https://mwpt.com.br/wp-content/uploads/2025/04/ABNT-NBR-17225-Acessibilidade-Digital.pdf">link</a>.
</p>

<p id="ref3">[3] W3C. Web Content Accessibility Guidelines (WCAG) 2.2. Disponível em:
<a target="_blank" href="https://www.w3c.br/traducoes/wcag/wcag22-pt-BR/">link</a>.
</p>

<p id="ref4">[4] ONU. Convenção sobre os Direitos das Pessoas com Deficiência. Disponível em:
<a target="_blank" href="https://www.un.org/disabilities/documents/convention/convoptprot-e.pdf">link</a>.
</p>

<p id="ref5">[5] BRASIL. Portaria nº 3, de 7 de maio de 2007. Disponível em:
<a target="_blank" href="https://www.gov.br/secretariageral/pt-br/estrutura/secretaria-executiva/secretaria-de-gestao-e-governanca/portaria3-2007">link</a>.
</p>


##  Histórico de Versão
 
| Versão | Data | Descrição | Autor(es)| Revisor(es) |
|--------|------|-----------|-----------|-------------|
| 1.0 | 10/11/2025 | Criação da pagina | [ Giovana Fontes ](https://github.com/GiovanaFontesS)  | [Isabella Choukaira](https://github.com/isabellachoukaira) |
| 1.2 | 15/11/2025 | Adição do checklist| [ Giovana Fontes ](https://github.com/GiovanaFontesS)  | [Isabella Choukaira](https://github.com/isabellachoukaira) |