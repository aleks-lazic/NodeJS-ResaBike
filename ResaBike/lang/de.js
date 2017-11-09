module.exports = {
    
    //GERMAN TRANSLATION
    
    /** SIDE OF CLIENT **/
    /** INDEX PAGE **/
    //Navbar
    navSearch: 'Suche',
    navAbout: 'Uber uns',
    navContact: 'Kontakt',
    navLogin: 'Login',
    //Banner Text
    bannerText: 'Eine neue Art, mit dem Fahrrad zu reisen',
    bannerContact: 'Kontaktieren',
    //Search Field
    searchTitle: 'Zeitpläne und Reservierung',
    searchFromStation: 'Von',
    searchToDest: 'Zu',
    searchDate: 'Datum',
    searchNbBike: 'Anzahl der Fahrräder',
    searchSubmit: 'Suchen',
    //About us
    aboutTitle: 'Uber uns',
    aboutText1: 'Eine Gruppe von 2 Schülern, die an einem Schulprojekt arbeiten.',
    aboutText2: 'Das Ziel des Projektes ist es, eine Reservierung für ein Fahrrad in einem Bus vornehmen zu können.',
    //Contact Form
    contactTitle: 'Kontaktieren Sie Uns',
    contactName: 'Name',
    contactSubject: 'Thema',
    contactMessage: 'Nachricht',
    contactSendMessage: 'Nachricht Senden',
    contactMsg:'Sie müssen alle Felder ausfüllen, um ein eail zu senden',
    //Toast Message
    contactEmailSent: 'Email wurde gesendet!',
    //Footer Lang
    french: 'Französisch',
    german: 'Deutsch',
    english: 'Englisch',
    //DONT FORGET THE DATEPICKER

    /** RESERVATION PAGE **/
    resDepFrom: 'Abfahrt von',
    resArrTo: 'Ankunft',
    resTimDep: 'Abfahrtszeit',
    resTimeArrival: 'Ankunftszeit',
    resPlacesAvailable: 'Verfügbare Plätze',
    resGoBack: 'Zurück',
    reservation: 'Reservieren',
    //Modal
    resDetailsRes: 'Details Reservierung',
    resDateTime: 'Datum und Uhrzeit',
    resNbBike: 'Anzahl der Fahrräder',
    resEmailConfirm: 'Geben Sie Ihre E-Mail-Adresse ein, um die Reservierung zu bestätigen',
    resConfirm: 'Bestätigen Sie die Reservierung',
    //Toasts after reservation
    resSuccessfull: 'Die Reservierung wurde abgeschlossen',
    resConfirmed: 'Die Reservierung wird von einem Administrator bestätigt',
    resToolTip: 'Die Anfrage wird bestätigt',
    resFirstName: 'Vorname',
    resLastName: 'Name',


    /** SIDE OF ADMIN **/
    /** LOGIN PAGE **/
    loginText: 'Bitte loggen Sie sich in Ihr Konto ein',
    loginUsername: 'Benutzername',
    loginPassword: 'Passwort',
    loginButton: 'Login',

    //NOT FINISHED YET
    /** NEED TO ADD TO THE OTHER TRANSLATION **/
    loginWrongUser: 'Benutzername oder passwort ist falsch',
    
   /** GET ALL ZONES */
   zoneName: 'Name',
   zoneDetails: 'Details',
   zoneEdit: 'Bearbeiten',
   zoneDelete: 'Löschen',
   zoneCreate: 'Erstellen',

   layoutUserWelcome: 'Willkomemn',
   layoutUserNavUser: 'Benutzer',
   layoutUserNavZone: 'Zone',
   layoutUserNavRes: 'Reservierung',

   deleteResCanceled: 'Reservierung wurde storniert',
   deleteResMsg: 'Ihre Reservierung wurde storniert, wenn es nicht Ihre Absicht war, wiederholen Sie bitte die Reservierung',
   
   searchTime: 'Abfahrtszeit',

   pickerToday :'Heute',
   pickerClear: 'Löschen',
   pickerCancel: 'Annulieren',

   getAllBookZone: 'Zone',
   getAllBookDetails: 'Details',

   getAllUsersUN: 'Benutzername',
   getAllUsersMail: 'Email',
   getAllUsersRole: 'Rolle',
   getAllUsersEdit: 'Bearbeiten',
   getAllUsersDel: 'Löschen',
   getAllUsersSave: 'Speichern',

   getAllUsersEnterPass: 'Geben Sie ihr Passwort ein',
   getAllUsersRepeatPass: 'Bitte Passwort wiederholen',
   getAllUsersEnterMail: 'Geben Sie ihr Email ein',
   getAllUsersSelRole: 'Wählen Sie eine Rolle',
   getAllUsersSelZone: 'Wählen Sie eine Zone',
   getAllUsersCreate: 'Erstellen',

   getOneBookLine: 'Linie',
   getOneBookAt: 'Nach',
   getOneBookBikeConf: 'Fahrräder bestätigt',
   getOneBookBikeToConf: 'Fahrräder zu bestätigen',
   getOneBikeNotConf: 'Nicht bestätigt',

   getOneZoneStatDep: 'Abfahrtsstation',
   getOneZoneStatArr: 'Ankunftsstation',

   //MAIL PARTS RESERVATION
   //CONFIRMATION
   mailResSubject: 'Reservierungsbestätigung - Resabike',
   mailResFirstPart: '<div><h1>Reservierungsbestätigung</h1></div><div><p>Datum :',
   mailResSec1Part: '<br>Abfahrt von :',
   mailResSec2Part: '<br>Ankunft an :',
   mailResSec3Part: '<br>Anzahl Fahrräder :',
   mailResDel1Part: '</p></div><br><div><p>Wenn Sie Ihre Reservierung löschen möchten, klicken Sie einfach auf diesen Link: <a href=',
   mailResDel2Part: '>Reservierung löschen</a></p></div>',

   //WAITING
   mailWaitSubject: 'Reservierung wird später Bestätigt - Resabike',
   mailWaitFirstPart: '<div><h1>Reservierung wird später Bestätigt</h1></div><div><p>Datum :',
   mailWaitSec1Part: '<br>Abfahrt von :',
   mailWaitSec2Part: '<br>Ankunft an :',
   mailWaitSec3Part: '<br>Anzahl Fahrräder :',
   mailWaitDel1Part: '</p></div><br><div><p>Ihre Reservierung wurde berücksichtigt. Ein Administrator wird Sie bald kontaktieren</p></div>',


   //BOOKINGS MANAGEMENT
   //REFUSAL MAIL
   mailBmRefSubject: 'Reservierungsverweigerung - Resabike',
   mailBmFirstPart: '<div><h1>Reservierung wurde abgelehnt</h1></div><div><p>Datum :',
   mailBmSec1Part: '<br>Abfahrt von :',
   mailBmSec2Part: '<br>Ankunft an:',
   mailBmSec3Part: '<br>Anzahl Fahrräder :',
   mailBmLastPart: '</p></div><br>',

}