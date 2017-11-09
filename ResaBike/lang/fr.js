module.exports = {

    //FRENCH TRANSLATION
    
    /** SIDE OF CLIENT **/
    /** INDEX PAGE **/
    //Navbar
    navSearch: 'Recherche',
    navAbout: 'À Propos',
    navContact: 'Contact',
    navLogin: 'Login',
    //Banner Text
    bannerText: 'Une nouvelle façon de voyager avec votre vélo',
    bannerContact: 'Contactez Nous',
    //Search Field
    searchTitle: 'Horaires et réservation',
    searchFromStation: 'Depuis',
    searchToDest: 'À',
    searchDate: 'Date',
    searchNbBike: 'Nombre de vélos',
    searchSubmit: 'Rechercher',
    //About us
    aboutTitle: 'À Propos',
    aboutText1: 'Un groupe de 2 étudiants travaillant sur un project d\'école.',
    aboutText2: 'Le but du projet est de pouvoir faire une réservation pour une place de vélos dans un bus.',
    //Contact Form
    contactTitle: 'Contactez nous',
    contactName: 'Nom',
    contactSubject: 'Sujet',
    contactMessage: 'Message',
    contactSendMessage: 'Envoyer le message',
    contactMsg:'Vous devez remplir tous les champs pour pouvoir envoyer un email',
    //Toast Message
    contactEmailSent: 'L\'email a été envoyé !',
    //Footer Lang
    french: 'Français',
    german: 'Allemand',
    english: 'Anglais',
    //DONT FORGET THE DATEPICKER

    /** RESERVATION PAGE **/
    resDepFrom: 'Départ de',
    resArrTo: 'Arrivée à',
    resTimDep: 'Heure de départ',
    resTimeArrival: 'Heure d\'arrivée',
    resPlacesAvailable: 'Places disponibles',
    resGoBack: 'Retour',
    reservation: 'Réservation',
    //Modal
    resDetailsRes: 'Détails Réservation',
    resDateTime: 'Date et heure',
    resNbBike: 'Nombre de vélos',
    resEmailConfirm: 'Entrez votre adresse email pour confirmer la réservation',
    resConfirm: 'Confirmer la réservation',
    //Toasts after reservation
    resSuccessfull: 'La réservation a été faite',
    resConfirmed: 'La réservation sera confirmée par un administrateur',
    
    resToolTip: 'La requête va être confirmée',
    resFirstName: 'Prénom',
    resLastName: 'Nom',


    /** SIDE OF ADMIN **/
    /** LOGIN PAGE **/
    loginText: 'Veuillez vous connecter à votre compte',
    loginUsername: 'Nom d\'utilisateur',
    loginPassword: 'Mot de passe',
    loginButton: 'Login',

    /** NEED TO ADD TO THE OTHER TRANSLATION **/
    loginWrongUser: 'Le username et/ou le mot de passe ne correspondent pas',

    /** GET ALL ZONES */
    zoneName: 'Nom',
    zoneDetails: 'Détails',
    zoneEdit: 'Modifier',
    zoneDelete: 'Supprimer',
    zoneCreate: 'Créer',

    layoutUserWelcome: 'Bienvenue',
    layoutUserNavUser: 'Utilisateur',
    layoutUserNavZone: 'Zones',
    layoutUserNavRes: 'Réservations',
 
    deleteResCanceled: 'Réservation annulée',
    deleteResMsg: 'Votre réservation a été annulée, si ceci ne vient pas de vous, veuillez refaire la réservation',
    
    searchTime: 'Heure de départ',

    pickerToday :'Aujourd\'hui',
    pickerClear: 'Supprimer',
    pickerCancel: 'Annuler',

    getAllBookZone: 'Zone',
    getAllBookDetails: 'Détails',

    getAllUsersUN: 'Nom d\'utilisateur',
    getAllUsersMail: 'Email',
    getAllUsersRole: 'Rôle',
    getAllUsersEdit: 'Modifier',
    getAllUsersDel: 'Supprimer',
    getAllUsersSave: 'Sauvegarder',

    getAllUsersEnterPass: 'Entrez votre mot de passe',
    getAllUsersRepeatPass: 'Retapez votre mot de passe',
    getAllUsersEnterMail: 'Entrez votre email',
    getAllUsersSelRole: 'Sélectionnez un rôle',
    getAllUsersSelZone: 'Sélectionnez une zone',
    getAllUsersCreate: 'Créer',

    getOneBookLine: 'Ligne',
    getOneBookAt: 'à',
    getOneBookBikeConf: 'Vélo(s) confirmé',
    getOneBookBikeToConf: 'Vélo(s) a confirmé',
    getOneBikeNotConf: 'Pas confirmé',

    getOneZoneStatDep: 'Station de départ',
    getOneZoneStatArr: 'Station d\'arrivée',

    //MAIL PARTS RESERVATION
    //CONFIRMATION
    mailResSubject: 'Confirmation réservation - Resabike',
    mailResFirstPart: '<div><h1>Confirmation réservation</h1></div><div><p>Date :',
    mailResSec1Part: '<br>Départ de :',
    mailResSec2Part: '<br>Arrivée à :',
    mailResSec3Part: '<br>Nombres de vélos :',
    mailResDel1Part: '</p></div><br><div><p>Si vous voulez supprimer la réservation, il vous suffit de cliquer sur ce lien : <a href=',
    mailResDel2Part: '>Supprimer la réservation</a></p></div>',

    //WAITING
    mailWaitSubject: 'Réservation en attente de confirmation - Resabike',
    mailWaitFirstPart: '<div><h1>Réservation en attente</h1></div><div><p>Date :',
    mailWaitSec1Part: '<br>Départ de :',
    mailWaitSec2Part: '<br>Arrivée à :',
    mailWaitSec3Part: '<br>Nombres de vélos :',
    mailWaitDel1Part: '</p></div><br><div><p>Votre réservation a été pris en compte. Un administrateur va vous contacter d\'ici peu</p></div>',


    //BOOKINGS MANAGEMENT
    //REFUSAL MAIL
    mailBmRefSubject: 'Réservation refusée - Resabike',
    mailBmFirstPart: '<div><h1>Réservation refusée</h1></div><div><p>Date :',
    mailBmSec1Part: '<br>Départ de :',
    mailBmSec2Part: '<br>Arrivée à',
    mailBmSec3Part: '<br>Nombres de vélos :',
    mailBmLastPart: '</p></div><br>',

    //A RAJOUTER DANS LES AUTRES
    allUsers: 'Tous les utilisateurs',
    zoneName: 'Nom de la zone',
    bookingsToCome: 'Réservations à venir',
    bookingsHistory: 'Historique',
    allZones: 'Toutes les zones',
    bookingsHistoric: 'Historique des réservations',
    noReservations: 'Pas de réservations pour le moment'




}