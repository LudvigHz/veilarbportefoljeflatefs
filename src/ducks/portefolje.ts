import * as Api from './../middleware/api';
import {doThenDispatch, handterFeil, STATUS} from './utils';
import {pagineringSetup} from './paginering';
import {TILDELING_FEILET, visFeiletModal} from './modal-feilmelding-brukere';
import {visServerfeilModal} from './modal-serverfeil';
import {hentStatustallForVeileder} from './statustall-veileder';
import {BrukerModell, Sorteringsfelt, Sorteringsrekkefolge} from '../model-interfaces';
import {selectFraIndex, selectSidestorrelse} from '../components/toolbar/paginering/paginering-selector';
import {skjulModal, visTilordningOkModal} from './modal';
import {AppState} from '../reducer';
import {OrNothing} from '../utils/types/types';
import {OversiktType} from './ui/listevisning';
import {capitalize} from '../utils/utils';
import {hentStatustallForEnhet} from './statustall-enhet';
import {toJson, oppdaterFargekategori} from '../middleware/api';
import {oppdaterFargekategoriState} from '../components/fargekategori/fargekategori-popover';

// Actions
const OK = 'veilarbportefolje/portefolje/OK';
const FEILET = 'veilarbportefolje/portefolje/FEILET';
const PENDING = 'veilarbportefolje/portefolje/PENDING';
export const SETT_SORTERING = 'veilarbportefolje/portefolje/SETT_SORTERING';
const SETT_MARKERT_BRUKER = 'veilarbportefolje/portefolje/SETT_MARKERT_BRUKER';
export const SETT_MARKERT_BRUKER_ALLE = 'veilarbportefolje/portefolje/SETT_MARKERT_BRUKER_ALLE';
export const TILDEL_VEILEDER = 'veilarbportefolje/portefolje/TILDEL_VEILEDER';
const TILDEL_VEILEDER_RELOAD = 'veilarbportefolje/portefolje/TILDEL_VEILEDER_RELOAD';
const TILDEL_VEILEDER_OK = 'veilarbportefolje/portefolje/TILDEL_VEILEDER_OK';
const TILDEL_VEILEDER_FEILET = 'veilarbportefolje/portefolje/TILDEL_VEILEDER_FEILET';
const OPPDATER_ANTALL = 'veilarbportefolje/portefolje/OPPDATER_ANTALL';
const NULLSTILL_FEILENDE_TILDELINGER = 'veilarbportefolje/portefolje/NULLSTILL_FEILENDE_TILDELINGER';
const OPPDATER_ARBEIDSLISTE = 'veilarbportefolje/portefolje/OPPDATER_ARBEIDSLISTE';
const OPPDATER_ARBEIDSLISTE_VEILEDER = 'veilarbportefolje/portefolje/ARBEIDSLISTE_VEILEDER';
const OPPDATER_ARBEIDSLISTE_BRUKER = 'veilarbportefolje/portefolje/ARBEIDSLISTE_BRUKER';
const OPPDATER_FARGEKATEGORI = 'veilarbportefolje/portefolje/FARGEKATEGORI';
const FARGEKATEGORI_REDIGER_OK = 'veilarbportefolje/oppdater_fargekategori/OK';
const FARGEKATEGORI_REDIGER_FEILET = 'veilarbportefolje/oppdater_fargekategori/FEILET';
const FARGEKATEGORI_REDIGER_PENDING = 'veilarbportefolje/oppdater_fargekategori/PENDING';

function lagBrukerGuid(bruker) {
    return bruker.fnr === '' ? `${Math.random()}`.slice(2) : bruker.fnr;
}

// Reducer
export interface PortefoljeData {
    brukere: BrukerModell[];
    antallTotalt: number;
    antallReturnert: number;
    fraIndex: number;
}

export interface PortefoljeState {
    status: string;
    data: PortefoljeData;
    sorteringsrekkefolge: OrNothing<Sorteringsrekkefolge>;
    sorteringsfelt: OrNothing<Sorteringsfelt>;
    feilendeTilordninger?: any[];
    tilordningerstatus: string;
}

const initialState: PortefoljeState = {
    status: STATUS.NOT_STARTED,
    data: {
        brukere: [],
        antallTotalt: 0,
        antallReturnert: 0,
        fraIndex: 0
    },
    sorteringsrekkefolge: null,
    sorteringsfelt: null,
    tilordningerstatus: STATUS.OK
};

function updateVeilederForBruker(brukere, veilederId, feilende) {
    const feilendeFnr = feilende.map(b => b.brukerFnr);

    return brukere.map(bruker => {
        if (bruker.markert && !feilendeFnr.includes(bruker.fnr)) {
            return {
                ...bruker,
                veilederId,
                markert: false
            };
        }
        return bruker;
    });
}

function updateBrukerInArray(brukere, action) {
    return brukere.map(bruker => {
        if (bruker.guid === action.guid) {
            return {
                ...bruker,
                markert: action.markert
            };
        }
        return bruker;
    });
}

function updateArbeidslisteForBrukere(brukere, arbeidsliste) {
    return brukere.map(bruker => {
        const arbeidslisteForBruker = arbeidsliste.find(a => a.fnr === bruker.fnr);
        if (arbeidslisteForBruker) {
            return {
                ...bruker,
                arbeidsliste: {...bruker.arbeidsliste, ...arbeidslisteForBruker}
            };
        }
        return bruker;
    });
}

function leggTilKommentarArbeidsliste(brukere, arbeidsliste) {
    return brukere.map(bruker => {
        if (bruker.aktoerid === arbeidsliste.aktoerid) {
            return {
                ...bruker,
                arbeidsliste: {
                    ...bruker.arbeidsliste,
                    kommentar: arbeidsliste.kommentar,
                    hentetKommentarOgTittel: true
                }
            };
        }
        return bruker;
    });
}

function leggTilOverskriftOgTittelArbeidsliste(brukere, arbeidsliste) {
    return brukere.map(bruker => {
        const arbeidslisteForBruker = arbeidsliste.find(a => a.aktoerid === bruker.aktoerid);
        if (arbeidslisteForBruker) {
            return {
                ...bruker,
                arbeidsliste: {
                    ...bruker.arbeidsliste,
                    overskrift: arbeidslisteForBruker.overskrift,
                    kommentar: arbeidslisteForBruker.kommentar
                }
            };
        }
        return bruker;
    });
}

function updateFargekategoriForBrukere(brukere, fargekategori) {
    // eslint-disable-next-line
    console.log('I updateFargekategoriForBrukere i portefolje.ts, brukere og fargekategori:', brukere, fargekategori);
    return brukere.map(bruker => {
        const fargekategoriForBruker = fargekategori.find(a => a.fnr === bruker.fnr);
        if (fargekategoriForBruker) {
            return {
                ...bruker,
                fargekategori: {...bruker.fargekategori, ...fargekategoriForBruker}
            };
        }
        return bruker;
    });
}

export default function portefoljeReducer(state = initialState, action): PortefoljeState {
    switch (action.type) {
        case PENDING:
            if (state.status === STATUS.OK) {
                return {...state, status: STATUS.RELOADING};
            }
            return {...state, status: STATUS.PENDING};
        case FEILET:
            return {...state, status: STATUS.ERROR, data: {...action.data, brukere: []}};
        case OK:
            return {
                ...state,
                status: STATUS.OK,
                data: {
                    ...action.data,
                    brukere: action.data.brukere.map(bruker => ({
                        ...bruker,
                        guid: lagBrukerGuid(bruker),
                        fornavn: capitalize(bruker.fornavn),
                        etternavn: capitalize(bruker.etternavn),
                        arbeidsliste: {...bruker.arbeidsliste, hentetKommentarOgTittel: false}
                    }))
                }
            };
        case SETT_SORTERING: {
            return {
                ...state,
                sorteringsrekkefolge: action.sorteringsrekkefolge,
                sorteringsfelt: action.sorteringsfelt
            };
        }
        case SETT_MARKERT_BRUKER: {
            return {
                ...state,
                data: {
                    ...state.data,
                    brukere: updateBrukerInArray(state.data.brukere, action)
                }
            };
        }
        case TILDEL_VEILEDER: {
            return {
                ...state,
                tilordningerstatus: STATUS.OK,
                data: {
                    ...state.data,
                    brukere: updateVeilederForBruker(
                        state.data.brukere,
                        action.tilVeileder,
                        action.feilendeTilordninger
                    )
                }
            };
        }
        case OPPDATER_ANTALL:
            return {
                ...state,
                data: {
                    ...state.data,
                    antallTotalt: state.data.antallTotalt - action.antallTilordninger,
                    antallReturnert: state.data.antallReturnert - action.antallTilordninger
                }
            };
        case TILDEL_VEILEDER_RELOAD: {
            return {...state, tilordningerstatus: STATUS.RELOADING};
        }
        case TILDEL_VEILEDER_OK: {
            return {...state, tilordningerstatus: STATUS.OK};
        }
        case TILDEL_VEILEDER_FEILET: {
            return {...state, tilordningerstatus: STATUS.ERROR};
        }
        case NULLSTILL_FEILENDE_TILDELINGER: {
            return {...state, feilendeTilordninger: []};
        }
        case SETT_MARKERT_BRUKER_ALLE: {
            return {
                ...state,
                data: {
                    ...state.data,
                    brukere: state.data.brukere.map(bruker => {
                        if (bruker.fnr !== '') {
                            return {...bruker, markert: action.markert};
                        }
                        return {...bruker};
                    })
                }
            };
        }
        case OPPDATER_ARBEIDSLISTE: {
            return {
                ...state,
                data: {
                    ...state.data,
                    brukere: updateArbeidslisteForBrukere(state.data.brukere, action.arbeidsliste)
                }
            };
        }
        case OPPDATER_ARBEIDSLISTE_VEILEDER: {
            return {
                ...state,
                data: {
                    ...state.data,
                    brukere: leggTilOverskriftOgTittelArbeidsliste(state.data.brukere, action.arbeidsliste)
                }
            };
        }
        case OPPDATER_ARBEIDSLISTE_BRUKER: {
            return {
                ...state,
                data: {
                    ...state.data,
                    brukere: leggTilKommentarArbeidsliste(state.data.brukere, action.arbeidslisteForBruker)
                }
            };
        }
        case OPPDATER_FARGEKATEGORI: {
            // eslint-disable-next-line
            console.log('I FARGEKATEGORI_REDIGER_OK i portefolje.ts, action:', action.fargekategori);
            return {
                ...state,
                data: {
                    ...state.data,
                    brukere: updateFargekategoriForBrukere(state.data.brukere, action.fargekategori)
                }
            };
        }
        default:
            return state;
    }
}

function hentPortefolje(hentPortefoljeFn: (...args: any[]) => void, ...args: any[]) {
    const fn = (dispatch, getState) => {
        const state = getState();
        const fra = selectFraIndex(state);
        const antall = selectSidestorrelse(state);

        return hentPortefoljeFn(...args, fra, antall);
    };
    return doThenDispatch(fn, {
        OK,
        FEILET,
        PENDING
    });
}

// Action Creators
export function hentPortefoljeForEnhet(enhet, rekkefolge, sorteringsfelt, filtervalg) {
    return hentPortefolje(Api.hentEnhetsPortefolje, enhet, rekkefolge, sorteringsfelt, filtervalg);
}

export function hentPortefoljeForVeileder(enhet, veileder, rekkefolge, sorteringsfelt, filtervalg) {
    return hentPortefolje(Api.hentVeiledersPortefolje, enhet, veileder, rekkefolge, sorteringsfelt, filtervalg);
}

export function settSortering(rekkefolge, felt) {
    return dispatch =>
        dispatch({
            type: SETT_SORTERING,
            sorteringsrekkefolge: rekkefolge,
            sorteringsfelt: felt
        });
}

export function settBrukerSomMarkert(guid, markert) {
    return dispatch =>
        dispatch({
            type: SETT_MARKERT_BRUKER,
            guid,
            markert
        });
}

export function markerAlleBrukere(markert) {
    return dispatch =>
        dispatch({
            type: SETT_MARKERT_BRUKER_ALLE,
            markert
        });
}

export function tildelVeileder(tilordninger, tilVeileder, oversiktType, veilederIdent) {
    return (dispatch, getState: () => AppState) => {
        dispatch({type: TILDEL_VEILEDER_RELOAD});
        dispatch({type: PENDING});
        Api.tilordneVeileder(tilordninger)
            .then(toJson)
            .then(res => {
                dispatch({
                    type: TILDEL_VEILEDER,
                    tilVeileder,
                    feilendeTilordninger: res.feilendeTilordninger
                });
                if (res.feilendeTilordninger.length > 0) {
                    const feilendeTilordninger = res.feilendeTilordninger;
                    const feiledeFnr = feilendeTilordninger.map(f => f.brukerFnr);

                    const vellykkedeTilordninger = tilordninger
                        .filter(tilordning => !feiledeFnr.includes(tilordning.brukerFnr))
                        .map(tilordning => ({brukerFnr: tilordning.brukerFnr}));

                    visFeiletModal({
                        aarsak: TILDELING_FEILET,
                        brukereError: feilendeTilordninger,
                        brukereOk: vellykkedeTilordninger
                    })(dispatch);
                } else {
                    dispatch(visTilordningOkModal(tilordninger.map(tilordning => ({brukerFnr: tilordning.brukerFnr}))));
                    dispatch(pagineringSetup({side: 1}));
                }
                if (oversiktType === OversiktType.minOversikt) {
                    dispatch({
                        type: OPPDATER_ANTALL,
                        antallTilordninger: tilordninger.length - res.feilendeTilordninger.length
                    });
                }
            })
            .then(() => {
                // Venter litt slik at indeks kan komme i sync
                setTimeout(() => {
                    const enhet = getState().valgtEnhet.data.enhetId;
                    const rekkefolge = getState().portefolje.sorteringsrekkefolge;
                    const sorteringsfelt = getState().portefolje.sorteringsfelt;
                    if (oversiktType === OversiktType.minOversikt) {
                        const filtervalg = getState().filtreringMinoversikt;
                        dispatch(
                            hentPortefoljeForVeileder(enhet, veilederIdent, rekkefolge, sorteringsfelt, filtervalg)
                        );
                    } else {
                        const filtervalg = getState().filtreringEnhetensOversikt;
                        dispatch(hentPortefoljeForEnhet(enhet, rekkefolge, sorteringsfelt, filtervalg));
                    }
                }, 2000);
            })
            .catch(error => {
                visServerfeilModal()(dispatch);
                // TILDEL_VEILEDER_FEILET setter errorstatus slik at spinner forsvinner
                return handterFeil(dispatch, TILDEL_VEILEDER_FEILET)(error);
            })
            .then(() => {
                // Venter litt slik at indeks kan komme i sync
                setTimeout(() => {
                    const enhet = getState().valgtEnhet.data.enhetId;
                    if (oversiktType === OversiktType.minOversikt) {
                        hentStatustallForVeileder(enhet, veilederIdent)(dispatch);
                    } else {
                        hentStatustallForEnhet(enhet)(dispatch);
                    }
                }, 2000);
            });
    };
}

export function oppdaterArbeidslisteForBruker(arbeidsliste) {
    return dispatch =>
        dispatch({
            type: OPPDATER_ARBEIDSLISTE,
            arbeidsliste
        });
}

export function hentArbeidslisteforVeileder(enhet, veileder) {
    return dispatch => {
        Api.hentArbeidslisteForVeileder(enhet, veileder).then(arbeidsliste => {
            dispatch({
                type: OPPDATER_ARBEIDSLISTE_VEILEDER,
                arbeidsliste
            });
        });
    };
}

export function hentArbeidslisteForBruker(fodselsnummer) {
    return dispatch => {
        Api.hentArbeidslisteForBruker(fodselsnummer).then(arbeidslisteForBruker => {
            dispatch({
                type: OPPDATER_ARBEIDSLISTE_BRUKER,
                arbeidslisteForBruker
            });
        });
    };
}

export function oppdaterFargekategoriAction(data, props) {
    const fargekategori = {
        fargekategoriVerdi: data,
        fnr: props
    };

    // eslint-disable-next-line
    console.log('I oppdaterFargekategoriAction i portefolje.ts', fargekategori);

    return dispatch =>
        lagreFargekategoriAction(fargekategori)(dispatch)
            .then(res => oppdaterFargekategoriState(res, fargekategori.fargekategoriVerdi, fargekategori.fnr, dispatch))
            .then(() => dispatch(skjulModal()));
}

function lagreFargekategoriAction(fargekategori) {
    // eslint-disable-next-line
    console.log('I lagreFargekategoriAction i portefolje.ts, fargekategori:', fargekategori);

    return doThenDispatch(() => oppdaterFargekategori(fargekategori), {
        OK: FARGEKATEGORI_REDIGER_OK,
        FEILET: FARGEKATEGORI_REDIGER_FEILET,
        PENDING: FARGEKATEGORI_REDIGER_PENDING
    });
}
