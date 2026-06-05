# 📝 Blog API - Node.js + Express + MySQL

API REST completa de un blog con autenticación JWT, artículos, categorías y comentarios con respuestas (1 nivel de anidación).

---

# 🧠 Decisión de Base de Datos

Se ha elegido **MySQL** por:

- Modelo relacional adecuado para entidades conectadas (users, articles, categories, comments)
- Soporte para relaciones **1:N y N:M**
- Integridad referencial mediante claves foráneas
- Buen rendimiento en consultas estructuradas
- Facilidad de uso con Node.js (mysql2)

---

## 📊 Modelo de datos

- **users** → usuarios registrados (autores y lectores)
- **articles** → artículos del blog
- **categories** → categorías de artículos
- **article_categories** → relación N:M entre artículos y categorías
- **comments** → comentarios con soporte de respuestas (parent_id)

---

# 🚀 Instalación y arranque

## 1. Clonar repositorio

```bash
git clone <URL_REPOSITORIO>
cd blog-api