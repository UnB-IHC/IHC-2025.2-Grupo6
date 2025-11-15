# Desenvolvimento

Esta seção apresenta diretrizes para implementar interfaces digitais acessíveis, considerando aspectos técnicos essenciais. Ela é destinada a **desenvolvedores front-end, back-end e engenheiros de software**, responsáveis por construir sistemas robustos, compatíveis com diferentes tecnologias assistivas e capazes de oferecer uma experiência consistente para todos os usuários

Esta parte do guia foi construida com base no capítulo 6 "Desenvolvimento" do <a href="#GuiaUK">Guia de Boas Práticas para Acessibilidade Digital (UK + Brasil)</a> e com base na <a href="#WCAG">Web Content Accessibility Guidelines (WCAG) 2.2</a> e na <a href="#NBR"> ABNT-NBR-17225-Acessibilidade-Digital</a> 

## Gráficos
<div class="progress-sidebar" style="display: flex; flex-direction: row;">
    <div style="text-align: center;">
        <h3>Nível A</h3>
        <canvas id="graficoAdev" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
    </div>
    <div style="text-align: center;">
        <h3>Nível AA</h3>
        <canvas id="graficoAAdev" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
    </div>
    <div style="text-align: center;">
        <h3>Nível AAA</h3>
        <canvas id="graficoAAAdev" width="200" height="200" style="width: 200px; height: 200px;"></canvas>
    </div>
</div>

## 1. Navegação <small>Baseado no capitulo 6 do Guia UK: "Links e Botões"</small>
  
### links

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
 Todos os links são usados para navegação (A). <a href="#NBR">[NBR 5.7.2] </a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  A finalidade dos links é clara pelo texto dos links ou pelo seu contexto próximo e programaticamente associado (A). <a href="#NBR">[NBR 5.7.4]</a> <a href="#1">[WCAG 2.4.4]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
 Todos os mecanismos de ajuda que se repetem em um conjunto de páginas estão na mesma ordem relativa (A). <a href="#NBR">[NBR 2.7.16]</a> <a href="#">[WCAG 3.2.6]</a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
 Há um ou mais links (ou outro mecanismo) que permitem contornar blocos de conteúdo na página (A). <a href="#NBR">[NBR 5.7.11]</a> <a href="#">[WCAG 2.4.1]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
 Há mais de uma forma para encontrar uma página em um conjunto de páginas ou A página é o resultado ou uma etapa de um processo (AA). <a href="#NBR">[NBR 5.7.13]</a> <a href="#">[WCAG 2.4.5]</a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
Todos os mecanismos de navegação que se repetem em um conjunto de páginas estão na mesma ordem relativa ou o usuário que altera (AA). <a href="#NBR">[NBR 5.7.15]</a> <a href="#">[WCAG 3.2.3]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAAdev">
A finalidade dos links é claramente identificável apenas pelo texto dos links, sem depender do contexto (AAA). <a href="#">[WCAG 2.4.9]</a> <a href="#">[WCAG 3.2.6]</a>
</label>

### Botões

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Todos os botões possuem uma definição clara de sua função e devem executar uma funcionalidade (A). <a href="#NBR">[NBR 5.8.1]</a> <a href="#NBR">[NBR 5.8.2]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Componente de interface recebe foco, não muda de contexto a não ser que o usuário seja avisado (A). <a href="#">[WCAG 3.2.1]</a> <a href="#">[WCAG 3.2.2]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Toda funcionalidade operada por movimento pode ser operada também por componentes que não exigem esse modo de operação (A). <a href="#">[WCAG 2.5.4]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
Os componentes que têm a mesma funcionalidade em um conjunto de páginas web são identificados de forma consistente (AA). <a href="#">[WCAG 3.2.4]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
Toda funcionalidade operada por movimento de arrastar pode ser operada também por um ponteiro único sem movimento de arrastar (AA). <a href="#">[WCAG 2.5.7]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
  O tamanho do alvo para entradas de ponteiro é pelo menos 24 por 24 pixels CSS (AA). <a href="#">[WCAG 2.5.8]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAAdev">
  Toda mudança de contexto é iniciada apenas a pedido do usuário ou pode ser desativada (AAA). <a href="#">[WCAG 3.2.5]</a>
</label>


## 2. Navegação por teclado: <small> Baseado no capítulo 6 do Guia UK: "Permite navegação completa por teclado"</small>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Toda a funcionalidade do conteúdo é operável através de uma interface de teclado (A). <a href="#">[WCAG 2.1.1]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Elementos focáveis aparecem em ordem sequencial lógica e intuitiva ao receber foco (A). <a href="#NBR">[NBR 5.1.4]</a> <a href="#1">[WCAG 2.4.3]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Não há componentes que bloqueiam, impedem ou interrompem a navegação por teclado (A). <a href="#NBR">[NBR 5.1.6]</a> <a href="#1">[WCAG 2.1.2]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Há um mecanismo simples para desativar ou remapear o atalho de teclado sem tecla modificadora (A). <a href="#">[WCAG 2.1.4]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
 Todos os elementos focáveis possuem um indicador de foco visível (AA). <a href="#NBR">[NBR 5.1.1]</a> <a href="#">[WCAG 2.4.7]</a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAAdev">
  Todos os elementos focáveis estão completamente visíveis quando recebem foco (AAA). <a href="#NBR">[NBR 5.1.2]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAAdev">
  Todas as funcionalidades da página são acessíveis com o teclado, sem exceção (AAA). <a href="#NBR">[NBR 5.1.2]</a>
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAAdev">
  Não há funcionalidade na página que restringe o uso de algum mecanismo de entrada disponível (AAA). <a href="#NBR">[NBR 5.1.14]</a> <a href="#">[WCAG 2.5.6]</a> 
</label>

## 3. Conteúdo Visual e Auditivo

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Legendas para áudio e vídeo ao vivo (A). 
  <a href="#NBR">[NBR 5.14.9]</a> <a href="#WCAG">[WCAG 1.2.4]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  É possível controlar o volume do áudio, sem afetar o volume geral do sistema (A). 
  <a href="#NBR">[NBR 5.14.7]</a> <a href="#WCAG">[WCAG 1.4.2]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="AAdev">
  Todos os vídeos pré-gravados têm audiodescrição para todo o conteúdo visual (AA). 
  <a href="#NBR">[NBR 5.14.4]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="AAAdev">
  Há janela de Libras para conteúdo em áudio (AAA). 
  <a href="#NBR">[NBR 5.14.6]</a> <a href="#WCAG">[WCAG 1.2.6]</a>
</label>

## 4. Estrutura Semântica

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Todos os cabeçalhos possuem semântica determinada programaticamente (A) <a href="#NBR">[NBR 5.3.1]</a> <a href="#">[WCAG 1.3.1]</a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  A ordem dos elementos conforme aparece no código é lógica e intuitiva, de modo que preserva o significado e a operabilidade (A). <a href="#NBR">[NBR 5.13.6]</a> <a href="#">[WCAG 1.3.2]</a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="Adev">
  Todos os componentes que requerem identificação por nome possuem um nome acessível (A). <a href="#NBR">[NBR 5.13.9]</a> <a href="#">[WCAG 4.1.2]</a> 
</label>

<label class="criterio">
<input type="checkbox" class="criterio" data-level="AAdev">
 Os cabeçalhos e os rótulos descrevem o tópico ou a finalidade (AA). <a href="#">[WCAG 2.4.6]</a> 
</label>

## 5. Formulários e interação 

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Todos os campos de formulário possuem um rótulo que os identifica (A). 
  <a href="#NBR">[NBR 5.9.1]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  As informações, a estrutura e os relacionamentos visuais do conteúdo devem poder ser identificados automaticamente por tecnologias assistivas ou estar claramente disponíveis no texto (A). 
  <a href="#WCAG">[WCAG 1.3.1]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Rótulos ou instruções são fornecidos quando o conteúdo exigir a entrada de dados por parte do usuário (A). 
  <a href="#WCAG">[WCAG 3.3.2]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Todos os rótulos estão associados e identificam o propósito dos respectivos campos de formulário (A). 
  <a href="#NBR">[NBR 5.9.3]</a> <a href="#NBR">[NBR 5.9.4]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Todas as mensagens de erro descrevem em texto qual é o erro e identificam qual é o campo com erro (A). 
  <a href="#WCAG">[WCAG 3.3.1]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="AAdev">
  Todos os campos de entrada têm seu tipo de dado determinado programaticamente (AA). 
  <a href="#NBR">[NBR 5.9.8]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="AAdev">
  Todos os formulários críticos permitem uma forma de reverter, verificar ou confirmar os dados (AA). 
  <a href="#WCAG">[WCAG 3.3.4]</a>
</label>

## 6. Tempo e Responsividade

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Há um mecanismo para desligar, ajustar ou estender o limite de tempo antes de atingi-lo (A).  
  <a href="#NBR">[NBR 5.16.2]</a> <a href="#WCAG">[WCAG 2.2.1]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="Adev">
  Não há atualização que inicie automaticamente e seja apresentada em paralelo com outro conteúdo (A).  
  <a href="#NBR">[NBR 5.16.3]</a> <a href="#NBR">[NBR 2.2.2]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="AAdev">
  O conteúdo não requer uma orientação de exibição específica (AA).  
  <a href="#NBR">[NBR 5.10.3]</a> <a href="#WCAG">[WCAG 1.3.4]</a>
</label>

<label class="criterio">
  <input type="checkbox" class="criterio" data-level="AAdev">
  O design é responsivo (AA).  
  <a href="#NBR">[NBR 5.10.4]</a> <a href="#WCAG">[WCAG 1.4.10]</a>
</label>


# Referências Bibliograficas

> <a id="1" href="">1.</a> Diretrizes de Acessibilidade para Conteúdo Web (WCAG) 2.2. **Critério de Sucesso 2.4.4 Finalidade do Link (Em contexto) (Nível A)**. Disponível em: [https://www.w3c.br/traducoes/wcag/wcag22-pt-BR/#link-purpose-in-context](https://www.w3c.br/traducoes/wcag/wcag22-pt-BR/#link-purpose-in-context). Acesso em: 10 nov. 2025.

> <a id="WCAG" href=""> </a> ABNT NBR 17225:2025. **Acessibilidade em conteúdo e aplicações web – Requisitos**. Disponível em: [https://www.w3c.br/traducoes/wcag/wcag22-pt-BR/](https://www.w3c.br/traducoes/wcag/wcag22-pt-BR/) Acesso em: 23 Jun. 2025

> <a id="NBR" href=""> </a> ABNT NBR 17225:2025. **Acessibilidade em conteúdo e aplicações web – Requisitos**. Disponível em: [https://mwpt.com.br/wp-content/uploads/2025/04/ABNT-NBR-17225-Acessibilidade-Digital.pdf](https://mwpt.com.br/wp-content/uploads/2025/04/ABNT-NBR-17225-Acessibilidade-Digital.pdf) Acesso em: 23 Jun. 2025

> <a id="GuiaUK" href=""></a> DINIZ, V.; FERRAZ, R.; NASCIMENTO, C. M.; CREDIDIO, R. **Guia de Boas Práticas para Acessibilidade Digital**. Programa de Cooperação entre Reino Unido e Brasil em Acesso Digital, 2023. Disponível em: [https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/guiaboaspraaticasparaacessibilidadedigital.pdf](https://www.gov.br/governodigital/pt-br/acessibilidade-e-usuario/acessibilidade-digital/guiaboaspraaticasparaacessibilidadedigital.pdf). Acesso em: 9 Mai. 2024. 


