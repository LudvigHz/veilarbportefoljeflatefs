import * as React from 'react';
import {
    nesteUtlopsdatoEllerNull, utledValgteAktivitetsTyper
} from '../utils/utils';
import { ytelsevalg,
    VENTER_PA_SVAR_FRA_NAV,
    VENTER_PA_SVAR_FRA_BRUKER,
    UTLOPTE_AKTIVITETER,
    I_AVTALT_AKTIVITET } from '../filtrering/filter-konstanter';
import { filtervalgShape } from '../proptype-shapes';
import DatoKolonne from '../components/datokolonne';
import { FiltervalgModell } from '../model-interfaces';
import { Kolonne } from '../ducks/ui/listevisning';
import UkeKolonne from '../components/ukekolonne';

interface EnhetDatokolonnerProps {
    bruker: any;
    ytelse?: string;
    filtervalg: FiltervalgModell;
    valgteKolonner: Kolonne[];
}

function EnhetDatokolonner({ bruker, ytelse= '', filtervalg, valgteKolonner }: EnhetDatokolonnerProps) {
    const valgteAktivitetstyper = utledValgteAktivitetsTyper(bruker.aktiviteter, filtervalg.aktiviteter);
    const ytelseErValgtKolonne = valgteKolonner.includes(Kolonne.UTLOP_YTELSE);
    return (
        <div className="datokolonner__wrapper">
            <UkeKolonne
                ukerIgjen={bruker.dagputlopUke}
                minVal={2}
                skalVises={ytelseErValgtKolonne && (ytelse === ytelsevalg.DAGPENGER || ytelse === ytelsevalg.ORDINARE_DAGPENGER)}
            />
            <UkeKolonne
                ukerIgjen={bruker.permutlopUke}
                minVal={2}
                skalVises={ytelseErValgtKolonne && (ytelse === ytelsevalg.DAGPENGER_MED_PERMITTERING)}
            />
            <UkeKolonne
                ukerIgjen={bruker.aapmaxtidUke}
                minVal={12}
                skalVises={ytelseErValgtKolonne && (ytelse === ytelsevalg.AAP_MAXTID)}
            />
            <DatoKolonne
                dato={bruker.utlopsdato}
                skalVises={ytelseErValgtKolonne && [ytelsevalg.TILTAKSPENGER, ytelsevalg.AAP_UNNTAK, ytelsevalg.AAP].includes(ytelse)}
            />
            <DatoKolonne
                dato={bruker.venterPaSvarFraBruker}
                skalVises={filtervalg.brukerstatus === VENTER_PA_SVAR_FRA_BRUKER  && valgteKolonner.includes(Kolonne.VENTER_SVAR)}
            />
            <DatoKolonne
                dato={bruker.venterPaSvarFraNAV}
                skalVises={filtervalg.brukerstatus === VENTER_PA_SVAR_FRA_NAV && valgteKolonner.includes(Kolonne.VENTER_SVAR)}
            />
            <DatoKolonne
                dato={bruker.nyesteUtlopteAktivitet}
                skalVises={filtervalg.brukerstatus === UTLOPTE_AKTIVITETER && valgteKolonner.includes(Kolonne.UTLOPTE_AKTIVITETER)}
            />
            <DatoKolonne
                dato={nesteUtlopsdatoEllerNull(bruker.aktiviteter)}
                skalVises={filtervalg.brukerstatus === I_AVTALT_AKTIVITET && valgteKolonner.includes(Kolonne.AVTALT_AKTIVITET)}
            />
            <DatoKolonne
                dato={nesteUtlopsdatoEllerNull(valgteAktivitetstyper)}
                skalVises={!!valgteAktivitetstyper && filtervalg.tiltakstyper.length === 0  && valgteKolonner.includes(Kolonne.UTLOP_AKTIVITET)}
            />
        </div>
    );
}

export default EnhetDatokolonner;
