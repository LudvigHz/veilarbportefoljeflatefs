import React, { PropTypes as PT, Component } from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import { hentPortefoljeForEnhet } from '../../ducks/filtrering';
import FiltreringOversikt from './filtrering-oversikt';
import FiltreringBrukere from './filtrering-filtrer-brukere';

class FiltreringContainer extends Component {
    componentDidUpdate() {
        this.oppdaterDatagrunnlag();
    }

    oppdaterDatagrunnlag() {
        const { hentPortefolje, filtervalg, sorteringsrekkefolge, fraIndex, antall, valgtEnhet } = this.props;
        hentPortefolje(valgtEnhet, sorteringsrekkefolge, fraIndex, antall, filtervalg);
    }

    render() {
        return (
            <div className="filtrering-container">
                <Ekspanderbartpanel tittel="Status" tittelProps="systemtittel">
                    <FiltreringOversikt />
                </Ekspanderbartpanel>
                <Ekspanderbartpanel tittel="Filter" tittelProps="systemtittel">
                    <FiltreringBrukere />
                </Ekspanderbartpanel>
            </div>
        );
    }
}

FiltreringContainer.propTypes = {
    filtervalg: PT.object,
    sorteringsrekkefolge: PT.string,
    fraIndex: PT.number,
    antall: PT.number,
    valgtEnhet: PT.string,
    hentPortefolje: PT.func.isRequired
};

const mapStateToProps = state => ({
    filtervalg: state.filtrering.filtervalg,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    fraIndex: state.portefolje.data.fraIndex,
    antall: state.paginering.sideStorrelse,
    valgtEnhet: state.enheter.valgtEnhet.enhetId
});

const mapDispatchToProps = dispatch => ({
    hentPortefolje: (enhet, rekkefolge, fra, antall, filtervalg) =>
        dispatch(hentPortefoljeForEnhet(enhet, rekkefolge, fra, antall, filtervalg))
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltreringContainer);
