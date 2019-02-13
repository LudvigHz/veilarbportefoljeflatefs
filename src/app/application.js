import React, { Component, PropTypes as PT } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import { IntlProvider, addLocaleData } from 'react-intl';
import nb from 'react-intl/locale-data/nb';
import queryString from 'query-string';
import Innholdslaster from './innholdslaster/innholdslaster';
import rendreDekorator from './eventhandtering';
import { settSide } from './ducks/ui/side';
import history from './history';
import { enhetShape, valgtEnhetShape, veiledereShape } from './proptype-shapes';
import EnhetContext from './components/enhet-context/enhet-context';
import tekstBundle from './../../tekster-built/bundle';
import { sjekkFeature } from './ducks/features';
import { FLYTT_FILTER_VENSTRE } from './konstanter';
import TilbakemeldingFab from './components/tilbakemelding/tilbakemelding-fab';

function mapTeksterTilNokkelDersomAngitt(ledetekster) {
    const skalViseTekstnokkel = queryString.parse(location.search).vistekster; // eslint-disable-line no-undef
    if (skalViseTekstnokkel) {
        return Object.keys(ledetekster).reduce((obj, curr) => ({ ...obj, [curr]: curr }), {});
    }
    return ledetekster;
}

addLocaleData(nb);

class Application extends Component {

    componentWillMount() {
        rendreDekorator();
    }

    componentDidMount() {
        this.oppdaterSideState();
        const pathname = location.pathname;// eslint-disable-line no-undef
        if (pathname === '/veilarbportefoljeflatefs/' ||
            pathname === '/veilarbportefoljeflatefs') {
            history.push('/enhet');
        }
    }

    oppdaterSideState() {
        const { routes } = this.props;
        const lastFragment = routes[routes.length - 1].path;

        if (this.props.side !== lastFragment) {
            this.props.settSide(lastFragment);
        }
    }

    render() {
        const { enheter, children, veiledere, flyttFilterTilVenstre } = this.props;

        return (
            <IntlProvider
                defaultLocale="nb"
                locale="nb"
                messages={mapTeksterTilNokkelDersomAngitt(tekstBundle.nb)}
            >
                <div className="portefolje">
                    <Innholdslaster avhengigheter={[enheter, enheter.valgtEnhet, veiledere]}>
                        <EnhetContext />
                        <div
                            className={classnames({ container: !flyttFilterTilVenstre }, 'maincontent', 'side-innhold')}
                        >
                            {children}
                        </div>
                        <TilbakemeldingFab />
                    </Innholdslaster>
                </div>
            </IntlProvider>
        );
    }
}

Application.propTypes = {
    settSide: PT.func.isRequired,
    routes: PT.arrayOf(PT.object).isRequired,
    side: PT.string.isRequired,
    flyttFilterTilVenstre: PT.bool,
    children: PT.oneOfType([PT.arrayOf(PT.node), PT.node]),
    enheter: PT.shape({
        data: PT.arrayOf(enhetShape).isRequired,
        valgtEnhet: valgtEnhetShape.isRequired,
        ident: PT.string,
        status: PT.string.isRequired
    }).isRequired,
    veiledere: PT.shape({
        status: PT.string.isRequired,
        data: veiledereShape.isRequired,
        veiledereITabell: PT.arrayOf(veiledereShape)
    }).isRequired
};

const mapStateToProps = (state) => ({
    side: state.ui.side.side,
    flyttFilterTilVenstre: sjekkFeature(state, FLYTT_FILTER_VENSTRE)
});

const mapDispatchToProps = (dispatch) => ({
    settSide: (side) => dispatch(settSide(side))
});

export default connect(mapStateToProps, mapDispatchToProps)(Application);
