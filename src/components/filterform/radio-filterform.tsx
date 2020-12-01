import React, {useEffect, useState} from 'react';
import {Radio} from 'nav-frontend-skjema';
import './filterform.less';
import {FiltervalgModell} from '../../model-interfaces';
import VelgLukkKnapp from '../velg-lukk-knapp';
import NullstillValgKnapp from '../nullstill-valg-knapp';
import {useFeatureSelector} from '../../hooks/redux/use-feature-selector';
import {NULLSTILL_KNAPP} from '../../konstanter';
import {kebabCase} from '../../utils/utils';
import {endreFiltervalg} from '../../ducks/filtrering';
import {useDispatch} from 'react-redux';

interface ValgType {
    [key: string]: {label: string; className?: string};
}

interface RadioFilterformProps {
    form: string;
    closeDropdown: () => void;
    valg: ValgType;
    filtervalg: FiltervalgModell;
}

export function RadioFilterform({form, closeDropdown, valg, filtervalg}: RadioFilterformProps) {
    const [valgtFilterValg, setValgteFilterValg] = useState<string>(filtervalg[form]);
    const erNullstillFeatureTogglePa = useFeatureSelector()(NULLSTILL_KNAPP);
    const dispatch = useDispatch();

    useEffect(() => {
        setValgteFilterValg(filtervalg[form]);
    }, [filtervalg, form]);

    let reactKey = 1;
    return (
        <form
            className="skjema radio-filterform"
            onSubmit={e => {
                e.preventDefault();
                if (valgtFilterValg) {
                    dispatch(endreFiltervalg(form, valgtFilterValg));
                }
                closeDropdown();
            }}
        >
            <div className="radio-filterform__valg">
                {Object.keys(valg).map(v => (
                    <Radio
                        key={reactKey++}
                        label={valg[v].label}
                        value={v}
                        name={valg[v].label}
                        className={valg[v].className}
                        checked={valgtFilterValg === v}
                        onChange={e => setValgteFilterValg(e.target.value)}
                        data-testid={`radio-valg_${kebabCase(valg[v].label)}`}
                    />
                ))}
            </div>
            <div
                className={
                    erNullstillFeatureTogglePa ? 'filterform__under-valg__nullstill-feature' : 'filterform__under-valg'
                }
            >
                <VelgLukkKnapp
                    harValg={valgtFilterValg !== '' && valgtFilterValg !== null}
                    dataTestId="radio-filterform"
                />
                {erNullstillFeatureTogglePa && (
                    <NullstillValgKnapp
                        dataTestId="radio-filterform"
                        nullstillValg={() => dispatch(endreFiltervalg(form, null))}
                        form={form}
                    />
                )}
            </div>
        </form>
    );
}
