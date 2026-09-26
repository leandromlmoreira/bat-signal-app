# Bat-Sinal

Central de chamados do GCPD em React Native: um toque acende o holofote no telhado e projeta o morcego nas nuvens de Gotham, no celular e na web.

**[Ver ao vivo →](https://leandromlmoreira.github.io/bat-sinal/)**

![Bat-Sinal em ação: o holofote acende, o feixe sobe pela chuva e projeta o morcego nas nuvens](docs/preview.gif)

<p>
  <img src="docs/preview.png" alt="Versão desktop com o sinal ativo" width="68%" />
  <img src="docs/preview-mobile.png" alt="Versão mobile com o sinal ativo" width="28%" />
</p>

## Funcionalidades

- **Gotham à noite, desenhada em código.** Skyline em três camadas com parallax sutil (e reação ao mouse na web), janelas acesas que apagam e voltam, nuvens baixas em movimento, lua encoberta e chuva fina em duas profundidades.
- **Ignição com estalo.** Ao acionar, o holofote dá um estalo de luz, o feixe volumétrico sobe gaguejando como um arco de carbono e só então o morcego aparece nas nuvens, com halo, tremulação leve e a chuva iluminada dentro do feixe.
- **Símbolo próprio.** O morcego é um desenho vetorial original, anguloso, feito em SVG para este projeto.
- **Terminal da polícia.** Painel no estilo terminal do GCPD com log de eventos e o status ao vivo: `Comissário Gordon: sinal ativo — 00:14`.
- **Contador de chamados** com animação a cada acionamento e botão para desligar o sinal.
- **Layouts de verdade para cada tela.** Composição vertical no celular, coluna editorial no desktop e modo compacto para celular deitado.
- **Cuidados de produto.** Vibração ao acionar (iOS/Android), estados de hover e foco no teclado na web, respeito a "reduzir movimento" do sistema e animações rodando no driver nativo.

## Stack

- [Expo](https://docs.expo.dev/) SDK 57 + React Native 0.86, TypeScript
- [react-native-svg](https://github.com/software-mansion/react-native-svg) para toda a cena (céu, prédios, nuvens, chuva, feixe e símbolo)
- API `Animated` com `useNativeDriver` no celular (só `transform` e `opacity` são animados)
- `expo-font` com Big Shoulders, Barlow Condensed e JetBrains Mono (Google Fonts)
- `expo-haptics` e `react-native-safe-area-context`
- Deploy da versão web no GitHub Pages via GitHub Actions

## Como rodar

```bash
git clone https://github.com/leandromlmoreira/bat-sinal.git
cd bat-sinal
npm install
npm start
```

Escaneie o QR code com o Expo Go ou abra direto numa plataforma:

```bash
npm run web       # navegador
npm run android   # emulador ou dispositivo Android
npm run ios       # simulador ou dispositivo iOS
```

## Qualidade e deploy

```bash
npm run typecheck   # tsc --noEmit
npm run lint        # eslint-config-expo
npm run build       # exporta a versão web estática para dist/
```

A cada push na `main`, o workflow `deploy-pages.yml` checa tipos e lint, exporta a web com `baseUrl` `/bat-sinal` (definido no `app.json`) e publica no GitHub Pages.

---

<sub>Nasceu do desafio "Recrie um app de Bat-Sinal" da trilha de React Native da DIO.</sub>
