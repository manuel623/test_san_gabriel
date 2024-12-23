# Proyecto Test San Gabriel

Este proyecto está dividido en dos partes: **backend** y **frontend**. A continuación, te explico los pasos que debes seguir para levantar ambos servicios correctamente

## Requisitos previos

### Backend
- **PHP 8** instalado en tu máquina.
- **Composer** instalado (gestor de dependencias de PHP)
- Tener una base de datos local en funcionamiento

### Frontend
- **Angular 17** instalado.
- **Node.js** en versión 16.20.2 o superior

---

## Instrucciones para la Base de Datos

Es fundamental que la base de datos esté corriendo en tu entorno local antes de levantar el backend. 
Asegúrate de que el puerto y las credenciales de conexión sean correctas en el archivo .env del backend.

---

## Instrucciones para el backend

1. Navega a la carpeta `text_back`
2. Ejecutar `composer install` para instalar dependencias
3. Ejecutar `php artisan migrate` para migrar la base de datos
4. Ejecutar `php artisan db:seed` para poblar la base de datos con datos de prueba
5. Ejecutar `php artisan serve` para levantar el servidor

## IMPORTANTE

Verifica el archivo .env para asegurarse de que la configuración de la base de datos esté correcta. Especialmente.
Revisa que el puerto de la base de datos coincida con el que estás utilizando en tu entorno local

-Si por alguna razón da este error:
Personal access client not found. Please create one.

Significa que la llave para iniciar sesión del cliente no se creo correctamente, siga estos pasos:

1. php artisan passport:client --personal


al seguir los pasos que ahí se muestran debe colocar esto en el .env 
(Recordar que es un ejemplo y que en Client1 y 2 debe colocar lo que arroje la consola):
CLIENT_1=1
CLIENT_2=PM4l50aDdFewB3AJnkSpMIByOz1BwqftXVRSUxZc

---

## Instrucciones para el frontend

1. Navega a la carpeta `text_front`
2. Ejecutar `npm install` para instalar dependencias
3. Ejecutar `npm start` para levantar el servidor

## IMPORTANTE

Si llega a presentar fallas en la reproducción al iniciar y/o recargar la pagina
Se recomienda hacer clic (interactuar) sobre la pagina antes de cargar un video y/o banner, debido a seguridad que presentan los navegadores


