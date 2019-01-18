import * as React from 'react';
import { connect } from 'react-redux';
import Ekspanderbartpanel from 'nav-frontend-ekspanderbartpanel';
import FiltreringStatus from './filtrering-status';
import { endreFiltervalg } from '../ducks/filtrering';
import { EnhetModell, FiltervalgModell, VeilederModell } from '../model-interfaces';
import FiltreringNavnOgFnr from './filtrering-navnellerfnr';
import FiltreringFilter from './filtrering-filter';
import FiltreringFilterVenstreToggle from './filtrering-filter-venstre-toggle';
import { sjekkFeature } from '../ducks/features';
import { FLYTT_FILTER_VENSTRE } from '../konstanter';
import FiltreringNavnellerfnrVenstreToggle from './filtrering-navnellerfnr-venstre-toggle';

const defaultVeileder: VeilederModell = {
    ident: '',
    navn: '',
    fornavn: '',
    etternavn: ''
};

interface FiltreringContainerProps {
    enhettiltak: EnhetModell;
    filtervalg: FiltervalgModell;
    filtergruppe?: string;
    flyttFilterVenstreToggle: boolean;
    veileder: VeilederModell;
    actions: {
        endreFiltervalg: (filterId: string, filterVerdi: string) => void;
    };
}

function FiltreringContainer({ filtergruppe, filtervalg, veileder= defaultVeileder, actions, enhettiltak, flyttFilterVenstreToggle }: FiltreringContainerProps) {
    return (
        <div className="blokk-m">
            <Ekspanderbartpanel
                apen
                className="blokk-xxxs"
                tittel="Status"
                tittelProps="undertittel"
            >
                <FiltreringStatus
                    filtergruppe={filtergruppe}
                    veileder={veileder}
                    filtervalg={filtervalg}
                />
            </Ekspanderbartpanel>
            <Ekspanderbartpanel
                apen={filtergruppe !== 'veileder'}
                className="blokk-xxxs"
                tittel="Filter"
                tittelProps="undertittel"
            >
                {flyttFilterVenstreToggle ?
                    (<FiltreringFilterVenstreToggle
                        actions={actions}
                        filtervalg={filtervalg}
                        enhettiltak={enhettiltak}
                    />)
                    :
                    (<FiltreringFilter
                        actions={actions}
                        filtervalg={filtervalg}
                        enhettiltak={enhettiltak}
                    />)
                }
            </Ekspanderbartpanel>
            <Ekspanderbartpanel
                apen
                className="blokk-xxxs"
                tittel="Søk"
                tittelProps="undertittel"
            >
                {flyttFilterVenstreToggle ?
                    (<FiltreringNavnellerfnrVenstreToggle
                        filtervalg={filtervalg}
                        actions={actions}
                    />)
                    :
                    (<FiltreringNavnOgFnr
                        filtervalg={filtervalg}
                        actions={actions}
                    />)
                }
            </Ekspanderbartpanel>
        </div>
    );
}

const mapStateToProps = (state) => ({
    flyttFilterVenstreToggle: sjekkFeature(state, FLYTT_FILTER_VENSTRE)
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    actions: {
        endreFiltervalg: (filterId: string, filterVerdi: string) => {
            dispatch(endreFiltervalg(filterId, filterVerdi, ownProps.filtergruppe, ownProps.veileder && ownProps.veileder.ident));
        }
    }
});

export default connect(mapStateToProps, mapDispatchToProps)(FiltreringContainer);