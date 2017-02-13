/* eslint-disable jsx-a11y/onclick-has-focus*/
/* eslint-disable jsx-a11y/onclick-has-role*/
/* eslint-disable jsx-a11y/no-static-element-interactions*/
import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import Innholdslaster from '../innholdslaster/innholdslaster';
import { hentPortefoljeForVeileder, settSorterRekkefolge } from '../ducks/portefolje';
import Paginering from '../utils/paginering';
import { enhetShape, veilederShape } from './../proptype-shapes';


class VeilederPortefoljeVisning extends Component {
    componentWillMount() {
        const { hentPortefolje } = this.props;
        hentPortefolje(this.props.valgtEnhet.enhetId, this.props.veileder);
        this.settSorteringOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this);
    }

    settSorteringOgHentPortefolje() {
        const { sorteringsrekkefolge, settSortering, fraIndex,
                hentPortefolje, veileder, valgtEnhet } = this.props;
        let valgtRekkefolge = '';
        if (sorteringsrekkefolge === 'ascending') {
            valgtRekkefolge = 'descending';
            settSortering('descending');
        } else {
            valgtRekkefolge = 'ascending';
            settSortering('ascending');
        }
        hentPortefolje(valgtEnhet, veileder, valgtRekkefolge, fraIndex);
    }


    render() {
        const { portefolje, hentPortefolje, sorteringsrekkefolge, valgtEnhet } = this.props;
        const { antallTotalt, antallReturnert, fraIndex, brukere } = portefolje.data;

        const pagineringTekst = (
            <FormattedMessage
                id="enhet.portefolje.paginering.tekst"
                values={{ fraIndex: `${fraIndex}`, tilIndex: fraIndex + antallReturnert, antallTotalt }}
            />
        );

        return (
            <Innholdslaster avhengigheter={[portefolje]}>
                <Paginering
                    antallTotalt={antallTotalt}
                    fraIndex={fraIndex}
                    hentListe={(fra, antall) =>
                        hentPortefolje(valgtEnhet.enhetId, sorteringsrekkefolge, fra, antall)}
                    tekst={pagineringTekst}
                />
                <table className="tabell tabell-skillestrek" tabIndex="0">
                    <thead>
                        <tr>
                            <th>
                                <a onClick={this.settSorteringOgHentPortefolje} role="button">
                                    <FormattedMessage id="portefolje.tabell.navn" />
                                </a>
                            </th>
                            <th>
                                <FormattedMessage id="portefolje.tabell.fodselsnummer" />
                            </th>
                            <th />
                            <th>
                                flagg
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {brukere.map(bruker => <tr key={bruker.fnr}>
                            <td>{`${bruker.etternavn}, ${bruker.fornavn}`} </td>
                            <td>{bruker.fnr}</td>
                            <td>
                                {bruker.sikkerhetstiltak.length > 0 ? <span>Sikkerhetstiltak</span> : null}
                                {bruker.diskresjonskode != null ?
                                    <span>{`Kode ${bruker.diskresjonskode}`}</span> : null}
                                {bruker.egenAnsatt === true ? <span>Egen ansatt</span> : null}
                            </td>
                            <td>
                                flagg
                            </td>
                        </tr>)}
                    </tbody>
                </table>
            </Innholdslaster>
        );
    }
}

VeilederPortefoljeVisning.propTypes = {
    portefolje: PT.shape({
        data: PT.shape({
            brukere: PT.arrayOf(PT.object).isRequired,
            antallTotalt: PT.number.isRequired,
            antallReturnert: PT.number.isRequired,
            fraIndex: PT.number.isRequired
        }).isRequired,
        sorteringsrekkefolge: PT.string.isRequired
    }).isRequired,
    valgtEnhet: enhetShape.isRequired,
    veileder: veilederShape.isRequired,
    hentPortefolje: PT.func.isRequired,
    settSortering: PT.func.isRequired,
    sorteringsrekkefolge: PT.string.isRequired,
    fraIndex: PT.number
};

const mapStateToProps = state => ({
    portefolje: state.portefolje,
    valgtEnhet: state.enheter.valgtEnhet,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    veileder: state.portefolje.veileder
});

const mapDispatchToProps = dispatch => ({
    hentPortefolje: (enhet, veileder, rekkefolge, fra = 0, antall = 20) =>
        dispatch(hentPortefoljeForVeileder(enhet, veileder, rekkefolge, fra, antall)),
    settSortering: rekkefolge => dispatch(settSorterRekkefolge(rekkefolge))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederPortefoljeVisning);
