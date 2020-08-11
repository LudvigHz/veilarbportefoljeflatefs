import {useEffect} from "react";
import {lagredeFilterListerErLik} from "../components/modal/lagrede-filter/lagrede-filter-utils";
import {avmarkerVelgtFilter, markerVelgtFilter} from "../ducks/lagret-filter";
import {useDispatch, useSelector} from "react-redux";
import {AppState} from "../reducer";


export function useLagreFilterController() {
    const dispatch = useDispatch()
    const filtreringMinOversikt = useSelector((state: AppState) => state.filtreringMinoversikt);
    const lagretFilterList = useSelector((state: AppState) => state.lagretFilter.data);

    useEffect(() => {
        const valgtFilter = lagretFilterList.find(elem => lagredeFilterListerErLik(elem.filterValg, filtreringMinOversikt));
        if (valgtFilter) {
            dispatch(markerVelgtFilter(valgtFilter));
        } else {
            dispatch(avmarkerVelgtFilter());
        }
    }, [filtreringMinOversikt, lagretFilterList, dispatch])

    return null
}
