import React, { useEffect, useRef } from 'react';
import {
    SidebarTabInfo,
    SidebarTabInfo as SidebarTabType,
    useSidebarViewStore
} from '../../store/sidebar/sidebar-view-store';
import classNames from 'classnames';
import './sidebar.less';
import { ReactComponent as StatusIkon } from '../ikoner/tab_status.svg';
import { ReactComponent as FilterIkon } from '../ikoner/tab_filter.svg';
import { ReactComponent as InfoFraBrukerIkon } from '../ikoner/tab_info-fra-bruker.svg';
import { ReactComponent as VeiledergruppeIkon } from '../ikoner/tab_veiledergrupper.svg';
import { FiltervalgModell } from '../../model-interfaces';
import { OrNothing } from '../../utils/types/types';
import { Tiltak } from '../../ducks/enhettiltak';
import { logEvent } from '../../utils/frontend-logger';
import SidebarTab from './sidebar-tab';
import { FiltreringStatus } from '../../filtrering/filtrering-status/filtrering-status';
import FiltreringFilter from '../../filtrering/filtrering-filter';
import { useDispatch } from 'react-redux';
import { pagineringSetup } from '../../ducks/paginering';
import { endreFiltervalg } from '../../ducks/filtrering';
import FilteringVeilederGrupper from '../../filtrering/filtrering-veileder-grupper/filtrering-veileder-grupper';
import FiltreringInformasjonOmBruker
    from '../../filtrering/filtrering-informasjon-fra-bruker/filtrering-informasjon-fra-bruker';

interface Sidebar {
    type: SidebarTabType;
    icon: React.ReactNode;
    tittel: string;
}

const sidebar: Sidebar[] = [
    {
        type: SidebarTabType.STATUS,
        icon: <StatusIkon/>,
        tittel: 'Status'
    }, {
        type: SidebarTabType.VEILEDERGRUPPER,
        icon: <VeiledergruppeIkon/>,
        tittel: 'Veiledergrupper'
    }, {
        type: SidebarTabType.INFORMASJON_OM_BRUKER,
        icon: <InfoFraBrukerIkon/>,
        tittel: 'Informasjon om bruker'
    }, {
        type: SidebarTabType.FILTER,
        icon: <FilterIkon/>,
        tittel: 'Filter'
    }
];

function finnTab(viewType: SidebarTabType, tabs: Sidebar[]): Sidebar | undefined {
    return tabs.find(t => t.type === viewType);
}

function mapTabTilView(tab: Sidebar, isSelected: boolean, onTabClicked: (tab: Sidebar) => void) {
    const classes = classNames('sidebar__tab', {'sidebar__tab-valgt': isSelected});
    return (
        <button className={classes} onClick={() => onTabClicked(tab)} key={tab.type}>
            <div className="sidebar__tab-ikon">{tab.icon}</div>
        </button>
    );
}

interface SidebarProps {
    filtervalg: FiltervalgModell;
    enhettiltak: OrNothing<Tiltak>;
    filtergruppe: string;
    isSidebarHidden: boolean;
    handleOnTabClicked: (tab: Sidebar, selectedTab: SidebarTabInfo) => void;
    lukkTab: () => void
}

function Sidebar(props: SidebarProps) {
    const {selectedTab, setSelectedTab} = useSidebarViewStore();
    const sidebarRef = useRef<HTMLDivElement>(null);
    const selectedTabData = finnTab(selectedTab, sidebar);

    function handleOnTabClicked(tab: Sidebar) {
        setSelectedTab(tab.type);
        props.handleOnTabClicked(tab, selectedTab);
        logEvent('portefolje.metrikker.sidebar-tab', {tab: tab.type,});
    }

    const dispatch = useDispatch();

    const doEndreFiltervalg = (filterId: string, filterVerdi: any) => {
        dispatch(pagineringSetup({side: 1}));
        dispatch(endreFiltervalg(filterId, filterVerdi, props.filtergruppe));
    };

    function sidevelger(selectedTabData) {
        if ((selectedTabData as Sidebar).tittel === 'Status') {
            return <SidebarTab tittel="Status"
                               handleClick={props.lukkTab}
                               children={<FiltreringStatus
                                   filtergruppe={props.filtergruppe}
                                   filtervalg={props.filtervalg}/>
                               }/>;
        } else if ((selectedTabData as Sidebar).tittel === 'Informasjon om bruker') {
            return <SidebarTab tittel="Informasjon fra bruker"
                               handleClick={props.lukkTab}
                               children={
                                   <FiltreringInformasjonOmBruker
                                       filtervalg={props.filtervalg}
                                       endreFiltervalg={doEndreFiltervalg}
                                   />
                               }/>;
        } else if ((selectedTabData as Sidebar).tittel === 'Filter') {
            return <SidebarTab tittel="Filter"
                               handleClick={props.lukkTab}
                               children={<FiltreringFilter
                                   endreFiltervalg={doEndreFiltervalg}
                                   filtervalg={props.filtervalg}
                                   enhettiltak={props.enhettiltak}/>
                               }/>;
        } else if ((selectedTabData as Sidebar).tittel === 'Veiledergrupper') {
            return <SidebarTab tittel="Veiledergrupper"
                               handleClick={props.lukkTab}
                               children={<FilteringVeilederGrupper
                                   filtergruppe={props.filtergruppe}/>
                               }/>;
        }
    }

    useEffect(() => {
        setSelectedTab(selectedTab);
    }, [setSelectedTab, selectedTab]);

    const tabs = () => {
        const viseVeiledergrupper = tab => tab.type === SidebarTabType.VEILEDERGRUPPER;
        const erIkkePaEnhetensOversikt = props.filtergruppe === 'veileder';

        if (erIkkePaEnhetensOversikt) {
            return sidebar.filter(tab => erIkkePaEnhetensOversikt && !viseVeiledergrupper(tab))
                .map(tab => mapTabTilView(tab, tab.type === (selectedTabData as Sidebar).type, handleOnTabClicked));
        } else {
            return sidebar.map(tab => mapTabTilView(tab, tab.type === (selectedTabData as Sidebar).type, handleOnTabClicked));
        }
    };

    return (
        <div ref={sidebarRef}
             className={classNames('sidebar', props.isSidebarHidden && 'sidebar__hidden')}>
            <div className="sidebar__tab-container">
                {tabs()}
            </div>
            <div
                className='sidebar__content-container'
                hidden={props.isSidebarHidden}
            >
                {sidevelger(selectedTabData)}
            </div>
        </div>
    );
}

export default Sidebar;