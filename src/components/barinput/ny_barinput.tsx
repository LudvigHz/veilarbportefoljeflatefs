import React from 'react';
import {guid} from 'nav-frontend-js-utils';
import './barlabel.less';
import NyBarlabel from './ny_barlabel';

interface BarInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    labelTekst: React.ReactNode;
    antall: number;
    barClassname: string;
}

function NyBarInput({labelTekst, antall, max, barClassname, ...props}: BarInputProps) {
    const htmlFor = props.id || guid();
    return (
        <div className="skjema__input">
            <input {...props} data-testid={`filter_checkboks-container_${barClassname}`} />
            <NyBarlabel
                htmlFor={htmlFor}
                labelTekst={labelTekst}
                antall={antall}
                className={`${barClassname} skjemaelement__label`}
            />
        </div>
    );
}

export default NyBarInput;
