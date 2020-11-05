import * as React from 'react';
import {Input} from 'nav-frontend-skjema';
import {useDispatch, useSelector} from 'react-redux';
import {endreFiltervalg} from '../ducks/filtrering';
import VeilederCheckboxListe from '../components/veileder-checkbox-liste/veileder-checkbox-liste';
import {ListevisningType} from '../ducks/ui/listevisning';
import {useRef, useState} from 'react';
import {useEventListener} from '../hooks/use-event-listener';
import {AppState} from '../reducer';

function FiltreringVeiledere() {
    const [hasFocus, setHasFocus] = useState(false);

    const veilederNavnQuerySelector = useSelector(
        (state: AppState) => state.filtreringVeilederoversikt.veilederNavnQuery
    );
    const [veilederNavnQuery, setVeilederNavnQuery] = useState(veilederNavnQuerySelector);

    const wrapperRef = useRef<HTMLDivElement>(null);
    const dispatch = useDispatch();

    const handleClickOutside = e => {
        if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
            setHasFocus(false);
        }
    };

    useEventListener('mousedown', handleClickOutside);

    const handleChange = event => {
        const nyQuery = event.target.value;
        setVeilederNavnQuery(nyQuery);
        dispatch(endreFiltervalg('veilederNavnQuery', nyQuery, ListevisningType.veilederOversikt));
    };

    return (
        <div className="filtrering-veiledere" ref={wrapperRef}>
            <Input
                label=""
                placeholder="Navn eller NAV-ident"
                onChange={e => handleChange(e)}
                value={veilederNavnQuery}
                onFocus={() => setHasFocus(true)}
                data-testid="veilederoversikt_sok-veileder-input"
            />
            {hasFocus && (
                <VeilederCheckboxListe
                    open={hasFocus}
                    onSubmit={() => setHasFocus(false)}
                    onClose={() => setHasFocus(false)}
                />
            )}
        </div>
    );
}

export default FiltreringVeiledere;
