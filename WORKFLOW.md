# Flujo de Trabajo Git (Cheat Sheet)

## 1. Programar nuevas funciones (Día a día)
Siempre trabaja sobre la rama `develop`.

```bash
# Cambiar a la rama de desarrollo
git checkout develop

# ... haces cambios en tu código ...

# Agregar cambios
git add .

# Guardar cambios (Commit)
git commit -m "feat: implement backend api endpoint"

# Subir a la nube
git push origin develop
```

## 2. Pasar cambios a Producción (Release)
Cuando confirmes que `develop` funciona perfecto y quieras actualizar el servidor en la nube:

```bash
# 1. Ir a la rama de producción
git checkout main

# 2. Fusionar los cambios de desarrollo
git merge develop

# 3. Subir a producción
git push origin main

# 4. Volver a desarrollo para seguir trabajando
git checkout develop
```
