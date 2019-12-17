import * as React from 'react';
import { connect } from 'react-redux';
import Innholdslaster from '../innholdslaster/innholdslaster';
import { hentPortefoljeForVeileder, PortefoljeState, settSortering } from '../ducks/portefolje';
import TabellOverskrift from '../components/tabell-overskrift';
import Toolbar, { ToolbarPosisjon } from './../components/toolbar/toolbar';
import { leggEnhetIUrl, updateLastPath } from '../utils/url-utils';
import { ASCENDING, DESCENDING } from '../konstanter';
import Diagram from './diagram/diagram';
import { diagramSkalVises } from './diagram/util';
import MinoversiktTabell from './minoversikt-portefolje-tabell';
import { STATUS } from '../ducks/utils';
import {  FiltervalgModell, ValgtEnhetModell, VeilederModell } from '../model-interfaces';
import { ListevisningType } from '../ducks/ui/listevisning';
import { selectSideStorrelse } from '../components/toolbar/paginering/paginering-selector';
import {MinOversiktModalController} from "../components/modal/modal-min-oversikt-controller";

interface DispatchProps {
    hentPortefolje: (...args) => void;
    doSettSortering: (rekkefolge: string, felt: string) => void;
}

interface StateProps {
    portefolje: PortefoljeState;
    sorteringsrekkefolge: string;
    valgtEnhet: ValgtEnhetModell;
    sorteringsfelt: string;
    visningsmodus: string;
    filtervalg: FiltervalgModell;
    innloggetVeilederIdent: string;
    sideStorrelse: number;
}

interface OwnProps {
    gjeldendeVeileder: VeilederModell;
    visesAnnenVeiledersPortefolje: boolean;
}

type VeilederPortefoljeVisningProps = OwnProps & StateProps & DispatchProps;

class VeilederPortefoljeVisning extends React.Component<VeilederPortefoljeVisningProps> {
    componentWillMount() {
        const {
            valgtEnhet,
        } = this.props;

        leggEnhetIUrl(valgtEnhet.enhet!.enhetId!);
        this.settSorteringOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this);
    }

    settSorteringOgHentPortefolje(felt) {
        const {
            sorteringsrekkefolge,
            sorteringsfelt,
            doSettSortering,
            hentPortefolje,
            gjeldendeVeileder,
            valgtEnhet,
            filtervalg
        } = this.props;
        let valgtRekkefolge = '';
        if (felt !== sorteringsfelt) {
            valgtRekkefolge = ASCENDING;
        } else {
            valgtRekkefolge = sorteringsrekkefolge === ASCENDING ? DESCENDING : ASCENDING;
        }
        doSettSortering(valgtRekkefolge, felt);
        hentPortefolje(
            valgtEnhet.enhet!.enhetId, gjeldendeVeileder.ident, valgtRekkefolge, felt, filtervalg
        );
    }

    lagToolbar = (posisjon: ToolbarPosisjon) => {

        const {
            portefolje,
            hentPortefolje,
            gjeldendeVeileder,
            sorteringsrekkefolge,
            sorteringsfelt,
            valgtEnhet,
            filtervalg,
            visningsmodus,
            visesAnnenVeiledersPortefolje,
        } = this.props;

        const { antallTotalt } = portefolje.data;

        return (
            <Toolbar
                filtergruppe={ListevisningType.minOversikt}
                onPaginering={(fra, antall) => hentPortefolje(
                    valgtEnhet.enhet!.enhetId,
                    gjeldendeVeileder.ident,
                    sorteringsrekkefolge,
                    sorteringsfelt,
                    filtervalg
                )}
                gjeldendeVeileder={gjeldendeVeileder}
                visesAnnenVeiledersPortefolje={visesAnnenVeiledersPortefolje}
                sokVeilederSkalVises={false}
                visningsmodus={visningsmodus}
                antallTotalt={antallTotalt}
                posisjon={posisjon}
            />
        );
    };

    render() {
        const {
            portefolje,
            gjeldendeVeileder,
            innloggetVeilederIdent,
            valgtEnhet,
            filtervalg,
            visningsmodus,
            sideStorrelse,
        } = this.props;
        updateLastPath();
        const {antallTotalt, antallReturnert, fraIndex, brukere} = portefolje.data;
        const antallValgt = brukere.filter((bruker) => bruker.markert).length;
        const visDiagram = diagramSkalVises(visningsmodus, filtervalg.ytelse);
        const tilordningerStatus = portefolje.tilordningerstatus !== STATUS.RELOADING ? STATUS.OK : STATUS.RELOADING;
        const visNedreToolbar = antallTotalt >= sideStorrelse && !visDiagram;

        return (
            <div className="portefolje__container">
                <Innholdslaster avhengigheter={[portefolje, {status: tilordningerStatus}]}>
                    <TabellOverskrift
                        fraIndex={fraIndex}
                        antallIVisning={antallReturnert}
                        antallTotalt={antallTotalt}
                        antallValgt={antallValgt}
                        visDiagram={visDiagram}
                    />
                    {this.lagToolbar(ToolbarPosisjon.OVER)}
                    {
                        visDiagram ?
                            <Diagram
                                filtreringsvalg={filtervalg}
                                enhet={valgtEnhet.enhet!.enhetId}
                                veileder={gjeldendeVeileder.ident}
                            />
                            :
                            <MinoversiktTabell
                                innloggetVeileder={innloggetVeilederIdent}
                                settSorteringOgHentPortefolje={this.settSorteringOgHentPortefolje}
                            />
                    }
                    {visNedreToolbar && this.lagToolbar(ToolbarPosisjon.UNDER)}
                    <MinOversiktModalController/>
                </Innholdslaster>
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    portefolje: state.portefolje,
    valgtEnhet: state.enheter.valgtEnhet,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    sorteringsfelt: state.portefolje.sorteringsfelt,
    visningsmodus: state.paginering.visningsmodus,
    filtervalg: state.filtreringMinoversikt,
    innloggetVeilederIdent: state.enheter.ident,
    sideStorrelse: selectSideStorrelse(state),
});

const mapDispatchToProps = (dispatch) => ({
    hentPortefolje: (enhet, veileder, rekkefolge, felt, filtervalg) =>
        dispatch(hentPortefoljeForVeileder(enhet, veileder, rekkefolge, felt, filtervalg)),
    doSettSortering: (rekkefolge, felt) => dispatch(settSortering(rekkefolge, felt)),
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederPortefoljeVisning);
