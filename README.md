# Radio UAS — Alexa Skill

Skill de Alexa para **Radio Universidad Autónoma de Sinaloa**. Transmite audio en vivo y video en dispositivos compatibles, y muestra el programa actual vía API.

## Estructura del proyecto

```
├── index.js          # Entry point (registro de handlers)
├── config.js         # Constantes: URLs, metadatos, timezone, mapas slug→icono, fallback
├── api.js            # Cliente de parrilla diaria + resolución de programa al aire / siguientes
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

El skill consulta la parrilla diaria en:

```
GET https://spc.radiouas.org/api/schedule/daily?day={N}
```

`N` = día de la semana (`1` lunes … `7` domingo). Devuelve un arreglo de programas con
`name`, `producer`, `host`, `image`, `slug`, `startTime`, `endTime`, `PTY`, `PTN`, `SM`,
`music`, `ID`, `durationMinutes`.

El skill determina el programa **al aire ahora** y **los siguientes 2** comparando la hora
local de **Sinaloa / Mazatlán (UTC-7 fijo)** contra `startTime`/`endTime`. Los huecos de la
parrilla y los fallos de API se rellenan con un programa *fallback*.

> `PTN` se ignora (información exclusiva de sistemas RBDS). El campo `slug` se usa como
> keyword de categoría y se mapea a un icono nativo de APL (`SLUG_ICONS` en `config.js`).

## Dispositivos con pantalla

- **APL**: cover del programa actual como protagonista (izquierda) + info a la derecha
  (categoría con icono, producción, conducción, horario) y franja **"A continuación"** con
  los 2 programas siguientes.
- **Standard Card**: nombre del programa actual con su cover.
