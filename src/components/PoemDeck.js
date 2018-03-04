import React from 'react';
import { View, Animated, Text } from 'react-native';
import Deck from './Deck.js'
import { Card, List} from 'react-native-elements';
import {Button,Icon} from 'native-base'

class PoemDeck extends React.Component {

    renderCard(poem) {


        if (poem.image !== 'en') {
            return (
                <Card
                    key={poem.id}
                    title={poem.title}
                    image={{ uri: 'http://novasyon.net/images/poem/' + poem.image }}>
                    <Text style={{ marginBottom: 10 }} numberOfLines={3} ellipsizeMode={"tail"}>
                        {poem.poem_txt}
                    </Text>
                    <View style={{flex: 1, flexDirection: 'row'}}>
                        <Button transparent>
                            <Icon name="arrow-back" />
                        </Button>
                        <Text>View</Text>
                        <Button transparent>
                            <Icon name="arrow-forward" />
                        </Button>
                    </View>
                </Card>
            );
        } else {
            return (
                <Card
                    key={poem.id}
                    title={poem.title}>
                    <Text style={{ marginBottom: 10 }} numberOfLines={3} ellipsizeMode={"tail"}>
                        {poem.poem_txt}
                    </Text>
                </Card>
            );
        }
    }


    render() {
        return (<Deck
            data={this.props.poems}
            renderCard={this.renderCard}
        />);
    }

}

export default PoemDeck;