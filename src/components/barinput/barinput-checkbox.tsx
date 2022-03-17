import React, {ChangeEventHandler} from 'react';
import {mapFilternavnTilFilterValue} from '../../filtrering/filter-konstanter';
import './bar.less';
import {Label} from '@navikt/ds-react';

interface BarInputCheckboxProps {
    filterNavn: string;
    handleChange: ChangeEventHandler<HTMLInputElement>;
    checked: boolean;
    antall: number;
    labelTekst?: React.ReactNode;
}

function BarInputCheckbox({filterNavn, handleChange, checked, antall}: BarInputCheckboxProps) {
    const filterVerdi = mapFilternavnTilFilterValue[filterNavn];

    return (
        <div className="barinput-checkbox">
            <input
                data-testid={`filter_checkboks-container_${filterNavn}`}
                type="checkbox"
                name="ferdigfilter"
                id={filterNavn}
                value={filterVerdi}
                onChange={handleChange}
                checked={checked}
                className="barinput-checkbox__input"
            />
            {(antall || antall === 0) && (
                <Label className="barlabel__antall" size="small">
                    {antall}
                </Label>
            )}
        </div>
    );
}

export default BarInputCheckbox;
