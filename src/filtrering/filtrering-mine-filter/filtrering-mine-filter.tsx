import React from 'react';
import {useSelector} from 'react-redux';
import {AppState} from '../../reducer';
import AlertStripe from 'nav-frontend-alertstriper';
import {STATUS} from '../../ducks/utils';
import './mine-filter_innhold.less';
import MineFilterInnhold from './mine-filter_innhold';
import {HandlingsType, LagretFilter} from '../../ducks/lagret-filter';
import {OversiktType} from '../../ducks/ui/listevisning';
import {OrNothing} from '../../utils/types/types';
import {Tiltak} from '../../ducks/enhettiltak';

function FiltreringMineFilter(props: {
    oversiktType: OversiktType;
    fjernUtilgjengeligeFilter: (elem: LagretFilter) => void;
    sortertMineFilter;
    isDraggable: boolean;
    setisDraggable: React.Dispatch<React.SetStateAction<boolean>>;
    enhettiltak: OrNothing<Tiltak>;
}) {
    const mineFilterState = useSelector((state: AppState) => state.mineFilter);

    return (
        <>
            {mineFilterState.handlingType === HandlingsType.HENTE && mineFilterState.status === STATUS.ERROR ? (
                <AlertStripe type="feil">
                    Det oppsto en feil, og mine filter kunne ikke hentes fram. Prøv igjen senere.
                </AlertStripe>
            ) : (
                <MineFilterInnhold
                    lagretFilter={props.sortertMineFilter}
                    oversiktType={props.oversiktType}
                    isDraggable={props.isDraggable}
                    fjernUtilgjengeligeFilter={props.fjernUtilgjengeligeFilter}
                    setisDraggable={props.setisDraggable}
                    enhettiltak={props.enhettiltak}
                />
            )}
        </>
    );
}

export default FiltreringMineFilter;
