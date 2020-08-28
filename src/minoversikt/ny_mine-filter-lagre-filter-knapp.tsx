import Knapp from "nav-frontend-knapper/lib/knapp";
import * as React from "react";
import {useEffect, useState} from "react";
import {erObjektValuesTomt, lagredeFilterListerErLik} from "../components/modal/lagrede-filter/lagrede-filter-utils";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../reducer";
import {MINE_FILTER} from "../konstanter";
import {apenLagreFilterModal} from "../ducks/lagret-filter-ui";
import {useFeatureSelector} from "../hooks/redux/use-feature-selector";

export function NyMineFilterLagreFilterKnapp(props: { filtergruppe: string }) {
    const [erLagreKnappSkjult, setErLagreKnappSkjult] = useState(true);
    const filtreringMinOversikt = useSelector((state: AppState) => state.filtreringMinoversikt);
    const filtreringEnhetensOversikt = useSelector((state: AppState) => state.filtreringEnhetensOversikt);

    const erPaMinOversikt = props.filtergruppe === 'veileder';
    const erPaEnhetensOversikt = props.filtergruppe === 'enhet';

    const filtrering = useSelector((state: AppState) => erPaMinOversikt ? state.filtreringMinoversikt : state.filtreringEnhetensOversikt);
    const lagretFilterList = useSelector((state: AppState) => state.lagretFilter.data);
    const valgtFilter = !lagretFilterList.find(elem => lagredeFilterListerErLik(elem.filterValg, filtrering));

    const erMineFilterFeatureTogglePa = useFeatureSelector()(MINE_FILTER)

    const dispatch = useDispatch();

    function lagreFilterModal(event) {
        event.preventDefault()
        dispatch(apenLagreFilterModal(props.filtergruppe))
    }

    useEffect(() => {
        const ingenFilterValgt = erPaMinOversikt
            ? erObjektValuesTomt(filtreringMinOversikt)
            : erObjektValuesTomt(filtreringEnhetensOversikt)

        if ((erPaMinOversikt && valgtFilter && !ingenFilterValgt) ||
            (erPaEnhetensOversikt && valgtFilter && !ingenFilterValgt)) {
            setErLagreKnappSkjult(false)
        } else {
            setErLagreKnappSkjult(true)
        }
    }, [filtreringMinOversikt, filtreringEnhetensOversikt, erPaMinOversikt, erPaEnhetensOversikt, erLagreKnappSkjult, valgtFilter]);

    return (
        <Knapp className="ny__lagre-filter-knapp" mini
               hidden={erLagreKnappSkjult || !erMineFilterFeatureTogglePa}
               onClick={(event) => lagreFilterModal(event)}>
            Lagre filter
        </Knapp>
    )
}
