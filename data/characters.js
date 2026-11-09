// ============================================================
// PERSONAJES HISTÓRICOS — retratos, datos y diálogos
// ============================================================
const CHARACTERS = {
  belgrano: {
    nombre: "Manuel Belgrano",
    cargo: "Abogado · Vocal de la Primera Junta",
    img: "./assets/portraits/belgrano.jpg",
    dialogos: {
      jaboneria: [
        "Sé que esto te parece mucho para una primera noche. La Jabonería no es lo que parece desde afuera, y nosotros tampoco. Somos abogados, comerciantes, hombres de iglesia. Gente que tiene más que perder que la mayoría y aun así está acá.",
        "Estudié en Europa. Vi lo que es un pueblo que se gobierna a sí mismo. Lo que tenemos acá —un rey prisionero, un Virrey que ya no representa a nadie— es un accidente de la historia. Nuestra tarea es convertirlo en una oportunidad.",
        "Tu rol no va a ser el de soldado. Va a ser el de mensajero, el de puente entre las personas que tienen que tomar decisiones y las que las van a ejecutar. Las ideas necesitan pies y manos para moverse. ¿Estás dispuesto a ser esas manos?"
      ],
      escarapela: [
        "Las naciones necesitan símbolos que las convoquen, no solo argumentos que las convenzan. Un símbolo bien elegido llega donde el discurso más brillante no llega: a la gente que no tiene tiempo de leer pero sí de mirar.",
        "Celeste y blanco. Los colores de la Virgen, los colores del cielo del Río de la Plata, los mismos colores que French y Beruti usaron en la plaza. No es un capricho. Es continuidad. El pueblo ya sabe qué significan esos colores.",
        "Saavedra va a oponerse. Moreno también, aunque por razones distintas. Pero los momentos históricos no esperan consenso unánime. ¿Qué pensás vos? Necesito tu opinión sincera, no la políticamente conveniente."
      ]
    },
    // Preguntas opcionales tras el diálogo: { q: lo que pregunta el jugador, a: respuesta en boca
    // del personaje, en su tiempo (nunca anticipar hechos posteriores al evento) }.
    // No cambian prestigio ni riesgo. Ver charAskQuestion() en engine/game.js.
    preguntas: {
      jaboneria: [
        {
          q: "¿Qué es esta jabonería?",
          a: "Es de Hipólito Vieytes, un hombre de campo y de comercio que además escribe: él edita el Semanario de Agricultura, Industria y Comercio, y yo lo ayudo desde el Consulado. Un negocio de jabón no llama la atención de nadie, y por eso nos reunimos acá y no en la casa de un doctor."
        },
        {
          q: "Dice que estudió en Europa: ¿dónde?",
          a: "En España. Me mandaron a los dieciséis años: estudié Leyes en Salamanca y en Valladolid, y me recibí de abogado en 1793. Más que los códigos, me marcaron los libros de los economistas, que enseñan que la riqueza de un país nace de trabajar la tierra y de educar al que la trabaja. Volví en 1794 como secretario del Consulado, y desde entonces no dejo de pedir escuelas."
        },
        {
          q: "¿Por qué un rey prisionero cambia tanto las cosas?",
          a: "Porque el rey era el único lazo que unía estas tierras con España. Fernando está preso de Napoleón desde 1808, y en España mandan juntas que acá nadie eligió. Si el rey falta, decimos, el poder vuelve al pueblo. Por ahora no hablamos de independencia: hablamos de gobernarnos en nombre de Fernando, hasta que vuelva."
        }
      ],
      escarapela: [
        {
          q: "¿De dónde salen el celeste y el blanco?",
          a: "Te soy sincero: no hay una sola respuesta. Unos dicen que es el cielo de nuestro río; otros, el manto de la Virgen Inmaculada; y hay quienes recuerdan que son los colores de la casa de Borbón, la del rey Fernando. Lo cierto es que French y Beruti repartieron esas cintas en la plaza y la gente las reconoció enseguida."
        },
        {
          q: "¿Qué tenés en mente con esta cinta?",
          a: "Una cinta que cada uno se prende como puede es un gesto; una señal igual para todos, que hable en nombre del gobierno, sería un símbolo. Es una idea mía, nada más: todavía no la propuse a nadie, y sé el problema. Un distintivo propio suena a separarnos de España, y la Junta gobierna en nombre del rey. Pero los símbolos hay que pensarlos antes de necesitarlos."
        },
        {
          q: "¿Qué van a decir Saavedra y Moreno?",
          a: "Saavedra es hombre de cuartel y prefiere la ambigüedad: desconfía de todo lo que apure los tiempos. Moreno, al revés, quiere declaraciones claras y piensa en decretos y en la Gaceta más que en gestos. Los dos tienen algo de razón, y por eso quiero tu opinión antes de hablar con ellos."
        }
      ]
    }
  },

  french: {
    nombre: "Domingo French",
    cargo: "Comandante de los Chisperos · Milicia Patriota",
    img: "./assets/portraits/french.jpg",
    dialogos: {
      escarapelas: [
        "No me importa lo que están discutiendo adentro del Cabildo. Lo que me importa es que afuera haya suficiente gente para que no puedan ignorarnos. Sin presión popular, los doctores negocian, ceden, y en una semana todo vuelve a ser como antes.",
        "Esta cinta celeste y blanca es una declaración. El que la lleva hoy está tomando partido, y eso asusta. Pero hay momentos en la historia en que la neutralidad es la peor de las opciones. El que no elige, elige igual.",
        "Necesito que vayas al Retiro y a San Telmo. Que la gente vea que la plaza no es un rumor. Que la revolución tiene cara, tiene nombre, tiene color. ¿Podés hacer eso antes del amanecer del 22?"
      ]
    },
    preguntas: {
      escarapelas: [
        {
          q: "¿Quiénes son tus chisperos?",
          a: "Muchachos de barrio, criollos, gente que no se sienta en las salas del Cabildo pero sabe llenar una plaza. Beruti y yo los reunimos. Mientras los doctores discuten adentro, nosotros nos aseguramos de que afuera haya quien escuche."
        },
        {
          q: "¿A qué te dedicabas antes de todo esto?",
          a: "Reparto cartas: desde 1802 recorro Buenos Aires casa por casa, así que conozco a medio pueblo. Y en las invasiones inglesas me tocó pelear; Liniers me nombró teniente coronel en 1808. Esta ciudad aprendió a defenderse sola, y eso no se olvida."
        },
        {
          q: "¿Qué pasó hoy en la plaza?",
          a: "Esta tarde la Plaza de la Victoria se llenó de hombres con armas: dicen que somos unos seiscientos. No vinimos a pedir permiso, vinimos a que el virrey vea que el pueblo existe. Cisneros no tuvo más remedio que aceptar el Cabildo Abierto, y mañana va a reunirse."
        }
      ]
    }
  },

  beruti: {
    nombre: "Antonio Luis Beruti",
    cargo: "Abogado · Organizador Popular · Chispero",
    img: "./assets/portraits/beruti.jpg",
    dialogos: {
      plaza25: [
        "Cuatrocientas cincuenta y siete firmas. Las conté tres veces. Comerciantes, artesanos, milicianos, un zapatero que firmó con una cruz porque no sabe escribir. Eso es lo que el pueblo puso sobre la mesa del Cabildo.",
        "La gente que firmó sabe lo que arriesga. El Virrey tiene listas. Puede represaliarlos mañana mismo. Firmaron igual porque están hartos, porque sienten que algo cambió y que esta vez puede ser distinto.",
        "Hoy adentro van a hablar los doctores. Castelli, Moreno, los juristas. Nosotros vamos a estar afuera. No para intimidar — para recordarles que el pueblo existe y está mirando. Necesito saber si puedo contar con vos."
      ]
    },
    // Preguntas opcionales (ver belgrano): respuesta en boca del personaje, en su tiempo.
    preguntas: {
      plaza25: [
        {
          q: "¿Quién es usted, Beruti?",
          a: "Nací en Buenos Aires en 1772. Mi padre era escribano real y me mandó a España: me doctoré en Leyes en Salamanca. Volví con ideas que en esta ciudad cuesta decir en voz alta. Con French nos repartimos el trabajo: él pone el temple de militar, yo las palabras."
        },
        {
          q: "¿Cómo se juntaron esas firmas?",
          a: "Ayer los milicianos recorrieron calles y casas con un papel que pide disolver la junta del virrey y trae la lista de quiénes deben gobernar. Dicen que la idea fue de French y mía. Cada uno firmó con nombre y apellido, y el que firma sabe que queda anotado."
        },
        {
          q: "¿Por qué la plaza y no solo el Cabildo?",
          a: "Porque los doctores argumentan, pero lo que pesa es lo que hay en la calle. Dicen que el propio virrey, cuando se vio perdido, soltó: «ya que el pueblo no me quiere y el ejército me abandona, hagan ustedes lo que quieran». Hoy hay que mostrarle que el pueblo no cambió de idea."
        }
      ]
    }
  },

  cisneros: {
    nombre: "Baltasar Hidalgo de Cisneros",
    cargo: "Virrey del Río de la Plata",
    img: "./assets/portraits/cisneros.jpg",
    dialogos: {
      cabildoabierto: [
        "Te mirás y ves a un revolucionario. Yo te miro y veo a un joven inteligente siendo usado por gente que tiene mucho que ganar y te pone a vos a correr los riesgos. No es casualidad que los que agitan siempre estén a salvo mientras los mensajeros terminan presos.",
        "España se va a recuperar. Fernando va a volver al trono. Y cuando eso pase, los que se apresuraron a traicionar a la Corona van a tener que responder. Estás a tiempo de elegir el lado correcto.",
        "El orden que estas personas quieren destruir es el mismo que ha dado paz y comercio a estas tierras por doscientos años. ¿Qué ofrecen a cambio? Palabras sobre libertad escritas por hombres que nunca gobernaron nada."
      ]
    },
    // Preguntas opcionales (ver belgrano): respuesta en boca del personaje, en su tiempo.
    preguntas: {
      cabildoabierto: [
        {
          q: "¿Quién es usted, excelencia?",
          a: "Soy marino, no político. Serví en la Armada del Rey durante muchos años y estuve en las batallas del cabo de San Vicente y de Trafalgar. En 1809 me mandaron a gobernar estas tierras, y llevo diez meses tratando de sostener el orden en un momento en que todo se tambalea."
        },
        {
          q: "¿Qué pasó en España, excelencia?",
          a: "Napoleón ocupó casi toda la Península y el rey Fernando está prisionero. Las noticias que llegaron hace unos días dicen que la Junta que gobernaba en nombre del rey se disolvió bajo el avance francés. Estos señores concluyen que a ustedes les toca mandarse solos. Yo digo que lo que corresponde es esperar al rey."
        },
        {
          q: "¿Por qué abrió el comercio a los ingleses?",
          a: "Porque la caja estaba vacía y la guerra cuesta. Dejé comerciar a los ingleses por un tiempo y con derechos, para que la Real Hacienda recibiera dinero. No fue un favor a nadie, fue una necesidad. Los hacendados querían más, los comerciantes españoles querían menos, y yo tuve que decidir entre los dos."
        }
      ]
    }
  },

  castelli: {
    nombre: "Juan José Castelli",
    cargo: "Abogado · El Tribuno · Vocal de la Primera Junta",
    img: "./assets/portraits/castelli.jpg",
    dialogos: {
      contrarrevolucion: [
        "Escuchaste el argumento de los realistas: que debemos esperar, que España se recuperará, que la lealtad al Rey nos obliga. Es inteligente. Pero se sostiene sobre una mentira: que la autoridad del Rey puede delegarse al Virrey cuando el Rey está cautivo. Eso no tiene base en ningún derecho natural ni positivo.",
        "Lo que hicimos en el Cabildo no fue traición. Fue exactamente lo que la doctrina colonial prevé cuando la metrópoli no puede gobernar: la soberanía retorna al pueblo. Estamos actuando dentro de la ley. Solo que la ley, por una vez, nos favorece a nosotros.",
        "El momento de dudar ya pasó. El 22 de mayo quedó en los libros. Lo que necesitamos ahora no son más argumentos — necesitamos personas dispuestas a actuar. ¿Lo sos?"
      ]
    },
    // Preguntas opcionales (ver belgrano): respuesta en boca del personaje, en su tiempo.
    preguntas: {
      contrarrevolucion: [
        {
          q: "¿Qué dijo usted en el Cabildo Abierto?",
          a: "Dije que, caído el gobierno de España, el poder vuelve al pueblo, y que Buenos Aires tiene derecho a decidir quién la gobierna. No inventé nada: es un principio viejo del derecho español. Lo que molestó fue decirlo en voz alta, frente al obispo y a los funcionarios del rey."
        },
        {
          q: "¿Qué tiene de malo una junta presidida por Cisneros?",
          a: "Es una concesión que no concede nada: le quitaron el título de virrey y lo dejaron al frente con otro nombre, el de presidente. Cambia el cargo, no cambia la voluntad. Saavedra y yo figuramos como vocales, pero ya avisamos que renunciamos: no firmo nada bajo las órdenes del mismo hombre."
        },
        {
          q: "¿Por qué lo llaman el Tribuno?",
          a: "Por la voz, supongo. Los tribunos de Roma hablaban en nombre del pueblo, y eso intento hacer. Desde el 22 hay quien me llama el orador de la Revolución. Prefiero que me recuerden por lo que dije y no por el apodo."
        }
      ]
    }
  },

  moreno: {
    nombre: "Mariano Moreno",
    cargo: "Abogado · Secretario de la Primera Junta",
    img: "./assets/portraits/moreno.jpg",
    dialogos: {
      decreto: [
        "Los revolucionarios necesitan dos cosas: ideas para saber adónde van, y gente con las ideas suficientemente claras para transmitirlas sin distorsionarlas. Vos parecés ser lo segundo, que es más raro de lo que parece.",
        "El mensaje que llevás no es solo información. Es la diferencia entre que una familia dé refugio a un correo nuestro o lo entregue a las autoridades. Lo que digan tus palabras cuando lo entregués importa tanto como lo que dice el papel.",
        "Una cosa más. Si te detienen, ese documento no puede llegar a manos del Virrey. Espero que entiendas exactamente lo que eso significa. Mirándome a los ojos: ¿lo entendés?"
      ],
      debate: [
        "Saavedra dice que la revolución necesita tiempo. Tiene razón. También necesita dirección, y la dirección no es algo que aparezca sola mientras uno espera que las condiciones sean perfectas.",
        "Este territorio es inmenso y diverso. Eso es verdad. Pero la diversidad no es argumento para la inacción — es argumento para actuar con más urgencia, no con menos. Cada semana que perdemos en debates internos es una semana que los realistas usan para organizarse.",
        "No te pido que elijas mi posición. Te pido que no elijas el silencio. En este momento, el silencio es la única opción que garantiza que perdemos."
      ]
    },
    // Preguntas opcionales (ver belgrano): respuesta en boca del personaje, en su tiempo.
    preguntas: {
      decreto: [
        {
          q: "¿Quién es usted, doctor Moreno?",
          a: "Nací en Buenos Aires en 1778. Estudié Leyes en Chuquisaca y volví a ejercer de abogado. En 1809 escribí, en nombre de los hacendados, un pedido al virrey para poder vender nuestros cueros y nuestra carne a quien quisiera comprarlos. Esa idea es la semilla de este decreto."
        },
        {
          q: "¿Qué cambia con el comercio libre?",
          a: "Hoy casi todo lo que entra y sale tiene que pasar por España, y eso empobrece a quien produce. Si los puertos se abren a las naciones amigas, el que cría ganado vende más, y la Junta cobra derechos que llenan la caja que necesita. Los comerciantes del monopolio no nos lo van a perdonar."
        },
        {
          q: "¿Por qué tanto secreto con el borrador?",
          a: "Porque un decreto que se filtra se discute en la calle antes de nacer, y los que viven del monopolio tendrían tiempo de armar una respuesta. Prefiero que lo conozcan el día en que ya es ley y no hay vuelta atrás."
        }
      ],
      debate: [
        {
          q: "¿Por qué le da tanta importancia a la Gaceta?",
          a: "Porque un gobierno que gobierna a oscuras no puede pedir que lo apoyen. La Gaceta de Buenos Aires salió el 7 de junio para que el pueblo lea qué hacemos y por qué. Una revolución que no se explica se pierde, aunque tenga razón."
        },
        {
          q: "¿Qué piensa de Saavedra?",
          a: "Que es un hombre honrado y un buen soldado, y que sin él y sus Patricios no habría Junta. Pero pensamos distinto: él cree que se gobierna con calma, yo con decisión. Lo peor que nos puede pasar es mostrarnos divididos delante de los realistas."
        },
        {
          q: "¿Qué hay que hacer con las provincias?",
          a: "El 27 de mayo les escribimos a las ciudades del interior invitándolas a mandar sus diputados. Pero una invitación sola no alcanza: hay que enviar fuerzas hacia el norte antes de que los realistas se organicen allá. Las provincias se ganan con hechos, no con circulares."
        }
      ]
    }
  },

  saavedra: {
    nombre: "Cornelio Saavedra",
    cargo: "Teniente Coronel · Presidente de la Primera Junta",
    img: "./assets/portraits/saavedra.jpg",
    dialogos: {
      primerajunta: [
        "Ganamos la primera batalla. El Cabildo votó, el Virrey cedió, la Junta existe. Eso es más de lo que muchos creíamos posible hace un mes. Ahora viene lo difícil.",
        "Moreno quiere ir rápido. Entiendo su urgencia. Pero este territorio es enorme y la mayoría de sus habitantes no sabe todavía qué es una junta ni qué significa autogobierno. Si vamos demasiado rápido, perdemos a las provincias, y sin las provincias, Buenos Aires sola no es nada.",
        "El trabajo en el Acto I fue el de conspirar. Lo que viene ahora es distinto: gobernar. Y gobernar sin perder lo que se ganó es la parte que nadie te enseña."
      ]
    },
    // Preguntas opcionales (ver belgrano): respuesta en boca del personaje, en su tiempo.
    preguntas: {
      primerajunta: [
        {
          q: "¿Quién es usted, coronel?",
          a: "Nací en el Alto Perú, cerca de Potosí, en 1759, y mi familia se vino a Buenos Aires cuando yo era chico. En las invasiones inglesas los oficiales me eligieron jefe del regimiento de Patricios. Soy militar de milicias, no de carrera, pero conozco a mi gente."
        },
        {
          q: "¿Qué son los Patricios?",
          a: "Un regimiento de criollos nacidos en Buenos Aires. Se formó en 1806, después de la primera invasión inglesa, porque la ciudad no tenía con qué defenderse. Esos hombres aprendieron que podían vencer a un ejército europeo, y eso cambia a la gente. Hoy son la fuerza que respalda a esta Junta."
        },
        {
          q: "¿Por qué no ir más rápido con las provincias?",
          a: "Porque lo que se impone a la fuerza se rompe. Vamos a escribir a las ciudades del interior invitándolas a mandar diputados, y a esperar su respuesta. Moreno quiere correr; yo prefiero llegar con todos. Un gobierno que pierde las provincias queda reducido a una sola ciudad."
        }
      ]
    }
  },

  liniers: {
    nombre: "Santiago de Liniers",
    cargo: "Ex-Virrey Interino · Jefe de la Resistencia Realista",
    img: "./assets/portraits/liniers.jpg",
    dialogos: {
      cordoba: [
        "Sé por qué estás acá. Y sé lo que te van a pedir que me digas: que me rinda, que la causa está perdida, que mi resistencia solo añade sangre inútil a lo que ya es irreversible.",
        "Yo defendí esta ciudad contra los ingleses dos veces. Dos reconquistas, con los mismos criollos que hoy me llaman enemigo. No me pidas que entienda eso sin amargura.",
        "Pero te voy a decir algo que no le dirías a tu gente: lo que están haciendo tiene una lógica que entiendo, aunque no pueda aceptarla. Los imperios cambian. Las lealtades se ajustan. Solo espero que cuando lleguen al poder, sean mejores señores de lo que fueron súbditos."
      ]
    },
    // Preguntas opcionales (ver belgrano): respuesta en boca del personaje, en su tiempo.
    preguntas: {
      cordoba: [
        {
          q: "¿Quién es usted, don Santiago?",
          a: "Nací en Francia, en Niort, en 1753, hijo de un oficial de marina. Llegué a estas tierras como oficial de la Armada española. Soy francés de cuna y español de juramento, y por eso hay quien duda de mí aun después de todo lo que hice por esta ciudad."
        },
        {
          q: "¿Cómo fue la Reconquista?",
          a: "En 1806 los ingleses tenían Buenos Aires. Crucé el río desde la Banda Oriental con unos pocos soldados y la ciudad entera se levantó con nosotros: milicianos, vecinos, hombres y mujeres. La recuperamos el 12 de agosto, y al año siguiente la defendimos de un segundo ataque. Ese día aprendí que el valor no es de ningún cuerpo en particular, sino de quien defiende lo suyo."
        },
        {
          q: "¿Por qué resiste a la Junta?",
          a: "Después de dejar el virreinato me retiré a una estancia en Alta Gracia. Allí me alcanzó la noticia de lo de Buenos Aires. Con otros hombres de Córdoba resolvimos no obedecer a esta Junta, porque no la eligieron todos los pueblos del virreinato. No quiero sangre. Por eso mando esta propuesta: me retiro si se me garantiza la seguridad y se respeta mi honor."
        }
      ]
    }
  }
};
