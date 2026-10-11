/* Brota - Herramientas de Google: datos, buscador, filtros por categoría y ventana con la idea para Brota. */
(function () {
  var B = window.Brota, qs = B.qs, qsa = B.qsa, L = B.L;
  if (!qs("#grid")) return;
  var CATS = [
    ["todas", "Todas", "All"], ["docs", "Documentos", "Documents"], ["org", "Organización", "Organization"],
    ["com", "Comunicación", "Communication"], ["web", "Web y diseño", "Web and design"],
    ["datos", "Análisis", "Analytics"], ["ia", "IA", "AI"]
  ];
  var TOOLS = [
    { n: "Google Forms", s: "forms", c: "docs", u: "https://forms.google.com", d: ["Crea encuestas y formularios y recibe las respuestas en una hoja de cálculo.", "Create surveys and forms and get the answers in a spreadsheet."], i: ["Una encuesta a posibles clientes: ¿cada cuánto riegas tus plantas y cuántas se te han muerto?", "A survey for potential customers: how often do you water your plants and how many have died on you?"] },
    { n: "Google Docs", s: "docs", c: "docs", u: "https://docs.google.com/document", d: ["Editor de texto en línea donde varias personas escriben a la vez.", "Online text editor where several people write at the same time."], i: ["Redactar entre todos el manual de uso de la maceta y la ficha del producto.", "Write the planter's user manual and the product sheet together."] },
    { n: "Google Sheets", s: "sheets", c: "docs", u: "https://docs.google.com/spreadsheets", d: ["Hojas de cálculo en línea con fórmulas y gráficos.", "Online spreadsheets with formulas and charts."], i: ["Calcular el costo de la pila, la mecha y el depósito para fijar el precio de venta.", "Work out the cost of the battery, wick and tank to set the selling price."] },
    { n: "Google Slides", s: "slides", c: "docs", u: "https://docs.google.com/presentation", d: ["Presentaciones en línea para hacer en equipo.", "Online presentations you can build as a team."], i: ["Armar la presentación para mostrar Brota en clase.", "Build the presentation to show Brota in class."] },
    { n: "Google Drive", s: "drive", c: "org", u: "https://drive.google.com", pago: true, d: ["Almacenamiento en la nube para guardar y compartir archivos. Incluye 15 GB gratis; más espacio es de pago.", "Cloud storage to save and share files. It includes 15 GB free; extra space is paid."], i: ["Una carpeta compartida con el logo, las fotos del producto y los documentos del equipo.", "A shared folder with the logo, product photos and the team's documents."] },
    { n: "Google Calendar", s: "calendar", c: "org", u: "https://calendar.google.com", d: ["Calendario para agendar tareas y reuniones.", "Calendar to schedule tasks and meetings."], i: ["Marcar las fechas de entrega del prototipo y de la presentación.", "Mark the due dates for the prototype and the presentation."] },
    { n: "Google Keep", s: "keep", c: "org", u: "https://keep.google.com", d: ["Notas rápidas, listas y recordatorios.", "Quick notes, lists and reminders."], i: ["Apuntar ideas sueltas para mejorar el sensor de humedad.", "Jot down loose ideas to improve the moisture sensor."] },
    { n: "Google Meet", s: "meet", c: "com", u: "https://meet.google.com", d: ["Videollamadas y reuniones en línea.", "Video calls and online meetings."], i: ["Reunirse en video con el equipo o con un proveedor de macetas.", "Meet by video with the team or with a planter supplier."] },
    { n: "Gmail", s: "gmail", c: "com", u: "https://mail.google.com", d: ["Correo electrónico gratuito.", "Free email."], i: ["Un correo propio de Brota para recibir los mensajes de la gente interesada.", "A Brota email address to receive messages from interested people."] },
    { n: "Google Sites", s: "sites", c: "web", u: "https://sites.google.com", d: ["Crea páginas web sin programar.", "Build web pages without coding."], i: ["Un borrador rápido de la página de Brota antes de pasarla a código.", "A quick draft of the Brota site before turning it into code."] },
    { n: "Google Fonts", s: "fonts", c: "web", u: "https://fonts.google.com", d: ["Biblioteca gratuita de tipografías para la web.", "Free library of typefaces for the web."], i: ["Brota usa Fraunces, Caveat y Nunito Sans de aquí.", "Brota uses Fraunces, Caveat and Nunito Sans from here."] },
    { n: "Looker Studio", s: "looker-studio", c: "datos", u: "https://lookerstudio.google.com", d: ["Convierte datos en paneles y reportes visuales.", "Turns data into dashboards and visual reports."], i: ["Un panel con las visitas al sitio y las respuestas de la encuesta.", "A dashboard with site visits and the survey answers."] },
    { n: "Google Analytics", s: "analytics", c: "datos", u: "https://analytics.google.com", d: ["Mide cuántas personas visitan tu sitio y qué hacen en él.", "Measures how many people visit your site and what they do on it."], i: ["Ver qué página de Brota visita más la gente.", "See which Brota page people visit the most."] },
    { n: "Google Trends", s: "trends", c: "datos", u: "https://trends.google.com", d: ["Muestra cuánto se busca un tema en Google a lo largo del tiempo.", "Shows how much a topic is searched on Google over time."], i: ["Comparar el interés por «plantas de interior» y «maceta autorregable».", "Compare interest in \"indoor plants\" and \"self-watering planter\"."] },
    { n: "Gemini", s: "gemini", c: "ia", u: "https://gemini.google.com", pago: true, d: ["Asistente de IA para escribir, resumir y generar ideas. Los modelos más avanzados son de pago.", "AI assistant to write, summarize and generate ideas. The most advanced models are paid."], i: ["Pedir ideas de eslóganes o preguntas para la encuesta.", "Ask for slogan ideas or questions for the survey."] }
  ];
  var filtro = "todas", consulta = "";
  var COLORES = ["#F2B84B", "#6BB898", "#E9A583", "#9FC9E4", "#C9B8E8"];
  function norm(s) { return s.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase(); }
  function catNombre(id) { for (var i = 0; i < CATS.length; i++) if (CATS[i][0] === id) return CATS[i][B.lang === "en" ? 2 : 1]; return ""; }
  function renderTools() {
    qs("#filtros").innerHTML = CATS.map(function (c) {
      return '<button type="button" data-c="' + c[0] + '" aria-pressed="' + (filtro === c[0]) + '">' + c[B.lang === "en" ? 2 : 1] + '</button>';
    }).join("");
    var q = norm(consulta.trim());
    var lista = TOOLS.map(function (t, i) { t.k = i; return t; }).filter(function (t) {
      if (filtro !== "todas" && t.c !== filtro) return false;
      return !q || norm([t.n, L(t.d), L(t.i), catNombre(t.c)].join(" ")).indexOf(q) !== -1;
    });
    qs("#grid").innerHTML = lista.map(function (t) {
      return '<article class="tool card"><div class="ficha"><span class="letra" style="background:' + COLORES[t.k % COLORES.length] + '">' + t.n.replace("Google ", "").charAt(0) + '<img src="img/herramientas/' + t.s + '.png" alt="" hidden onload="this.hidden=false"></span><h3>' + t.n + '</h3></div>' +
        '<div><span class="chip">' + catNombre(t.c) + '</span>' + (t.pago ? ' <span class="chip pago">' + (B.lang === "en" ? "Has paid features" : "Con funciones de pago") + '</span>' : "") + '</div>' +
        '<p>' + L(t.d) + '</p><button type="button" class="btn" data-k="' + t.k + '">' + (B.lang === "en" ? "See the idea" : "Ver la idea") + '</button></article>';
    }).join("");
    var n = lista.length, total = TOOLS.length;
    qs("#contador").textContent = n === total ? (B.lang === "en" ? total + " tools" : total + " herramientas") : (B.lang === "en" ? "Showing " + n + " of " + total + " tools" : "Mostrando " + n + " de " + total + " herramientas");
    qs("#vacio").hidden = n !== 0;
  }
  qs("#buscador").addEventListener("input", function (e) { consulta = e.target.value; renderTools(); });
  qs("#filtros").addEventListener("click", function (e) { var b = e.target.closest("button[data-c]"); if (b) { filtro = b.dataset.c; renderTools(); } });
  var modal = qs("#modal"), abierta = null;
  function llenarModal() {
    if (abierta === null) return;
    var t = TOOLS[abierta];
    qs("#mTitulo").textContent = t.n;
    qs("#mCuerpo").innerHTML = '<p><span class="chip">' + catNombre(t.c) + '</span>' + (t.pago ? ' <span class="chip pago">' + (B.lang === "en" ? "Has paid features" : "Con funciones de pago") + '</span>' : "") + '</p><p>' + L(t.d) + '</p><p class="idea"><b>' + (B.lang === "en" ? "Idea for Brota:" : "Idea para Brota:") + '</b> ' + L(t.i) + '</p>';
    qs("#mEnlace").href = t.u;
  }
  qs("#grid").addEventListener("click", function (e) {
    var b = e.target.closest("button[data-k]"); if (!b) return;
    abierta = +b.dataset.k; llenarModal();
    if (modal.showModal) modal.showModal(); else modal.setAttribute("open", "");
  });
  function cerrar() { abierta = null; if (modal.close) modal.close(); else modal.removeAttribute("open"); }
  qs("#mCerrar").addEventListener("click", cerrar);
  modal.addEventListener("click", function (e) { if (e.target === modal) cerrar(); });
  modal.addEventListener("close", function () { abierta = null; });


  B.hooks.push(function () { renderTools(); llenarModal(); });
  renderTools();
})();
