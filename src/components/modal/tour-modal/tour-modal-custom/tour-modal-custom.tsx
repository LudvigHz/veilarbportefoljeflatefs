import {ModalName, TourModalConfig} from '../tour-modal';
import mineFilter1 from './mine-filter/mine-filter1.png';
import mineFilter2 from './mine-filter/mine-filter2.png';
import mineFilter3 from './mine-filter/mine-filter3.png';

import tilrettelegging1 from './tilrettelegging/tilrettelegging1.jpg';
import tilrettelegging2 from './tilrettelegging/tilrettelegging2.jpg';
import tilrettelegging3 from './tilrettelegging/tilrettelegging3.jpg';

const stepsMineFilter: TourModalConfig = {
    steps: [
        {
            tittel: 'Mine filter',
            bilde: mineFilter1,
            altTekst: 'Et bilde av oversikten hvor den nye funksjonen "Mine filter" er uthevet.',
            tekst:
                'Nå kan du lagre enkeltfiltre og kombinasjoner av flere filter. Da får du enklere tilgang på filtreringer du bruker mye.'
        },
        {
            tittel: 'Lagre nytt filter',
            bilde: mineFilter2,
            altTekst: 'Et bilde av oversikten hvor knappen "Lagre filter" er markert.',
            tekst: 'Gjør filtreringen du ønsker å lagre. Klikk på knappen «Lagre filter» og gi filteret et navn.'
        },
        {
            tittel: 'Endre navn eller slett filter',
            bilde: mineFilter3,
            altTekst: 'Et bilde av oversikten hvor et ikon av en redigeringsblyant er markert.',
            tekst: 'Velg det aktuelle filteret og klikk på blyantsymbolet for å redigere navnet eller slette filteret.'
        }
    ]
};

const stepsTilrettelegging: TourModalConfig = {
    modalTittel: 'Visste du at...',
    steps: [
        {
            tittel: 'Stillinger med inkluderingsmuligheter',
            bilde: tilrettelegging1,
            altTekst: 'Et ikon av en person med teksten "ca. 900 stillinger".',
            tekst: 'I Rekrutteringsbistand finner du ca. 900 stillinger hvor arbeidsgiver er åpen for å inkludere.'
        },
        {
            tittel: 'Brukere med behov for tilrettelegging',
            bilde: tilrettelegging2,
            altTekst: 'Et ikon av en person med teksten "ca. 1200 brukere".',
            tekst: 'Nå er det bare registrert ca. 1200 brukere som trenger tilrettelegging.'
        },
        {
            tittel: 'Registrer behov du også!',
            bilde: tilrettelegging3,
            altTekst: 'Bilde av aktivitetsplanen med ',
            tekst:
                'Gi dine brukere flere muligheter for å komme i jobb. Registrer tilretteleggingsbehov under "Detaljer".'
        }
    ]
};

export function getTour(modal: ModalName) {
    switch (modal) {
        case ModalName.MINE_FILTER:
            return stepsMineFilter.steps;
        case ModalName.TILRETTELEGGING:
            return stepsTilrettelegging.steps;
        default:
            return null;
    }
}

export function getTitle(modal: ModalName) {
    switch (modal) {
        case ModalName.MINE_FILTER:
            return stepsMineFilter.modalTittel;
        case ModalName.TILRETTELEGGING:
            return stepsTilrettelegging.modalTittel;
        default:
            return null;
    }
}
