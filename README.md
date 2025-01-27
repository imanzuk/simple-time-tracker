# Simple Time Tracker

Egyszerű időmérő és időelszámolást készítő alkalmazás.

Telepítést nem igényel, az index.html megnyitásával futtatható.

Az egyszerűség érdekében az adatok tárolása a böngésző Local Storage funkciójával van megvalósítva.

Szintén az egyszerűség miatt a time sheet az aktuális hónapra rögzített adatokat listázza.
Ha tovább kellene fejleszteni, akkor kattinthatóvá tenném az "Export period" után feltüntetett időszakot,
és megjelenítenék egy modalt, amiben a kezdő és záró dátum megadható.

A disztribúció tesztadatokat is tartalmaz, amiket a böngésző konzolból az `stt.loadTestData()` parancs futtatásával lehet betölteni.
