import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { AppState } from '../../reducer';
import Innholdslaster from '../../innholdslaster/innholdslaster';
import { LeggTilKnapp } from '../../components/knapper/legg-til-knapp';
import VeilederGruppeInnhold from './veiledergrupper-innhold';
import './veileder-gruppe.less';
import { Normaltekst } from 'nav-frontend-typografi';
import VeilederGruppeModalLage from '../../modal/veiledergruppe/veileder-gruppe-modal-lage';

function FilteringVeilederGrupper() {
    const [veilederGruppeModal, setVeilederGruppeModal] = useState(false);

    const lagretFilterState = useSelector((state: AppState) => state.lagretFilter);
    const lagretFilter = lagretFilterState.data;

    return (
        <Innholdslaster avhengigheter={[lagretFilterState]}>
            {lagretFilter.length > 0
                ? <VeilederGruppeInnhold
                    lagretFilter={lagretFilter}
                    veilederGruppeModal={veilederGruppeModal}
                    setVeilederGruppeModal={setVeilederGruppeModal}
                />
                :
                <div className="veiledergruppe-emptystate">
                    <Normaltekst className="veiledergruppe-emptystate__tekst">Ingen lagrede veiledergrupper på enheten</Normaltekst>
                    <LeggTilKnapp onClick={() => {
                        setVeilederGruppeModal(true);}
                    }/>
                </div>
            }
            <VeilederGruppeModalLage
                isOpen={veilederGruppeModal}
                onRequestClose={() => setVeilederGruppeModal(false)}
            />
        </Innholdslaster>
    );
}

export default FilteringVeilederGrupper;
