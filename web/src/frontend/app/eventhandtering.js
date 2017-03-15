import { velgEnhetForVeileder } from './ducks/enheter';
import { store } from './index';
import { hentVeiledereForEnhet } from './ducks/veiledere';
import { hentPortefoljeForEnhet } from './ducks/portefolje';
import { hentPortefoljeStorrelser } from './ducks/portefoljestorrelser';

const hentOgDispatchAllInformasjonOmEnhet = (enhet) => {
    store.dispatch(velgEnhetForVeileder(enhet));
    store.dispatch(hentPortefoljeForEnhet(enhet));
    store.dispatch(hentVeiledereForEnhet(enhet));
    store.dispatch(hentPortefoljeStorrelser(enhet));
};

const handleChangeEnhet = (enhet) => {
    hentOgDispatchAllInformasjonOmEnhet(enhet);
};

const getConfig = (initiellEnhet = undefined) => {
    const config = {
        config: {
            toggles: {
                visEnhet: false,
                visEnhetVelger: true,
                visSokefelt: true,
                visSaksbehandler: true
            },
            handleChangeEnhet,
            initiellEnhet,
            applicationName: 'Oppfølging'
        }
    };
    return config;
};

export default () => {
    window.renderDecoratorHead(getConfig());
};


export const settEnhetIDekorator = (initiellEnhet) => {
    window.renderDecoratorHead(getConfig(initiellEnhet));
};
