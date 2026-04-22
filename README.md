# limaHUB — Landing Page de Growth e Vendas

Landing page institucional desenvolvida para representar a proposta da **limaHUB**, com foco em geração de leads qualificados através de um diagnóstico estratégico.

Este projeto foi construído com foco em **performance, clareza de conversão e controle total do front-end**, sem uso de frameworks ou ferramentas externas de build.

---

## 🎯 Objetivo do projeto

A página foi pensada como um **ativo de conversão**, não apenas institucional.

A estrutura conduz o usuário por uma jornada clara:

1. Entendimento do problema
2. Identificação com a dor
3. Apresentação da solução
4. Prova (cases e números)
5. Conversão via formulário

Toda a construção segue lógica de **funil de vendas direto no front-end**.

---

## 🧱 Stack utilizada

O projeto foi desenvolvido com tecnologias puras, sem abstrações:

* **HTML5 semântico**
* **CSS3 com Design System próprio**
* **JavaScript Vanilla (ES6+)**

Sem uso de:

* frameworks (React, Vue, etc.)
* bibliotecas (jQuery, Bootstrap, etc.)
* ferramentas de build (Webpack, Vite, etc.)

---

## 🧠 Estrutura da Landing Page

A página é composta por blocos estratégicos:

| Seção        | Função                               |
| ------------ | ------------------------------------ |
| Hero         | Proposta de valor + CTA principal    |
| Métricas     | Prova social com contadores animados |
| Problema     | Conexão com a dor do cliente         |
| Solução      | Apresentação do modelo de atuação    |
| Serviços     | Estrutura de entrega em etapas       |
| Cases        | Validação com resultados reais       |
| Prova        | Autoridade e histórico               |
| Diferenciais | Posicionamento estratégico           |
| Formulário   | Conversão principal                  |

---

## 🎨 Design System

Todo o visual foi estruturado com base em **CSS Variables**, centralizadas no `:root`:

* Paleta principal baseada em roxo + fúcsia
* Tipografia:

  * **Sora** (títulos)
  * **DM Sans** (texto)
* Sistema de espaçamento, radius e sombras padronizados

👉 Nenhuma cor é aplicada diretamente — tudo passa por variável.

---

## ⚡ Animações e Interações

As animações seguem princípios de performance:

* Uso de `IntersectionObserver` para entrada de elementos
* Animação apenas de:

  * `opacity`
  * `transform`
* Contadores animados via `requestAnimationFrame`
* Respeito a `prefers-reduced-motion`

Isso evita:

* reflow
* jank
* perda de performance em dispositivos mais fracos

---

## 📲 Formulário e captura de leads

Diferente da versão inicial, o projeto hoje possui:

### Integração com Google Sheets

O envio do formulário é feito via:

* `fetch` (POST)
* Apps Script como endpoint
* Registro automático em planilha

Trecho principal do fluxo: 

* sanitização de dados
* validação de campos
* proteção contra spam
* tratamento de erro de rede
* feedback visual ao usuário

---

## 🛡️ Proteções implementadas

O formulário possui mecanismos básicos de segurança:

* **Honeypot invisível** (campo falso para bots)
* **Delay mínimo de envio** (anti-bot)
* **Sanitização de inputs**
* **Validação de e-mail e telefone**
* **Fallback para WhatsApp em caso de erro**

---

## 📁 Estrutura de arquivos

```
projetoLP-MKT/
├── index.html      # Estrutura completa da landing page
├── styles.css      # Design system + estilos
├── script.js       # Interações, animações e envio do formulário
└── README.md
```

---

## 🌐 Deploy

A página está publicada via **GitHub Pages**:

* sem backend próprio
* sem servidor dedicado
* totalmente estática

---

## 🧩 Decisões de arquitetura

Algumas escolhas importantes do projeto:

* **Zero dependência externa** → controle total
* **Front-end puro** → leve e rápido
* **Integração via Apps Script** → substitui backend
* **Foco em conversão** → não é um site institucional genérico
* **Código legível e direto** → fácil manutenção

---

## 🧠 Observação final

Esse projeto não é apenas uma landing page visual.

Ele representa um modelo de construção baseado em:

* lógica de vendas
* controle de dados
* performance real
* e independência de ferramentas

A ideia aqui não é só “ter uma LP bonita”,
mas **ter um ativo que funciona como parte do processo comercial**.
