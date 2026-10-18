export interface SeedChurchTourItem {
  id: string;
  title: string;
  illustrationSvgKey: string;
  glossaryTermSlug?: string;
  xPercent: number;
  yPercent: number;
  reverenceNote: string;
  simplifiedTextBand3_7: string;
  simplifiedTextBand8_10: string;
  simplifiedTextBand11_15: string;
  orderIndex: number;
}

export interface SeedChurchTourScene {
  id: string;
  slug: string;
  title: string;
  description: string;
  orderIndex: number;
  illustrationSvgKey: string;
  items: SeedChurchTourItem[];
}

export const SEED_CHURCH_TOUR_SCENES: readonly SeedChurchTourScene[] = [
  {
    id: "sc-0001-4000-8000-000000000001",
    slug: "narthex",
    title: "The Entrance & Narthex",
    description: "Where we prepare to enter God's holy house, blessing ourselves with holy water.",
    orderIndex: 0,
    illustrationSvgKey: "narthex_scene",
    items: [
      {
        id: "item-0001-01",
        title: "Holy Water Font",
        illustrationSvgKey: "holy_water_font",
        glossaryTermSlug: "holy-water-font",
        xPercent: 22,
        yPercent: 65,
        reverenceNote:
          "We dip our right hand into the holy water and make the Sign of the Cross: In the name of the Father, and of the Son, and of the Holy Spirit. Amen. This reminds us of our Baptism.",
        simplifiedTextBand3_7:
          "We dip our fingers in holy water and make the Sign of the Cross before entering.",
        simplifiedTextBand8_10:
          "The holy water font stands at the entrance to remind us of our Baptism and cleanse our hearts as we enter God's house.",
        simplifiedTextBand11_15:
          "Positioned at the entrance of the nave, the holy water stoup recalls our baptismal promises and sets apart the sacred space from the secular world.",
        orderIndex: 0,
      },
      {
        id: "item-0001-02",
        title: "Church Bells",
        illustrationSvgKey: "church_bells",
        glossaryTermSlug: "church-bells",
        xPercent: 78,
        yPercent: 40,
        reverenceNote:
          "When church bells ring, we pause and pray. They call all parishioners to come adore Jesus in the Holy Mass.",
        simplifiedTextBand3_7:
          "The big bells ring high in the tower to tell everyone it is time to pray.",
        simplifiedTextBand8_10:
          "Church bells ring joyfully before Mass, calling the faithful to gather and praising God across the neighborhood.",
        simplifiedTextBand11_15:
          "Church bells consecrate time and community life, announcing the Angelus, Holy Mass, weddings, and funeral liturgies with distinct sacred chimes.",
        orderIndex: 1,
      },
    ],
  },
  {
    id: "sc-0001-4000-8000-000000000002",
    slug: "nave",
    title: "The Nave & Pews",
    description:
      "The large central space where God's family gathers together to pray, listen, and sing.",
    orderIndex: 1,
    illustrationSvgKey: "nave_scene",
    items: [
      {
        id: "item-0002-01",
        title: "Pews and Kneelers",
        illustrationSvgKey: "church_pew",
        glossaryTermSlug: "pew",
        xPercent: 30,
        yPercent: 70,
        reverenceNote:
          "We lower the kneeler quietly with our hands, never letting it drop or slam. We kneel reverently to speak with Jesus in our hearts.",
        simplifiedTextBand3_7:
          "We sit quietly in the wooden pews and pull down the soft kneeler to pray.",
        simplifiedTextBand8_10:
          "Pews give us a reverent place to sit, stand, and kneel during the Mass. Kneeling shows our deep love and adoration for God.",
        simplifiedTextBand11_15:
          "The pews and kneelers support the active liturgical postures of the congregation: standing for prayer and Gospel, sitting for instruction, and kneeling for adoration.",
        orderIndex: 0,
      },
      {
        id: "item-0002-02",
        title: "Stations of the Cross",
        illustrationSvgKey: "stations_of_cross",
        glossaryTermSlug: "stations-of-the-cross",
        xPercent: 15,
        yPercent: 35,
        reverenceNote:
          "We walk quietly along the fourteen stations, meditating on Jesus's holy passion and thanking Him for His infinite love on the Cross.",
        simplifiedTextBand3_7:
          "Pictures on the wall showing how much Jesus loves us on the way to the Cross.",
        simplifiedTextBand8_10:
          "Fourteen plaques around the church that show Jesus's journey to Calvary, especially prayed on Fridays during Lent.",
        simplifiedTextBand11_15:
          "The Via Crucis (Way of the Cross) is a traditional Catholic devotion retracing Christ's passion, crucifixion, and burial through fourteen prayer stations.",
        orderIndex: 1,
      },
      {
        id: "item-0002-03",
        title: "The Confessional",
        illustrationSvgKey: "confessional",
        glossaryTermSlug: "confessional",
        xPercent: 85,
        yPercent: 55,
        reverenceNote:
          "We keep quiet near the confessional out of respect for God's forgiving mercy and the absolute secrecy of the Sacrament of Penance.",
        simplifiedTextBand3_7: "A quiet room where Father forgives our mistakes in Jesus's name.",
        simplifiedTextBand8_10:
          "Where we celebrate the Sacrament of Reconciliation, confessing our sins to receive Jesus's peace and forgiveness through the priest.",
        simplifiedTextBand11_15:
          "The sacred tribunal of mercy where the Sacrament of Penance is celebrated under the unbreakable Seal of Confession.",
        orderIndex: 2,
      },
    ],
  },
  {
    id: "sc-0001-4000-8000-000000000003",
    slug: "sanctuary",
    title: "The Sacred Sanctuary",
    description:
      "The elevated holy area around the altar, representing heaven on earth where the Holy Sacrifice is offered.",
    orderIndex: 2,
    illustrationSvgKey: "sanctuary_scene",
    items: [
      {
        id: "item-0003-01",
        title: "Sanctuary Lamp",
        illustrationSvgKey: "sanctuary_lamp",
        glossaryTermSlug: "sanctuary-lamp",
        xPercent: 80,
        yPercent: 30,
        reverenceNote:
          "When the red sanctuary lamp is glowing, it tells us: Jesus is truly here! We genuflect toward the Tabernacle whenever we cross in front of it.",
        simplifiedTextBand3_7:
          "A red candle that glows day and night to say: Jesus is home inside!",
        simplifiedTextBand8_10:
          "The red sanctuary lamp burns continuously near the tabernacle to signify the real presence of Jesus in the Holy Eucharist.",
        simplifiedTextBand11_15:
          "Governed by canon law, the perpetual sanctuary lamp indicates and honors the Real Presence of Christ reserved in the tabernacle.",
        orderIndex: 0,
      },
      {
        id: "item-0003-02",
        title: "The Ambo (Pulpit)",
        illustrationSvgKey: "ambo_pulpit",
        glossaryTermSlug: "ambo",
        xPercent: 25,
        yPercent: 55,
        reverenceNote:
          "We listen in silence when the lector and priest proclaim God's Word from the ambo. We stand reverently for the holy Gospel.",
        simplifiedTextBand3_7:
          "The special stand where the Bible readings and Gospel are read to us.",
        simplifiedTextBand8_10:
          "The table of the Word of God where the Old Testament, Epistles, Responsorial Psalm, and Gospel are proclaimed.",
        simplifiedTextBand11_15:
          "The ambo is the dignified lectern reserved exclusively for the proclamation of Scripture and the homily during the Liturgy of the Word.",
        orderIndex: 1,
      },
      {
        id: "item-0003-03",
        title: "Presider's Chair",
        illustrationSvgKey: "presiders_chair",
        glossaryTermSlug: "presiders-chair",
        xPercent: 70,
        yPercent: 60,
        reverenceNote:
          "We show respect for the priest, who acts in the person of Christ (in persona Christi) to lead the holy liturgy.",
        simplifiedTextBand3_7: "The priest's chair where Father sits to lead us in prayer.",
        simplifiedTextBand8_10:
          "The chair where the presiding priest leads the assembly in prayer during the introductory and concluding rites.",
        simplifiedTextBand11_15:
          "The sedilia expresses the priest's office of presiding over the assembly and directing the liturgical dialogue.",
        orderIndex: 2,
      },
    ],
  },
  {
    id: "sc-0001-4000-8000-000000000004",
    slug: "altar",
    title: "The High Altar & Tabernacle",
    description:
      "The heart of the Catholic church, where bread and wine become the Body and Blood of Christ.",
    orderIndex: 3,
    illustrationSvgKey: "altar_scene",
    items: [
      {
        id: "item-0004-01",
        title: "The Holy Altar",
        illustrationSvgKey: "altar_table",
        glossaryTermSlug: "altar",
        xPercent: 50,
        yPercent: 65,
        reverenceNote:
          "The altar is the symbol of Christ. Priests kiss the altar when they arrive, and we bow reverently whenever we pass before it.",
        simplifiedTextBand3_7: "The holy table where the bread and wine become Jesus during Mass.",
        simplifiedTextBand8_10:
          "The sacred table of sacrifice and banquet where the Holy Sacrifice of the Mass is offered by the priest.",
        simplifiedTextBand11_15:
          "The permanent stone altar represents Christ Himself, serving as the center of thanksgiving and the altar of the Eucharistic sacrifice.",
        orderIndex: 0,
      },
      {
        id: "item-0004-02",
        title: "The Tabernacle",
        illustrationSvgKey: "tabernacle",
        glossaryTermSlug: "tabernacle",
        xPercent: 50,
        yPercent: 28,
        reverenceNote:
          "We bend our right knee completely to the floor (genuflection) toward the Tabernacle because Jesus Christ is truly and personally present inside.",
        simplifiedTextBand3_7:
          "The golden house where Jesus lives in the Blessed Sacrament. We bend our knee to greet Him!",
        simplifiedTextBand8_10:
          "The sacred golden dwelling where the consecrated Hosts are reverently kept. We genuflect toward it whenever we pass.",
        simplifiedTextBand11_15:
          "The tabernacle is the noble, secure, and ornamented repository for the reservation of the Most Holy Eucharist for adoration and the sick.",
        orderIndex: 1,
      },
      {
        id: "item-0004-03",
        title: "The Altar Crucifix",
        illustrationSvgKey: "crucifix",
        glossaryTermSlug: "crucifix",
        xPercent: 50,
        yPercent: 10,
        reverenceNote:
          "Every Catholic altar must have a crucifix showing Jesus with His holy wounds, reminding us of the sacrifice He offered for our salvation.",
        simplifiedTextBand3_7:
          "A cross showing Jesus, reminding us how He died and rose to save us.",
        simplifiedTextBand8_10:
          "A cross bearing the corpus (body) of Jesus, placed on or near the altar to recall His sacrifice on Calvary.",
        simplifiedTextBand11_15:
          "Required by the General Instruction of the Roman Missal, the altar crucifix visibly reminds the congregation of the saving passion of the Lord.",
        orderIndex: 2,
      },
    ],
  },
  {
    id: "sc-0001-4000-8000-000000000005",
    slug: "sacristy",
    title: "The Sacristy",
    description:
      "The reverent preparation room where vestments, sacred vessels, altar bread, and wine are kept.",
    orderIndex: 4,
    illustrationSvgKey: "sacristy_scene",
    items: [
      {
        id: "item-0005-01",
        title: "Priest's Vestments",
        illustrationSvgKey: "priest_vestments",
        glossaryTermSlug: "vestments",
        xPercent: 25,
        yPercent: 45,
        reverenceNote:
          "We maintain quiet in the sacristy as the priest puts on his vestments while reciting special preparation prayers.",
        simplifiedTextBand3_7:
          "Beautiful robes of green, purple, white, and red that Father wears for Mass.",
        simplifiedTextBand8_10:
          "The alb, cincture, stole, and chasuble worn by the priest, changing colors with the liturgical seasons of the Church.",
        simplifiedTextBand11_15:
          "Sacred vestments conceal the individuality of the minister, signifying the virtues and dignity of the sacred priesthood.",
        orderIndex: 0,
      },
      {
        id: "item-0005-02",
        title: "Sacred Vessels (Chalice & Ciborium)",
        illustrationSvgKey: "sacred_vessels",
        glossaryTermSlug: "sacred-vessels",
        xPercent: 70,
        yPercent: 45,
        reverenceNote:
          "These gold vessels hold the Precious Blood and Body of Christ. Only ministers handle them with washed hands and utmost care.",
        simplifiedTextBand3_7: "Golden cups that hold the wine and bread that become Jesus.",
        simplifiedTextBand8_10:
          "The chalice holds the Precious Blood and the ciborium holds the consecrated hosts for Holy Communion.",
        simplifiedTextBand11_15:
          "Sacred vessels must be made of noble materials, gilded, and blessed exclusively for the Eucharistic sacrifice.",
        orderIndex: 1,
      },
      {
        id: "item-0005-03",
        title: "The Sacrarium (Piscina)",
        illustrationSvgKey: "sacrarium",
        glossaryTermSlug: "sacrarium",
        xPercent: 50,
        yPercent: 75,
        reverenceNote:
          "A special sacred sink that drains directly into the clean earth, used only to wash altar linens and purify sacred vessels.",
        simplifiedTextBand3_7:
          "A special sink that goes straight into the soil, keeping holy water pure.",
        simplifiedTextBand8_10:
          "A unique basin in the sacristy whose drain leads straight into the earth rather than common sewers, used for purifying linens.",
        simplifiedTextBand11_15:
          "The sacrarium (piscina) drains directly into consecrated earth, preserving reverence when disposing of water containing particles of sacred species.",
        orderIndex: 2,
      },
    ],
  },
];

export function getChurchTourScenes(): SeedChurchTourScene[] {
  return [...SEED_CHURCH_TOUR_SCENES].sort((a, b) => a.orderIndex - b.orderIndex);
}

export function getChurchTourSceneBySlug(slug: string): SeedChurchTourScene | undefined {
  return SEED_CHURCH_TOUR_SCENES.find((s) => s.slug.toLowerCase() === slug.toLowerCase());
}

export function getTotalChurchTourItemCount(): number {
  return SEED_CHURCH_TOUR_SCENES.reduce((acc, scene) => acc + scene.items.length, 0);
}
