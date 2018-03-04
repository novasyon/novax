import React from 'react';
import {
    PanResponder,
    View,
    Animated,
    Dimensions
} from 'react-native';
import {Button,Icon} from 'native-base'



const SCREEN_WIDTH = Dimensions.get('window').width;
const SWIPE_THRESHOLD = 0.25 * SCREEN_WIDTH;
const SWIPE_OUT_DURATION = 250;

class Deck extends React.Component {

    static defaultProps = {

        onSwipeRight: () => { },
        onSwipeLeft: () => { }

    }


    constructor(props) {
        console.log("Deck Constructor");
        super(props);
        const position = new Animated.ValueXY();
        const panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (event, gesture) => {
                position.setValue({ x: gesture.dx, y: gesture.dy })
            },
            onPanResponderRelease: (event, gesture) => {
                console.log("onResponderRelease");
                if (gesture.dx > SWIPE_THRESHOLD) {
                    console.log("swipe right");
                    this.forceSwipe('right');
                } else if (gesture.dx < -SWIPE_THRESHOLD) {
                    console.log("swipe left");
                    this.forceSwipe('left');
                } else {
                    this.resetPosition();
                }

            }
        });



        this.state = { panResponder, position, index: 0 };

    }

    onSwipeComplete(direction) {
        const { onSwipeRight, onSwipeLeft, data } = this.props;
        const item = data[this.state.index];
        let currentIndex = this.state.index;

        direction === 'right' ? onSwipeRight() : onSwipeLeft();

        this.state.position.setValue({ x: 0, y: 0 });

        //direction === 'right' ? currentIndex++ : currentIndex--
        if(direction==='right'){
            currentIndex++;
        }else{
            currentIndex > 0 ? currentIndex--:currentIndex=0
        }
        this.setState({ index: currentIndex });

    }

    forceSwipe(direction) {

        const x = direction === 'right' ? SCREEN_WIDTH : -SCREEN_WIDTH;
        Animated.timing(this.state.position, {
            toValue: { x: x, y: 0 },
            duration: SWIPE_OUT_DURATION
        }).start(() => { this.onSwipeComplete(direction) });

    }



    resetPosition() {
        Animated.spring(this.state.position, {
            toValue: { x: 0, y: 0 }
        }).start();
    }

    getCardStyle() {

        const { position } = this.state;
        const rotate = position.x.interpolate({
            inputRange: [-SCREEN_WIDTH * 1.5, 0, SCREEN_WIDTH * 1.5],
            outputRange: ['-120deg', '0deg', '120deg']
        })
        return {
            ...position.getLayout()
            //transform: [{ rotate }]
        }
    }

    renderCards() {
        return this.props.data.map((item, i) => {

            if (i < this.state.index) { return null }

            if (i === this.state.index) {

                return (<Animated.View
                    key={item.id}
                    style={this.getCardStyle()}
                    {...this.state.panResponder.panHandlers}>
                    {this.props.renderCard(item)}
                </Animated.View>);

            }

            //return this.props.renderCard(item);
        }
        );
    }

    render() {
        return (
            <View>
                {this.renderCards()}
            </View>
        );
    }
}

export default Deck;