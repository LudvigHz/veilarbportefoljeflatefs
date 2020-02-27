import * as React from 'react';
import { Form, } from 'formik';
import { Hovedknapp } from 'nav-frontend-knapper';
import FormikTekstArea from '../../formik/formik-tekstarea';
import FormikInput from '../../formik/formik-input';
import FormikDatoVelger from '../../formik/formik-datovelger/formik-datovelger';
import { Undertekst, Undertittel } from 'nav-frontend-typografi';
import './arbeidsliste.less';
import ArbeidslisteKategori from './arbeidsliste-kategori';
import { BrukerModell } from '../../../model-interfaces';

interface RedigerArbeidslisteProps {
    sistEndretDato: Date;
    sistEndretAv?: string;
    laster: boolean;
    lukkModal: () => void;
    bruker: BrukerModell;
}

function RedigerArbeidsliste(props: RedigerArbeidslisteProps) {
    function label(bruker: BrukerModell): React.ReactNode {
        return (
            <Undertittel>
                {`${bruker.fornavn} ${bruker.etternavn}, ${bruker.fnr}`}
            </Undertittel>
        );
    }

    return (
        <Form>
            <div className="input-fields">
                <div className="nav-input blokk-s">
                    <legend>
                        {label(props.bruker)}
                    </legend>
                    <FormikInput name="overskrift"/>
                    <FormikTekstArea name="kommentar"/>
                    <Undertekst className="arbeidsliste--modal-redigering">
                        {`Oppdatert ${props.sistEndretDato.toLocaleDateString()} av ${props.sistEndretAv}`}
                    </Undertekst>
                </div>
                <div className="skjemaelement dato-kategori-wrapper">
                    <FormikDatoVelger name="frist" label="Frist"/>
                    <ArbeidslisteKategori name="kategori"/>
                </div>
                <div className="modal-footer">
                    <Hovedknapp htmlType="submit" className="knapp knapp--hoved" spinner={props.laster}>
                        Lagre
                    </Hovedknapp>
                    <button type="button" className="knapp" onClick={props.lukkModal}>
                        Avbryt
                    </button>
                </div>
            </div>
        </Form>
    );
}

export default RedigerArbeidsliste;
