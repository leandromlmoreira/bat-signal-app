# 🦇 Bat-Sinal

Bat-Sinal é um app mobile que recria o clássico sinal de Gotham City: um toque projeta o facho amarelo com a silhueta do morcego no céu, pronto para chamar o vigilante quando a cidade precisa dele.

**Demo online:** https://leandromlmoreira.github.io/bat-signal-app/

## Funcionalidades

- **Acionar/desligar o sinal** com um botão, alternando entre os estados "sinal ativo" e "céu calmo".
- **Animação de pulso** no facho enquanto ele está ativo, simulando o efeito de um projetor real.
- **Contador de acionamentos**, mostrando quantas vezes o sinal foi chamado na sessão atual.
- **Layout responsivo**: o tamanho do sinal se ajusta à largura da tela, de celulares a tablets.

## Como usar

1. Abra o app. A tela mostra "GOTHAM CITY" e a mensagem "O céu está calmo... por enquanto.".
2. Toque em **ACIONAR SINAL**. O facho amarelo se ilumina, a silhueta do morcego aparece recortada no centro e o sinal passa a pulsar suavemente.
3. O contador na parte inferior soma mais um acionamento.
4. Toque em **DESLIGAR SINAL** para apagar o facho e voltar ao estado de repouso.

## Stack

- [React Native](https://reactnative.dev/) + [Expo](https://docs.expo.dev/) (SDK 57)
- TypeScript
- [react-native-svg](https://github.com/software-mansion/react-native-svg) para o desenho vetorial do facho e da silhueta
- API `Animated` do React Native para a animação de pulso

## Como rodar localmente

```bash
git clone https://github.com/leandromlmoreira/bat-signal-app.git
cd bat-signal-app
npm install
npm start
```

Abra no Expo Go escaneando o QR code exibido no terminal, ou rode diretamente em uma plataforma:

```bash
npm run web      # navegador
npm run android  # emulador/dispositivo Android
npm run ios      # simulador/dispositivo iOS
```

## Qualidade e CI

```bash
npx tsc --noEmit   # checagem de tipos
npm run lint       # eslint (eslint-config-expo)
```

A cada push na branch `main`, um workflow de GitHub Actions gera a versão web estática do app (`expo export -p web`) e publica automaticamente no GitHub Pages.

---

Base: desafio "Recrie um app de Bat-Sinal" da trilha de React Native da DIO.
