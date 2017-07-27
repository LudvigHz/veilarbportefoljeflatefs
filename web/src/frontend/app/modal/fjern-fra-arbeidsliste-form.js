import React, { PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Element } from 'nav-frontend-typografi';
import { reduxForm } from 'redux-form';
import { slettArbeidsliste } from '../ducks/arbeidsliste';
import { oppdaterArbeidslisteForBruker } from '../ducks/portefolje';
import { brukerShape } from '../proptype-shapes';
import { leggTilStatustall } from '../ducks/statustall';

function brukerLabel(bruker) {
    return (
        <li key={bruker.fnr}>
            <Element className="blokk-xs">
                <FormattedMessage
                    id="modal.legg.til.arbeidsliste.brukerinfo"
                    values={{
                        etternavn: bruker.etternavn,
                        fornavn: bruker.fornavn,
                        fnr: bruker.fnr
                    }}
                />
            </Element>
        </li>
    );
}


function FjernFraArbeidslisteForm({ lukkModal, valgteBrukere, handleSubmit }) {
    return (
        <form onSubmit={handleSubmit}>
            <ul>
                { valgteBrukere.map((bruker) => brukerLabel(bruker)) }
            </ul>
            <div>
                <button
                    type="submit"
                    className="knapp knapp--hoved"
                    onClick={handleSubmit}
                >
                    <FormattedMessage id="modal.knapp.bekreft" />
                </button>
                <button type="button" className="knapp" onClick={lukkModal}>
                    <FormattedMessage id="modal.knapp.avbryt" />
                </button>
            </div>
        </form>
    );
}

const FjernFraArbeidslisteReduxForm = reduxForm({
    form: 'fjern-fra-arbeidsliste-form'
})(FjernFraArbeidslisteForm);

FjernFraArbeidslisteForm.propTypes = {
    lukkModal: PT.func.isRequired,
    valgteBrukere: PT.arrayOf(brukerShape).isRequired,
    handleSubmit: PT.func.isRequired
};


function prepareForDispatch(arbeidsliste) {
    return arbeidsliste.map((a) => ({
        ...a,
        arbeidslisteAktiv: false
    }));
}
const mapDispatchToProps = () => ({
    onSubmit: (formData, dispatch, props) => {
        const arbeidsliste = props.valgteBrukere.map((bruker) => ({
            fnr: bruker.fnr,
            kommentar: bruker.arbeidsliste.kommentar,
            frist: bruker.arbeidsliste.frist
        }));
        slettArbeidsliste(arbeidsliste)(dispatch)
            .then((res) => leggTilStatustall('minArbeidsliste', -res.data.data.length)(dispatch))
            .then(() => oppdaterArbeidslisteForBruker(prepareForDispatch(arbeidsliste))(dispatch));
        props.lukkModal();
    }
});

export default connect(null, mapDispatchToProps)(FjernFraArbeidslisteReduxForm);

