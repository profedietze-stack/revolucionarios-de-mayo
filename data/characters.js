// ============================================================
// PERSONAJES HISTÓRICOS — retratos, datos y diálogos
// ============================================================
const CHARACTERS = {
  belgrano: {
    nombre: "Manuel Belgrano",
    cargo: "Abogado · Vocal de la Primera Junta",
    img: "./assets/portraits/belgrano.png",
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
    }
  },

  french: {
    nombre: "Domingo French",
    cargo: "Comandante de los Chisperos · Milicia Patriota",
    img: "./assets/portraits/french.png",
    dialogos: {
      escarapelas: [
        "No me importa lo que están discutiendo adentro del Cabildo. Lo que me importa es que afuera haya suficiente gente para que no puedan ignorarnos. Sin presión popular, los doctores negocian, ceden, y en una semana todo vuelve a ser como antes.",
        "Esta cinta celeste y blanca es una declaración. El que la lleva hoy está tomando partido, y eso asusta. Pero hay momentos en la historia en que la neutralidad es la peor de las opciones. El que no elige, elige igual.",
        "Necesito que vayas al Retiro y a San Telmo. Que la gente vea que la plaza no es un rumor. Que la revolución tiene cara, tiene nombre, tiene color. ¿Podés hacer eso antes del amanecer del 22?"
      ]
    }
  },

  beruti: {
    nombre: "Antonio Luis Beruti",
    cargo: "Abogado · Organizador Popular · Chispero",
    img: "./assets/portraits/beruti.png",
    dialogos: {
      plaza25: [
        "Cuatrocientas cincuenta y siete firmas. Las conté tres veces. Comerciantes, artesanos, milicianos, un zapatero que firmó con una cruz porque no sabe escribir. Eso es lo que el pueblo puso sobre la mesa del Cabildo.",
        "La gente que firmó sabe lo que arriesga. El Virrey tiene listas. Puede represaliarlos mañana mismo. Firmaron igual porque están hartos, porque sienten que algo cambió y que esta vez puede ser distinto.",
        "Hoy adentro van a hablar los doctores. Castelli, Moreno, los juristas. Nosotros vamos a estar afuera. No para intimidar — para recordarles que el pueblo existe y está mirando. Necesito saber si puedo contar con vos."
      ]
    }
  },

  cisneros: {
    nombre: "Baltasar Hidalgo de Cisneros",
    cargo: "Virrey del Río de la Plata",
    img: "./assets/portraits/cisneros.png",
    dialogos: {
      cabildoabierto: [
        "Te mirás y ves a un revolucionario. Yo te miro y veo a un joven inteligente siendo usado por gente que tiene mucho que ganar y te pone a vos a correr los riesgos. No es casualidad que los que agitan siempre estén a salvo mientras los mensajeros terminan presos.",
        "España se va a recuperar. Fernando va a volver al trono. Y cuando eso pase, los que se apresuraron a traicionar a la Corona van a tener que responder. Estás a tiempo de elegir el lado correcto.",
        "El orden que estas personas quieren destruir es el mismo que ha dado paz y comercio a estas tierras por doscientos años. ¿Qué ofrecen a cambio? Palabras sobre libertad escritas por hombres que nunca gobernaron nada."
      ]
    }
  },

  castelli: {
    nombre: "Juan José Castelli",
    cargo: "Abogado · El Tribuno · Vocal de la Primera Junta",
    img: "./assets/portraits/castelli.png",
    dialogos: {
      contrarrevolucion: [
        "Escuchaste el argumento de los realistas: que debemos esperar, que España se recuperará, que la lealtad al Rey nos obliga. Es inteligente. Pero se sostiene sobre una mentira: que la autoridad del Rey puede delegarse al Virrey cuando el Rey está cautivo. Eso no tiene base en ningún derecho natural ni positivo.",
        "Lo que hicimos en el Cabildo no fue traición. Fue exactamente lo que la doctrina colonial prevé cuando la metrópoli no puede gobernar: la soberanía retorna al pueblo. Estamos actuando dentro de la ley. Solo que la ley, por una vez, nos favorece a nosotros.",
        "El momento de dudar ya pasó. El 22 de mayo quedó en los libros. Lo que necesitamos ahora no son más argumentos — necesitamos personas dispuestas a actuar. ¿Lo sos?"
      ]
    }
  },

  moreno: {
    nombre: "Mariano Moreno",
    cargo: "Abogado · Secretario de la Primera Junta",
    img: "./assets/portraits/moreno.png",
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
    }
  },

  saavedra: {
    nombre: "Cornelio Saavedra",
    cargo: "Teniente Coronel · Presidente de la Primera Junta",
    img: "./assets/portraits/saavedra.png",
    dialogos: {
      primerajunta: [
        "Ganamos la primera batalla. El Cabildo votó, el Virrey cedió, la Junta existe. Eso es más de lo que muchos creíamos posible hace un mes. Ahora viene lo difícil.",
        "Moreno quiere ir rápido. Entiendo su urgencia. Pero este territorio es enorme y la mayoría de sus habitantes no sabe todavía qué es una junta ni qué significa autogobierno. Si vamos demasiado rápido, perdemos a las provincias, y sin las provincias, Buenos Aires sola no es nada.",
        "El trabajo en el Acto I fue el de conspirar. Lo que viene ahora es distinto: gobernar. Y gobernar sin perder lo que se ganó es la parte que nadie te enseña."
      ]
    }
  },

  liniers: {
    nombre: "Santiago de Liniers",
    cargo: "Ex-Virrey Interino · Jefe de la Resistencia Realista",
    img: "./assets/portraits/liniers.png",
    dialogos: {
      cordoba: [
        "Sé por qué estás acá. Y sé lo que te van a pedir que me digas: que me rinda, que la causa está perdida, que mi resistencia solo añade sangre inútil a lo que ya es irreversible.",
        "Yo defendí esta ciudad contra los ingleses dos veces. Dos reconquistas, con los mismos criollos que hoy me llaman enemigo. No me pidas que entienda eso sin amargura.",
        "Pero te voy a decir algo que no le dirías a tu gente: lo que están haciendo tiene una lógica que entiendo, aunque no pueda aceptarla. Los imperios cambian. Las lealtades se ajustan. Solo espero que cuando lleguen al poder, sean mejores señores de lo que fueron súbditos."
      ]
    }
  }
};
