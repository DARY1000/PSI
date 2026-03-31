/* Wadagni Simulateur — Données programme officiel 2026-2033
 * Source : Programme « Plus Loin, Ensemble » — 68 pages, 23 secteurs
 * Présentation : Palais des Congrès de Cotonou, 21 mars 2026
 */

const D={
  jeune:{emoji:'🎓',label:'Jeune / Étudiant',
    bilan:[{val:'9 000',lbl:'nouvelles salles de classe'},{val:'45 000',lbl:'bourses en formation pro'},{val:'89%',lbl:'taux réussite au CEP'}],
    measures:[
      {icon:'💻',title:'Sèmè City Hubs dans chaque pôle territorial',desc:'Des espaces connectés et équipés offriront des formations d\'excellence en ligne en IA, sciences des données et numérique dans les 6 pôles. Chaque jeune peut se former sans quitter son territoire.'},
      {icon:'🏭',title:'Au moins une industrie structurante par région',desc:'Chaque pôle de développement accueillera une unité industrielle. Des hubs de formation de pointe permettront d\'accéder à un enseignement technique et professionnel sans devoir migrer vers les grandes villes.'},
      {icon:'📱',title:'Crédit digital en moins de 48 heures',desc:'Des prêts de 50 000 à 50 millions FCFA évalués automatiquement via mobile money et données fiscales seront accordés en moins de 48h depuis le téléphone, avec des exigences allégées pour les jeunes entrepreneurs.'},
      {icon:'⚽',title:'Infrastructure sportive dans les 546 arrondissements',desc:'Des terrains et espaces sportifs modernes seront construits dans chacun des 546 arrondissements du pays, avec des bourses sportives pour soutenir les espoirs nationaux et des pôles de détection des talents.'},
      {icon:'🤖',title:'IA Factory — emploi sans diplôme par la pratique',desc:'Un pôle de production de solutions IA formera des jeunes par la pratique, sans condition de diplôme, pour résoudre des problèmes concrets soumis par des organisations publiques et privées béninoises.'}
    ],
    quote:'"Demain, chaque Béninois, chaque jeune, où qu\'il soit, doit pouvoir trouver une opportunité à portée de main."'},

  entrepreneur:{emoji:'💼',label:'Entrepreneur / PME',
    bilan:[{val:'8%',lbl:'croissance PIB en 2025'},{val:'BB-',lbl:'notation S&P (stabilité)'},{val:'20 000',lbl:'emplois créés à la GDIZ'}],
    measures:[
      {icon:'📱',title:'Crédit garanti en moins de 48h depuis le téléphone',desc:'Des prêts de 50 000 à 50 millions FCFA, évalués via mobile money et données fiscales, accordés en moins de 48h. L\'État assure la régulation, la garantie, et priorise les microentreprises et zones sous-bancarisées.'},
      {icon:'🏭',title:'Fonds de développement industriel national',desc:'Un fonds pour accompagner l\'émergence de champions nationaux avec unités industrielles de transformation dans chaque pôle territorial. Sélection d\'entreprises à fort potentiel et accompagnement à l\'international.'},
      {icon:'⚡',title:'Tarif industriel attractif et énergie stable garantie',desc:'Un mécanisme garantira un accès continu à l\'énergie à prix stable. +100 MW supplémentaires tous les 2 ans, construction du barrage Dogo-Bis (128 MW), et compteurs intelligents généralisés pour les industriels.'},
      {icon:'📊',title:'Prélèvement unique libératoire pour TPE/PME',desc:'Tous les impôts — y compris les taxes communales — regroupés en un seul prélèvement simplifié pour les petites et très petites entreprises. Automatisation de la délivrance de l\'identifiant fiscal dès la création.'},
      {icon:'🌍',title:'Zone Économique Spéciale Bénin-Nigeria (Kétou)',desc:'L\'opérationnalisation de la Zone Économique Transfrontalière Bénin-Nigeria de Kétou transformera la relation avec la première économie africaine en moteur de croissance direct pour les entrepreneurs béninois.'}
    ],
    quote:'"Je suis votre argentier. Si je deviens président, je vous promets de gérer le pays avec le même sérieux."'},

  agriculteur:{emoji:'🌾',label:'Agriculteur / Éleveur',
    bilan:[{val:'641 000T',lbl:'coton (1er producteur africain)'},{val:'26 000 ha',lbl:'périmètres irrigués'},{val:'89 Mds',lbl:'FCFA financés via FNDA'}],
    measures:[
      {icon:'🛡️',title:'Assurance récolte, épargne et retraite agricole',desc:'La production sera répartie en 3 parts : revenu immédiat, remboursement d\'intrants, et épargne-retraite. Un mécanisme compensera les agriculteurs en cas de mauvaise récolte face aux aléas climatiques et économiques.'},
      {icon:'🚜',title:'Mécanisation et semences à haut rendement',desc:'Objectif de tripler les rendements du manioc et du maïs, et doubler ceux du cajou, riz, soja et karité. Combinaison de semences améliorées, intrants de qualité, mécanisation et encadrement technique structuré.'},
      {icon:'💧',title:'Programme national d\'irrigation — 314 nouveaux systèmes',desc:'Un effort national de construction de retenues d\'eau étendra les périmètres irrigués. 314 nouveaux systèmes d\'eau potable multi-villages et forages équipés de capteurs intelligents dans les zones rurales.'},
      {icon:'📱',title:'Agritech : drones, IA et plateformes mobiles',desc:'Agriculture de précision via drones phytosanitaires, capteurs de sol et IA pour le suivi des cultures. Plateformes mobiles d\'accès aux intrants et aux marchés, y compris à l\'export international.'},
      {icon:'🏭',title:'Unités de transformation locales dans chaque pôle',desc:'Des unités industrielles de transformation des matières premières agricoles seront accessibles dans chaque pôle de développement territorial — permettre de transformer sur place ce que nos terres produisent.'}
    ],
    quote:'"Sur le plan agricole, l\'objectif est d\'augmenter la productivité et d\'aider les producteurs à cotiser pour leur retraite à travers un mécanisme simple et moderne."'},

  artiste:{emoji:'🎨',label:'Artiste / Créatif',
    bilan:[{val:'1 250 Mds',lbl:'FCFA investis en culture'},{val:'78 pays',lbl:'ayant visité les trésors royaux'},{val:'30 000',lbl:'élèves en classes culturelles'}],
    measures:[
      {icon:'💵',title:'Programme National d\'Excellence Artistique — salaire garanti',desc:'Des artistes (arts plastiques, musique, danse, littérature, arts numériques) bénéficieront d\'une rémunération pluriannuelle conditionnée pour se consacrer pleinement à la création. Sélection rigoureuse et transparente.'},
      {icon:'🎬',title:'Content City et label "Bénin Originals" pour l\'international',desc:'Une zone spéciale regroupera studios de production IA, animation et jeux vidéo. L\'African Screen School avec Gobelins Paris formera les créateurs. Le label "Bénin Originals" permettra la monétisation sur les plateformes mondiales.'},
      {icon:'🏛️',title:'Résidences artistiques dans les 6 pôles territoriaux',desc:'Un réseau national de galeries, centres d\'art et résidences de création dans les 6 pôles accompagnera les artistes dans la stratégie de production, construction de carrière et accès aux marchés internationaux.'},
      {icon:'🎪',title:'Port franc des arts — marché de l\'art international',desc:'Un espace sécurisé de conservation et d\'échange d\'œuvres sans taxation immédiate attirera les acteurs du marché de l\'art international et générera des revenus liés au stockage, à l\'assurance et aux transactions.'},
      {icon:'📅',title:'Calendrier culturel annuel sur tout le territoire',desc:'Triennale d\'art contemporain et d\'architecture, Itinéraires du patrimoine créatif, nouvelles Maisons de la Culture dans chaque pôle, et reconversion des anciens cinémas emblématiques en centres culturels de proximité.'}
    ],
    quote:'"Le secteur culturel connaîtra une révolution avec le Programme National d\'Excellence Artistique, permettant aux artistes de se consacrer pleinement à leur création."'},

  fonctionnaire:{emoji:'🏛️',label:'Fonctionnaire',
    bilan:[{val:'56 000',lbl:'agents recrutés depuis 2016'},{val:'60 Mds',lbl:'FCFA/an revalorisation salariale'},{val:'250+',lbl:'services publics numérisés'}],
    measures:[
      {icon:'🏥',title:'Urgences vitales gratuites — paiement différé',desc:'La prise en charge systématique des soins d\'urgence vitale sera garantie pour toute la population via un dispositif de paiement différé. Un carnet de santé digital sera créé pour chaque Béninois.'},
      {icon:'⚡',title:'Choc de simplification administrative',desc:'Principe "dites-le-nous une seule fois" par interconnexion des bases de données. Délais des 20 démarches les plus utilisées réduits de 50%. 100% des services accessibles en ligne d\'ici 2030.'},
      {icon:'🏆',title:'Passeport Carrière Publique',desc:'Dispositif pour mieux gérer les compétences, valoriser le mérite et organiser des parcours professionnels clairs dans l\'administration, avec un mécanisme national de performance évalué par les citoyens.'},
      {icon:'🔒',title:'Gouvernance numérique — cybersécurité et libertés',desc:'Protection des données, cybersécurité, et prévention des abus garantissant l\'équilibre entre sécurité et libertés. Modernisation du processus électoral par la dématérialisation pour plus de transparence.'},
      {icon:'👵',title:'Amélioration des pensions et retraites',desc:'Amélioration des délais de liquidation des pensions et sécurisation par virement. Opérationnalisation du volet retraite du projet ARCH pour toute la population active béninoise.'}
    ],
    quote:'"Je ferai le job avec intégrité, courage et constance. Je suis persuadé qu\'en me faisant confiance, nous irons plus loin ensemble."'},

  mere:{emoji:'👩‍👧',label:'Mère de famille',
    bilan:[{val:'1,3 M',lbl:'enfants avec repas chaud/jour'},{val:'96%',lbl:'taux de rétention scolaire'},{val:'500 000',lbl:'femmes autonomisées (SWEDD)'}],
    measures:[
      {icon:'🚑',title:'Urgences vitales gratuites — on soigne d\'abord',desc:'Prise en charge systématique des soins d\'urgence vitale pour toute la population via paiement différé. Plus jamais de décès faute de formalités administratives. Carnet de santé digital créé pour chaque Béninois.'},
      {icon:'🍽️',title:'Cantines scolaires dans 100% des écoles primaires',desc:'Extension du dispositif à 100% des écoles primaires publiques pour garantir un repas chaud quotidien à chaque enfant. Transferts monétaires numériques fléchés vers la santé prénatale et la fréquentation scolaire.'},
      {icon:'💧',title:'Programme Eau pour tous — abonnement à 10 000 FCFA',desc:'314 nouveaux systèmes d\'eau potable multi-villages construits. Abonnement à domicile à 10 000 FCFA (au lieu de 85 000 FCFA). 100% des localités et chaque école desservies en eau potable.'},
      {icon:'🤝',title:'Plateforme nationale de prestations sociales',desc:'Registre national des ménages dynamique pour identifier les familles en difficulté et leur apporter l\'aide adaptée, via un moyen de paiement réservé aux aides sociales. SAMU social national créé.'},
      {icon:'🏥',title:'Centre hospitalier international à Parakou (CHIP)',desc:'Construction d\'un nouveau CHIP à Parakou, pendant du CHIC de Calavi, pour rapprocher les soins spécialisés des populations du nord. Télémédecine et IA généralisées dans toutes les structures sanitaires.'}
    ],
    quote:'"Il n\'y aura plus au Bénin de décès liés au fait qu\'on attend de faire la formalité, on attend d\'amener la facture. Non !"'},

  commercant:{emoji:'🏪',label:'Commerçant(e)',
    bilan:[{val:'35',lbl:'marchés modernes en construction'},{val:'1er UEMOA',lbl:'taux inclusion financière 90%'},{val:'3 000km',lbl:'routes bitumées construites'}],
    measures:[
      {icon:'📱',title:'Crédit en 48h depuis le téléphone',desc:'Prêts de 50 000 à 50 millions FCFA évalués via mobile money et déclarations fiscales, accordés en moins de 48h. Priorité aux commerçants, microentreprises et zones sous-bancarisées du territoire.'},
      {icon:'🏪',title:'35 marchés modernes — 25 800 espaces marchands',desc:'Programme de construction de 35 marchés modernes dont 21 marchés de détail avec 25 800 espaces marchands et 2 marchés de gros. Répartis sur tout le territoire national pour faciliter le commerce local.'},
      {icon:'⚡',title:'"Se brancher aujourd\'hui, payer plus tard"',desc:'Campagne nationale subventionnant le coût de branchement électrique. +100 MW tous les 2 ans, compteurs intelligents généralisés pour garantir une énergie stable et abordable pour les activités commerciales.'},
      {icon:'🛣️',title:'Deux axes transversaux Est-Ouest et transport fluvial',desc:'Création de deux axes routiers transversaux reliant le Nord-Ouest au Nord-Est et le Centre-Ouest au Centre-Est. Développement du transport fluvial le long du fleuve Ouémé comme alternative complémentaire.'},
      {icon:'🌍',title:'Zone Économique Spéciale Bénin-Nigeria — Kétou',desc:'La Zone Économique Transfrontalière Bénin-Nigeria de Kétou sera opérationnalisée, ouvrant un accès direct au marché nigérian, première économie africaine, pour les commerçants béninois.'}
    ],
    quote:'"Cette dynamique régionale permettra de créer des écosystèmes économiques cohérents, capables de générer de l\'emploi et de la richesse au niveau local."'},

  artisan:{emoji:'🔨',label:'Artisan',
    bilan:[{val:'450 236',lbl:'artisans identifiés nationalement'},{val:'20 000',lbl:'jeunes accompagnés (AZOLI)'},{val:'200 000F',lbl:'subvention AZOLI par jeune'}],
    measures:[
      {icon:'🏗️',title:'Bases d\'appui à l\'artisanat dans chaque commune',desc:'Chaque commune du Bénin sera dotée d\'une base d\'appui opérationnel avec plateaux techniques mutualisés adaptés aux filières locales, à tarifs encadrés, transparents et accessibles à tout artisan sur le territoire.'},
      {icon:'⭐',title:'Ateliers d\'excellence — artisanat haut de gamme international',desc:'Des manufactures de prestige combineront formation avancée, transmission intergénérationnelle, certification des savoir-faire et accès aux marchés du luxe, de la mode, de l\'art contemporain et de l\'architecture d\'intérieur.'},
      {icon:'💳',title:'Crédit ARCH Artisan généralisé',desc:'La généralisation du crédit ARCH Artisan financera l\'acquisition d\'équipements modernes. Le village artisanal de la Marina de Ouidah offrira un espace de commercialisation avec accès à plus d\'1 million de visiteurs/an.'},
      {icon:'🎓',title:'Réforme des Certificats de Qualification Professionnelle',desc:'Les CQP seront réformés et alignés sur les exigences du marché pour améliorer leur reconnaissance nationale et internationale, et renforcer l\'employabilité des artisans dans les filières à valeur ajoutée.'},
      {icon:'🌍',title:'Connexion aux circuits économiques internationaux',desc:'Les ateliers d\'excellence connecteront l\'artisanat béninois aux marchés internationaux à forte valeur ajoutée : luxe, décoration, architecture d\'intérieur, mode africaine et art contemporain mondial.'}
    ],
    quote:'"Les ateliers d\'excellence feront de l\'artisanat béninois une filière d\'avenir, de fierté et de rayonnement mondial."'},

  tech:{emoji:'💻',label:'Pro du digital',
    bilan:[{val:'90%',lbl:'du territoire couvert en 4G'},{val:'3 500km',lbl:'de fibre optique déployée'},{val:'9 000',lbl:'apprenants formés à Sèmè City'}],
    measures:[
      {icon:'🚀',title:'Bénin exportateur de solutions technologiques',desc:'IA Factory pour la formation par la pratique, venture builders sectoriels, fonds national d\'amorçage public-privé, et label officiel "Bénin Tech" ouvrant l\'accès à la commande publique et aux marchés internationaux.'},
      {icon:'🖥️',title:'Data centers nationaux et supercalculateurs',desc:'Infrastructures nationales sécurisées avec supercalculateurs, plateforme nationale de collecte de données locales, et loi sur la localisation de la donnée garantissant la souveraineté numérique du Bénin.'},
      {icon:'🌐',title:'Sèmè City Hubs dans les 6 pôles territoriaux',desc:'Espaces connectés et équipés offrant des formations d\'excellence en ligne dans chaque pôle. Dispositif dédié aux Béninois de la diaspora pour contribuer comme mentors et conseillers depuis l\'étranger.'},
      {icon:'📱',title:'Super App IA Gouvernementale pour chaque citoyen',desc:'Une Super App IA offrira une administration personnalisée en permanence : télémédecine, carnet de santé digital, suivi scolaire via IA, services financiers mobiles — la tech au service de tous les Béninois.'},
      {icon:'💰',title:'Fonds national d\'amorçage public-privé pour les startups',desc:'Fonds abondé par l\'État, les partenaires internationaux et le secteur privé, dédié aux startups et PME à forte intensité technologique, avec exonérations fiscales ciblées et régime de propriété intellectuelle.'}
    ],
    quote:'"Le Bénin va devenir un exportateur de solutions technologiques. Ce n\'est pas un rêve, c\'est un plan."'}
};