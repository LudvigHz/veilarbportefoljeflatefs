import React, {useState} from 'react';
import {Dictionary} from '../../utils/types/types';
import {FiltervalgModell} from '../../model-interfaces';
import AlertStripe from 'nav-frontend-alertstriper';
import './checkbox-filterform.less';

interface CheckboxFilterformProps {
    form: string;
    valg: Dictionary<string>;
    endreFilterValg: (form: string, filterVerdi: string[]) => void;
    closeDropdown: () => void;
    filtervalg: FiltervalgModell;
    columns?: number;
}

function FodselsdatoFilterform({
    endreFilterValg,
    valg,
    closeDropdown,
    form,
    filtervalg,
    columns = 1
}: CheckboxFilterformProps) {
    const harValg = Object.keys(valg).length > 0;

    const [checkBoxValg, setCheckBoxValg] = useState<string[]>(filtervalg[form]);

    const velgCheckBox = e => {
        e.persist();
        return e.target.checked
            ? setCheckBoxValg(prevState => [...prevState, e.target.value])
            : setCheckBoxValg(prevState => prevState.filter(value => value !== e.target.value));
    };

    return (
        <form
            className="skjema checkbox-filterform"
            onSubmit={e => {
                e.preventDefault();
                endreFilterValg(form, checkBoxValg);
                closeDropdown();
            }}
        >
            {harValg && (
                <div className="checkbox-filterform__valg fodselsdato__grid">
                    <RenderFields valg={valg} velgCheckBox={velgCheckBox} checkBoxValg={checkBoxValg} />
                </div>
            )}
            <div className="checkbox-filterform__under-valg">
                {checkBoxValg.length > 0 ? (
                    <button className="knapp knapp--mini knapp--hoved" type="submit">
                        Velg
                    </button>
                ) : (
                    <button className="knapp knapp--mini" type="button" onClick={closeDropdown}>
                        Lukk
                    </button>
                )}
                {!harValg && (
                    <AlertStripe type="info" className="checkbox-filterform__alertstripe">
                        Ingen veiledere funnet
                    </AlertStripe>
                )}
            </div>
        </form>
    );
}

function RenderFields(props: {valg: Dictionary<string>; velgCheckBox: (e) => void; checkBoxValg: string[]}) {
    return (
        <>
            {Object.entries(props.valg).map(([filterKey, filterValue]) => (
                <div key={filterKey} className="fodselsdato__container">
                    <input
                        id={filterKey}
                        type="checkbox"
                        className="fodselsdato__checkboks"
                        value={filterKey}
                        checked={props.checkBoxValg.includes(filterKey)}
                        onChange={props.velgCheckBox}
                    />
                    <label htmlFor={filterKey} className="fodselsdato__label">
                        {filterValue}
                    </label>
                </div>
            ))}
        </>
    );
}

export default FodselsdatoFilterform;
