# 🦇 Bat-Signal App

App mobile em React Native (Expo) que recria o Bat-Sinal: acione e veja o sinal do Batman projetado no céu de Gotham, de forma interativa e responsiva.

Projeto do desafio **"Recrie um app de Bat-Sinal"**, da Formação React Native Developer (DIO / Santander).

## O que o projeto faz

- Um botão **ACIONAR SINAL** liga o facho amarelo com a silhueta do morcego recortada no centro, como o Bat-Sinal original.
- O sinal pulsa suavemente enquanto ativo (efeito de projetor), usando a API `Animated` do React Native.
- Um contador mostra quantas vezes o sinal foi acionado na sessão atual.
- O tamanho do sinal se adapta à largura da tela (`useWindowDimensions`), funcionando tanto em celulares pequenos quanto em tablets.

## Tecnologias

- [React Native](https://reactnative.dev/) + [Expo](https://docs.expo.dev/) (SDK 57)
- TypeScript
- [react-native-svg](https://github.com/software-mansion/react-native-svg) — desenho vetorial do facho e da silhueta do morcego
- `Animated` API (nativa do React Native) — animação de pulso

## Estrutura

```
src/
├── components/
│   └── BatSignal/       # o facho + silhueta do morcego, com animação de pulso
└── screens/
    └── Home/            # tela única: título, sinal, botão e contador
```

## Como executar

```bash
git clone https://github.com/leandromlmoreira/bat-signal-app.git
cd bat-signal-app
npm install
npm run start
```

Abra no Expo Go escaneando o QR code, ou rode `npm run web` / `npm run android` / `npm run ios`.

## Decisões de design

- **Silhueta em SVG, não imagem**: desenhei o facho e o morcego com `react-native-svg` em vez de usar uma imagem estática, para o sinal escalar sem perder qualidade em qualquer tamanho de tela.
- **Cor de acordo com o estado**: círculo e texto do botão trocam de cor (amarelo apagado/cinza quando inativo, amarelo vivo quando ativo) para que o estado do sinal seja óbvio mesmo sem ler o texto.
- **Responsividade**: o tamanho do sinal é calculado como uma fração da largura da tela (`width * 0.6`, entre 180 e 320px), em vez de um valor fixo.

## O que aprendi

- Como desenhar formas vetoriais customizadas em React Native com `react-native-svg`, incluindo paths com curvas Bézier (`C`) para um contorno orgânico do morcego.
- Como animar um valor de escala em loop com `Animated.loop` + `Animated.sequence`, e limpar a animação (`loop.stop()`) quando o componente desmonta ou o estado muda.
- Que responsividade em React Native muitas vezes é só calcular valores a partir de `useWindowDimensions`, em vez de depender só de flexbox.

---

Feito durante a Formação React Native Developer (DIO).
