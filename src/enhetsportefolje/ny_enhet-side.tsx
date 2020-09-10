import * as React from 'react';
import DocumentTitle from 'react-document-title';
import Innholdslaster from '../innholdslaster/innholdslaster';
import TabellOverskrift from '../components/tabell-overskrift';
import {ModalEnhetSideController} from '../components/modal/modal-enhet-side-controller';
import EnhetTabell from './enhetsportefolje-tabell';
import EnhetTabellOverskrift from './enhetsportefolje-tabelloverskrift';
import './ny_enhetsportefolje.less';
import './brukerliste.less';
import ToppMeny from '../topp-meny/topp-meny';
import {usePortefoljeSelector} from '../hooks/redux/use-portefolje-selector';
import {ListevisningType} from '../ducks/ui/listevisning';
import {useSetStateFromUrl} from '../hooks/portefolje/use-set-state-from-url';
import {useFetchPortefolje} from '../hooks/portefolje/use-fetch-portefolje';
import FiltreringLabelContainer from '../filtrering/filtrering-label-container';
import {lagLablerTilVeiledereMedIdenter} from '../filtrering/utils';
import {useDispatch, useSelector} from 'react-redux';
import Toolbar from '../components/toolbar/toolbar';
import {endreFiltervalg, slettEnkeltFilter} from '../ducks/filtrering';
import {hentPortefoljeForEnhet} from '../ducks/portefolje';
import {useSyncStateMedUrl} from '../hooks/portefolje/use-sync-state-med-url';
import {useSetLocalStorageOnUnmount} from '../hooks/portefolje/use-set-local-storage-on-unmount';
import VelgFilterMelding from './velg-filter-melding';
import '../ny_style.less';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useFetchStatusTall} from '../hooks/portefolje/use-fetch-statustall';
import {AppState} from '../reducer';
import {useSidebarViewStore} from '../store/sidebar/sidebar-view-store';
import classNames from 'classnames';
import FiltreringNavnellerfnr from '../filtrering/filtrering-navnellerfnr';
import {sortTiltak} from '../filtrering/filtrering-status/filter-utils';
import {pagineringSetup} from '../ducks/paginering';
import Sidebar from '../components/sidebar/sidebar';
import {skjulSidebar, visSidebar} from "../ducks/sidebar-tab";
import {useMineFilterController} from "../minoversikt/use-mine-filter-controller";
import {NyMineFilterLagreFilterKnapp} from "../minoversikt/ny_mine-filter-lagre-filter-knapp";
import {MineFilterModal} from "../components/modal/mine-filter/mine-filter-modal";

function antallFilter(filtervalg) {
    function mapAktivitetFilter(value) {
        return Object.entries(value).map(([_, verdi]) => {
            if (verdi === 'NA') return 0;
            return 1;
        }).reduce((a: number, b: number) => a + b, 0);
    }

    return Object.entries(filtervalg)
        .map(([filter, value]) => {
            if (value === true) {
                return 1;
            } else if (Array.isArray(value)) {
                return value.length;
            } else if (filter === 'aktiviteter') {
                return mapAktivitetFilter(value);
            } else if (typeof value === 'object') {
                return value ? Object.entries(value).length : 0;
            } else if (value) return 1;
            return 0;
        }).reduce((a, b) => a + b, 0);
}

function Ny_EnhetSide() {
    const statustall = useFetchStatusTall();
    const filtergruppe = ListevisningType.enhetensOversikt;
    const {portefolje, filtervalg, enhetId, sorteringsrekkefolge, sorteringsfelt, enhettiltak, listevisning} = usePortefoljeSelector(filtergruppe);
    const dispatch = useDispatch();
    const portefoljeData = portefolje.data;
    const antallBrukere = portefoljeData.antallReturnert > portefoljeData.antallTotalt ? portefoljeData.antallTotalt : portefoljeData.antallReturnert;
    const harFilter = antallFilter(filtervalg) !== 0;
    const veilederliste = useSelector((state: AppState) => state.veiledere.data.veilederListe);
    const slettVeilederFilter = useCallback(ident => dispatch(slettEnkeltFilter('veiledere', ident, ListevisningType.enhetensOversikt)), [dispatch]);
    const veilederLabel = useMemo(() => lagLablerTilVeiledereMedIdenter(filtervalg.veiledere, veilederliste, slettVeilederFilter), [filtervalg.veiledere, veilederliste, slettVeilederFilter]);
    const tiltak = sortTiltak(enhettiltak.data.tiltak);
    const {isSidebarHidden} = useSidebarViewStore(filtergruppe);

    useSetStateFromUrl();
    useSyncStateMedUrl();

    useFetchPortefolje(filtergruppe);
    useSetLocalStorageOnUnmount();
    useMineFilterController({filtergruppe: filtergruppe});

    const handleOnTabClicked = (tab, selectedTab) => {
        if (isSidebarHidden) {
            dispatch(visSidebar(filtergruppe))

        } else if (tab.type === selectedTab.selectedTab) {
            dispatch(skjulSidebar(filtergruppe))
        }
    };

    const lukkTab = () => {
        dispatch(skjulSidebar(filtergruppe))
    };

    const doEndreFiltervalg = (filterId: string, filterVerdi: any) => {
        dispatch(pagineringSetup({side: 1}));
        dispatch(endreFiltervalg(filterId, filterVerdi, filtergruppe));
    };

    const [scrolling, setScrolling] = useState(false);

    useEffect(() => {
        function onScroll() {
            let currentPosition = window.pageYOffset;
            if (currentPosition > 200) {
                setScrolling(true);
            } else {
                setScrolling(false);
            }
        }

        window.addEventListener("scroll", onScroll);
        return window.addEventListener("scroll", onScroll);
    });

    return (
        <DocumentTitle title="Enhetens oversikt">
            <div className="side-storrelse__ny">
                <ToppMeny/>
                <Innholdslaster avhengigheter={[statustall]}>
                    <div role="tabpanel"
                         className={classNames('oversikt-sideinnhold__ny',
                             isSidebarHidden && 'oversikt-sideinnhold__ny__hidden')}>
                        <Sidebar
                            filtervalg={filtervalg}
                            filtergruppe={filtergruppe}
                            enhettiltak={tiltak}
                            handleOnTabClicked={handleOnTabClicked}
                            isSidebarHidden={isSidebarHidden}
                            lukkTab={lukkTab}
                        />
                        <div className="sokefelt-knapp__container">
                            <FiltreringNavnellerfnr
                                filtervalg={filtervalg}
                                endreFiltervalg={doEndreFiltervalg}
                            />
                            <NyMineFilterLagreFilterKnapp filtergruppe={filtergruppe}/>
                        </div>
                        <FiltreringLabelContainer
                            filtervalg={{
                                ...filtervalg,
                                veiledere: veilederLabel
                            }}
                            filtergruppe={filtergruppe}
                            enhettiltak={enhettiltak.data.tiltak}
                            listevisning={listevisning}
                            className="ny__filtrering-label-container"
                        />
                        {harFilter ?
                            <div className={classNames('oversikt__container',
                                isSidebarHidden && 'oversikt__container__hidden')}>
                                <div className={antallBrukere > 4
                                    ? 'sticky-container__ny'
                                    : 'ikke-sticky__ny__container'}>
                                    <span className={antallBrukere > 4
                                        ? 'sticky-skygge__ny'
                                        : 'ikke-sticky__ny__skygge'}>
                            <div className={antallBrukere > 4
                                ? 'toolbar-container__ny'
                                : 'ikke-sticky__ny__toolbar-container'}>
                                    <TabellOverskrift className="tabelloverskrift"/>
                                <Toolbar
                                    onPaginering={() => dispatch(hentPortefoljeForEnhet(
                                        enhetId,
                                        sorteringsrekkefolge,
                                        sorteringsfelt,
                                        filtervalg
                                    ))}
                                    filtergruppe={filtergruppe}
                                    sokVeilederSkalVises
                                    antallTotalt={portefoljeData.antallTotalt}
                                    scrolling={isSidebarHidden && scrolling}
                                />
                                <EnhetTabellOverskrift/>
                            </div>
                            </span>
                                    <EnhetTabell
                                        classNameWrapper={antallBrukere > 0
                                            ? 'portefolje__container__ny'
                                            : 'portefolje__container__ny__tom-liste'}
                                    />
                                </div>
                            </div>
                            : <VelgFilterMelding/>}
                    </div>
                </Innholdslaster>
                <MineFilterModal filtergruppe={filtergruppe}/>
                <ModalEnhetSideController/>
            </div>
        </DocumentTitle>
    );
}

export default Ny_EnhetSide;
