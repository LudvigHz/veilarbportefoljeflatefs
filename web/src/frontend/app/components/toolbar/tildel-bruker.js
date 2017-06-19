import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import SokFilter from './sok-filter';
import Dropdown from './../dropdown/dropdown';
import RadioFilterform from './../radio-filterform/radio-filterform';
import { tildelVeileder } from './../../ducks/portefolje';

function TildelBruker({ tildelTilVeileder, veiledere, brukere }) {
    const valgteBrukere = brukere.filter((bruker) => bruker.markert === true);
    const aktiv = valgteBrukere.length > 0;

    const onSubmit = (_, ident) => {
        const tilordninger = valgteBrukere
            .map((bruker) => ({
                fraVeilederId: bruker.veilederId,
                tilVeilederId: ident,
                brukerFnr: bruker.fnr
            }));

        tildelTilVeileder(tilordninger, ident);
    };

    return (
        <Dropdown name="Tildel bruker" className="dropdown--fixed dropdown--toolbar" disabled={!aktiv}>
            <SokFilter
                label="Tildel brukere"
                placeholder="Tildel brukere"
                data={veiledere.data.veilederListe}
            >
                <TildelBrukerRenderer onSubmit={onSubmit} />
            </SokFilter>
        </Dropdown>
    );
}

function TildelBrukerRenderer({ onSubmit, data, ...props }) {
    const datamap = data.reduce((acc, element) => ({ ...acc, [element.ident]: { label: element.navn }}), {});
    return (
        <RadioFilterform
            form="veiledertildeling"
            valg={datamap}
            filtervalg={{ veiledervisning: undefined }}
            onSubmit={onSubmit}
            {...props}
        />
    );
}

const mapStateToProps = ({ veiledere, enheter, portefolje }) => ({
    veiledere,
    brukere: portefolje.data.brukere,
    veileder: enheter.valgtVeileder
});
const mapDispatchToProps = (dispatch, ownProps) => ({
    tildelTilVeileder: (...args) => dispatch(tildelVeileder(...args, ownProps.filtergruppe, ownProps.veileder))
});

export default connect(mapStateToProps, mapDispatchToProps)(TildelBruker);
