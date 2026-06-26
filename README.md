# Radio UAS — Alexa Skill

Skill de Alexa para **Radio Universidad Autónoma de Sinaloa**. Transmite audio en vivo y video en dispositivos compatibles, y muestra el programa actual vía API.

## Estructura del proyecto

```
├── index.js          # Entry point (registro de handlers)
├── config.js         # Constantes: URLs, metadatos, RADIO_NAME, RADIO_SLOGAN
├── api.js            # Cliente HTTP para la API de programación
├── utils.js          # Función supportsVideo()
├── handlers/
│   ├── launch.js     # Bienvenida con programa actual
│   ├── audio.js      # Reproducción de streaming + card
│   ├── video.js      # Reproducción de video con fallback a audio
│   ├── info.js       # AboutIntent y frase personalizada
│   └── system.js     # Stop, Help, SessionEnded, ErrorHandler
├── bundle.js         # Archivo generado para deploy
└── package.json      # Dependencias y script build
```

## Desarrollo

### Instalación

```bash
npm install
```

### Build para deploy

```bash
npm run build
```

Genera `bundle.js` — copia el contenido y pégalo en la consola de Alexa Developer Console (Código → Guardar → Deploy).

## Intents

| Intent | Descripción |
|---|---|
| `LaunchRequest` | Bienvenida + muestra programa actual |
| `PlayStreamIntent` | Inicia transmisión de audio |
| `PlayVideoIntent` | Inicia transmisión de video (Echo Show) |
| `AMAZON.StopIntent` | Detiene la transmisión |
| `AMAZON.HelpIntent` | Muestra ayuda |
| `AboutIntent` | Información de la radio |
| `PlayCustomPhraseIntent` | Frase personalizada |
| `AMAZON.ResumeIntent` | Reanuda transmisión |

## API

El skill consulta `spc.radiouas.org/api/schedule/now` para obtener el programa actual. Si la API falla, el skill funciona sin ella con mensajes genéricos.

## Dispositivos con pantalla

Muestra una **Standard Card** con el nombre del programa actual y el logo de Radio UAS.
