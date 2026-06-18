// ============================================================
// EVENTS — 50 eventos del juego (3 actos + epílogo 46-50)
// ============================================================
const EVENTS = [
  // ACT I: LA TENSIÓN
  {
    id: 1,
    title: "El Llamado",
    subtitle: "Acto I · La Tensión · 18 de abril de 1810",
    narrative: [
      "La noche del 18 de abril cae sobre Buenos Aires con la densidad de un secreto largo tiempo guardado. Las calles adoquinadas están húmedas por la llovizna reciente, y los faroles de aceite proyectan sombras largas sobre las paredes encaladas. Caminas hacia la Iglesia del Pilar cuando una mano firme te detiene en el umbral.",
      "El hombre es de mediana edad, de mirada penetrante y ropa de comerciante. Susurra '{PLAYER}' con urgencia contenida. Dice llamarse Juan, aunque sus ojos dicen que ese no es su nombre verdadero. Te habla de libertad, de criollos como tú que merecen gobernar su propio destino, de un movimiento que ya está en marcha y necesita mensajeros de confianza.",
      "La ciudad respira diferente estas semanas. Las noticias de España —Napoleón en el trono, el Rey Fernando prisionero— han sacudido los cimientos del orden colonial. En las pulperías y en los salones se susurra: si el rey no puede gobernar, ¿quién tiene el derecho de hacerlo? Esta noche, ese susurro llega directamente a tus oídos.",
      "El hombre te extiende una mano. No es solo un saludo: es una invitación a cruzar una línea que, una vez cruzada, no podrá deshacerse. La lámpara de aceite parpadea entre ustedes como testigo mudo de este momento que podría cambiarlo todo."
    ],
    choices: [
      { text: "Aceptar sin dudarlo — el patriotismo exige valentía.", prest: 2, riesgo: 5, special: null, label: "A" },
      { text: "Pedir pruebas de legitimidad antes de comprometerte.", prest: 1, riesgo: 2, special: { title: "ENCUENTRO CON VIEYTES", text: "El hombre te conduce a la Jabonería de Hipólito Vieytes, donde conoces al propio líder del círculo patriota. Tu prudencia fue sabia: este grupo es real y tu posición dentro de él, más sólida." }, label: "B" },
      { text: "Declinar y considerar informar al Virrey.", prest: -99, riesgo: -99, gameOver: true, goText: "Elegiste la lealtad al orden colonial. Informas al Virrey sobre el encuentro. Los revolucionarios son advertidos y huyen. No formas parte de esta historia.", label: "C" }
    ]
  },
  {
    id: 2,
    title: "La Jabonería Clandestina",
    subtitle: "Acto I · La Tensión · 20 de abril de 1810",
    showCharacter: { id: 'belgrano', ctx: 'jaboneria' },
    narrative: [
      "La Jabonería de Hipólito Vieytes, en los márgenes de la ciudad, parece desde afuera un establecimiento comercial ordinario. Por dentro, es el corazón de la conspiración patriota. El olor a sebo se mezcla con el de papel y tinta fresca mientras una docena de hombres hablan en voz baja alrededor de una mesa larga.",
      "Vieytes —un hombre de ojos vivos y hablar preciso— te saluda con la sobriedad de quien carga secretos pesados. Junto a él reconoces a Manuel Belgrano, que teclea nerviosamente sobre la mesa mientras estudia documentos. Sobre la madera hay mapas, listas de nombres, hojas con argumentos filosóficos sobre la soberanía popular.",
      "Los documentos que alcanzas a leer son incendiarios: argumentan que la Junta Central de Sevilla ya no tiene autoridad legítima sobre el Río de la Plata, que el pueblo criollo debe asumir el gobierno en nombre del Rey cautivo. Son palabras que, en boca equivocada, significarían la horca.",
      "Vieytes te observa con atención mientras absorbes la escena. Esta es tu primera prueba real: ¿cómo te moverás en este espacio cargado de peligro y posibilidad?"
    ],
    choices: [
      { text: "Memorizar cada detalle con discreción y precisión.", prest: 1, riesgo: 3, label: "A" },
      { text: "Copiar en secreto fragmentos de los documentos más importantes.", prest: 3, riesgo: 9, label: "B" },
      { text: "Mantener perfil bajo, escuchar sin llamar la atención.", prest: 1, riesgo: -2, label: "C" }
    ]
  },
  {
    id: 3,
    title: "El Espía Realista",
    subtitle: "Acto I · La Tensión · 23 de abril de 1810",
    narrative: [
      "En el mercado público, mientras cumples un encargo para los revolucionarios, un comerciante de tez curtida y modales afectados se acerca a ti con demasiada naturalidad. Su nombre, dice, es Cienfuegos. Tiene negocios en Montevideo y conoce a gente de influencia. Su sonrisa revela dientes perfectos y ojos que no sonríen.",
      "La conversación deriva rápidamente hacia tus movimientos de los últimos días. ¿Con quiénes te has reunido? ¿Has notado agitación entre los criollos? Te ofrece una bolsa con monedas —son muchas— a cambio de información, envolviéndolo todo en un discurso sobre lealtad al rey y orden social.",
      "La señal es inequívoca: este hombre trabaja para el Virrey o para las autoridades realistas de Montevideo. Lo que no sabes es cuánto sabe ya, ni si te ha identificado como parte del movimiento patriota.",
      "El mercado bulle alrededor de ustedes. Nadie parece mirar, pero en Buenos Aires de 1810, todas las paredes tienen oídos. Tienes segundos para decidir cómo responder a esta trampa —o a esta oportunidad."
    ],
    choices: [
      { text: "Aceptar el dinero y darle información falsa calculada.", prest: 1, riesgo: 7, label: "A" },
      { text: "Rechazar con frialdad y alejarte sin levantar sospechas.", prest: 1, riesgo: -2, label: "B" },
      { text: "Fingir aceptar, memorizar sus datos y reportar todo a los patriotas.", prest: 2, riesgo: 4, label: "C" }
    ]
  },
  {
    id: 4,
    title: "Síntomas de Sospecha",
    subtitle: "Acto I · La Tensión · 27 de abril de 1810",
    narrative: [
      "Algo ha cambiado en las calles de Buenos Aires. Las rondas de milicianos son más frecuentes, los patrullajes nocturnos se han duplicado. Ves caras que reconoces en lugares donde no deberían estar. ¿Te siguen, o es la paranoia del conspirador que ya no distingue amenazas reales de sombras propias?",
      "La respuesta llega esta tarde cuando un militiano —joven, nervioso, con uniforme demasiado nuevo— te intercepta en la esquina de la Plaza. Dice que es rutina. Te pide nombre, oficio, destino. Sus ojos se mueven demasiado rápido. Detrás de él, otro hombre de civil observa desde la sombra de un portal.",
      "Recuerdas las palabras de Vieytes: 'Un mensajero descubierto es una red completa destruida.' En este momento, todo el movimiento patriota —sus reuniones, sus documentos, sus planes— pende de la calidad de tu actuación en los próximos minutos.",
      "El militiano espera tu respuesta. El hombre del portal da un paso hacia la luz."
    ],
    choices: [
      { text: "Mentir con total convicción, inventar una historia comercial completa.", prest: 1, riesgo: 10, label: "A" },
      { text: "Decir una verdad parcial: eres mensajero de un comerciante de la zona.", prest: 1, riesgo: 3, label: "B" },
      { text: "Mostrarte exageradamente cooperativo para no levantar más sospechas.", prest: 1, riesgo: 2, label: "C" }
    ]
  },
  {
    id: 5,
    title: "El Mensajero de Confianza",
    subtitle: "Acto I · La Tensión · 2 de mayo de 1810",
    narrative: [
      "Han pasado dos semanas desde tu reclutamiento y los líderes patriotas han observado tus movimientos con la misma atención con que un orfebre estudia el oro. Esta noche, en una casa de la calle Reconquista, Belgrano mismo te convoca. '{PLAYER}', dice sin preámbulos, 'la causa necesita alguien en quien confiar plenamente.'",
      "El hombre que ha fundado el Consulado de Comercio y soñado con una nación libre te mira con la mezcla de urgencia y esperanza que caracteriza a quien sabe que el tiempo se acaba. Tu primera misión real: llevar un mensaje cifrado a un contacto en el barrio de San Telmo. El documento contiene información sobre el número de tropas realistas en el Fuerte.",
      "Es el punto de no retorno. Hasta ahora has sido un observador, un aprendiz. Este encargo te convierte en parte activa de la conspiración. Si te detienen, el documento es evidencia suficiente para encarcelarte. Si lo cumples, ganas la confianza total del círculo patriota.",
      "Belgrano extiende el sobre sellado. Sus manos no tiemblan. Las tuyas, en cambio, sí."
    ],
    choices: [
      { text: "Aceptar la misión sin hesitar — la causa lo exige.", prest: 3, riesgo: 6, label: "A" },
      { text: "Aceptar, pero pedir entrenamiento rápido en contraespionaje.", prest: 1, riesgo: 2, special: { title: "LECCIÓN DE UN VETERANO", text: "Un hombre que fue espía durante las Invasiones Inglesas te enseña en una hora técnicas de comunicación segura, rutas de escape y cómo destruir un mensaje sin evidencias. Eres mejor mensajero desde hoy." }, label: "B" },
      { text: "Exigir compensación económica por el riesgo asumido.", prest: 0, riesgo: -3, label: "C" }
    ]
  },
  {
    id: 6,
    title: "Rumores en el Puerto",
    subtitle: "Acto I · La Tensión · 8 de mayo de 1810",
    narrative: [
      "El puerto de Buenos Aires nunca duerme del todo. Mientras cumples la misión, escuchas en un muelle a dos marineros que discuten en voz alta lo que claramente deberían callar: refuerzos realistas están por llegar desde Montevideo. Una fragata con tropas y armas destinadas a 'restablecer el orden' en Buenos Aires.",
      "La información es crucial. Si es cierta, los planes del movimiento patriota deben acelerarse o modificarse. La ventana para actuar sin represión militar se está cerrando. Pero también puede ser una trampa: información falsa plantada para que los patriotas se precipiten y cometan errores.",
      "Calculas el tiempo: si las tropas llegan en una semana, el Cabildo Abierto que los patriotas planean para el 22 de mayo podría realizarse bajo ocupación militar. Eso cambiaría todo.",
      "El sol está cayendo sobre el Río de la Plata y tienes que tomar una decisión sobre esta información urgente antes de que la oportunidad de actuar se pierda."
    ],
    choices: [
      { text: "Correr inmediatamente a advertir a los patriotas con toda la información.", prest: 2, riesgo: 10, label: "A" },
      { text: "Investigar una hora más para confirmar antes de reportar.", prest: 1, riesgo: 5, label: "B" },
      { text: "Esperar a tener fuentes más confiables — la precipitación mata revoluciones.", prest: 1, riesgo: -2, label: "C" }
    ]
  },
  {
    id: 7,
    title: "French y Beruti: Las Cintas",
    subtitle: "Acto I · La Tensión · 21 de mayo de 1810",
    showCharacter: { id: 'french', ctx: 'escarapelas' },
    narrative: [
      "Dos hombres que van a escribir su nombre en la historia con gestos pequeños te buscan esta tarde: Domingo French y Antonio Luis Beruti. French es militar de carácter, Beruti es abogado de ideas encendidas. Juntos han organizado lo que nadie había pensado organizar: la movilización popular para el Cabildo Abierto del 22 de mayo.",
      "Su plan es simple y audaz. Distribuirán escarapelas de tela celeste y blanca entre la multitud para identificar a los patriotas, crear unidad visual, y señalar a los indecisos que hay un movimiento organizado —no solo una protesta espontánea. Necesitan mensajeros discretos que lleven las cintas a distintos barrios sin ser interceptados.",
      "También necesitan que la gente llegue al Cabildo. No cualquier gente: gente que sepa que está ahí para respaldar una revolución, no para mirar un espectáculo. French te mira con su directness militar: '¿Podés tener veinte personas de confianza en la plaza mañana a las ocho?'",
      "Beruti agrega en voz más baja que si el plan falla y los identifican como organizadores, los dos irán presos antes del amanecer del 22. La escarapela que te extienden es un símbolo y una sentencia posible al mismo tiempo."
    ],
    choices: [
      { text: "Aceptar distribuir cintas y reclutar veinte personas para la plaza.", prest: 2, riesgo: 8, label: "A" },
      { text: "Aceptar solo la distribución de cintas, sin el reclutamiento visible.", prest: 1, riesgo: 4, label: "B" },
      { text: "Ayudar a planificar pero sin participar directamente — el riesgo es demasiado alto.", prest: 0, riesgo: -4, label: "C" }
    ]
  },
  {
    id: 8,
    title: "El Cabildo Abierto",
    subtitle: "Acto I · La Tensión · 22 de mayo de 1810",
    showCharacter: { id: 'cisneros', ctx: 'cabildoabierto' },
    narrative: [
      "El Cabildo Abierto del 22 de mayo es un campo de batalla que parece una sala de reunión. Cuatrocientos cincuenta y un vecinos han sido convocados a votar sobre el destino del Virrey Cisneros. Afuera, la plaza ya tiene gente apostada desde el amanecer, muchos con las cintas que French y Beruti distribuyeron. Adentro, el debate es feroz.",
      "El Obispo Lué y Riega — voz del orden colonial — argumenta que los americanos nunca podrán gobernarse solos, que la tutela peninsular es un bien necesario. La sala reacciona con un murmullo que no es respeto. Luego habla el Dr. Castelli con una precisión que desarma: si la metrópoli ha caído, la soberanía retorna al pueblo.",
      "Tu rol hoy no es votar —no sos de los cuatrocientos cincuenta y uno— sino manejar la presión exterior. La multitud en la plaza necesita señales de lo que ocurre adentro para mantenerse cohesionada. Si la gente se dispersa, el Cabildo puede ignorar el peso popular.",
      "Un correo te trae una nota urgente de French: hay rumores de que Cisneros envió a buscar refuerzos militares al Fuerte. Si llegan antes de que el Cabildo vote, todo puede cambiar."
    ],
    choices: [
      { text: "Ir al Fuerte a verificar el rumor y retrasar si es posible el movimiento de tropas.", prest: 3, riesgo: 14, label: "A" },
      { text: "Quedarte coordinando la multitud en la plaza — es la presión más importante.", prest: 2, riesgo: 6, label: "B" },
      { text: "Entrar al Cabildo a reportar el rumor directamente a Castelli o Moreno.", prest: 1, riesgo: 9, label: "C" }
    ]
  },
  {
    id: 9,
    title: "La Traición de Cisneros",
    subtitle: "Acto I · La Tensión · 23 de mayo de 1810",
    showCharacter: { id: 'castelli', ctx: 'contrarrevolucion' },
    narrative: [
      "El resultado del Cabildo Abierto es un golpe para los patriotas: Cisneros no fue destituido. En cambio, se formó una Junta Provisional presidida por el propio Virrey, con algunos criollos como vocales. Es una maniobra que parece una concesión pero es, en realidad, un vaciamiento de la revolución.",
      "El movimiento patriota reacciona con indignación. Moreno está furioso con una frialdad que asusta más que el enojo. Belgrano dice que esto no puede aceptarse. Saavedra, sorprendentemente, está de acuerdo: Cisneros al frente de cualquier junta hace imposible el cambio real.",
      "La tarea de esta noche es organizar una nueva presión coordinada: los cuerpos militares patriotas deben negarse a obedecer a la Junta fraudulenta, los comerciantes criollos deben cerrar sus tiendas en señal de protesta, y la plaza debe llenarse nuevamente mañana con una demanda clara: Cisneros fuera, sin condiciones.",
      "Sos el coordinador entre estos tres grupos — militares, comerciantes, pueblo — que deben actuar al mismo tiempo para que la presión sea irresistible. Si uno falla, los otros quedan expuestos."
    ],
    choices: [
      { text: "Priorizar a los militares — sin ellos, los otros grupos son vulnerables.", prest: 2, riesgo: 7, label: "A" },
      { text: "Coordinar los tres grupos simultáneamente aunque sea más difícil y riesgoso.", prest: 3, riesgo: 13, label: "B" },
      { text: "Concentrarte en el pueblo en la plaza — la presión visible es el argumento más poderoso.", prest: 1, riesgo: 9, label: "C" }
    ]
  },

  // ACT II: LA REVOLUCIÓN
  {
    id: 10,
    title: "La Noche de Tensión",
    subtitle: "Acto I · La Tensión · 24 de mayo de 1810",
    narrative: [
      "Es la noche del 24 de mayo. Mañana, todo cambia —o todo termina. Estás en una casa segura del barrio de la Merced con una docena de revolucionarios: funcionarios criollos, militares jóvenes, abogados de la Audiencia, un sacerdote de ideales avanzados. La vela en el centro de la mesa los ilumina a todos con la misma luz inquieta.",
      "Moreno está repasando documentos en silencio. Castelli camina de un lado al otro, componiendo en voz baja los argumentos que pronunciará mañana. Saavedra, el más veterano, fuma en pipa con la calma de quien ha visto otras noches difíciles y ha sobrevivido.",
      "La tensión es física: se respira, se palpa, pesa sobre los hombros. Algunos están exaltados, otros silenciosos. Uno de ellos —un joven abogado— te confiesa entre dientes que tiene miedo y que no sabe si están haciendo lo correcto. Sus dudas son las tuyas.",
      "En este momento, más allá de las estrategias y los documentos, el grupo necesita algo humano: cohesión, certeza, la sensación de que mañana no están solos. ¿Cuál es tu rol esta noche?"
    ],
    choices: [
      { text: "Expresar tus dudas honestamente — la revolución necesita cabezas frías.", prest: 0, riesgo: -2, label: "A" },
      { text: "Motivar al grupo con palabras apasionadas sobre el futuro que construyen.", prest: 2, riesgo: 3, label: "B" },
      { text: "Mantener la calma y revisar los detalles logísticos de mañana.", prest: 1, riesgo: -4, label: "C" }
    ]
  },
  {
    id: 11,
    title: "Secretos Peligrosos",
    subtitle: "Acto I · La Tensión · 24 de mayo de 1810, medianoche",
    narrative: [
      "Mientras los demás duermen o descansan, uno de los revolucionarios más radicales —un hombre que conoces solo como 'el Tucumano'— te llama aparte hacia la cocina. Hay algo en su mirada que no has visto antes: no es entusiasmo ni miedo. Es determinación fría, casi calculada.",
      "En voz muy baja, te revela algo que te sacude: dentro del grupo hay quienes planean, una vez ganada la revolución, ajustar cuentas con los principales líderes realistas. No un juicio —una ejecución. Quieren que nadie con poder suficiente sobreviva para revertir los cambios.",
      "Te pide que guardes silencio absoluto sobre esto. Dice que es 'necesario' para la estabilidad futura, que las revoluciones que dejan enemigos en pie acaban siendo devoradas por esos mismos enemigos. Sus argumentos tienen una lógica oscura que no puedes ignorar del todo.",
      "Estás solo en una cocina oscura, portando un secreto que podría definir el carácter moral de la revolución que defiendes. ¿Qué haces con esto?"
    ],
    choices: [
      { text: "Guardar el secreto absolutamente — no es el momento para divisiones internas.", prest: 1, riesgo: 2, label: "A" },
      { text: "Advertir a Moreno o Belgrano discretamente sobre estas intenciones.", prest: 1, riesgo: 5, label: "B" },
      { text: "Confrontar al Tucumano directamente sobre la inmoralidad de ese plan.", prest: 1, riesgo: 7, label: "C" }
    ]
  },
  {
    id: 12,
    title: "El Momento Crítico",
    subtitle: "Acto I · La Tensión · 25 de mayo de 1810, madrugada",
    showCharacter: { id: 'beruti', ctx: 'plaza25' },
    narrative: [
      "Suenan las campanas de la Catedral en la madrugada del 25 de mayo. No son las campanas de la misa: son el llamado. Miles de personas han inundado la Plaza de la Victoria desde el amanecer, muchas de ellas convocadas por mensajeros como tú durante las últimas noches. La plaza es un mar de sombreros, capas y escarapelas de tela blanca y celeste.",
      "El Cabildo es visible desde donde estás, con sus ventanas iluminadas por dentro. Ahí dentro se está decidiendo el futuro. Afuera, la multitud es la presión que debe empujar esa decisión en la dirección correcta. Los revolucionarios han planeado esto con precisión: el pueblo en la plaza no es decoración, es el argumento más poderoso.",
      "Tienes en tu bolsillo una pequeña bolsa de cintas y escarapelas, símbolos de la causa patriota. También tienes mensajes verbales para transmitir a ciertos líderes de grupos dentro de la multitud, coordinando posiciones estratégicas alrededor del Cabildo.",
      "Este es el momento para el cual has trabajado estas semanas. La historia se está escribiendo ahora mismo, y tú estás en el centro de ella."
    ],
    choices: [
      { text: "Distribuir las cintas y coordinar grupos, manteniendo perfil bajo.", prest: 1, riesgo: 9, label: "A" },
      { text: "Concentrarte en los mensajes de coordinación sin exponer tu identidad.", prest: 2, riesgo: 3, label: "B" },
      { text: "Mezclarte en la multitud como observador — registrar todo para la memoria histórica.", prest: 0, riesgo: -5, label: "C" }
    ]
  },
  {
    id: 13,
    title: "Voz en la Multitud",
    subtitle: "Acto I · La Tensión · 25 de mayo de 1810",
    narrative: [
      "Desde tu posición en la plaza, escuchas las voces que resuenan en el Cabildo mientras los debates se filtran por las ventanas abiertas. El Dr. Mariano Moreno —joven, apasionado, de voz cortante como filo— argumenta con una claridad que paraliza: 'La soberanía reside en el pueblo. Si el Rey no puede gobernar, el pueblo debe hacerlo.' Cada palabra cae sobre la plaza como una piedra en agua quieta.",
      "Luego habla Juan José Castelli. Lo llaman 'el tribuno' y esta tarde entienden por qué: su oratoria tiene la cadencia de quien ha estudiado los filósofos de la Ilustración y los ha digerido en experiencia viva. Habla de los derechos naturales del hombre, de la igualdad entre americanos y peninsulares, de una nueva forma de entender el poder.",
      "La multitud a tu alrededor reacciona con murmullos, aplausos contenidos, algunas exclamaciones que los militianos observan sin intervenir. Junto a ti hay personas de todas las condiciones: artesanos, comerciantes, estudiantes, algunos esclavos libertos. Todos están viviendo este momento.",
      "Un sector de la plaza, donde se concentran algunos peninsulares y funcionarios realistas, empuja en sentido contrario, argumentando que el orden debe mantenerse. El ambiente es eléctrico, no violento, pero podría cambiar en segundos."
    ],
    choices: [
      { text: "Animar apasionadamente al sector favorable a los oradores revolucionarios.", prest: 3, riesgo: 8, label: "A" },
      { text: "Escuchar atentamente y registrar todo mentalmente para tu reporte.", prest: 1, riesgo: 2, label: "B" },
      { text: "Debatir con quienes se oponen en la multitud, intentando convencerlos.", prest: 1, riesgo: 13, label: "C" }
    ]
  },

  // ACT II: LA REVOLUCIÓN

  // ACT II: LA REVOLUCIÓN
  {
    id: 14,
    title: "La Primera Junta",
    subtitle: "Acto II · La Revolución · 25 de mayo de 1810, tarde",
    showCharacter: { id: 'saavedra', ctx: 'primerajunta' },
    narrative: [
      "Ha sucedido. Cornelio Saavedra acaba de ser designado Presidente de la Primera Junta de Gobierno del Río de la Plata. A su lado: Mariano Moreno como Secretario, Juan José Castelli, Manuel Belgrano, Miguel de Azcuénaga y otros cuatro vocales, más dos secretarios. Nueve hombres que hoy cargan el peso de una nación que aún no sabe que existe.",
      "El ex-Virrey Cisneros ha sido destituido. El orden colonial de trescientos años acaba de resquebrajarse en una tarde de mayo. No hubo sangre —todavía— pero hubo una revolución que la historia recordará como silenciosa solo desde la distancia: quienes la vivieron saben que fue la tormenta más intensa que ha atravesado esta ciudad. Y vos, {PLAYER}, estuviste ahí.",
      "Las calles están llenas de personas que celebran, pero también de otras que miran desde sus ventanas cerradas con expresión de quien no sabe qué significa este cambio para ellos. No todos en Buenos Aires eran patriotas. No todos querían esto.",
      "Tú estás en la plaza mientras las campanas vuelven a sonar, esta vez en celebración. ¿Cómo procesas lo que acabas de hacer parte de construir?"
    ],
    choices: [
      { text: "Celebrar públicamente tu alegría con los patriotas —que sepan de qué lado estás.", prest: 1, riesgo: 11, label: "A" },
      { text: "Mantener cautela: la celebración visible puede exponerte a represalias futuras.", prest: 1, riesgo: -2, label: "B" },
      { text: "Buscar a Saavedra personalmente para ofrecerte como colaborador formal.", prest: 2, riesgo: 6, label: "C" }
    ]
  },
  {
    id: 15,
    title: "Moreno y el Decreto",
    subtitle: "Acto II · La Revolución · 27 de mayo de 1810",
    showCharacter: { id: 'moreno', ctx: 'decreto' },
    narrative: [
      "Mariano Moreno trabaja de noche. Siempre. Esta noche está redactando el decreto que abrirá el comercio libre del Río de la Plata con todas las naciones neutrales y amigas — un golpe al monopolio comercial español. Te llama a su despacho no para pedirte ayuda con el texto, sino para algo diferente: necesita que lleves copias del borrador a tres juristas de confianza antes del amanecer.",
      "El decreto debe publicarse en dos días y cada hora cuenta. Pero en el camino hacia el primer jurista, el hombre que te siguió desde la Jabonería de Vieytes vuelve a aparecer. Esta vez no hay duda: es un seguidor profesional.",
      "Tenés en tus manos uno de los documentos más importantes de la revolución y alguien sabe que lo tenés. Moreno fue claro antes de que partieras: este borrador no puede caer en manos realistas antes de su publicación. Si cae, habrá tiempo para preparar una respuesta que neutralice su efecto.",
      "El seguidor aminora el paso cuando vos lo hacés. Hay tres callejones en esta cuadra. Tenés quince segundos para decidir."
    ],
    choices: [
      { text: "Confrontar al seguidor directamente con una historia de cobertura y desviarlo.", prest: 1, riesgo: 11, label: "A" },
      { text: "Cambiar la ruta, esconder el documento en un lugar seguro y buscar ayuda.", prest: 2, riesgo: 6, label: "B" },
      { text: "Destruir el borrador para proteger la información y regresar a Moreno a reportar.", prest: 1, riesgo: 3, special: { title: "LA IRA DE MORENO", text: "Moreno acepta tu decisión pero con la frialdad de quien no olvida. 'Destruir un documento de la revolución', dice, 'es una decisión que solo puede tomar quien lo escribió.' Tendrás que ganarte nuevamente su confianza." }, label: "C" }
    ]
  },
  {
    id: 16,
    title: "Purgas Internas",
    subtitle: "Acto II · La Revolución · 28 de mayo de 1810",
    narrative: [
      "La revolución tiene tres días y ya tiene sus primeras crisis internas. Correo interno de la Junta: hay sospechas de que agentes realistas se han infiltrado entre los colaboradores patriotas. El miedo al espía dentro de casa es el miedo más paralizante que existe.",
      "Castelli, con esa intensidad que lo caracteriza, te convoca junto a otros dos hombres de confianza. La tarea: investigar a cinco personas sospechosas y determinar si hay traidores entre ellas. Tiene información fragmentaria, rumores, coincidencias que pueden ser o no significativas.",
      "El problema ético es claro: una acusación falsa en este contexto puede destruir la vida de un inocente. Una acusación correcta puede salvar la revolución. Y el tiempo es corto: si hay infiltrado, cada día que pasa es un día más de filtración de información estratégica.",
      "Castelli te entrega los nombres y te mira con sus ojos de fiscal nato: 'Necesito la verdad, no lo que yo quiero escuchar. ¿Puedes dármela?'"
    ],
    choices: [
      { text: "Investigar con rigor y reportar solo lo que puedas verificar con evidencias.", prest: 2, riesgo: 3, label: "A" },
      { text: "Priorizar la seguridad del movimiento: denunciar a los más sospechosos.", prest: 0, riesgo: 14, label: "B" },
      { text: "Negarte a participar en procesos que pueden afectar inocentes.", prest: 1, riesgo: -3, label: "C" }
    ]
  },
  {
    id: 17,
    title: "Belgrano y la Escarapela",
    subtitle: "Acto II · La Revolución · 1 de junio de 1810",
    showCharacter: { id: 'belgrano', ctx: 'escarapela' },
    narrative: [
      "Manuel Belgrano tiene una idea que no ha compartido con nadie excepto con vos, esta tarde, en el patio trasero de su casa. Es un hombre que piensa en los símbolos tanto como en las leyes: sabe que las naciones necesitan imágenes que las convoquen, no solo argumentos que las convenzan.",
      "Su idea: crear una escarapela oficial del nuevo gobierno, con los colores celeste y blanco — los mismos que French y Beruti usaron en la plaza, los colores de la Virgen, los colores del cielo del Río de la Plata. Una señal visual de identidad que unifique a los patriotas de distintas provincias y condiciones sociales.",
      "Pero hay un problema político: publicar una escarapela oficial sería declarar implícitamente la separación de España, algo que la Junta todavía no ha hecho de manera formal. Saavedra, que prefiere la ambigüedad táctica, se opondrá. Moreno, paradójicamente, también, porque prefiere la declaración explícita a los símbolos implícitos.",
      "Belgrano te pide consejo sincero, no político. ¿Es el momento? ¿Vale el riesgo político interno?"
    ],
    choices: [
      { text: "Apoyar la escarapela como necesidad simbólica urgente — los pueblos necesitan emblemas.", prest: 2, riesgo: 5, special: { title: "LA ESCARAPELA NACIONAL", text: "Belgrano te agradece el apoyo con un gesto simple. Semanas después, la escarapela celeste y blanca será adoptada oficialmente. Has sido parte de una decisión que sobrevivirá siglos." }, label: "A" },
      { text: "Aconsejar esperar a que la Junta tome una posición más clara sobre la independencia.", prest: 1, riesgo: -3, label: "B" },
      { text: "Proponer que la escarapela se distribuya informalmente sin declaración oficial.", prest: 1, riesgo: 7, label: "C" }
    ]
  },
  {
    id: 18,
    title: "Liniers Negocia",
    subtitle: "Acto II · La Revolución · 3 de junio de 1810",
    showCharacter: { id: 'liniers', ctx: 'cordoba' },
    narrative: [
      "Santiago de Liniers es uno de los hombres más complejos de este momento histórico. Fue Virrey interino, el héroe que reconquistó Buenos Aires de los ingleses en 1806 y 1807, pero ahora encabeza la resistencia realista desde Córdoba. Es respetado incluso entre los patriotas que lo combaten.",
      "A través de intermediarios, Liniers ha hecho llegar una propuesta: está dispuesto a negociar su retiro del territorio si se le garantiza seguridad personal y se respeta su honor militar. Los radicales de la Junta —Moreno principalmente— rechazan cualquier negociación. Los moderados ven una oportunidad de prevenir derramamiento de sangre.",
      "Te ofrecen ser el mensajero en esta negociación secreta, un intermediario entre las posiciones que ni siquiera deberían estar hablando. Si lo haces bien, podrías salvar vidas. Si fracasas o eres descubierto, ambas facciones podrían verte como traidor.",
      "La propuesta está sobre la mesa. Liniers espera respuesta antes del amanecer."
    ],
    choices: [
      { text: "Aceptar ser mediador —la paz ahorra sangre que no debería derramarse.", prest: 2, riesgo: 6, label: "A" },
      { text: "Rechazar: la revolución no puede negociar con quien la resiste activamente.", prest: 1, riesgo: 9, label: "B" },
      { text: "Aceptar para obtener información de inteligencia sobre los planes de Liniers.", prest: 1, riesgo: 12, label: "C" }
    ]
  },
  {
    id: 19,
    title: "Declaración de Objetivos",
    subtitle: "Acto II · La Revolución · 7 de junio de 1810",
    narrative: [
      "La Primera Junta enfrenta su primera gran decisión de comunicación: ¿qué dice al pueblo y a las demás provincias sobre sus objetivos? La pregunta parece simple, pero sus consecuencias son enormes. Hay tres posiciones en debate dentro del gobierno.",
      "Moreno argumenta por la transparencia total: el pueblo merece saber que esto es el comienzo de la independencia. Saavedra, más pragmático, prefiere mantener la ficción de la lealtad al Rey Fernando para no alienar a los moderados y evitar la intervención portuguesa desde Brasil. Paso propone una posición intermedia.",
      "Te han pedido colaborar en la redacción del primer comunicado oficial de la Junta, el documento que será la cara pública de la revolución ante el mundo. Es una responsabilidad literaria e histórica que pesa como piedra.",
      "Las plumas están listas, el papel en blanco espera. ¿Qué palabras pones en boca de la revolución?"
    ],
    choices: [
      { text: "Abogar por la declaración de independencia plena y transparente.", prest: 3, riesgo: 10, label: "A" },
      { text: "Apoyar la ambigüedad pragmática: gobernar 'en nombre del Rey' por ahora.", prest: 1, riesgo: -2, label: "B" },
      { text: "Proponer lealtad explícita al Rey como estrategia de tiempo.", prest: 0, riesgo: -6, label: "C" }
    ]
  },
  {
    id: 20,
    title: "Soldados Leales",
    subtitle: "Acto II · La Revolución · 12 de junio de 1810",
    narrative: [
      "La revolución necesita músculos. Los argumentos filosóficos y los documentos legales son indispensables, pero sin una fuerza militar leal, la Junta es vulnerable a cualquier contraataque realista organizado. La militarización del movimiento se acelera.",
      "El General Balcarce, que comanda las fuerzas patriotas, te busca personalmente. Tu reputación como mensajero de confianza ha llegado a sus oídos. Te ofrece comandar un pequeño grupo de doce hombres: ex-milicianos de las Invasiones Inglesas, jóvenes artesanos, algunos esclavos libertos que han pedido unirse a cambio de su libertad.",
      "No eres militar de carrera. Pero estos hombres tampoco. La revolución está construida por personas que aprenden sobre la marcha a hacer cosas para las que no fueron entrenados. Comando, disciplina, lealtad, valor: ¿los tienes?",
      "Balcarce espera tu respuesta. Detrás de él, doce pares de ojos te observan, buscando en tu cara la señal de que vale la pena seguirte."
    ],
    choices: [
      { text: "Aceptar el mando con entusiasmo —la revolución necesita líderes, no espectadores.", prest: 2, riesgo: 11, label: "A" },
      { text: "Aceptar pero enfatizando que liderarás con principios civiles, no violencia.", prest: 2, riesgo: 5, label: "B" },
      { text: "Rehusar el mando militar —tu fuerza es la inteligencia, no las armas.", prest: 1, riesgo: -5, label: "C" }
    ]
  },
  {
    id: 21,
    title: "El Debate Saavedra-Moreno",
    subtitle: "Acto II · La Revolución · 15 de junio de 1810",
    showCharacter: { id: 'moreno', ctx: 'debate' },
    narrative: [
      "La Primera Junta lleva veinte días en el poder y ya tiene su primera fractura visible: Saavedra y Moreno no pueden estar en el mismo cuarto sin que el aire se cargue de una electricidad que no es admiración mutua. Son dos visiones de la revolución que son, en lo fundamental, incompatibles.",
      "Saavedra representa la cautela: gobernar bien, consolidar el poder, no precipitar cambios que el territorio no puede absorber. Moreno representa la urgencia: la revolución que no avanza retrocede. Esta tarde, en una reunión sobre logística de la expedición al norte, el debate explota. Voces altas, documentos lanzados sobre la mesa, Castelli apoyando a Moreno, Azcuénaga intentando mediar sin éxito.",
      "El resto de los vocales mira y elige bando con los ojos. Alguien tiene que salir de esta reunión sin que la Junta se rompa en dos. Te miran porque sos el único en la sala que no está formalmente del lado de nadie.",
      "Saavedra te habla con los ojos. Moreno te habla con los ojos. Ambos esperan que elijas."
    ],
    choices: [
      { text: "Apoyar a Moreno: la revolución necesita velocidad, no prudencia.", prest: 2, riesgo: 9, label: "A" },
      { text: "Apoyar a Saavedra: sin consolidación, los cambios no duran.", prest: 1, riesgo: 4, label: "B" },
      { text: "Proponer un acuerdo de trabajo: cada área tiene su método, ninguno veta al otro.", prest: 3, riesgo: 7, label: "C" }
    ]
  },
  {
    id: 22,
    title: "Noticia desde Córdoba",
    subtitle: "Acto II · La Revolución · 19 de junio de 1810",
    narrative: [
      "El correo llega al galope: Córdoba se ha levantado en armas contra la Junta de Buenos Aires. Liniers, el Obispo Orellana, el Gobernador Gutiérrez de la Concha y otros caudillos realistas han organizado una resistencia armada. Reclutan tropas, acumulan armas y llaman a la lealtad al rey español.",
      "La Junta se reúne de urgencia. La decisión: enviar una expedición militar al mando del general Francisco Ortiz de Ocampo. La revolución que creía haber ganado en Buenos Aires descubre que el territorio es mucho más complejo. Las provincias del interior tienen sus propias lealtades, sus propias autoridades, sus propios miedos.",
      "En la reunión de estrategia, que excepcionalmente incluye a colaboradores civiles como tú, se consideran tres roles posibles para tu participación en la respuesta a Córdoba. El debate es urgente: cada semana que pasa, la resistencia realista se fortalece.",
      "Moreno, que argumenta por la firmeza total, te mira esperando que tomes posición. 'No hay revolución sin sacrificio', dice con esa dureza que algunos admiran y otros temen."
    ],
    choices: [
      { text: "Enlistarte voluntariamente como soldado de la expedición a Córdoba.", prest: 3, riesgo: 14, label: "A" },
      { text: "Ofrecerte como agente de inteligencia infiltrado entre los realistas cordobeses.", prest: 2, riesgo: 17, label: "B" },
      { text: "Quedarte en Buenos Aires asegurando la retaguardia y las comunicaciones.", prest: 0, riesgo: -6, label: "C" }
    ]
  },
  {
    id: 23,
    title: "Castelli en el Interior",
    subtitle: "Acto II · La Revolución · 22 de junio de 1810",
    narrative: [
      "Juan José Castelli parte hacia el norte con la expedición militar, designado como comisionado político. Su tarea: convencer — o si es necesario, forzar — a las provincias del interior a reconocer la autoridad de Buenos Aires. Lleva poderes casi ilimitados y en la cabeza ideas que escandalizarán a los curas y terratenientes del interior.",
      "Antes de partir, Castelli te convoca. Necesita un enlace de confianza que se quede en Buenos Aires y le envíe información periódica sobre los debates internos de la Junta. Necesita saber si el respaldo político seguirá ahí cuando tome las decisiones difíciles que nadie quiere anunciar desde la capital.",
      "Lo que te pide es, en esencia, ser su oído en Buenos Aires: informarle de los cambios de posición de Saavedra, de las alianzas que se forman y se rompen, de si Moreno sigue siendo su aliado o está virando. Información confidencial del gobierno transmitida de manera privada.",
      "'Sin información', dice Castelli, 'cometo errores que cuestan vidas.' Su lógica es impecable. La ética del pedido, menos."
    ],
    choices: [
      { text: "Aceptar ser el enlace — Castelli en el interior es vital para la revolución.", prest: 2, riesgo: 10, label: "A" },
      { text: "Aceptar, pero solo información que no comprometa la seguridad de la Junta.", prest: 1, riesgo: 4, label: "B" },
      { text: "Rechazar: pasar información privada de la Junta a un vocal ausente cruza una línea.", prest: 1, riesgo: -5, label: "C" }
    ]
  },
  {
    id: 24,
    title: "El Pronunciamiento del Pueblo",
    subtitle: "Acto II · La Revolución · 25 de junio de 1810",
    narrative: [
      "La revolución ha despertado algo que no esperaba despertar: al pueblo mismo. Artesanos, vendedores, trabajadores del puerto, labradores de los alrededores —personas que nunca antes habían tenido voz política— ahora la quieren. Se organizan en grupos, firman peticiones, se presentan ante el Cabildo con demandas concretas.",
      "La lista es larga y ambiciosa: abolición de los impuestos coloniales más onerosos, apertura de escuelas para los hijos de los pobres, libertad de comercio con todas las naciones, igualdad legal entre criollos y peninsulares, protección para los trabajadores artesanales. No son abstractos: son los problemas de sus vidas cotidianas.",
      "Los peticionarios te han identificado como alguien con acceso a los líderes de la Junta. Te piden que lleves sus demandas al gobierno con tu voz. Eres el puente entre el pueblo que hizo posible la revolución y los líderes que la están conduciendo.",
      "Moreno ve con buenos ojos estas demandas. Saavedra las ve con cautela: 'Una revolución que promete demasiado, cumple poco y genera decepción peligrosa', te dice en privado."
    ],
    choices: [
      { text: "Presentar las demandas populares ante la Junta con toda la fuerza posible.", prest: 3, riesgo: 8, label: "A" },
      { text: "Presentar una versión moderada que no alarme a los sectores más conservadores.", prest: 1, riesgo: 2, label: "B" },
      { text: "Aconsejar a los peticionarios que esperen el momento adecuado.", prest: -3, riesgo: 5, label: "C" }
    ]
  },
  {
    id: 25,
    title: "Traidor Descubierto",
    subtitle: "Acto II · La Revolución · 3 de julio de 1810",
    narrative: [
      "El nombre del traidor circula entre los patriotas con el peso de una condena: es Esteban, el contador joven que participó en varias reuniones clandestinas y que todos consideraban un creyente sincero en la causa. Las evidencias lo implican directamente: documentos de la Junta aparecieron en manos realistas, y solo él tenía acceso.",
      "Lo conocías bien. Compartiste cenas, debates filosóficos, la misma ansiedad en la noche del 24 de mayo. Y ahora está sentado en una silla, pálido, sin negar los hechos pero sin dar tampoco la lista completa de sus contactos. Sus razones, dice, fueron personales y no ideológicas: dinero para pagar una deuda que lo hubiera llevado a la cárcel.",
      "Castelli —que ha asumido el rol de fiscal de la revolución— te pide que seas el testigo principal en el juicio sumario. Pero algunos en el grupo más radical quieren saltarse el proceso: la situación militar no permite demoras, argumentan.",
      "Esteban te mira desde su silla como quien espera que alguien recuerde que fue humano antes de ser traidor."
    ],
    choices: [
      { text: "Apoyar el juicio sumario rápido —la revolución no puede paralizarse por sentimentalismo.", prest: 1, riesgo: 13, label: "A" },
      { text: "Insistir en un proceso justo aunque sea breve: sin evidencia completa, no hay condena.", prest: 2, riesgo: 3, label: "B" },
      { text: "Abogar para que se le permita huir del territorio a cambio de silencio.", prest: 1, riesgo: -6, label: "C" }
    ]
  },
  {
    id: 26,
    title: "La Conspiración de los Alcaldes",
    subtitle: "Acto II · La Revolución · 5 de julio de 1810",
    narrative: [
      "Los alcaldes de barrio son el gobierno más cercano al pueblo: resuelven disputas, controlan movimientos de personas en sus cuadras. Bajo el Virrey eran los ojos y oídos del orden colonial. Bajo la Junta, algunos siguen siéndolo — pero para los enemigos de la revolución.",
      "Tenés evidencia de que tres alcaldes de los barrios del sur están coordinando el registro de los revolucionarios más conocidos: sus domicilios, sus rutinas, sus contactos. La información termina en manos de un grupo de peninsulares exaltados que la usan para planificar represalias.",
      "La Junta puede destituirlos — tiene el poder legal. Pero los alcaldes son elegidos por los vecinos y gozan de respeto local. Una destitución arbitraria puede levantar los barrios del sur contra el nuevo gobierno, exactamente cuando más necesita unidad.",
      "Moreno quiere actuar esta noche. Saavedra pide esperar y reunir más evidencias. Belgrano propone reemplazarlos con hombres de confianza sin hacer ruido. Solo hay tiempo para una de las tres."
    ],
    choices: [
      { text: "Apoyar la acción inmediata de Moreno — cada hora que pasan es información que filtran.", prest: 1, riesgo: 12, label: "A" },
      { text: "Apoyar el reemplazo silencioso de Belgrano — sin confrontación visible.", prest: 2, riesgo: 5, label: "B" },
      { text: "Apoyar la espera de Saavedra y profundizar la investigación primero.", prest: 1, riesgo: 2, label: "C" }
    ]
  },
  {
    id: 27,
    title: "Recursos Agotados",
    subtitle: "Acto II · La Revolución · 10 de julio de 1810",
    narrative: [
      "La aritmética de la revolución es cruel: liberar un territorio cuesta dinero, y la Primera Junta heredó las arcas casi vacías del Virreinato. Las tropas necesitan pago, las comunicaciones cuestan, la administración no funciona sin fondos. El Tesorero de la Junta, con el semblante de quien debe dar malas noticias, presenta los números.",
      "Hay tres caminos posibles para obtener los recursos urgentes, y ninguno es cómodo. Cada uno implica compromisos diferentes —económicos, morales, políticos— y tendrá consecuencias que se extenderán más allá de esta emergencia inmediata.",
      "Te incluyen en la deliberación porque has demostrado capacidad para pensar con claridad bajo presión. Moreno dice que la revolución no puede sobrevivir siendo pura pero pobre. Saavedra dice que no puede sobrevivir siendo eficaz pero deshonesta.",
      "La decisión tiene que tomarse antes de que llegue el correo de Córdoba, que traerá más gastos."
    ],
    choices: [
      { text: "Solicitar préstamos voluntarios a comerciantes patriotas que se beneficiarán del libre comercio.", prest: 1, riesgo: 3, label: "A" },
      { text: "Confiscar bienes de funcionarios realistas que huyeron dejando propiedades.", prest: 1, riesgo: 12, label: "B" },
      { text: "Negociar un préstamo con comerciantes ingleses a cambio de ventajas comerciales futuras.", prest: 2, riesgo: 9, label: "C" }
    ]
  },
  {
    id: 28,
    title: "El Precio de la Libertad",
    subtitle: "Acto II · La Revolución · 14 de julio de 1810",
    narrative: [
      "Hay un tema que los líderes de la revolución evitan con destreza: la esclavitud. Buenos Aires tiene miles de esclavos — en las casas de las familias más importantes, en los talleres artesanales, en el puerto. Son invisibles en los debates sobre libertad y soberanía popular.",
      "Pero hoy se hacen visibles. Una delegación de diez hombres negros libertos, liderada por un hombre llamado Joaquín que habla con la precisión de quien ha aprendido a argumentar para sobrevivir, se presenta ante vos. Han escuchado los discursos sobre libertad. Quieren saber si esa palabra los incluye.",
      "Llevan una petición escrita en papel doblado cuatro veces. Piden que ningún hijo de esclavo nacido en el Río de la Plata a partir de mayo de 1810 nazca en condición de esclavitud. No piden la libertad inmediata de todos — saben que es imposible políticamente. Piden el comienzo del fin.",
      "Te piden que presentés la petición ante la Junta. Si lo hacés, vas contra los intereses de varias de las familias más influyentes de Buenos Aires. Si no lo hacés, la revolución perpetúa la contradicción más grande de su propio discurso."
    ],
    choices: [
      { text: "Presentar la petición ante la Junta con tu respaldo explícito.", prest: 3, riesgo: 10, label: "A" },
      { text: "Presentarla pero sin tu respaldo formal — dejar que se debata sin comprometerte.", prest: 1, riesgo: 5, label: "B" },
      { text: "Aconsejar a Joaquín que espere un momento político más favorable.", prest: -3, riesgo: -4, label: "C" }
    ]
  },
  {
    id: 29,
    title: "Alianza Internacional",
    subtitle: "Acto II · La Revolución · 17 de julio de 1810",
    narrative: [
      "Un representante discreto del consulado británico solicita un encuentro privado con alguien de confianza de la Junta. El nombre que dan para esa persona eres tú. Gran Bretaña —que está en guerra con España napoleónica— ve en la revolución rioplatense una oportunidad geopolítica de primera magnitud.",
      "El representante, un hombre elegante llamado Mr. Stanhope, habla un español impecable. Ofrece reconocimiento diplomático implícito, protección naval en el Río de la Plata, y apertura del comercio directo con Buenos Aires. El precio, nunca dicho explícitamente pero siempre presente: influencia británica sobre las decisiones económicas de la nueva administración.",
      "Es el dilema geopolítico de toda revolución que nace en periferia de un mundo dominado por potencias: ¿puedes ser libre si dependes del apoyo de quien tiene sus propios intereses? ¿Es mejor aliado incómodo que enemigo poderoso?",
      "Mr. Stanhope bebe su té y espera con la paciencia de quien sabe que el tiempo juega a su favor."
    ],
    choices: [
      { text: "Aceptar el apoyo británico como necesidad pragmática de la hora.", prest: 2, riesgo: 8, label: "A" },
      { text: "Negociar términos que preserven la autonomía de decisión de la Junta.", prest: 2, riesgo: 5, label: "B" },
      { text: "Rechazar toda influencia extranjera —la revolución debe ser completamente nuestra.", prest: 3, riesgo: -3, label: "C" }
    ]
  },
  {
    id: 30,
    title: "Reforma Religiosa",
    subtitle: "Acto II · La Revolución · 24 de julio de 1810",
    narrative: [
      "Mariano Moreno es muchas cosas: brillante, implacable, visionario, y completamente incapaz de detenerse ante un obstáculo que considera injusto. Su siguiente propuesta hace que hasta sus aliados se incomoden: propone limitar el poder temporal de la Iglesia en la administración de la educación, los registros civiles y la justicia.",
      "La Iglesia lleva trescientos años siendo el pilar del orden social en estas tierras. Es la institución que bautiza, casa y entierra. Que educa. Que da sentido cósmico a la vida cotidiana. Atacarla —aunque sea su poder temporal, no espiritual— es ganarse la enemistad de una institución que tiene más influencia sobre el pueblo que cualquier gobierno.",
      "Pero Moreno tiene un punto: una república moderna no puede permitir que la fe dicte la ley. El debate lleva días y está llegando al punto de necesitar una votación. Te piden que, como voz pública reconocida, tomes posición claramente.",
      "El Obispo Lué y Riega te ha enviado un mensaje privado: que reconsideres tu posición en este asunto antes de hablar públicamente. Es, a la vez, un consejo y una advertencia."
    ],
    choices: [
      { text: "Apoyar públicamente la secularización de las funciones civiles del Estado.", prest: 3, riesgo: 10, label: "A" },
      { text: "Proponer una reforma moderada que separe gradualmente la Iglesia del Estado.", prest: 1, riesgo: 2, label: "B" },
      { text: "Defender la posición de la Iglesia —la revolución no debe alienar a todo el pueblo.", prest: -3, riesgo: -8, label: "C" }
    ]
  },
  {
    id: 31,
    title: "La Red se Rompe",
    subtitle: "Acto II · La Revolución · 28 de julio de 1810",
    narrative: [
      "La noticia llega por tres vías en la misma hora, y eso significa que es cierta: capturaron a uno de los mensajeros de la red patriota. Se llama Lorenzo, tiene dieciséis años, y lleva encima un mensaje en clave que, descifrado, revela nombres de cuatro colaboradores de la Junta en el sur de la ciudad.",
      "El interrogatorio ya comenzó en el Fuerte, según el informante. Lorenzo no es duro: es leal, pero es joven y sin entrenamiento para soportar lo que le espera. Tienen horas — no días — antes de que los nombres empiecen a salir.",
      "Los cuatro colaboradores deben ser avisados. Pero hacerlo significa exponerse: cualquier movimiento rápido y coordinado para ayudarlos será detectado por quienes vigilan la red. Y hay algo más: el cifrado que Lorenzo lleva fue diseñado por vos. Si lo descifran, la siguiente pregunta que harán es quién lo creó.",
      "French te manda un mensaje de una sola línea: 'Muévete o pierde todo.'"
    ],
    choices: [
      { text: "Avisar personalmente a los cuatro colaboradores aunque eso te exponga.", prest: 2, riesgo: 16, label: "A" },
      { text: "Avisar a través de intermediarios para reducir tu exposición directa.", prest: 1, riesgo: 9, label: "B" },
      { text: "Evacuar solo a los dos más críticos — salvar todos es imposible con el tiempo disponible.", prest: 1, riesgo: 6, label: "C" }
    ]
  },

  // ACT III: LA CONSOLIDACIÓN

  // ACT III: LA CONSOLIDACIÓN

  // ACT III: LA CONSOLIDACIÓN
  {
    id: 32,
    title: "Conspiración Detectada",
    subtitle: "Acto III · La Consolidación · 1 de agosto de 1810",
    narrative: [
      "La información llega por tres canales diferentes en el mismo día, lo que la hace imposible de ignorar: existe un plan concreto para asesinar a tres miembros de la Primera Junta. Los autores son un grupo reducido de peninsulares exaltados que creen que el asesinato estratégico puede decapitar la revolución y restaurar el orden.",
      "Los nombres de los blancos incluyen a Moreno. La fecha tentativa: dentro de diez días. Los conspiradores son cinco o seis personas identificadas por sus contactos, pero hay al menos dos más cuya identidad es desconocida.",
      "Las vidas de las personas que han liderado esta revolución dependen de la acción que tomes en las próximas horas. Cada minuto que pasa es un minuto más que los conspiradores tienen para perfeccionar su plan.",
      "Castelli te dice: 'Necesitamos esta información contenida en veinticuatro horas. No te equivoques.' Sus palabras suenan a advertencia tanto como a instrucción."
    ],
    choices: [
      { text: "Reportar inmediatamente a la Junta con toda la información disponible.", prest: 2, riesgo: 6, label: "A" },
      { text: "Infiltrarte en la conspiración para identificar a los miembros desconocidos.", prest: 3, riesgo: 18, label: "B" },
      { text: "Advertir privadamente a los miembros amenazados sin involucrar a la Junta.", prest: 1, riesgo: 9, label: "C" }
    ]
  },
  {
    id: 33,
    title: "Moreno contra Saavedra",
    subtitle: "Acto III · La Consolidación · 5 de agosto de 1810",
    narrative: [
      "La fractura que se veía venir ha llegado. Saavedra consiguió que la Junta incorpore a los representantes de las provincias del interior como vocales. Moreno lo considera un golpe a la revolución: Buenos Aires perdería poder decisivo, y los representantes del interior son, en su mayoría, conservadores que frenarán los cambios.",
      "Moreno está hablando de renunciar. No en voz alta — eso sería debilidad pública — sino en los corredores donde las decisiones reales se toman antes de llegar a las actas. Si Moreno se va, la facción más radical y transformadora de la revolución pierde su voz más brillante.",
      "Sos uno de los pocos que tiene relación personal con ambos hombres y que ambos consideran neutral. Saavedra te pidió que convenzas a Moreno de quedarse. Moreno te pidió que le digas honestamente si la revolución todavía vale la pena desde adentro.",
      "Dos hombres, dos versiones de la misma revolución, y vos en el medio con la obligación de decir algo verdadero a los dos."
    ],
    choices: [
      { text: "Convencer a Moreno de quedarse: adentro tiene más poder que afuera.", prest: 2, riesgo: 8, label: "A" },
      { text: "Decirle a Moreno la verdad: si siente que ha perdido, quedarse lo destruirá.", prest: 1, riesgo: 5, label: "B" },
      { text: "Negociar con Saavedra garantías concretas que hagan viable la permanencia de Moreno.", prest: 3, riesgo: 11, label: "C" }
    ]
  },
  {
    id: 34,
    title: "Educación para Todos",
    subtitle: "Acto III · La Consolidación · 9 de agosto de 1810",
    narrative: [
      "En medio de todo lo que pasa —conspiraciones, debates políticos, crisis militares— surge algo que parece fuera de lugar pero no lo está: una propuesta de Manuel Belgrano para crear escuelas primarias en los barrios más pobres de Buenos Aires. Belgrano, que ha dedicado años a impulsar la educación como fundamento de la república, ve en este momento la oportunidad perfecta.",
      "La idea es sencilla en su formulación y revolucionaria en su impacto: cualquier niño, sin importar el origen de sus padres, tendría acceso a la lectura, la escritura y los principios básicos del civismo. Incluye a los hijos de los artesanos, de los labradores, de los esclavos libertos.",
      "La propuesta necesita financiamiento y voluntades. Belgrano te busca personalmente porque sabe que tienes recursos limitados pero influencia real entre ciertos sectores. 'Una nación de personas que no saben leer', te dice, 'es una nación que no puede gobernarse a sí misma.'",
      "Las caras de los niños de los conventillos de Buenos Aires, que corren por calles que no conocen el nombre de los derechos que en teoría tienen, flotan en tu imaginación mientras tomas tu decisión."
    ],
    choices: [
      { text: "Comprometer recursos personales para financiar la primera escuela revolucionaria.", prest: 3, riesgo: -6, label: "A" },
      { text: "Ofrecerte como maestro voluntario mientras se resuelve el financiamiento.", prest: 2, riesgo: -3, label: "B" },
      { text: "Apoyar la idea pero postponerla: hay prioridades militares urgentes ahora.", prest: -3, riesgo: 5, label: "C" }
    ]
  },
  {
    id: 35,
    title: "El Futuro del Virreinato",
    subtitle: "Acto III · La Consolidación · 18 de agosto de 1810",
    narrative: [
      "La Primera Junta no solo gobierna Buenos Aires: en teoría, gobierna todo el ex-Virreinato del Río de la Plata, que incluye territorios que hoy serían Argentina, Uruguay, Paraguay y parte de Bolivia. Pero Montevideo es leal a los realistas, Paraguay rechaza la autoridad de Buenos Aires, y el Alto Perú es un teatro de guerra.",
      "En la Junta se debate con urgencia la pregunta que define todo lo demás: ¿cuál es el proyecto territorial de esta revolución? ¿Busca crear un Estado central desde Buenos Aires? ¿Una confederación de provincias iguales? ¿O simplemente asegurar la autonomía local mientras el destino se define más adelante?",
      "El debate es filosófico, jurídico y militar al mismo tiempo. Moreno quiere un Estado centralizado fuerte que imponga la revolución. Belgrano prefiere una federación. Saavedra teme el caos que produce cualquier definición prematura.",
      "Te han pedido elaborar una posición escrita para el debate. Lo que escribas circulará entre los vocales de la Junta antes de la sesión de mañana."
    ],
    choices: [
      { text: "Argumentar por la independencia completa e inmediata de todas las provincias.", prest: 3, riesgo: 12, label: "A" },
      { text: "Proponer una confederación de provincias libres con representación igualitaria.", prest: 2, riesgo: 6, label: "B" },
      { text: "Recomendar mantener lazos formales con España mientras se consolida el poder.", prest: -4, riesgo: -6, label: "C" }
    ]
  },
  {
    id: 36,
    title: "La Imprenta Clandestina",
    subtitle: "Acto III · La Consolidación · 20 de agosto de 1810",
    narrative: [
      "No todas las batallas se pelean con armas. Han llegado a tus manos copias de panfletos que los realistas distribuyen en los barrios más pobres: textos que describen a la Junta como usurpadores, que prometen el regreso del orden, que juegan con el miedo de los que menos tienen para perder con cualquier revolución.",
      "La contraofensiva requiere una imprenta propia, paralela a la Gaceta, que produzca material accesible en lenguaje de calle. Beruti, que tiene experiencia en distribución masiva desde las jornadas de mayo, localizó una imprenta disponible en secreto.",
      "El problema: operar esa imprenta sin autorización de la Junta es, técnicamente, una actividad clandestina. Si la descubren los realistas, es evidencia de sedición. Si la descubre la Junta antes de que estés listo para presentarla, puede interpretarse como un desafío a la Gaceta oficial.",
      "'Las ideas que no llegan a la gente que no lee la Gaceta', dice Beruti, 'son ideas que no existen.'"
    ],
    choices: [
      { text: "Lanzar la imprenta clandestina de inmediato — la urgencia supera el protocolo.", prest: 3, riesgo: 12, label: "A" },
      { text: "Presentar el plan a Moreno para que la Junta lo avale antes de comenzar.", prest: 1, riesgo: 4, label: "B" },
      { text: "Rechazar: una imprenta no autorizada puede ser usada en tu contra.", prest: 0, riesgo: -5, label: "C" }
    ]
  },
  {
    id: 37,
    title: "Última Prueba de Lealtad",
    subtitle: "Acto III · La Consolidación · 26 de agosto de 1810",
    narrative: [
      "Hay misiones que no tienen nombre porque no pueden tenerlo. El círculo más íntimo de la Junta —los que toman las decisiones que nunca aparecen en documentos— te convoca a una reunión de la que no existe constancia escrita.",
      "La tarea: acceder a los archivos del Consulado, donde están los registros de todos los comerciantes que financiaron operaciones realistas durante los últimos meses. La información permitiría a la Junta saber exactamente quiénes son sus enemigos económicos y cómo neutralizarlos. El acceso requiere métodos que ningún documento puede avalar.",
      "Si lo logras, tu nombre será mencionado en susurros como alguien en quien la revolución puede confiar para lo que nadie más puede hacer. Si fallas o eres capturado, la Junta lo negará todo. Estarás solo.",
      "El hombre que te explica esto no te mira a los ojos mientras habla. Cuando termina, hay un silencio largo. Luego dice: 'No estás obligado.' El tono de su voz dice exactamente lo contrario."
    ],
    choices: [
      { text: "Ejecutar la misión completamente —la revolución necesita esta información.", prest: 3, riesgo: 14, label: "A" },
      { text: "Ejecutarla, pero estableciendo límites: no destruirás evidencias ni causarás daño físico.", prest: 2, riesgo: 9, label: "B" },
      { text: "Declinar y proponer una alternativa legal que logre el mismo objetivo.", prest: 1, riesgo: -3, label: "C" }
    ]
  },
  {
    id: 38,
    title: "Reconocimiento Personal",
    subtitle: "Acto III · La Consolidación · 4 de septiembre de 1810",
    narrative: [
      "En una ceremonia de la Primera Junta —la primera celebración formal de sus logros iniciales— Cornelio Saavedra pronuncia un discurso que nadie esperaba. En medio de los agradecimientos institucionales, pronuncia tu nombre: '{PLAYER}'. Te describe como alguien cuyo trabajo en las sombras ha sido tan vital como el de quienes aparecen en los documentos oficiales.",
      "El salón se llena de aplausos. Personas que no conoces personalmente te miran con respeto. Colegas con quienes has trabajado te palmean el hombro. En un instante, el anonimato del mensajero secreto se ha evaporado y has sido convertido, públicamente, en Héroe de la Revolución de Mayo.",
      "El reconocimiento es sincero y te conmueve. Pero también es un arma de doble filo: la visibilidad que protege también expone. El espía maestro que tú has sido depende de la invisibilidad. El héroe público no puede moverse del mismo modo.",
      "Saavedra espera tu respuesta desde el podio. Cientos de personas te observan."
    ],
    choices: [
      { text: "Aceptar con humildad y dedicar el reconocimiento a todos los anónimos de la revolución.", prest: 2, riesgo: 3, label: "A" },
      { text: "Aceptar y aprovechar la visibilidad para consolidar posición política formal.", prest: 1, riesgo: 12, label: "B" },
      { text: "Agradecer brevemente y redirigir la atención a la causa colectiva, no a ti.", prest: 1, riesgo: -6, label: "C" }
    ]
  },
  {
    id: 39,
    title: "El Testigo Incómodo",
    subtitle: "Acto III · La Consolidación · 10 de septiembre de 1810",
    narrative: [
      "Hay algo que sabés y que no debería ser solo tuyo: fuiste testigo de una orden que, si se confirma, cambia lo que entendés sobre la moral de la revolución que defendés. A principios de junio, escuchaste cómo un hombre cercano a Moreno — no Moreno mismo — daba instrucciones para que la ejecución de Liniers no fuera un juicio sino una orden directa, sin proceso formal.",
      "Liniers fue fusilado en Córdoba el 26 de agosto. La historia oficial dice que fue juzgado y condenado. Lo que vos sabés sugiere que la decisión estaba tomada antes de que comenzara cualquier proceso. No tenés pruebas escritas — fue una conversación que creíste privada.",
      "Un historiador que trabaja para el Cabildo te contactó. Está escribiendo el registro oficial de los primeros meses de la Junta y quiere testimonios directos. Si le decís lo que sabés, el registro oficial tendrá una grieta que no cerrará. Si callás, la historia se escribe más limpia pero menos verdadera.",
      "Es la pregunta de fondo de toda revolución: ¿hasta dónde sostenés la narrativa que la hace posible?"
    ],
    choices: [
      { text: "Dar testimonio completo y honesto — la historia merece la verdad aunque duela.", prest: 3, riesgo: 14, label: "A" },
      { text: "Dar un testimonio parcial que no comprometa a nadie pero que no mienta.", prest: 1, riesgo: 6, label: "B" },
      { text: "Negarte a testificar — hay cosas que la historia oficial no puede cargar sin quebrarse.", prest: 0, riesgo: -7, label: "C" }
    ]
  },
  {
    id: 40,
    title: "El Diario de la Revolución",
    subtitle: "Acto III · La Consolidación · 14 de septiembre de 1810",
    narrative: [
      "La Gaceta de Buenos Aires, el primer periódico de la revolución, ha demostrado ser un arma más poderosa que muchos esperaban. Las palabras de Moreno —directas, apasionadas, a veces incendiarias— moldean la opinión de quienes pueden leer. Y quienes pueden leer moldean la opinión de quienes no pueden.",
      "Moreno mismo te busca con su característico ir directo al punto: quiere que contribuyas. Tienes la pluma, tienes la experiencia, tienes algo que la Gaceta necesita: credibilidad de alguien que estuvo ahí cuando la historia se estaba haciendo, no después.",
      "La oferta te emocionas porque siempre has tenido más palabras dentro de lo que puedes expresar en conversación. Pero la escritura pública en este momento es un acto político con consecuencias duraderas. Lo que publiques en la Gaceta permanecerá. Será citado, mal citado, interpretado y mal interpretado por siglos.",
      "Moreno dice que la próxima edición sale en cuatro días. ¿Tu contribución estará lista?"
    ],
    choices: [
      { text: "Escribir un artículo apasionado llamando a la independencia total y sin condiciones.", prest: 3, riesgo: 9, label: "A" },
      { text: "Escribir un análisis histórico ecuánime del proceso revolucionario.", prest: 1, riesgo: 2, label: "B" },
      { text: "Declinar: prefieres la acción a las palabras, el campo a la escritura.", prest: 0, riesgo: -5, label: "C" }
    ]
  },
  {
    id: 41,
    title: "Traición del Ejército",
    subtitle: "Acto III · La Consolidación · 22 de septiembre de 1810",
    narrative: [
      "La revolución tiene un nuevo problema y este viene de adentro: rumores que ya no son tan rumores de que un sector del ejército patriota, insatisfecho con el liderazgo de la Junta, está considerando un golpe interno. No para restaurar el orden realista, sino para reemplazar a los líderes civiles por un gobierno militar.",
      "El informante es alguien en quien confías absolutamente. Te da nombres, fechas de reuniones, ubicaciones donde ciertos oficiales se encuentran fuera de sus horarios normales. La información es específica y coherente. Pero actuar sobre ella significará enfrentarte a personas que son, en lo fundamental, patriotas —aunque con una visión diferente de cómo debe conducirse la revolución.",
      "Si el golpe se produce, la Primera Junta termina. Si actúas prematuramente sobre información incompleta, causas una crisis interna en el ejército que puede ser peor que el golpe mismo.",
      "El informante te mira y dice: 'Tú decides qué hacer con esto. Pero decide rápido.'"
    ],
    choices: [
      { text: "Llevar la información completa a la Junta de inmediato —el tiempo es crítico.", prest: 2, riesgo: 8, label: "A" },
      { text: "Investigar durante 48 horas para completar la información antes de actuar.", prest: 1, riesgo: 5, label: "B" },
      { text: "Buscar primero a los oficiales involucrados para darles la oportunidad de retractarse.", prest: 1, riesgo: 11, label: "C" }
    ]
  },
  {
    id: 42,
    title: "La Carta del Futuro",
    subtitle: "Acto III · La Consolidación · 30 de septiembre de 1810",
    narrative: [
      "Es tarde en la noche y Buenos Aires está quieta. Llevas semanas sin dormir bien, como todos. En tu mesa, a la luz de una vela que se consume, hay papel en blanco y una pluma que espera.",
      "Se te ha ocurrido —o quizás te lo ha sugerido alguien— la idea de escribir una carta. No para alguien de ahora, sino para el futuro: para los hijos y los nietos, para los historiadores del siglo que viene, para los ciudadanos de una Argentina que todavía no existe pero que ya está tomando forma en las decisiones de estos meses.",
      "¿Qué le dices al futuro sobre lo que viviste? ¿Le hablas de la esperanza, del sacrificio, de los errores, de los heroísmos pequeños y cotidianos que nadie verá en los libros? ¿Le adviertes? ¿Le instruyes? ¿Le das esperanza?",
      "La vela parpadea. El papel espera. Esta carta nadie leerá todavía, pero algún día alguien la encontrará y querrá saber quién eras."
    ],
    choices: [
      { text: "Escribir un manifiesto audaz llamando a la independencia completa y al poder popular.", prest: 3, riesgo: 5, label: "A" },
      { text: "Escribir reflexiones honestas sobre la complejidad de hacer la historia.", prest: 2, riesgo: 2, label: "B" },
      { text: "Escribir advertencias sobre los peligros de que la revolución traicione sus propios principios.", prest: 0, riesgo: -8, label: "C" }
    ]
  },
  {
    id: 43,
    title: "La Última Encrucijada",
    subtitle: "Acto III · La Consolidación · 15 de octubre de 1810",
    narrative: [
      "La información que llega esta tarde es la más perturbadora que recibiste en meses: existe un plan para modificar la composición de la Primera Junta antes de fin de año. No por un golpe violento sino por una maniobra política que excluiría a Moreno y Castelli de las decisiones clave, reduciéndolos a roles ceremoniales.",
      "Los que impulsan el plan son los vocales conservadores que llegaron con la incorporación de los representantes del interior. Su argumento es pragmático: la facción radical asusta a los aliados que la revolución necesita para sobrevivir. Para ellos, una revolución moderada que dura es mejor que una radical que se autodestruye.",
      "Podés hacer tres cosas con esta información: dársela a Moreno para que actúe antes de que el plan se concrete, usarla para negociar con ambas facciones desde una posición de poder, o guardarla y ver qué pasa — a veces las revoluciones necesitan que sus propias contradicciones se resuelvan solas.",
      "Esta es probablemente la decisión más importante que tomaste desde aquella noche en la Iglesia del Pilar."
    ],
    choices: [
      { text: "Alertar a Moreno de inmediato — quien tiene la información tiene el poder de actuar.", prest: 3, riesgo: 13, label: "A" },
      { text: "Negociar con ambas facciones usando la información como moneda de cambio.", prest: 2, riesgo: 9, label: "B" },
      { text: "Guardar la información y dejar que la revolución resuelva sus propias contradicciones.", prest: 1, riesgo: -6, label: "C" }
    ]
  },
  {
    id: 44,
    title: "Los Hijos de la Revolución",
    subtitle: "Acto III · La Consolidación · 18 de octubre de 1810",
    narrative: [
      "Han pasado cinco meses desde el 25 de mayo y la revolución está produciendo algo que nadie planeó del todo: una generación joven que creció creyendo que el orden colonial era eterno y que ahora lo ve desmoronarse. Jóvenes de quince, dieciséis años que quieren ser parte de lo que está pasando.",
      "French y Beruti los han organizado informalmente como correos rápidos, distribuidores de la Gaceta, informantes en los barrios. Pero hay una tensión que crece: algunos de estos jóvenes están siendo usados para tareas que los exponen a riesgos que no comprenden plenamente. Lorenzo, el mensajero capturado, tenía dieciséis años.",
      "Te proponen que te hagas cargo de la formación de este grupo joven: darles conciencia de los riesgos, enseñarles las reglas básicas del trabajo clandestino, pero también sus derechos — el derecho a negarse, el derecho a saber qué riesgo están tomando.",
      "Beruti dice que es una pérdida de tiempo. French, para tu sorpresa, lo contradice: 'Una revolución que usa a sus jóvenes como herramientas los pierde. Y sin jóvenes, no hay futuro.'"
    ],
    choices: [
      { text: "Aceptar la formación del grupo joven con énfasis en conciencia de riesgo y derechos.", prest: 3, riesgo: -4, label: "A" },
      { text: "Aceptar pero integrándolos a tareas de baja exposición mientras aprenden.", prest: 1, riesgo: -2, label: "B" },
      { text: "Apoyar a Beruti: la revolución no puede darse el lujo de la pedagogía ahora.", prest: 0, riesgo: 8, label: "C" }
    ]
  },
  {
    id: 45,
    title: "El Destino",
    subtitle: "Acto III · La Consolidación · 1 de noviembre de 1810",
    narrative: [
      "Es el primer día de noviembre de 1810. Han pasado casi seis meses desde aquella noche del 18 de abril cuando un extraño te abordó en la Iglesia del Pilar y cambió el curso de tu vida. Seis meses que han durado décadas en experiencia y en cicatrices que el tiempo enseñará a llevar.",
      "La Primera Junta está consolidada. La expedición al norte avanza. La Gaceta de Buenos Aires sigue publicándose. Córdoba fue sometida —con consecuencias dolorosas que todavía resuenan en tu conciencia. Buenos Aires respira como ciudad diferente: más libre, más incierta, más viva en su incertidumbre que en la seguridad del orden que fue.",
      "Tú has sobrevivido. Has contribuido. Has cometido errores que no olvidarás. Has hecho cosas de las que te enorgulleces sin poder decirlas en voz alta. Has sido parte de algo más grande que tú mismo, que es la definición más exacta de lo que significa vivir en la historia.",
      "Ahora el horizonte se abre con la misma plenitud asustadora de todos los horizontes reales. ¿Quién eres en esta nueva Argentina que apenas comienza a saber que existe? ¿Cuál es el legado que dejas a los que vendrán?"
    ],
    choices: [
      { text: "Continuar como agente activo de la independencia, donde la historia te necesite.", prest: 2, riesgo: 6, finalType: "militar", label: "A" },
      { text: "Retirarte a la vida civil como maestro y testigo vivo de lo que ocurrió.", prest: 2, riesgo: -6, finalType: "maestro", label: "B" },
      { text: "Partir hacia otras provincias llevando los ideales revolucionarios al interior.", prest: 3, riesgo: 9, finalType: "propagandista", label: "C" }
    ]
  },

  // ============================================================
  // EPÍLOGO — Qué pasó realmente con cada personaje histórico
  // Eventos 46-50: secuencia lineal post-Acto III.
  // La reflexión de Acto III se dispara en la transición 45→46.
  // ============================================================
  {
    id: 46,
    title: "El Viaje Sin Regreso",
    subtitle: "Epílogo · Mariano Moreno · 1811",
    narrative: [
      "Buenos Aires, enero de 1811. Han pasado ocho meses desde el 25 de mayo y la Primera Junta se fractura entre morenistas y saavedristas con una violencia política que sería hermosa si no tuviera consecuencias reales. Moreno —el cerebro de la revolución, su voz más afilada y su pluma más peligrosa— está siendo enviado a Europa. La misión oficial: negociar reconocimiento diplomático. La misión real: sacarlo de Buenos Aires antes de que gane o de que destruya lo que se construyó.",
      "Te llega la noticia de su partida por un contacto en el puerto. No hubo ceremonias públicas. Moreno abordó el bergantín 'Canning' el 25 de enero de 1811 con dos baúles de libros, una fiebre que arrastraba desde diciembre, y una certeza que no puso en los papeles oficiales. Sus últimas palabras en tierra argentina, según quien estuvo presente, fueron para el criado que lo acompañaba al muelle: 'Cuidá los libros. Los libros son lo único que no va a traicionarme.'",
      "El 4 de marzo de 1811, en alta mar, Mariano Moreno murió. Tenía treinta y dos años. El médico del barco informó que la causa fue una fiebre aguda agravada por el frío del Atlántico. Otros dijeron que el capitán del 'Canning' administró una dosis de tártaro emético —un purgante que en cantidades altas es letal— bajo instrucciones de Buenos Aires. Nadie fue juzgado. La verdad se hundió con su cuerpo en el océano.",
      "Cuando recibís la noticia en Buenos Aires, tenés que decidir cómo guardarla. No en papeles, que ahora son más peligrosos que nunca. En algún lugar más seguro: la memoria, que tarde o temprano busca la palabra justa para lo que no puede nombrar todavía. Moreno escribió: 'Mis principios no mueren aunque yo muera.' Lo que no escribió es que los principios no tienen barco. Los tiene que llevar la gente. Y ahora esa tarea, sin que nadie te la asigne formalmente, te pertenece un poco más."
    ],
    choices: [
      { text: "Fue asesinado. Lo sabés. No tenés pruebas, pero lo sabés.", prest: 0, riesgo: 3, label: "A" },
      { text: "Murió haciendo lo que eligió hacer. Su legado es lo que dejó escrito.", prest: 2, riesgo: -2, label: "B" },
      { text: "Lo que más duele no es su muerte. Es que Buenos Aires siguió sin detenerse.", prest: 1, riesgo: -1, label: "C" }
    ]
  },
  {
    id: 47,
    title: "El Tribuno Silenciado",
    subtitle: "Epílogo · Juan José Castelli · 1811-1812",
    narrative: [
      "Hay algo que cuesta aceptar sobre la historia: que los hombres con las ideas más grandes a veces producen los desastres más costosos. Castelli —el tribuno de Mayo, el que habló ante el Cabildo con la elocuencia de los justos— comandó el Ejército del Norte con la misma convicción con que pronunciaba discursos. El 25 de mayo de 1811, exactamente un año después de la revolución, proclamó en Tiahuanaco la igualdad legal entre criollos e indígenas. Fue el gesto más radical que la revolución había producido. Nadie en Buenos Aires se lo había pedido.",
      "Una semana después, el 20 de junio de 1811, el ejército patriota es derrotado en Huaqui con una contundencia que no deja margen a interpretación. Miles de muertos. El Alto Perú vuelve a manos realistas. Las razones serán debatidas durante décadas: que los hombres estaban mal armados, que fue traicionado, que sus proclamas radicales enajenaron a los aliados locales que necesitaba. Probablemente todo sea cierto y nada alcance para explicar completamente lo que ocurrió en ese campo.",
      "Castelli regresa a Buenos Aires para enfrentar un tribunal militar. Pero antes de que el tribunal dicte veredicto, su cuerpo dicta el propio: desarrolla un cáncer en la mandíbula que avanza con la velocidad que suelen tener las cosas que se llevan a los hombres que más hablan. Para 1812 ya no puede hablar. El tribuno de Mayo, cuya voz movió masas en el momento más crítico, pasa sus últimos meses en silencio forzado en una ciudad que ya está pensando en otra cosa.",
      "Muere el 12 de noviembre de 1812. Tiene cuarenta y ocho años. En sus papeles encuentran anotaciones a medio terminar sobre lo que hubiera dicho al tribunal si hubiera podido hablar. Lo que te queda de él no es Huaqui, que es la parte que todos conocen. Lo que te queda es Tiahuanaco: ese momento en que alguien proclamó que la revolución también era para los que nadie había invitado a la reunión de la Jabonería."
    ],
    choices: [
      { text: "Lo que proclamó en Tiahuanaco valió más que lo que perdió en Huaqui.", prest: 2, riesgo: -1, label: "A" },
      { text: "Los hombres de ideas necesitan a su lado hombres de ejecución. Castelli no los tenía.", prest: 1, riesgo: 0, label: "B" },
      { text: "La revolución lo usó para lo que necesitaba y no lo protegió cuando falló.", prest: 0, riesgo: 2, label: "C" }
    ]
  },
  {
    id: 48,
    title: "La Bandera que Nadie Pidió",
    subtitle: "Epílogo · Manuel Belgrano · 1812-1820",
    narrative: [
      "En febrero de 1812, Manuel Belgrano —el economista que se convirtió en general porque la revolución necesitaba generales y él no sabía decir que no— iza por primera vez en la costa del Paraná una bandera de dos franjas celestes y una blanca. Nadie se la encargó. Buenos Aires, cuando se entera, le manda una orden directa: arriárala, el gesto es prematuro, no hay bandera nacional todavía. Belgrano acusa recibo de la orden. La bandera sigue izada.",
      "En septiembre de 1812 desobedece una orden todavía más importante. Le indican retroceder hasta Córdoba para conservar fuerzas. Belgrano entiende lo que sus superiores no ven desde sus escritorios: si el ejército retrocede, el norte cae, y si el norte cae, la revolución pierde su profundidad territorial y su credibilidad. Elige dar batalla en Tucumán con 1.800 hombres contra 3.000 realistas. Gana. Si hubiera obedecido, probablemente no habrías tenido una nación para la que trabajar.",
      "Lo que sigue es una vida de servicio que agota lo que un cuerpo puede dar. Belgrano dona sus sueldos militares a la educación pública. Construye escuelas en Jujuy y Tarija. Escribe sobre la necesidad de una economía que beneficie a todos y no solo a los mercaderes del puerto. Pierde batallas que no debería haber perdido. Gana batallas que parecían imposibles. Vive en un cuerpo que se apaga más rápido de lo que él querría.",
      "Muere el 20 de junio de 1820 en la más absoluta pobreza. Su médico dejó escrito que al examinar sus bienes encontró 'nada excepto su honor.' Buenos Aires ese día estaba tan envuelta en su propia crisis política que nadie registró el fallecimiento. Lo asentaron en los libros tres días después, como dato tardío. Fue el creador de la bandera que hoy ondea en cada escuela pública de este país."
    ],
    choices: [
      { text: "Hay algo profundamente justo y triste en morir en la pobreza habiendo regalado todo.", prest: 3, riesgo: -3, label: "A" },
      { text: "Su desobediencia en Tucumán salvó la revolución. Obedecer no siempre es el valor más importante.", prest: 2, riesgo: 0, label: "B" },
      { text: "Fue el más completo de todos: pensador, soldado, y fundador sin haber pedido serlo.", prest: 2, riesgo: -1, label: "C" }
    ]
  },
  {
    id: 49,
    title: "El Presidente que Sobrevivió",
    subtitle: "Epílogo · Cornelio Saavedra · 1811-1829",
    narrative: [
      "Cornelio Saavedra —el presidente de la Primera Junta, el que puso el peso del Regimiento de Patricios del lado de la revolución cuando hacía falta y que hizo posible con su respaldo lo que Moreno y Castelli construyeron con palabras— fue desplazado del poder en septiembre de 1811. El Primer Triunvirato que lo reemplazó era más joven, más radical, y tenía prisa por demostrar que la revolución no era cosa de un solo hombre. Saavedra pagó el precio de los que llegan primero cuando llegan los segundos.",
      "Lo acusaron de conspirar. Lo exiliaron a Mendoza. Regresó a Buenos Aires en 1813, cuando el Triunvirato que lo había expulsado ya había sido a su vez desplazado —la revolución devoraba sus propias estructuras con una regularidad que empezaba a verse como patrón, no como accidente. Participó en campañas menores. Nadie le prestó demasiada atención. El hombre cuya firma en la Primera Junta abrió el capítulo más importante de estas tierras se volvió figura del pasado durante su propia vida.",
      "Vivió hasta 1829. Vio nacer la bandera de Belgrano, que nadie le pidió permiso para crear. Vio la declaración de independencia de 1816, que él nunca pidió en 1810 porque creía que el momento no era ese. Vio las guerras civiles entre unitarios y federales. Vio cómo el país que fue tomando forma no se parecía demasiado a lo que cualquiera de los hombres de mayo había planeado. Sobrevivió a casi todos sus contemporáneos y eso, en ciertas épocas históricas, tiene un precio que no se mide en años.",
      "Escribió sus memorias cerca del final. En ellas no hay amargura notable —o la hay tan bien calibrada que se disimula en la sintaxis. Hay algo más interesante: la conciencia tranquila de haber iniciado algo que escapó a todo intento de control. 'Hicimos bien en lo que hicimos', escribió, con la parsimonia de quien ya no tiene nada que probar. 'Aunque no salió como ninguno de nosotros pensaba.' Es posiblemente la frase más honesta que se escribió sobre la Revolución de Mayo."
    ],
    choices: [
      { text: "Su honestidad al final dice más sobre su carácter que cualquier cosa que hizo en 1810.", prest: 1, riesgo: -2, label: "A" },
      { text: "El problema de querer controlar una revolución es que las revoluciones no lo permiten.", prest: 2, riesgo: -1, label: "B" },
      { text: "Duró porque supo cuándo soltar el poder. Los que no saben eso no sobreviven.", prest: 1, riesgo: 0, label: "C" }
    ]
  },
  {
    id: 50,
    title: "Lo que Quedó",
    subtitle: "Epílogo · La Revolución · 1816",
    narrative: [
      "El 9 de julio de 1816, seis años y cuarenta y cuatro días después del 25 de mayo de 1810, el Congreso reunido en Tucumán declaró la independencia de las Provincias Unidas del Río de la Plata. Para ese momento ya no estaban Moreno —muerto en el mar—, ni Castelli —muerto en silencio—, ni Liniers —fusilado en Córdoba en agosto de 1810. Muchos de los hombres que construyeron el puente de mayo se habían quemado con él. Los que sobrevivieron llegaron a 1816 con más cicatrices que certezas.",
      "Lo que siguió al 25 de mayo fue una guerra larga, extenuante, y más complicada de lo que cualquier optimista de la Jabonería hubiera podido imaginar. Las guerras de independencia se extendieron por todo el continente americano hasta 1824, cuando Bolívar y Sucre derrotaron a los realistas en la batalla de Ayacucho. Catorce años de guerra continental para completar lo que empezó en un cabildo de Buenos Aires un martes de mayo. El saldo humano fue devastador. El resultado político fue la creación de doce países nuevos donde antes había cuatro virreinatos.",
      "El Virreinato del Río de la Plata no sobrevivió como unidad. Paraguay declaró su propia independencia. El Alto Perú se convirtió en Bolivia. La Banda Oriental se convirtió en Uruguay. Las guerras civiles entre unitarios y federales desgarraron a las Provincias Unidas durante décadas. La Argentina que conocemos —con la Constitución de 1853, la bandera de Belgrano, ese himno— tardó cuarenta y tres años más en consolidarse después de mayo de 1810. La historia no espera a que los que la inician estén listos para recibirla.",
      "Pero algo quedó de aquel mayo: la ruptura. El quiebre con la idea de que el orden colonial era natural e inevitable. La afirmación —peligrosa, costosa, irreversible— de que el poder reside en el pueblo y no en un rey cautivo en Europa. Esa idea, que Moreno articuló y Castelli proclamó en Tiahuanaco y Belgrano defendió desobedeciendo órdenes en Tucumán y Saavedra avaló con sus tropas en la plaza —esa idea no murió con ninguno de ellos. Llegó hasta acá. Llegó hasta vos, {PLAYER}. Lo que hacés con ella es, en algún sentido, la continuación de la historia que empezó aquella noche en que un extraño te abordó en la Iglesia del Pilar."
    ],
    choices: [
      { text: "Valió la pena. La independencia fue posible porque alguien tuvo el coraje de empezar.", prest: 3, riesgo: -3, label: "A" },
      { text: "El costo fue inmenso. Habría que preguntarse si había caminos menos cruentos.", prest: 1, riesgo: -2, label: "B" },
      { text: "La historia no tiene respuesta simple. Nunca la tiene. Y eso también es una respuesta.", prest: 2, riesgo: -1, label: "C" }
    ]
  },

  // ============================================================
  // ACTO II ALTERNATIVO — Ruta Diplomática
  // Reemplazan eventos 22 y 23 para jugadores que priorizaron
  // cautela y negociación sobre acción directa en el Acto I.
  // Evento 221 → 222 (secuencial), luego nextEvent: 24 reencuentra
  // el camino principal.
  // ============================================================
  {
    id: 221,
    title: "El Enviado de la Junta",
    subtitle: "Acto II · La Revolución · 19 de junio de 1810",
    narrative: [
      "La decisión de la Junta fue tomada a puerta cerrada: alguien debe ir al noroeste, no con tropas sino con palabras. Castelli marcha con el ejército hacia el norte para imponer la revolución por la fuerza; Ocampo avanza sobre Córdoba con cañones. Pero hay gobernadores en Salta y Tucumán que no son enemigos declarados —son hombres que esperan ver qué conviene más— y esos hombres se ganan con argumentos, no con pólvora.",
      "El elegido eres tú. No fue una decisión tomada a la ligera: tu reputación como mensajero que piensa antes de actuar y construye puentes donde otros queman te distinguió de candidatos con más experiencia diplomática formal. Moreno fue breve, como siempre: 'Tenés que hacer que Salta dude menos de nosotros que del rey fantasma que tienen en Bayona.' Belgrano añadió, con más calidez: 'La revolución que gana sin derramar sangre es la que dura.'",
      "El viaje en diligencia durará semanas por caminos que el invierno vuelve difíciles. Llevás cartas oficiales de la Junta, pero también instrucciones verbales que nunca aparecerán en ningún documento: si el gobernador de Salta no se declara aliado, debés saber si se convertirá en enemigo activo o si permanecerá neutral. Hay cosas que se obtienen de los neutrales que los aliados declarados no pueden dar, y la Junta necesita las dos.",
      "Antes de partir, un soldado joven de tu escolta te pregunta en voz baja si realmente cree que las palabras pueden doblar lo que las bayonetas no pudieron. Le respondés con una confianza que en parte es real y en parte es necesaria para que funcione. La respuesta que guardás para vos mismo es más complicada."
    ],
    choices: [
      { text: "Ir directamente al gobernador de Salta: su adhesión arrastra a Jujuy y Tucumán.", prest: 3, riesgo: 8, label: "A" },
      { text: "Contactar primero a los comerciantes criollos — ellos presionarán al gobernador por vos.", prest: 2, riesgo: 5, special: { title: "LA RED COMERCIAL", text: "Tu estrategia resulta más fina de lo esperado: los comerciantes locales, que ven en la apertura comercial de la Junta una oportunidad que el monopolio español les negó durante décadas, se convierten en aliados silenciosos. Presionarán al gobernador con argumentos que ningún delegado oficial podría usar. A veces la revolución se gana en el mercado antes de ganarse en el palacio." }, label: "B" },
      { text: "Presentar la misión como puramente comercial para no revelar los objetivos reales hasta tener terreno seguro.", prest: 1, riesgo: -3, label: "C" }
    ]
  },
  {
    id: 222,
    title: "Las Provincias Hablan",
    subtitle: "Acto II · La Revolución · 22 de junio de 1810",
    nextEvent: 24,
    narrative: [
      "Tucumán es diferente de todo lo que conocías de Buenos Aires. La ciudad tiene su propio ritmo, sus propias jerarquías, sus propios miedos. Los comerciantes del noroeste viven del comercio con el Alto Perú, todavía en manos realistas; una adhesión apresurada a la Junta puede cortarles la principal vena económica. Su cautela no es traición —es aritmética— y eso es algo con lo que podés trabajar.",
      "El gobernador interino te recibe con la cordialidad calculada del hombre que sabe que tiene opciones. Escucha tu exposición —los argumentos sobre la legitimidad de la Junta, la inestabilidad del gobierno en España, el futuro comercial de una región libre— con la atención de quien toma notas mentales aunque no levante ninguna pluma. Al final dice que 'considerará la situación con la prudencia que los tiempos demandan.' Es un lenguaje que conocés: significa esperar para ver cuál bando parece ganar.",
      "En los días que siguen te reunís con vecinos notables, curas, abogados. La imagen que emerge es la de una provincia que quiere sobrevivir lo que sea que ocurra, que tiene menos amor por el rey español que por sus propias costumbres y poderes locales. Son conservadores de sí mismos, no del Imperio. Ese es el hueco por donde entra la Junta si juega bien sus cartas.",
      "Una noche, un joven abogado de nombre Bernardo te busca por su cuenta. Sus ideas van mucho más lejos que las tuyas sobre qué significa la independencia y quiere unirse al movimiento en Buenos Aires. Escucharlo es un recordatorio de que la revolución que ayudaste a iniciar es apenas el primer capítulo de algo que vos no controlarás. Mientras regresás a Buenos Aires con tus informes y tus promesas cautelosas, sabés que dejás en el noroeste semillas cuyo fruto verá otro."
    ],
    choices: [
      { text: "Formalizar un acuerdo de no-interferencia con el gobernador a nombre de la Junta.", prest: 2, riesgo: 4, label: "A" },
      { text: "Apostar a los sectores más jóvenes y radicales para crear una base popular local.", prest: 2, riesgo: 10, label: "B" },
      { text: "Regresar a Buenos Aires con un informe honesto sin compromisos que no podés mantener.", prest: 1, riesgo: -2, special: { title: "INFORME PARA LA JUNTA", text: "Tu reporte describe con precisión la realidad del noroeste: cautela estratégica, no traición. Moreno lo lee dos veces. Belgrano anota los nombres que mencionás. El trabajo de base que realizaste será invisible en los documentos oficiales, pero cambiará la forma en que la Junta entiende y trata a estas provincias durante los meses que vienen." }, label: "C" }
    ]
  }
];

