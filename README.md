# 🦇 BatPass — Gerador de Senhas Fortes

Desafio de projeto **"Sequenciador de senhas do Batman com React Native"** da trilha
[Formação React Native Developer](https://web.dio.me/track/formacao-react-native-developer)
(DIO). Inspirado no projeto de referência do instrutor
([felipeAguiarCode/react-native-bat-pass-generator](https://github.com/felipeAguiarCode/react-native-bat-pass-generator)),
construído do zero em TypeScript.

## O que o projeto faz

Gera senhas fortes e aleatórias com comprimento e composição configuráveis
(maiúsculas, números, símbolos) e copia o resultado para a área de transferência
com um toque.

## Tecnologias

- React Native + Expo (SDK 57)
- TypeScript
- `expo-clipboard` para copiar a senha gerada

## Como executar

```bash
npm install
npm run web      # roda no navegador (mais rápido para testar)
npm run android   # ou ios, com Expo Go / emulador
```

## Melhoria implementada

O projeto de referência gera a senha; aqui adicionei:

- **Opções configuráveis**: comprimento (4–64), incluir maiúsculas, números e
  símbolos, cada uma com um `Switch` independente.
- **Copiar para a área de transferência** com feedback visual ("Copiado!").
- Tema visual escuro com acento amarelo (Batman), usando só `StyleSheet` (sem
  bibliotecas externas de UI).

## Como testar

Rodei `npm run web` e testei manualmente: gerar senha com as opções padrão,
alternar cada switch e conferir que a senha muda de composição, e copiar a
senha (o navegador confirma o clipboard). Não testei em dispositivo físico
Android/iOS.

## O que aprendi

- `useState` para estado de formulário (comprimento, switches) e para o
  resultado gerado.
- `TouchableOpacity` com estado `disabled` (o botão de copiar só habilita
  quando existe uma senha).
- `expo-clipboard` como a forma correta (e multiplataforma) de acessar a
  área de transferência em vez de qualquer API do navegador.
- Testar um app Expo sem emulador Android/iOS instalado, usando `expo start --web`
  (react-native-web) para validar layout e lógica rapidamente.
