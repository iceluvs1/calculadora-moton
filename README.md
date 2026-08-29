# Calculadora de motón

PWA móvil para calcular el peso mínimo requerido del motón de gancho con la fórmula:

**Aplicación publicada:** https://calculadora-moton.awkwardss.chatgpt.site

`G = L × M × N × F`

- **L:** largo total de pluma (m)
- **M:** peso del cable según diámetro (kg/m)
- **N:** número de ramales
- **F:** factor correspondiente al número de ramales

La aplicación también muestra la recomendación indicada en el documento: aumentar el peso calculado en un 10%, sin exceder la capacidad máxima de carga de la configuración de pluma.

## Abrir en Visual Studio Code

1. Abre esta carpeta en Visual Studio Code.
2. Abre **Terminal → Nuevo terminal**.
3. Ejecuta `npm install`.
4. Ejecuta `npm run dev`.
5. Abre la dirección local que aparece en la terminal.

## Publicar en GitHub Pages

La carpeta `dist-github` contiene la versión estática lista para GitHub Pages. El flujo incluido en `.github/workflows/deploy-pages.yml` la publica automáticamente al subir el proyecto a la rama `main`.

En el repositorio de GitHub, entra a **Settings → Pages** y selecciona **GitHub Actions** como origen. Después de la primera publicación, abre la URL desde el celular y usa **Agregar a pantalla de inicio**.

## Verificación de referencia

Con 70 m de pluma principal, 28 m de pluma adicional, cable de 28 mm y 12 ramales, el resultado es:

- Peso mínimo: **7.414 kg**
- Recomendado con 10%: **8.155 kg**
