import * as Api from '../middleware/api';
import {Systemmelding} from '../model-interfaces';
import {doThenDispatch, STATUS} from './utils';

export interface SystemmeldingState {
    status: string;
    data: Systemmelding[];
}

const initalStatusState: SystemmeldingState = {
    status: STATUS.NOT_STARTED,
    data: []
};

// Actions
export const OK = 'veilarbportefoljeflatefs/systemmeldinger/OK';
export const FEILET = 'veilarbportefoljeflatefs/systemmeldinger/FEILET';
export const PENDING = 'veilarbportefoljeflatefs/systemmeldinger/PENDING';

// Reducer
export default function reducer(state: SystemmeldingState = initalStatusState, action): SystemmeldingState {
    switch (action.type) {
        case PENDING:
            if (state.status === STATUS.OK) {
                return {...state, status: STATUS.RELOADING};
            }
            return {...state, status: STATUS.PENDING};
        case FEILET:
            return {...state, status: STATUS.ERROR, data: action.data};
        case OK: {
            return {...state, status: STATUS.OK, data: action.data};
        }
        default:
            return state;
    }
}

// Action Creators
export function hentSystemmeldinger() {
    return doThenDispatch(() => Api.hentSystemmeldinger(), {
        OK,
        FEILET,
        PENDING
    });
}
