# Integración del formulario de contacto

## Estado actual

El formulario de `/contacto` está **completo en interfaz y servidor, pero sin proveedor de correo configurado**:

- Valida en el navegador y de nuevo en el servidor (`lib/contact.ts`, compartido).
- Antispam: campo trampa oculto, tiempo mínimo de 3 s para rellenarlo y límite de 5 envíos cada 10 min por IP.
- Ruta de servidor: `app/api/contacto/route.ts`. Las credenciales solo se leen en el servidor.
- **Sin las variables de entorno, la ruta responde 503 `not_configured`** y el formulario muestra: «El envío en línea todavía no está activado. Su mensaje no se ha enviado.», con un botón que abre un borrador en el correo del usuario dirigido a `recepcion@ivc.pe`.
- El mensaje «Mensaje enviado» **solo aparece si el proveedor confirma el envío** (HTTP 200).

## Activarlo (cuando IVC lo autorice)

1. IVC confirma el **destinatario** de las consultas y la **política de tratamiento de datos** aplicable al formulario.
2. Crear una cuenta en [Resend](https://resend.com) (u otro proveedor: ver más abajo) y **verificar el dominio** desde el que se enviará (registros DNS en el dominio de IVC).
3. Crear el archivo `web/.env.local` a partir de `web/.env.example`:

   ```bash
   RESEND_API_KEY=re_xxxxxxxx          # clave de API (secreta)
   CONTACT_TO_EMAIL=recepcion@ivc.pe   # destinatario autorizado por IVC
   CONTACT_FROM_EMAIL=Web IVC <web@dominio-verificado>
   ```

4. Reiniciar `npm run dev`. En producción, definir las mismas variables en el panel del hosting (nunca en el código ni con prefijo `NEXT_PUBLIC_`).
5. Probar un envío real y confirmar la recepción con IVC.

`.env.local` está excluido de git por `.gitignore`.

## Cambiar de proveedor

Solo hay que sustituir el bloque `fetch("https://api.resend.com/emails", …)` de `app/api/contacto/route.ts` por la llamada del proveedor elegido (SMTP corporativo, SendGrid, Postmark, etc.). La validación, el antispam y los estados de la interfaz no cambian.

## Recomendaciones para producción

- El límite por IP vive en memoria: en un despliegue con varias instancias conviene moverlo a un almacén compartido (p. ej. Redis/KV) o añadir un captcha respetuoso con la privacidad (Cloudflare Turnstile).
- Registrar los envíos sin guardar datos personales innecesarios.
- Las **denuncias** no deben llegar por este formulario: la web dirige a los canales oficiales de IVC (`/transparencia#denuncias`).
