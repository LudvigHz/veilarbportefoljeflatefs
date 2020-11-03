import {useEffect} from 'react';
import {
    avmarkerSisteValgtMineFilter,
    avmarkerValgtMineFilter,
    avmarkerValgtVeiledergruppe,
    markerMineFilter,
    markerValgtVeiledergruppe
} from '../ducks/lagret-filter-ui-state';
import {erObjektValuesTomt, lagretFilterValgModellErLik} from '../components/modal/mine-filter/mine-filter-utils';
import {useDispatch, useSelector} from 'react-redux';
import {AppState} from '../reducer';
import {logEvent} from '../utils/frontend-logger';
import {finnSideNavn} from '../middleware/metrics-middleware';
import {ListevisningType} from '../ducks/ui/listevisning';
import {veilederlisterErLik} from '../components/modal/veiledergruppe/veileder-gruppe-utils';

export function LagredeFilterUIController(props: {filtergruppe: ListevisningType}) {
    const dispatch = useDispatch();

    const filtreringEnhetensOversikt = useSelector((state: AppState) => state.filtreringEnhetensOversikt);
    const filtreringMinoversikt = useSelector((state: AppState) => state.filtreringMinoversikt);
    const filtreringVeilederoversikt = useSelector((state: AppState) => state.filtreringVeilederoversikt);

    const lagretMineFilter = useSelector((state: AppState) => state.mineFilter.data);
    const lagretVeiledergrupper = useSelector((state: AppState) => state.veiledergrupper.data);

    useEffect(() => {
        const getFiltrering = () => {
            if (props.filtergruppe === ListevisningType.veilederOversikt) return filtreringVeilederoversikt;
            else if (props.filtergruppe === ListevisningType.minOversikt) return filtreringMinoversikt;
            else if (props.filtergruppe === ListevisningType.enhetensOversikt) return filtreringEnhetensOversikt;
        };

        const valgtMineFilter = lagretMineFilter.filter(elem =>
            lagretFilterValgModellErLik(elem.filterValg, getFiltrering())
        );
        const valgtVeiledergruppe = lagretVeiledergrupper.filter(elem =>
            veilederlisterErLik(elem.filterValg.veiledere, getFiltrering()!.veiledere)
        );

        if (erObjektValuesTomt(getFiltrering())) {
            dispatch(avmarkerSisteValgtMineFilter(props.filtergruppe));
        }

        if (valgtMineFilter.length === 0) {
            dispatch(avmarkerValgtMineFilter(props.filtergruppe));
            logEvent('portefolje.metrikker.lagredefilter.direkte-filtrering', {}, {sideNavn: finnSideNavn()});
        } else if (valgtMineFilter.length === 1) {
            dispatch(markerMineFilter(valgtMineFilter[0], props.filtergruppe));
        }

        if (valgtVeiledergruppe.length === 0) {
            dispatch(avmarkerValgtVeiledergruppe(props.filtergruppe));
        } else if (valgtVeiledergruppe.length === 1) {
            dispatch(markerValgtVeiledergruppe(valgtVeiledergruppe[0], props.filtergruppe));
        }
    }, [
        dispatch,
        props.filtergruppe,
        lagretMineFilter,
        lagretVeiledergrupper,
        filtreringEnhetensOversikt,
        filtreringMinoversikt,
        filtreringVeilederoversikt
    ]);

    return null;
}

export default LagredeFilterUIController;