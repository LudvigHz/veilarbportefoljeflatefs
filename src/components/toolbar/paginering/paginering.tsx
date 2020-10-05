import React from 'react';
import {connect} from 'react-redux';
import {HoyreChevron, VenstreChevron} from 'nav-frontend-chevron';
import classNames from 'classnames';
import KnappPanel from './knapp-panel';
import {pagineringSetup} from '../../../ducks/paginering';
import {selectSeAlle, selectSide, selectSideStorrelse} from './paginering-selector';
import './paginering.less';

interface StateProps {
    side: number;
    sideStorrelse: number;
    seAlle: boolean;
}

interface DispatchProps {
    endrePaginering: (side: number, seAlle: boolean) => void;
}

interface OwnProps {
    className: string;
    antallTotalt: number;
    onChange?: (fra?: number, til?: number) => void;
}

type PagineringProps = StateProps & OwnProps & DispatchProps;

function Paginering(props: PagineringProps) {
    const {
        className,
        onChange,
        side,
        sideStorrelse,
        antallTotalt,
        seAlle,
        endrePaginering
    } = props;

    const antallSider: number = Math.ceil(antallTotalt / sideStorrelse);
    const erPaForsteSide: boolean = side === 1;
    const erPaSisteSide: boolean = side >= antallSider;

    const totalPaginering = (sideNumber: number, seAlleBool: boolean): void => {
        endrePaginering(sideNumber, seAlleBool);
        if (onChange) {
            onChange();
        }
    };

    return (
        <div className={classNames('paginering', className)}>
            <KnappPanel
                disabled={!seAlle && antallTotalt <= sideStorrelse}
                pressed={seAlle && antallTotalt <= sideStorrelse}
                onClick={() => totalPaginering(1, !seAlle)}
                data-testid={!seAlle ? "se-alle_knapp" : "se-faerre_knapp"}
            >
                {!seAlle
                    ? 'Se alle'
                    : 'Se færre'
                }
            </KnappPanel>

            <KnappPanel disabled={erPaForsteSide}
                        onClick={() => totalPaginering(side - 1, seAlle)}
                        data-testid="paginering_venstre"
            >
                <VenstreChevron/>
            </KnappPanel>

            {!erPaForsteSide &&
            <KnappPanel
                onClick={() => totalPaginering(1, seAlle)}
                data-testid='paginering-tall_1'
            >1</KnappPanel>}

            <KnappPanel data-testid={`paginering-tall_${side}`} selected={true}>
                <strong>{side}</strong>
            </KnappPanel>

            {(!erPaSisteSide && !seAlle) &&
            <KnappPanel
                onClick={() => totalPaginering(antallSider, seAlle)}
                data-testid={`paginering-tall_${antallSider}`}
            >
                {antallSider}
            </KnappPanel>}

            <KnappPanel disabled={erPaSisteSide || seAlle}
                        onClick={() => totalPaginering(side + 1, seAlle)}
                        data-testid="paginering_hoyre"
            >
                <HoyreChevron/>
            </KnappPanel>
        </div>
    );
}

const mapStateToProps = (state): StateProps => {
    return ({
        side: selectSide(state),
        sideStorrelse: selectSideStorrelse(state),
        seAlle: selectSeAlle(state),
    });
};

const mapDispatchToProps = (dispatch, props: OwnProps) => ({
    endrePaginering: (side, seAlle) => dispatch(pagineringSetup({side, seAlle}))
});

export default connect(mapStateToProps, mapDispatchToProps)(Paginering);
