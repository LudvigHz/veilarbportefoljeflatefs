import {ModalName, Step} from '../tour-modal';
import React from 'react';
import nyKolonne1Bilde from './nyKolonne/nyKolonne-step1.png';
import nyKolonne2Bilde from './nyKolonne/nyKolonne-step2.png';
import veiledergruppe1 from './veiledergrupper/veiledergruppe1.png';
import veiledergruppe2 from './veiledergrupper/veiledergruppe2.png';
import veiledergruppe3 from './veiledergrupper/veiledergruppe3.png';
import tilrettelegging1 from './tilrettelegging/tilrettelegging1.jpg';
import tilrettelegging2 from './tilrettelegging/tilrettelegging2.jpg';
import tilrettelegging3 from './tilrettelegging/tilrettelegging3.jpg';
import veilederverktoy1 from './veilederverktoy/veilederverktoy1.png';
import veilederverktoy2 from './veilederverktoy/veilederverktoy2.png';
import veilederverktoy3 from './veilederverktoy/veilederverktoy3.png';
import permitterte1 from './permitterte/permitterte1.png';
import permitterte2 from './permitterte/permitterte2.png';
import permitterte3 from './permitterte/permitterte3.png';
import mineFilter1 from './mine-filter/mine-filter1.png';
import mineFilter2 from './mine-filter/mine-filter2.png'
import mineFilter3 from './mine-filter/mine-filter3.png'

const stepsNyKolonne: Step[] = [
    {
        tittel: 'Startdato for oppfølgingsperioden',
        bilde: nyKolonne1Bilde,
        tekst: 'Oversikten har en ny kolonne, «Oppfølging startet». Klikk på kolonnetittelen for å sortere etter startdato.'
    },
    {
        tittel: 'Velg kolonner',
        bilde: nyKolonne2Bilde,
        tekst: 'Dersom det ikke er plass til å vise alle kolonner samtidig, kan du bruke «Velg kolonner».'
    },

];

const stepsVeiledergrupper: Step[] = [
    {
        tittel: 'Veiledergrupper i Enhetens oversikt',
        bilde: veiledergruppe1,
        tekst: 'Enhetens oversikt har nå ett nytt filter «Veiledergrupper».'
    },
    {
        tittel: 'Lag en ny gruppe',
        bilde: veiledergruppe2,
        tekst: 'Klikk på «Ny gruppe», lag et navn på gruppen og velg veiledere.'
    },
    {
        tittel: 'Bruk av en gruppe',
        bilde: veiledergruppe3,
        tekst: 'I listen ser du alle brukerne som er tildelt veilederne i gruppen. Klikk på blyantsymbolet for å redigere eller slette gruppen.'
    }
];

const stepsTilrettelegging: Step[] = [
    {
        tittel: 'Detaljer',
        bilde: tilrettelegging1,
        tekst: 'Søk opp brukeren. Velg fanen «Detaljer».'
    },
    {
        tittel: 'Behov for tilrettelegging',
        bilde: tilrettelegging2,
        tekst: 'Velg «Behov for tilrettelegging» og klikk «Registrer».'
    },
    {
        tittel: 'Registrer behovenev',
        bilde: tilrettelegging3,
        tekst: 'Velg aktuelle tilretteleggingsbehov. Du kan huke av flere.'
    }
];

const stepsVeilederverktoy: Step[] = [
    {
        tittel: 'Veilederverktøy',
        bilde: veilederverktoy1,
        tekst: 'Legg til/redigere arbeidsliste og tildel veileder finner du nå i Veilederverktøy.'
    },
    {
        tittel: 'Arbeidslisteikon',
        bilde: veilederverktoy2,
        tekst: 'Du kan også klikke på ikonet for arbeidslisten for å legge til, se og redigere kommentaren.'
    },
    {
        tittel: 'Kopiere fødselsnummer',
        bilde: veilederverktoy3,
        tekst: 'Ved ett klikk har du kopiert personens fødselsnummer.'

    }
];

const stepsPermitterte: Step[] = [
    {
        tittel: 'Alle utenom permitterte',
        bilde: permitterte1,
        tekst: <>Filteret viser alle brukere, uavhengig av situasjon og når de registrerte seg, <b>ekskludert</b> de som
            er permittert etter 9. mars. Filteret kan kombineres med andre statusfiltre.</>
    },
    {
        tittel: 'Permitterte etter 9. mars',
        bilde: permitterte2,
        tekst: <>Filteret viser <b>kun</b> de som har svart at de er permittert eller blir permittert og har registrert
            seg etter 9. mars. Du kan kombinere filteret med f.eks. "Venter på svar fra NAV”.</>
    },
    {
        tittel: 'Etiketter for permitterte etter 9. mars',
        bilde: permitterte3,
        tekst: 'De permitterte har etiketten "Permittert etter 9. mars”, både i oversikten og i visittkortet over aktivitetsplanen.'
    }
];

const stepsMineFilter: Step[] = [
    {
        tittel: 'Mine filter',
        bilde: mineFilter1,
        tekst: 'Nå kan du lagre enkeltfiltre og kombinasjoner av flere filter. Da får du enklere tilgang på filtreringer du bruker mye.'
    },
    {
        tittel: 'Lagre nytt filter',
        bilde: mineFilter2,
        tekst: 'Gjør filtreringen du ønsker å lagre. Klikk på knappen «Lagre filter» og gi filteret et navn.'
    },
    {
        tittel: 'Endre navn eller slett filter',
        bilde: mineFilter3,
        tekst: 'Velg det aktuelle filteret og klikk på blyantsymbolet for å redigere navnet eller slette filteret.'
    },
];

export function getTour(modal: ModalName) {
    switch (modal) {
        case ModalName.NY_KOLONNE:
            return stepsNyKolonne;
        case ModalName.VEILEDERGRUPPER:
            return stepsVeiledergrupper;
        case ModalName.TILRETTELEGGING:
            return stepsTilrettelegging;
        case ModalName.VEILEDERVERKTOY:
            return stepsVeilederverktoy;
        case ModalName.PERMITTERTE:
            return stepsPermitterte;
        case ModalName.MINE_FILTER:
            return stepsMineFilter;
        default:
            return null;
    }
}
