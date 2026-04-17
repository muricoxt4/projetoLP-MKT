# limaHUB — Landing Page de Marketing

Landing page de alta conversão desenvolvida para a **limaHUB**, agência de marketing de performance e vendas. Projeto construído do zero com HTML, CSS e JavaScript puros — sem frameworks, sem dependências de build.

---

## Visão geral

A página tem como objetivo principal gerar leads qualificados por meio de um **diagnóstico estratégico gratuito**. O fluxo de conversão guia o visitante desde a consciência do problema até o preenchimento do formulário de contato via WhatsApp.

### Seções da página

| Seção | Objetivo |
|---|---|
| Hero | Proposta de valor + CTA principal |
| Barra de métricas | Prova social com números animados |
| Problema | Agitar a dor do cliente |
| Solução | Apresentar a abordagem da agência |
| Serviços | Detalhar os três pilares (tráfego, tecnologia, treinamento) |
| Cases | Resultados reais de clientes |
| Diagnóstico | Formulário de captura com envio via WhatsApp |
| Footer | Navegação e informações de contato |

---

## Stack técnica

- **HTML5** semântico — estrutura acessível com landmarks, hierarquia de headings e atributos ARIA
- **CSS3 puro** — design system baseado em CSS Custom Properties (variáveis), sem Tailwind ou Bootstrap
- **JavaScript vanilla** — sem jQuery, sem frameworks; ES6+ com foco em performance

---

## Design system

O projeto possui um design system próprio definido inteiramente em CSS variables no `:root`:

- **Paleta**: tons de roxo (`--purple-500` a `--purple-950`) com acento fúcsia
- **Tipografia**: `Sora` para títulos, `DM Sans` para corpo — carregadas do Google Fonts com `preconnect`
- **Radii**: `--radius-sm` a `--radius-full`
- **Sombras**: `--shadow-soft` e `--shadow-float`
- **Transições**: `--transition-smooth` e `--transition-snappy`

Regra fundamental: **nenhuma cor é hardcoded no CSS** — todos os valores passam pelas variáveis do sistema.

---

## Animações

As animações de entrada usam o padrão `.reveal` + `IntersectionObserver`:

```css
.reveal {
  opacity: 0;
  transform: translateY(28px);
  transition: opacity 0.7s ease-out, transform 0.7s ease-out;
}
.reveal.is-visible {
  opacity: 1;
  transform: translateY(0);
}
```

- Só `transform` e `opacity` são animados (GPU-friendly, sem layout shift)
- Suporte a `prefers-reduced-motion` para respeitar preferências de acessibilidade
- Contadores de métricas animam via `requestAnimationFrame` com easing

---

## Formulário e integração WhatsApp

O formulário de diagnóstico não usa backend. O fluxo é:

1. Usuário preenche nome, telefone e desafio principal
2. JavaScript valida os campos e aplica honeypot anti-spam
3. Os dados são serializados em uma mensagem de texto
4. O botão abre o WhatsApp Business com a mensagem pré-preenchida via `wa.me`

---

## Responsividade

Testado e funcional em:

| Breakpoint | Dispositivo |
|---|---|
| 375px | Mobile pequeno |
| 768px | Tablet / Mobile grande |
| 1024px | Tablet largo |
| 1280px+ | Desktop |

---

## Estrutura de arquivos

```
projetoLP-MKT/
├── lp/                    # Versão final — vai ao ar
│   ├── index.html         # Toda a estrutura HTML da LP
│   ├── styles.css         # Design system + estilos por seção
│   └── script.js          # Interações, animações e formulário
├── apoio/
│   └── matrizMestre.html  # Biblioteca de componentes UI de referência
├── CLAUDE.md              # Instruções para o agente de IA
└── .gitignore
```

---

## Como visualizar

Abra `lp/index.html` diretamente no navegador — não há servidor ou build necessário.

Para uma experiência fiel ao deploy, use um servidor local simples:

```bash
# Python
python -m http.server 8080 --directory lp

# Node.js (npx serve)
npx serve lp
```

Acesse em `http://localhost:8080`.

---

## Referências visuais

O design foi inspirado em sites de agências e produtos de referência do mercado:

- [Ramotion](https://ramotion.com) — composição e motion
- [Cuberto](https://cuberto.com) — tipografia e hover states
- [Framer](https://framer.com) — layout e gradientes
- [Figma](https://figma.com) — sistema de cores e componentes
