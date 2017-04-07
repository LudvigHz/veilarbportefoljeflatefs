import React, { Component, PropTypes as PT } from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import classNames from 'classnames';
import Innholdslaster from '../innholdslaster/innholdslaster';
import Tabelletiketter from './../components/tabelletiketter/tabelletiketter';
import {
    hentPortefoljeForVeileder,
    settSortering,
    settBrukerSomMarkert,
    nullstillFeilendeTilordninger,
    markerAlleBrukere,
    PORTEFOLJE_SIDESTORRELSE
} from '../ducks/portefolje';
import Paginering from '../paginering/paginering';
import { enhetShape, veilederShape, filtervalgShape } from './../proptype-shapes';
import { leggEnhetIUrl, ytelseFilterErAktiv } from '../utils/utils';
import { ASCENDING, DESCENDING } from '../konstanter';
import Utlopsdatokolonne from '../tabell/kolonne_utlopsdato';
import Diagram from './diagram/diagram';
import { diagramSkalVises } from './diagram/util';
import { ytelsevalg } from '../filtrering/filter-konstanter';

const settSammenNavn = (bruker) => {
    if (bruker.etternavn === '' && bruker.fornavn === '') {
        return '';
    }
    return `${bruker.etternavn}, ${bruker.fornavn}`;
};

class VeilederPortefoljeVisning extends Component {
    componentWillMount() {
        const {
            sorteringsrekkefolge,
            sorteringsfelt,
            hentPortefolje,
            valgtEnhet,
            veileder,
            filtervalg,
            fraIndex,
            antall
        } = this.props;

        hentPortefolje(
            valgtEnhet.enhet.enhetId, veileder, sorteringsfelt, sorteringsrekkefolge, fraIndex, antall, filtervalg
        );

        leggEnhetIUrl(valgtEnhet.enhet.enhetId);
        this.settSorteringNavnOgHentPortefolje = this.settSorteringOgHentPortefolje.bind(this, 'etternavn');
    }

    settSorteringOgHentPortefolje(felt) {
        const {
            sorteringsrekkefolge,
            sorteringsfelt,
            settSortering, // eslint-disable-line no-shadow
            fraIndex,
            hentPortefolje,
            veileder,
            valgtEnhet,
            filtervalg,
            antall
        } = this.props;
        let valgtRekkefolge = '';
        if (felt !== sorteringsfelt) {
            valgtRekkefolge = ASCENDING;
        } else {
            valgtRekkefolge = sorteringsrekkefolge === ASCENDING ? DESCENDING : ASCENDING;
        }
        settSortering(valgtRekkefolge, felt);
        hentPortefolje(
            valgtEnhet.enhet.enhetId, veileder, sorteringsfelt, valgtRekkefolge, fraIndex, antall, filtervalg
        );
    }


    render() {
        const {
            portefolje,
            hentPortefolje,
            veileder,
            sorteringsrekkefolge,
            sorteringsfelt,
            valgtEnhet,
            settMarkert,
            clearFeilendeTilordninger,
            settSomMarkertAlle,
            filtervalg,
            visningsmodus
        } = this.props;

        const { antallTotalt, antallReturnert, fraIndex, brukere } = portefolje.data;

        const sorterEtternavn = portefolje.sorteringsfelt === 'etternavn';
        const sorterUtlopsdato = portefolje.sorteringsfelt === 'utlopsdato';

        const pagineringTekst = (
            antallTotalt > 0 ?
                (<FormattedMessage
                    id="enhet.portefolje.paginering.tekst"
                    values={{ fraIndex: `${fraIndex + 1}`, tilIndex: fraIndex + antallReturnert, antallTotalt }}
                />) :
                (<FormattedMessage
                    id="enhet.portefolje.paginering.tekst"
                    values={{ fraIndex: '0', tilIndex: '0', antallTotalt: '0' }}
                />)
        );

        const feil = portefolje.feilendeTilordninger;
        if (feil && feil.length > 0) {
            const fnr = feil.map((b) => b.brukerFnr).toString();
            // TODO en alert???
            alert(`Tilordning av veileder feilet brukere med fnr:${fnr}`); // eslint-disable-line no-undef
            clearFeilendeTilordninger();
        }

        const alleMarkert = brukere.length > 0 && brukere.every((bruker) => bruker.markert);
        const utlopsdatoHeader = !!filtervalg && ytelseFilterErAktiv(filtervalg.ytelse) ?
            (<th className="tabell-element-center">
                <FormattedMessage id="portefolje.tabell.utlopsdato" />
            </th>)
            :
            <th />;

        const fodselsdatoHeader = (<th className="tabell-element-center">
            <FormattedMessage id="portefolje.tabell.fodselsnummer" />
        </th>);

        const ddmmyyHeader = (<th className="tabell-element-center">
            <button
                onClick={() => this.settSorteringOgHentPortefolje('utlopsdato')}
                className={classNames('sortering-link', { valgt: sorterUtlopsdato })}
                aria-pressed={sorterUtlopsdato}
                aria-label={(sorterUtlopsdato && sorteringsrekkefolge !== 'ikke_satt') ?
                    sorteringsrekkefolge: 'inaktiv'}
            >
                <FormattedMessage id="portefolje.tabell.ddmmyy"/>
            </button>
        </th>);

        const visDiagram = diagramSkalVises(visningsmodus, filtervalg.ytelse);
        const visButtonGroup = ytelseFilterErAktiv(filtervalg.ytelse) && filtervalg.ytelse !== ytelsevalg.AAP_UNNTAK;

        return (
            <Innholdslaster avhengigheter={[portefolje]}>
                <Paginering
                    antallTotalt={antallTotalt}
                    fraIndex={fraIndex}
                    hentListe={(fra, antall) =>
                        hentPortefolje(valgtEnhet.enhet.enhetId, veileder,
                            sorteringsfelt, sorteringsrekkefolge, fra, antall, filtervalg)}
                    tekst={pagineringTekst}
                    sideStorrelse={PORTEFOLJE_SIDESTORRELSE}
                    visButtongroup={visButtonGroup}
                    antallReturnert={antallReturnert}
                />
                {
                    visDiagram ?
                        <Diagram
                            filtreringsvalg={filtervalg.ytelse}
                            brukere={brukere}
                        /> :
                        <table className="tabell portefolje-tabell typo-avsnitt">
                        <thead className="extra-head">
                            <tr>
                                <th />
                                <th>Bruker</th>
                                {utlopsdatoHeader}
                                <th />
                            </tr>
                        </thead>
                        <thead>
                            <tr>
                                <th>
                                    <div className="skjema__input">
                                        <input
                                            className="checkboks"
                                            id="checkbox-alle-brukere"
                                            type="checkbox"
                                            checked={alleMarkert}
                                            onClick={() => settSomMarkertAlle(!alleMarkert)}
                                        />
                                        <label className="skjema__label" htmlFor="checkbox-alle-brukere" />
                                    </div>
                                </th>
                                <th>
                                    <button
                                        onClick={this.settSorteringNavnOgHentPortefolje}
                                        role="button"
                                        className={classNames('sortering-link', { valgt: sorterEtternavn })}
                                        aria-pressed={sorterEtternavn}
                                        aria-label={sorterEtternavn && sorteringsrekkefolge !== 'ikke_satt' ?
                                            sorteringsrekkefolge : 'inaktiv'}
                                    >
                                        <FormattedMessage id="portefolje.tabell.navn" />
                                    </button>
                                </th>
                                {ytelseFilterErAktiv(filtervalg.ytelse) ? ddmmyyHeader : null}
                                {fodselsdatoHeader}
                                <th />
                            </tr>
                        </thead>

                            <tbody>
                                {brukere.filter((b) => b.veilederId === veileder.ident)
                                    .map((bruker) => <tr key={bruker.fnr}>
                                        <td>
                                            <div className="skjema__input">
                                                <input
                                                    className="checkboks"
                                                    id={`checkbox-${bruker.fnr}`}
                                                    type="checkbox"
                                                    checked={bruker.markert}
                                                    onClick={() => settMarkert(bruker.fnr, !bruker.markert)}
                                                />
                                                <label className="skjema__label" htmlFor={`checkbox-${bruker.fnr}`} />
                                            </div>
                                        </td>
                                        <th>
                                            <a
                                                href={`https://${window.location.hostname}` +// eslint-disable-line no-undef
                                                `/veilarbpersonflatefs/${bruker.fnr}?enhet=${valgtEnhet.enhet.enhetId}`}
                                                className="til-bruker-link"
                                            >
                                                {settSammenNavn(bruker)}
                                            </a>
                                        </th>
                                        {
                                            ytelseFilterErAktiv(filtervalg.ytelse) && bruker.utlopsdato !== null ?
                                            <Utlopsdatokolonne utlopsdato={bruker.utlopsdato}/>
                                            : null
                                        }
                                    {bruker.fnr !== null ?
                                        <td className="tabell-element-center">{bruker.fnr}</td> :
                                        <td className="ny-bruker-td"><span className="ny-bruker">Ny bruker</span></td>
                                    }
                                        <td>
                                            {bruker.sikkerhetstiltak.length > 0 ?
                                                <Tabelletiketter type="sikkerhetstiltak">
                                                    Sikkerhetstiltak
                                                </Tabelletiketter> : null}
                                            {bruker.diskresjonskode !== null ?
                                                <Tabelletiketter type="diskresjonskode">
                                                    {`Kode ${bruker.diskresjonskode}`}
                                                </Tabelletiketter> : null}
                                            {bruker.egenAnsatt === true ?
                                                <Tabelletiketter type="egen-ansatt">Egen ansatt</Tabelletiketter> : null}
                                            {bruker.erDoed === true ?
                                                <Tabelletiketter type="doed">Død</Tabelletiketter> : null}
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                }
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
    sorteringsfelt: PT.string.isRequired,
    fraIndex: PT.number,
    settMarkert: PT.func.isRequired,
    clearFeilendeTilordninger: PT.func.isRequired,
    settSomMarkertAlle: PT.func.isRequired,
    visningsmodus: PT.string.isRequired,
    filtervalg: filtervalgShape.isRequired,
    antall: PT.number
};

const mapStateToProps = (state) => ({
    portefolje: state.portefolje,
    valgtEnhet: state.enheter.valgtEnhet,
    sorteringsrekkefolge: state.portefolje.sorteringsrekkefolge,
    sorteringsfelt: state.portefolje.sorteringsfelt,
    visningsmodus: state.veilederpaginering.visningsmodus,
    filtervalg: state.filtreringVeileder
});

const mapDispatchToProps = (dispatch) => ({
    hentPortefolje: (enhet, ident, felt, rekkefolge, fra = 0, antall = 20, filtervalg) =>
        dispatch(hentPortefoljeForVeileder(enhet, ident, rekkefolge, felt, fra, antall, filtervalg)),
    settSortering: (rekkefolge, felt) => dispatch(settSortering(rekkefolge, felt)),
    settMarkert: (fnr, markert) => dispatch(settBrukerSomMarkert(fnr, markert)),
    clearFeilendeTilordninger: () => dispatch(nullstillFeilendeTilordninger()),
    settSomMarkertAlle: (markert) => dispatch(markerAlleBrukere(markert))
});

export default connect(mapStateToProps, mapDispatchToProps)(VeilederPortefoljeVisning);
