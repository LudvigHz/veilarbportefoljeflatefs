import React from 'react';
import {Field, getIn} from 'formik';
import {Label, Textarea} from '@navikt/ds-react';

const KOMMENTAR_MAKS_LENGDE = 500;

interface FormikTekstAreaProps {
    name: string;
    index?: number;
}

function FormikTekstArea({name, index}: FormikTekstAreaProps) {
    const indexId = index ? `_${index}` : '';

    const validate = (value: string) => {
        let error: undefined | string;
        if (!value) {
            error = 'Du må fylle ut en kommentar';
        } else if (value.length > KOMMENTAR_MAKS_LENGDE) {
            error = `Du må korte ned teksten til ${KOMMENTAR_MAKS_LENGDE} tegn`;
        }
        return error;
    };

    return (
        <Field validate={validate} name={name}>
            {({field, form}) => {
                const touched = getIn(form.touched, name);
                const errors = getIn(form.errors, name);
                const feil = touched && errors ? errors : undefined;
                return (
                    <Textarea
                        id={name}
                        size="small"
                        label="Kommentar"
                        onChange={form.handleChange}
                        onBlur={form.handleBlur}
                        value={field.value}
                        name={name}
                        error={feil}
                        maxLength={500}
                        data-testid={`modal_arbeidsliste_kommentar${indexId}`}
                    />
                );
            }}
        </Field>
    );
}

export default FormikTekstArea;
