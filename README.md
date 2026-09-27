# Bat-Sinal

A Central do GCPD num app React Native: acenda o holofote que projeta o morcego nas nuvens de Gotham e, na área ao lado, gere senhas fortes com o BatPass. Funciona no celular e na web.

**[Ver ao vivo →](https://leandromlmoreira.github.io/bat-sinal/)** · **[Abrir direto no BatPass →](https://leandromlmoreira.github.io/bat-sinal/#batpass)**

![Relâmpago sobre Gotham, o holofote acende gaguejando, o morcego aparece recortado nas nuvens e a câmera mergulha no símbolo até o BatPass](docs/preview.gif)

<p>
  <img src="docs/preview.png" alt="Área Sinal no desktop com o holofote ligado, poeira e chuva no facho" width="68%" />
  <img src="docs/preview-mobile.png" alt="Área Sinal no celular" width="28%" />
</p>
<p>
  <img src="docs/batpass.png" alt="Área BatPass no desktop com a senha recém-copiada" width="68%" />
  <img src="docs/batpass-mobile.png" alt="Área BatPass no celular" width="28%" />
</p>

## Duas áreas, uma central

A barra flutuante no topo alterna entre as áreas. Na troca, o emblema do Bat-Sinal aparece no centro e a câmera mergulha no morcego até a outra área surgir. Na web cada área tem endereço próprio (`#batpass`), então dá para compartilhar o link e o botão voltar do navegador funciona. Com o sinal ligado, a aba Sinal ganha um ponto âmbar para lembrar que o holofote continua no ar.

### Sinal

- **Gotham noir, desenhada em código.** Preto e grafite frio com névoa azulada; o âmbar do holofote é a única cor quente da tela. Skyline gótica em três camadas com torres, pináculos, catedrais, ameias e relógios iluminados, janelas que apagam e voltam e um banco de névoa entre os prédios.
- **Símbolo recortado nas nuvens.** A luz é uma máscara com borda suave e textura de nuvem; o morcego é sombra de verdade (com penumbra), e as camadas de nuvem passam na frente da projeção.
- **Feixe volumétrico.** Cone em camadas com bordas definidas, poeira cintilando dentro do facho e a chuva acesa só onde a luz bate.
- **Tempestade.** Chuva fina em duas profundidades e relâmpagos ocasionais que clareiam o céu por trás e revelam a silhueta da cidade.
- **Ignição com cintilação.** A lâmpada gagueja como um arco de carbono antes de firmar, com estalo de luz na lente. A sequência é determinística e compartilhada entre imagem e som.
- **Som sintetizado (WebAudio, na web).** Relé, zumbido do arco em sincronia com a cintilação, zumbido contínuo com o sinal no ar e trovão depois de cada relâmpago. Começa **mudo**; o botão de som fica na barra e a escolha é lembrada no aparelho.
- **Terminal do GCPD** com log de eventos e status ao vivo (`Comissário Gordon: sinal ativo — 00:14`), mais o **contador de chamados** animado a cada acionamento.

### BatPass

- **Aleatoriedade criptográfica.** `getRandomValues` (Web Crypto via `expo-crypto`) com amostragem por rejeição, sem viés de módulo e sem `Math.random`.
- **Opções completas.** Comprimento de 8 a 64 (slider arrastável e botões de passo), maiúsculas, números, símbolos e evitar caracteres ambíguos. Cada tipo ativo aparece ao menos uma vez, com embaralhamento Fisher-Yates.
- **Força em bits de entropia de verdade** (`comprimento × log2(alfabeto)`), quatro níveis e estimativa de força bruta a 100 bilhões de tentativas por segundo, num painel de análise com régua de 40 segmentos e marcas nos limiares de 50, 72 e 100 bits.
- **Copiar com feedback** e **histórico mascarado** das últimas 10 senhas copiadas, guardado só no aparelho (AsyncStorage, `localStorage` na web).

### Em todo o app

- **Identidade noir.** Anton nos títulos, Oswald na interface, Share Tech Mono nos dados do terminal e JetBrains Mono só nas senhas (para separar `l`, `1` e `I`). Painéis retos com cantoneiras, como telas de uma central de polícia, e o mesmo morcego no logo, na projeção, no hero do BatPass, no favicon e nos ícones do app.
- **Layouts de verdade para cada tela.** Composição vertical no celular, colunas no desktop e modo compacto para celular deitado ou telas baixas.
- **Cuidados de produto.** Vibração ao acionar o sinal (iOS/Android), hover e foco visível só na navegação por teclado, estados de vazio e carregando, respeito a "reduzir movimento" (sem chuva nem relâmpago, a transição vira um fade curto e as animações param) e animações apenas em `transform` e `opacity`.

## Stack

- [Expo](https://docs.expo.dev/) SDK 57 + React Native 0.86, TypeScript
- [react-native-svg](https://github.com/software-mansion/react-native-svg) para a cena, o emblema e as ilustrações
- API `Animated` com `useNativeDriver` no celular
- `expo-crypto`, `expo-clipboard`, `@react-native-async-storage/async-storage`, `expo-haptics`
- `expo-font` com Anton, Oswald, Share Tech Mono e JetBrains Mono (Google Fonts)
- Web Audio API para o som, todo sintetizado em código (sem arquivos de áudio)
- Testes das regras de negócio com o test runner nativo do Node
- Deploy da versão web no GitHub Pages via GitHub Actions

## Arquitetura

```
src/
  screens/     Central (troca de áreas), Signal (cena do holofote) e BatPass
  components/  shell (barra e transição), scene (Gotham), batpass e ui compartilhada
  domain/      regras puras e testadas do BatPass: geração, entropia, histórico, régua de força
  audio/       síntese do relé, do arco, do zumbido e do trovão com WebAudio
  services/    aleatoriedade segura e armazenamento local
  hooks/       estado do sinal, do gerador, da rota e da transição
  lib/         geradores determinísticos de skyline gótica, chuva, poeira, raios e ignição
  theme/       cores, fontes e curvas de animação
```

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
npm test            # 36 testes: domínio do BatPass, cena (skyline, raios, poeira, ignição), som e barra
npm run build       # exporta a versão web estática para dist/
```

A cada push na `main`, o workflow `deploy-pages.yml` checa tipos, lint e testes, exporta a web com o `baseUrl` derivado do nome do repositório (variável `BASE_PATH`, lida no `app.config.js`) e publica no GitHub Pages.

O BatPass nasceu num repositório separado e foi trazido para cá com `git subtree`, então todo o histórico dele continua no `git log` deste projeto.

## Créditos

- Símbolo do morcego: [Batman, do SVG Repo](https://www.svgrepo.com/svg/485626/batman), usado na projeção, no logo, no hero do BatPass, no favicon e nos ícones em `assets/`.
- Batman e o Bat-Sinal são marcas registradas da DC Comics. Este é um projeto de fã, sem fins comerciais e sem vínculo com a DC.

---

<sub>Nasceu dos desafios "Recrie um app de Bat-Sinal" e do gerador de senhas da trilha de React Native da DIO, este inspirado no projeto de referência de Felipe Aguiar.</sub>
