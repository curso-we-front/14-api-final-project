# 14 — Proyecto Final: API REST Completa

## Objetivo

Construir una API REST production-ready de principio a fin, integrando todo lo aprendido en el curso.

## Descripción

Vas a construir la API de un **sistema de gestión de contenidos (CMS) para un blog**. La API debe soportar múltiples autores, categorías, comentarios, sistema de roles y estar correctamente documentada.

## Requisitos funcionales

### Autenticación
- Registro, login, refresh token, logout
- Roles: `admin`, `editor`, `author`, `reader`

### Artículos
- CRUD completo
- Un artículo tiene: título, contenido, slug (auto), categorías, tags, autor, estado (`draft`|`published`|`archived`)
- Solo `editor` y `admin` pueden publicar artículos
- Solo el autor (o admin/editor) puede editar/borrar

### Categorías
- CRUD (solo admin y editor)
- Un artículo puede tener múltiples categorías

### Comentarios
- Cualquier usuario autenticado puede comentar
- El autor del comentario o un admin puede borrar su comentario
- Los comentarios pueden tener respuestas (1 nivel de anidación)

### Búsqueda y filtros
- `GET /articles?status=published&category=tech&author=id&q=texto&page=1&limit=10&sort=createdAt`

## Requisitos técnicos

- [ ] Express + (MySQL **o** MongoDB, elige uno y justifícalo en el README)
- [ ] Autenticación JWT con refresh tokens
- [ ] Validación de todos los inputs
- [ ] Manejo centralizado de errores
- [ ] Rate limiting en endpoints públicos y de auth
- [ ] Variables de entorno para toda la configuración
- [ ] Tests de integración cubriendo los flujos principales
- [ ] `README.md` con instrucciones claras para levantar el proyecto

## Estructura sugerida

```
14-api-final-project/
├── src/
│   ├── config/
│   │   └── index.js          ← toda la config centralizada
│   ├── db/
│   │   └── connection.js
│   ├── models/ (o db/queries)
│   ├── controllers/
│   │   ├── auth.js
│   │   ├── articles.js
│   │   ├── categories.js
│   │   └── comments.js
│   ├── middlewares/
│   │   ├── auth.js
│   │   ├── authorize.js
│   │   ├── validate.js
│   │   ├── rateLimit.js
│   │   └── errorHandler.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── articles.js
│   │   ├── categories.js
│   │   └── comments.js
│   ├── utils/
│   │   └── asyncHandler.js
│   └── app.js
├── tests/
│   ├── auth.test.js
│   ├── articles.test.js
│   ├── categories.test.js
│   └── comments.test.js
├── .env.example
├── package.json
└── README.md                 ← documentación del proyecto
```

## Entregables

1. Repositorio con el código completo
2. `README.md` con:
   - Decisión de BD y justificación
   - Instrucciones de instalación y arranque
   - Lista de todos los endpoints con método, ruta, auth requerida y descripción
   - Ejemplos de requests con curl o Postman
3. Los tests deben pasar con `npm test`

## Criterios de evaluación

- [ ] Todos los endpoints funcionan correctamente
- [ ] La autenticación y autorización está implementada en todos los recursos
- [ ] Los errores se manejan correctamente (nunca un 500 sin capturar)
- [ ] Los tests cubren al menos los flujos: registro/login, CRUD de artículos, permisos
- [ ] El código está organizado siguiendo el patrón aprendido en el curso
- [ ] No hay credenciales hardcodeadas (todo en `.env`)
