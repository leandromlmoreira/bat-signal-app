# BatPass

Gerador de senhas com identidade noturna: força medida em bits de entropia reais, aleatoriedade criptográfica e histórico que nunca sai do seu aparelho.

**[Ver ao vivo](https://leandromlmoreira.github.io/bat-pass/)**

![BatPass no desktop](docs/preview.png)

<p align="center">
  <img src="docs/preview-mobile.png" alt="BatPass no celular" width="320" />
</p>

## Funcionalidades

- **Aleatoriedade criptográfica**: `expo-crypto` (`getRandomValues`) com amostragem por rejeição, sem viés de módulo e sem `Math.random`.
- **Opções completas**: comprimento de 8 a 64 (slider arrastável e botões de passo), maiúsculas, números, símbolos e evitar caracteres ambíguos (`I l 1 O 0` e afins).
- **Garantia de composição**: cada tipo ativo aparece ao menos uma vez, com embaralhamento Fisher-Yates.
- **Medidor de força com entropia real**: `comprimento × log2(tamanho do alfabeto)`, quatro níveis e estimativa de tempo de força bruta a 100 bilhões de tentativas por segundo.
- **Copiar com feedback**: `expo-clipboard`, botão que vira "Copiada" com ícone de confirmação e aviso para leitores de tela.
- **Histórico persistente**: últimas 10 senhas copiadas, mascaradas na lista, salvas com AsyncStorage (localStorage na web). Copiar de novo com um toque, ou limpar tudo.
- **Detalhes de produto**: senha colorida por tipo de caractere, efeito de decodificação ao gerar (desligado com "reduzir movimento"), estados de hover, foco por teclado, vazio e carregando, layout em duas colunas no desktop e empilhado no celular.
- **Ilustração em SVG**: céu, feixe de luz e skyline desenhados no projeto; o morcego clássico do Bat-Sinal aparece no logo, no sinal do hero, no favicon e nos ícones do app.

## Stack

- React Native 0.86 + Expo SDK 57 + TypeScript
- react-native-web para a versão web, publicada no GitHub Pages via GitHub Actions
- expo-crypto, expo-clipboard, @react-native-async-storage/async-storage, react-native-svg, expo-linear-gradient
- Fontes do Google Fonts via `@expo-google-fonts`: Big Shoulders Display, DM Sans e JetBrains Mono
- Testes das regras de negócio com o test runner nativo do Node

## Arquitetura

```
src/
  domain/      regras puras e testadas: geração, entropia, histórico
  services/    aleatoriedade segura (expo-crypto) e armazenamento
  hooks/       estado da tela: gerador, histórico, cópia, animação
  components/  peças pequenas de interface
  screens/     composição da tela
  theme/       cores, fontes, raios e curvas de animação
```

## Como rodar

```bash
npm install
npm run web          # navegador
npm run android      # ou npm run ios, com Expo Go ou emulador
npm test             # testes do domínio
npm run typecheck    # TypeScript
npm run build:web    # exporta a versão web para dist/
```

## Créditos

- Símbolo do morcego: [Batman, do SVG Repo](https://www.svgrepo.com/svg/485626/batman), usado no logo, no sinal do hero, no favicon e nos ícones gerados em `assets/`.
- Batman e o Bat-Sinal são marcas registradas da DC Comics. O BatPass é um projeto de fã, sem fins comerciais e sem vínculo com a DC.

---

<sub>Nasceu como desafio da Formação React Native Developer da DIO, inspirado no projeto de referência de Felipe Aguiar.</sub>
