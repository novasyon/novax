import React from "react";
import { View, FlatList, VirtualizedList, Dimensions, Image,TouchableOpacity } from "react-native";
import { Card,Icon } from 'react-native-elements';
import { Button,Text } from 'native-base'

let currentIndex = 0;
const SCREEN_WIDTH = Dimensions.get('window').width;

class JokeCards extends React.Component {



    constructor(props) {
        super(props);
        this.state = { index: 0 }

        console.log("Language==", this.props.language);
    }

    getItemLayout = (data, index) => (
        { length: SCREEN_WIDTH, offset: SCREEN_WIDTH * index, index }
    )


    next = () => {

        if (currentIndex < (this.props.data.length - 1)) {
            currentIndex++
            this.flatListRef.scrollToIndex({ animated: true, index: currentIndex });
        }
        this.setState({ index: currentIndex });
    }

    prev = () => {

        //console.log("Length=", this.props.data.length, "Prev CurrentIndex=", currentIndex);
        if (currentIndex > 0) {
            currentIndex--
            this.flatListRef.scrollToIndex({ animated: true, index: currentIndex });
        }
        this.setState({ index: currentIndex });
    }


    _keyExtractor = (item, index) => item.id;

    goToDetail(item) {

        this.props.navigation.navigate("JokeDetail", { id: item.id, title: item.title, isHome: true })

    }

    _renderJoke = ({ item, index }) => {

        if (item.image !== 'en' && item.image !== 'es' && item.image !== 'fr' && item.image !== 'ht') {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => { this.goToDetail(item) }}>
                    <Card
                        style={{width: SCREEN_WIDTH, backgroundColor: '#fff' }}
                        titleStyle={{padding:5,marginTop:5}}
                        //dividerStyle={{backgroundColor:'#fff'}}
                        key={item.id}
                        title={this.props.language.title}
                        image={{ uri: 'http://novasyon.net/images/poem/' + item.image }}
                    >
                        <Text onPress={() => { this.goToDetail(item) }} style={{ paddingLeft:10,color: '#64b5f6' }}>{item.title}</Text>
                        <Text note style={{ paddingLeft:10,fontSize: 12 }}>{this.props.language.field_author_name} {item.author}</Text>

                        <Text style={{ padding:10,fontSize: 14, marginTop: 10, marginBottom: 5 }} numberOfLines={3} ellipsizeMode={"tail"}>
                            {item.text}
                        </Text>
                        <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                            <Button transparent onPress={this.prev}>
                            <Icon name="chevron-left" type='entypo' color='#2a5fc6' />
                            </Button>
                            <Button transparent onPress={() => { this.goToDetail(item) }}>
                                <Text>{this.props.language.view_title}</Text>
                            </Button>

                            <Button transparent onPress={this.next}>
                            <Icon name="chevron-right" type='entypo' color='#2a5fc6' />
                            </Button>
                        </View>
                    </Card>
                </TouchableOpacity>
            )
        }
        return (
            <TouchableOpacity activeOpacity={1} onPress={() => { this.goToDetail(item) }}>
            <Card
                style={{width: SCREEN_WIDTH, backgroundColor: '#fff'}}
                titleStyle={{padding:5,marginTop:5}}
                //dividerStyle={{backgroundColor:'#fff'}}
                key={item.id}
                title={this.props.language.title}
            >
                <Text onPress={() => { this.goToDetail(item) }} style={{paddingLeft:10,color: '#64b5f6' }}>{item.title}</Text>
                <Text note style={{paddingLeft:10,fontSize: 12 }}>{this.props.language.field_authot_name} {item.author}</Text>

                <Text style={{ padding:10,fontSize: 14, marginTop: 10, marginBottom: 5 }} numberOfLines={3} ellipsizeMode={"tail"}>
                    {item.text}
                </Text>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>

                    <Button transparent onPress={this.prev}>
                    <Icon name="chevron-left" type='entypo' color='#2a5fc6' />
                    </Button>
                    <Button transparent onPress={() => { this.goToDetail(item) }}>
                        <Text>{this.props.language.view_title}</Text>
                    </Button>

                    <Button transparent onPress={this.next}>
                    <Icon name="chevron-right" type='entypo' color='#2a5fc6' />
                    </Button>
                </View>
            </Card>
            </TouchableOpacity>
        )
    }

    onScrollEnd(e) {
        let contentOffset = e.nativeEvent.contentOffset;
        let viewSize = e.nativeEvent.layoutMeasurement;

        // Divide the horizontal offset by the width of the view to see which page is visible
        let pageNum = Math.floor(contentOffset.x / viewSize.width);
        //console.log('scrolled to page ', pageNum);
        currentIndex = pageNum;
    }



    render() {


        return (
            <View>
                <FlatList
                    data={this.props.data}
                    pagingEnabled={true}
                    ref={(ref) => { this.flatListRef = ref; }}
                    getItemLayout={this.getItemLayout}
                    keyExtractor={this._keyExtractor}
                    horizontal={true}
                    renderItem={this._renderJoke}
                    onMomentumScrollEnd={this.onScrollEnd}
                    {...this.props}
                />
            </View>
        );

    }

}

export default JokeCards;
