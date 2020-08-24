import {LagretFilter} from "../../ducks/lagret-filter";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../../reducer";
import {finnSideNavn, mapVeilederIdentTilNonsens} from "../../middleware/metrics-middleware";
import {logEvent} from "../../utils/frontend-logger";
import {velgLagretFilter} from "../../ducks/filtrering";
import {apenLagreFilterModal} from "../../ducks/lagret-filter-ui";
import {Radio} from "nav-frontend-skjema";
import RedigerKnapp from "../../components/knapper/rediger-knapp";
import React from "react";
import './ny_lagrede-filter-innhold.less'

interface LagretFilterRadProps {
    filter: LagretFilter;
    filtergruppe: string;
}

function NyLagretFilterRad({filter, filtergruppe}: LagretFilterRadProps) {
    const dispatch = useDispatch();

    const valgtLagretFilter = useSelector((state: AppState) => filtergruppe === "veileder"
        ? state.lagretFilterMinOversikt.valgtLagretFilter
        : state.lagretFilterEnhetensOversikt.valgtLagretFilter);
    const veilederIdent = useSelector((state: AppState) => state.inloggetVeileder.data!);
    const veilederIdentTilNonsens = mapVeilederIdentTilNonsens(veilederIdent.ident);

    function velgFilter() {
        logEvent('portefolje.metrikker.lagredefilter.valgt-lagret-filter',
            {}, {filterId: filter.filterId, sideNavn: finnSideNavn(), id: veilederIdentTilNonsens});
        dispatch(velgLagretFilter(filter, filtergruppe))
    }

    function onClickRedigerKnapp() {
        dispatch(apenLagreFilterModal(filtergruppe))
    }

    return (
        <div className="ny__lagrede-filter__rad">
            <Radio
                className="ny__lagrede-filter__filternavn"
                key={filter.filterId}
                name="lagretFilter"
                label={filter.filterNavn}
                value={filter.filterId}
                onChange={() => velgFilter()}
                checked={valgtLagretFilter?.filterId === filter.filterId}
            />
            <RedigerKnapp
                hidden={valgtLagretFilter?.filterId !== filter.filterId}
                aria="Rediger lagret filter"
                onClick={onClickRedigerKnapp}
            />
        </div>
    );
}

export default NyLagretFilterRad;