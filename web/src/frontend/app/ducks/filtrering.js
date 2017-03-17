import * as Api from './../middleware/api';
import { doThenDispatch } from './utils';

// Actions
const OK = 'veilarbportefolje/portefolje/OK';
const FEILET = 'veilarbportefolje/portefolje/FEILET';
const PENDING = 'veilarbportefolje/portefolje/PENDING';
export const VALGT_NYE_BRUKERE = 'VALGT_NYE_BRUKERE';
export const AVVALGT_NYE_BRUKERE = 'AVVALGT_NYE_BRUKERE';
export const VALGT_INAKTIVE_BRUKERE = 'VALGT_INAKTIVE_BRUKERE';
export const AVVALGT_INAKTIVE_BRUKERE = 'AVVALGT_INAKTIVE_BRUKERE';
export const SETT_FILTERVALG = 'SETT_FILTERVALG';
export const ENDRET_ALDER = 'ENDRET_ALDER';
export const VALGT_KJONN = 'VALGT_KJONN';
export const VALGT_FODSELSDAG = 'VALGT_FODSELSDAG';

//  Reducer
const initialState = {
    filtervalg: {
        nyeBrukere: false,
        inaktiveBrukere: false,
        alder: [],
        kjonn: 'ikke definert',
        fodselsdagIMnd: 0
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        case VALGT_NYE_BRUKERE:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    nyeBrukere: true
                }
            };
        case AVVALGT_NYE_BRUKERE:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    nyeBrukere: false
                }
            };
        case VALGT_INAKTIVE_BRUKERE:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    inaktiveBrukere: true
                }
            };
        case AVVALGT_INAKTIVE_BRUKERE:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    inaktiveBrukere: false
                }
            };
        case ENDRET_ALDER:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    alder: action.alder
                }
            };
        case VALGT_KJONN:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    kjonn: action.kjonn
                }
            };
        case VALGT_FODSELSDAG:
            return { ...state,
                filtervalg: {
                    ...state.filtervalg,
                    fodselsdagIMnd: action.fodselsdagIMnd
                }
            };
        case SETT_FILTERVALG:
            return { ...state,
                filtervalg: action.filtervalg
            };
        default:
            return state;
    }
}

// Action Creators
export function endreFiltervalg(filterId, filtervalg) { // eslint-disable-line consistent-return
    if (filterId === 'checkbox-filtrering-oversikt-nye-brukere') {
        return { type: filtervalg ? VALGT_NYE_BRUKERE : AVVALGT_NYE_BRUKERE };
    } else if (filterId === 'checkbox-filtrering-oversikt-inaktive-brukere') {
        return { type: filtervalg ? VALGT_INAKTIVE_BRUKERE : AVVALGT_INAKTIVE_BRUKERE };
    } else if (filterId === 'alder') {
        return { type: ENDRET_ALDER, alder: filtervalg };
    } else if (filterId === 'kjonn') {
        return { type: VALGT_KJONN, kjonn: filtervalg };
    } else if (filterId === 'fodselsdagIMnd') {
        return { type: VALGT_FODSELSDAG, fodselsdagIMnd: filtervalg };
    }
}

export function settFiltervalg(filtervalg) {
    return {
        type: SETT_FILTERVALG,
        filtervalg
    };
}


export function hentPortefoljeForEnhet(enhet, rekkefolge, fra, antall, filtervalg) {
    return doThenDispatch(() =>
        Api.hentEnhetsPortefolje(enhet, rekkefolge, fra, antall, filtervalg), {
            OK, FEILET, PENDING
        });
}
