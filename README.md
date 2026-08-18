# Para Marjorie · 16 de septiembre

Página-regalo de cumpleaños (23 años).

## Desarrollo

```bash
npm install
npm run dev
```

## Música

Coloca los archivos en `public/music/` con estos nombres:

- `loco.mp3`
- `really.mp3`
- `falling-in-love.mp3`
- `guns-for-hands.mp3`
- `fade-into-you.mp3`
- `casio.mp3`
- `made-in-japan.mp3`
- `ella-viene-del-futuro.mp3`

## Build

```bash
npm run build
npm run preview
```
```mermaid
sequenceDiagram
    participant U as Usuario
    participant F as Frontend
    participant A as API
    participant D as Base de datos

    U->>F: Envía formulario
    F->>A: POST /api/users
    A->>D: INSERT INTO users
    D-->>A: OK
    A-->>F: 201 Created
    F-->>U: Muestra confirmación
```
```mermaid
flowchart TD
    A[Push a main] --> B[GitHub Actions]
    B --> C[Instalar dependencias]
    C --> D[Ejecutar tests]
    D --> E{Tests pasan?}
    E -->|Sí| F[Build]
    E -->|No| G[Notificar fallo]
    F --> H[Deploy a producción]
    G --> I[Crear issue]
```

```mermaid
flowchart TB
    subgraph Frontend
        A[React] --> B[Next.js]
    end
    subgraph Backend
        C[Node.js] --> D[PostgreSQL]
    end
    B --> C
```
