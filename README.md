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
%%{init: {
  'theme': 'default',
  'themeVariables': {
    'primaryColor': '#9333ea',
    'primaryTextColor': '#fff',
    'lineColor': '#06b6d4'
  }
}}%%
quadrantChart
    title Priorización de tareas
    x-axis Bajo esfuerzo --> Alto esfuerzo
    y-axis Bajo impacto --> Alto impacto
    quadrant-1 Hacer ya
    quadrant-2 Planificar
    quadrant-3 Delegar
    quadrant-4 Eliminar
    Corregir typos: [0.2, 0.3]
    Actualizar docs: [0.3, 0.7]
    Añadir dark mode: [0.7, 0.4]
    Refactorizar auth: [0.8, 0.9]
```
```mermaid
timeline
    title Historia de Markdown
    2004 : John Gruber crea Markdown
    2012 : GitHub Flavored Markdown
    2014 : Especificación CommonMark
    2016 : Mermaid 1.0
    2022 : GitHub soporta Mermaid nativo
    2024 : Mermaid 11.0
```
```mermaid
mindmap
  root((Markdown))
    Sintaxis
      Básica
      Extendida
      Avanzada
    Herramientas
      Editores
      Conversores
      Generadores
    Usos
      Documentación
      Blogs
      Notas
      IA
```

```mermaid
pie title Lenguajes más usados en 2026
    "JavaScript" : 30
    "Python" : 25
    "TypeScript" : 18
    "Java" : 12
    "Go" : 8
    "Otros" : 7
```

```mermaid
gantt
    title Plan de desarrollo Q1 2026
    dateFormat YYYY-MM-DD
    excludes weekends

    section Backend
    Diseñar API           :a1, 2026-01-05, 5d
    Implementar endpoints :a2, after a1, 10d
    Tests de integración  :a3, after a2, 5d

    section Frontend
    Diseñar UI            :b1, 2026-01-05, 7d
    Implementar vistas    :b2, after b1, 12d
    Tests E2E             :b3, after b2, 3d

    section Deploy
    Configurar CI/CD      :c1, after a3, 3d
    Deploy a staging      :c2, after c1, 2d
    Deploy a producción   :milestone, after c2, 0d
```

```mermaid
sequenceDiagram
    participant C as Cliente
    participant S as Servidor

    C->>S: Login (usuario, password)

    alt Credenciales válidas
        S-->>C: Token JWT
    else Credenciales inválidas
        S-->>C: Error 401
    end

    Note over C,S: El token expira en 24h

    loop Cada petición
        C->>S: Request + Token
        S-->>C: Response
    end
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
