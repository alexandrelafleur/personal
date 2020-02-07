import * as React from "react";

// Utils
import { autobind } from "sdk/core/utils/decorators";

// Style
import styled from "styled-components";

const SwipeableDiv = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    width: 100%;
`;

export interface IProps {
    id: string;
    swiped: (id: string) => void;
}
export interface IState {
    swiped: boolean;
    offset: number;
    initialPosition: number;
}

export default class Swipeable extends React.Component<IProps, IState> {
    public state: IState = { swiped: false, offset: 0, initialPosition: 0 };
    private swipe: any = {};
    private minDistance: number = window.innerWidth * 0.65;

    @autobind
    private onTouchStart(e: React.TouchEvent) {
        this.swipe = { x: e.touches[0].clientX };
        this.setState({ swiped: false, initialPosition: e.changedTouches[0].screenX });
    }

    @autobind
    private onTouchMove(e: React.TouchEvent) {
        if (e.changedTouches && e.changedTouches.length) {
            this.swipe.swiping = true;
            this.setState({ offset: e.changedTouches[0].screenX - this.state.initialPosition });
        }
    }

    @autobind
    private onTouchEnd(e: React.TouchEvent) {
        const absX = Math.abs(e.changedTouches[0].clientX - this.swipe.x);
        const swiped = this.swipe.swiping ? absX > this.minDistance : false;

        this.setState({ swiped, offset: 0 }, () => {
            if (this.state.swiped) this.props.swiped(this.props.id);
        });
        this.swipe = {};
    }

    @autobind
    public render() {
        const { offset } = this.state;
        const divOpacity = offset < 0 ? 1 - Math.abs(offset / window.innerWidth) : 1;

        return (
            <SwipeableDiv
                style={{
                    marginLeft: offset < 0 ? offset : 0,
                    opacity: divOpacity,
                    display: this.state.swiped ? "none" : "default",
                }}
                onTouchStart={this.onTouchStart}
                onTouchMove={this.onTouchMove}
                onTouchEnd={this.onTouchEnd}
            >
                {this.props.children}
            </SwipeableDiv>
        );
    }
}
