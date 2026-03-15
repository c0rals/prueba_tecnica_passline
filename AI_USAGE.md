# Uso de la IA en la creación del test plan

## IAs utilizada

- Cursor	: Analisis del codigo y verificación de bugs y riesgos
- Chat GPT	: Respuestas a preguntas simples, verificación de gramatica y estructuración de documentos bajo una misma norma 

---

## Prompts o instrucciones utilizadas

**Cursor**
- "Analiza el código y dame un resumen de los posibles riesgos de negocio y tecnicos de la aplicación "
- "Necesito verificar los bugs que encuentres en la aplicación. Entregame una lista que posea - título - descripción - pasos para reproducir - resultado esperado - resultado observado - severidad estimada - impacto de negocio - sugerencia breve de mitigación"
- "cuando intento editar el precio de un libro por ejemplo a 100,la pagina meda unaa alerta de que entregue un valor valido y que los valores maas cercanos son 99.99 y 100.99, esto es considerable como un bug?"

**Chat GPT**
- "tengo este texto < archivo de texto > y necesito que tenga esta norma < texto con norma >"
- "necesito una definición básica para DONE de una aplicación de carrito de libros que posee < definición de la app >"
- "que pruebas son tipicas para cubrir los smoke tests de esta aplicación?"

---

## En qué partes influyó la IA? 

- Basicamente me ayudó a analizar todo el codigo en un par de instancias para poder corroborar mi trabajo y dar formato a los textos. A demás, es mas facil trabajar teniendo un respaldo que verifica automaticamente si mi trabajo tiene sentido. 

- Tambien se utilizó para definir bien los test de API y Smoke

## Partes adaptadas manualmente 

- Para el caso de los riesgos tuve que eliminar los que hablaban del Stripe ya que la aplicación era solo para testing
- En el caso de los bugs solo dejé los que habia encontrado y pude corroborar. La IA me entregó 7 bugs de los cuales no considere aceptables los que dependian de la versión de Mongo u otras tecnologias de la app
