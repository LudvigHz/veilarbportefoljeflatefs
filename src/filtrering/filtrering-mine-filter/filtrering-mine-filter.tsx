import React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../reducer';
import MineFilterInnhold from "./mine-filter_innhold";
import {AlertStripeFeil} from "nav-frontend-alertstriper";
import {HandlingsType} from "../../ducks/mine-filter";
import {STATUS} from "../../ducks/utils";

function FiltreringMineFilter(props: { filtergruppe: string }) {
    const mineFilterState = useSelector((state: AppState) => state.lagretFilter);
    const mineFilter = mineFilterState.data;
    const sortertMineFilter = mineFilter.sort((a, b) => a.filterNavn.toLowerCase()
        .localeCompare(b.filterNavn.toLowerCase(), undefined, {numeric: true}));

    return (
        <>
            {(mineFilterState.handlingType === HandlingsType.HENTE
                && mineFilterState.status === STATUS.ERROR)
                ? <AlertStripeFeil>
                    Det oppsto en feil, og mine filter kunne ikke hentes fram. Prøv igjen senere.
                </AlertStripeFeil>
                : <MineFilterInnhold mineFilter={sortertMineFilter}
                                     filtergruppe={props.filtergruppe}/>}
        </>
    );
}

export default FiltreringMineFilter;
