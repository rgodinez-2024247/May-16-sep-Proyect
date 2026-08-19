# Para Marjorie · 16 de septiembre

Página-regalo de cumpleaños (23 años), hecha con **Vite + React + TypeScript**.

Repositorio: <https://github.com/rgodinez-2024247/May-16-sep-Proyect>

La experiencia es: pantalla de entrada con el botón "No" que se escapa → al dar "Sí" empieza la
música en orden aleatorio → tres personajes que abren una carta cada uno → un rompecabezas que se
arma arrastrando piezas → mensaje de cierre.

---

## 1. Requisitos

| Herramienta | Versión mínima | Cómo comprobar |
|---|---|---|
| Node.js | 20.19+ o 22+ | `node --version` |
| npm | 10+ | `npm --version` |
| Git | cualquiera reciente | `git --version` |

Si no tienes Node, descárgalo de <https://nodejs.org> (elige la versión **LTS**).

---

## 2. Instalación

Abre PowerShell en la carpeta del proyecto y ejecuta:

```powershell
npm install
```

Esto descarga las dependencias en `node_modules/` (esa carpeta **no** se sube a Git).

Si empiezas desde cero en otra computadora:

```powershell
git clone https://github.com/rgodinez-2024247/May-16-sep-Proyect.git
cd May-16-sep-Proyect
npm install
```

---

## 3. Correr en local (modo desarrollo)

```powershell
npm run dev
```

Verás algo así:

```
VITE v8.2.1  ready in 1006 ms
➜  Local:   http://localhost:5173/
```

Abre esa dirección en el navegador. Los cambios que guardes en el código se reflejan al instante.

- Si el puerto 5173 está ocupado, Vite usa el siguiente (5174, 5175...). **Fíjate en la dirección
  que imprime la terminal**, no asumas 5173.
- Para forzar un puerto: `npm run dev -- --port 5173 --strictPort`
- Para detenerlo: `Ctrl + C` en esa terminal.
- Para verlo desde el celular en la misma red WiFi: `npm run dev -- --host` y abre en el celular la
  dirección "Network" que aparece.

---

## 4. La música

Los MP3 viven en `public/music/` y **ya están en el repositorio**. Los nombres tienen que ser
exactamente estos, porque están escritos en `src/data/content.ts`:

- `loco.mp3`
- `really.mp3`
- `falling-in-love.mp3`
- `guns-for-hands.mp3`
- `fade-into-you.mp3`
- `jungle.mp3`
- `made-in-japan.mp3`
- `ella-viene-del-futuro.mp3`

Al entrar, la lista se reproduce en **orden aleatorio**. Si un archivo falta, el reproductor
muestra un aviso en vez de romperse.

Para cambiar, quitar o agregar canciones, edita el arreglo `songs` al final de
`src/data/content.ts` y pon el MP3 con ese nombre en `public/music/`.

---

## 5. Compilar para producción

```powershell
npm run build
```

Genera la carpeta `dist/`, que es el sitio ya listo (HTML, CSS, JS, imágenes y música).
Para revisarlo tal como quedará publicado:

```powershell
npm run preview
```

Otros comandos:

```powershell
npm run lint     # revisa el código con oxlint
npx tsc -b       # solo revisa los tipos de TypeScript
```

---

## 6. Desplegar (publicar en internet)

> **Lo más importante que debes saber:** el código pide las imágenes y la música con rutas
> absolutas (`/images/...`, `/music/...`). Eso funciona perfecto si el sitio vive en la **raíz** de
> un dominio (por ejemplo `https://algo.vercel.app/`), pero **se rompe si vive en una subcarpeta**
> (como `https://usuario.github.io/May-16-sep-Proyect/`). Por eso te recomiendo Vercel o Netlify.
> Más abajo explico el caso de GitHub Pages.

### Opción A · Vercel (recomendada, gratis)

1. Sube tus cambios a GitHub:

   ```powershell
   git add .
   git commit -m "Ajustes finales"
   git push origin main
   ```

2. Entra a <https://vercel.com> y crea una cuenta con **Continue with GitHub**.
3. Haz clic en **Add New… → Project**.
4. Busca el repositorio `May-16-sep-Proyect` y presiona **Import**.
5. Vercel detecta Vite solo. Verifica que diga:
   - Framework Preset: **Vite**
   - Build Command: `npm run build`
   - Output Directory: `dist`
6. Presiona **Deploy** y espera ~1 minuto.
7. Te da una URL tipo `https://may-16-sep-proyect.vercel.app`. Esa es la que le mandas a ella.

Desde ese momento, cada `git push origin main` vuelve a publicar automáticamente.

Si prefieres hacerlo por terminal:

```powershell
npm install -g vercel
vercel login
vercel --prod
```

### Opción B · Netlify sin Git (lo más rápido de todo)

1. `npm run build`
2. Entra a <https://app.netlify.com/drop>
3. Arrastra la carpeta **`dist`** completa a esa página.
4. Listo, te da una URL al instante.

Para actualizarla después: vuelve a correr `npm run build` y arrastra `dist` otra vez.

### Opción C · GitHub Pages (requiere un cambio de código)

GitHub Pages publica los proyectos en una subcarpeta
(`https://rgodinez-2024247.github.io/May-16-sep-Proyect/`). Como el código usa rutas absolutas,
**las imágenes y la música darían error 404** si lo publicas así sin más.

Para que funcione hay que hacer dos cosas:

1. Decirle a Vite en qué subcarpeta vive. En `vite.config.ts`:

   ```ts
   export default defineConfig({
     plugins: [react()],
     base: '/May-16-sep-Proyect/',
   })
   ```

2. Cambiar las ~46 rutas absolutas del código para que respeten esa base, usando
   `import.meta.env.BASE_URL`. Están en `src/data/content.ts`, `src/data/puzzle.ts`,
   `src/App.tsx`, `src/components/Entrance.tsx` y `src/components/LetterRoses.tsx`.

Si de plano quieres GitHub Pages, pídemelo y hago ese cambio. Mientras no se haga, usa Vercel o
Netlify, donde el proyecto funciona tal como está.

---

## 7. Estructura del proyecto

```
May-16-sep-Proyect/
├── index.html                    punto de entrada y fuentes de Google
├── vite.config.ts                configuración de Vite
├── package.json                  dependencias y comandos
├── public/                       archivos que se copian tal cual al sitio
│   ├── images/
│   │   ├── bg-crumpled-pink.png        fondo de papel arrugado
│   │   ├── hero-cat.png                el gatito de arriba (sin fondo)
│   │   ├── white-roses.png             rosas de las cartas
│   │   ├── puzzle-heart.png            imagen original del rompecabezas
│   │   ├── puzzle-pieces/p0..p23.png   las 24 piezas ya cortadas
│   │   └── characters/                 Cinnamoroll, Hello Kitty, Chococat
│   └── music/                    los 8 MP3
├── scripts/                      utilidades que se corren a mano (no son parte del sitio)
└── src/
    ├── App.tsx                   arma la página completa
    ├── index.css                 TODOS los estilos
    ├── data/
    │   ├── content.ts            cartas, personajes, canciones, pinturas, gatos
    │   └── puzzle.ts             posición y tamaño de cada pieza (generado)
    └── components/
        ├── Entrance.tsx          pantalla de entrada y el botón "No" que huye
        ├── CharacterGifts.tsx    los personajes y el modal de la carta
        ├── LetterRoses.tsx       las rosas de arriba y abajo
        ├── PuzzleGame.tsx        el rompecabezas arrastrable
        ├── MusicPlayer.tsx       el reproductor
        └── Background.tsx        el fondo
```

---

## 8. Cómo editar el contenido

Casi todo el texto está en un solo archivo: **`src/data/content.ts`**.

| Qué quieres cambiar | Dónde |
|---|---|
| El texto de las tres cartas | `letters` en `src/data/content.ts` |
| Qué personaje abre qué carta | `characters` en `src/data/content.ts` |
| La lista de canciones | `songs` en `src/data/content.ts` |
| "Feliz cumpleaños / mi niña" | `src/App.tsx` |
| "Te quiero mi niña. Felices 23 May." | `src/App.tsx` |
| "Hola, Baby… esto es solo para ti." | `src/App.tsx` |
| La pregunta y los botones Sí/No | `src/components/Entrance.tsx` |
| El "Yupiii" al terminar el rompecabezas | `src/components/PuzzleGame.tsx` |
| Colores y tipografías | variables `:root` al inicio de `src/index.css` |

Los colores principales están arriba de `src/index.css`:

```css
--rose-500: #c45a72;   /* rosa fuerte de los títulos */
--ink: #6b2647;        /* ciruela de los textos */
--ink-soft: #8f5f75;   /* ciruela suave de los subtítulos */
```

**Nota:** en `content.ts` siguen existiendo `paintings` (las pinturas) y `cats` (Arcadio, Oso y
Fuhrer). Están completos pero a propósito ningún personaje los abre, así que no se ven en la
página. Si algún día los quieres de vuelta, hay que agregar un personaje que los muestre.

---

## 9. Regenerar imágenes (solo si cambias las originales)

En `scripts/` hay utilidades que se corren **a mano** y solo cuando quieres reemplazar una imagen.
No hacen falta para desplegar.

```powershell
# Corta public/images/puzzle-heart.png en las 24 piezas y regenera src/data/puzzle.ts
node scripts/cut-cat-and-puzzle.cjs

# Quita el fondo de los tres personajes
node scripts/rembg-party.cjs

# Quita el fondo de Chococat
node scripts/rembg-chococat.cjs
```

**Para cambiar la imagen del rompecabezas:** reemplaza `public/images/puzzle-heart.png` por la
nueva (mismo nombre) y corre `node scripts/cut-cat-and-puzzle.cjs`. El script vuelve a cortar las
24 piezas con forma de ficha y actualiza `src/data/puzzle.ts`.

---

## 10. Problemas comunes

**"No se ve nada / pantalla en blanco"**
Revisa la terminal donde corre `npm run dev`; ahí aparecen los errores. También abre la consola del
navegador con `F12`.

**"Abrí localhost:5173 y no carga"**
Puede que Vite haya usado otro puerto porque el 5173 estaba ocupado. Mira la dirección exacta que
imprimió la terminal.

**"La música no suena"**
Los navegadores no permiten reproducir audio sin una interacción del usuario. La música arranca
después de dar clic en **"Sí"**; si nada suena, usa el botón ▶ del reproductor.

**"Las imágenes no cargan después de publicar"**
Es el tema de la sección 6: el sitio debe vivir en la raíz del dominio. Usa Vercel o Netlify.

**"npm install falla"**
Borra y reinstala:

```powershell
Remove-Item -Recurse -Force node_modules, package-lock.json
npm install
```

**"Quiero volver a un estado anterior"**

```powershell
git log --oneline        # ver los commits
git checkout <hash>      # ver cómo estaba en ese momento
git checkout main        # regresar
```

---

Los diagramas Mermaid de ejemplo que estaban en este archivo se movieron a
[`docs/mermaid-ejemplos.md`](docs/mermaid-ejemplos.md).
