import React from "react";
import { View, FlatList, VirtualizedList, Dimensions, Image, TouchableOpacity } from "react-native";
import { Card, Icon } from 'react-native-elements';
import { Button, Text } from 'native-base'

let currentIndex = 0;
const SCREEN_WIDTH = Dimensions.get('window').width;

class PoemCards extends React.Component {



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

        this.props.navigation.navigate("PoemDetail", { id: item.id, title: item.title, isHome: true })

    }

    _renderPoem = ({ item, index }) => {

        if (item.image !== 'en'&& item.image !== 'en' && item.image !== 'es' && item.image !== 'fr' && item.image !== 'ht') {
            return (
                <TouchableOpacity activeOpacity={1} onPress={() => { this.goToDetail(item) }}>
                    <Card
                        style={{ marginBottom: 5, width: SCREEN_WIDTH, backgroundColor: '#fff' }}
                        //titleStyle={{backgroundColor:'#ebebeb'}}
                        //dividerStyle={{backgroundColor:'#ebebeb'}}
                        key={item.id}
                        title={this.props.language.title}
                        //imageStyle={{padding:10,flex:1,marginLeft:30,justifyContent:'center',width:300}}
                        //imageWrapperStyle={{marginTop:0,justifyContent:'center'}}
                        image={{ uri: 'http://novasyon.net/images/poem/' + item.image }}
                    >
                        <Text onPress={() => { this.goToDetail(item) }} style={{ color: '#64b5f6' }}>{item.title}</Text>
                        <Text note style={{ fontSize: 12 }}>{item.author}</Text>

                        <Text style={{ padding: 10, fontSize: 14, marginBottom: 5 }} numberOfLines={3} ellipsizeMode={"tail"}>
                            {item.poem_txt}
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
                    style={{ width: SCREEN_WIDTH, backgroundColor: '#fff' }}
                    titleStyle={{ padding: 5 }}
                    //dividerStyle={{backgroundColor:'#fff'}}
                    key={item.id}
                    title={this.props.language.title}
                >
                    <Text onPress={() => { this.goToDetail(item) }} style={{ padding: 10, color: '#64b5f6' }}>{item.title}</Text>
                    <Text note style={{ padding: 10, fontSize: 12 }}>{item.author}</Text>

                    <Text style={{ fontSize: 14, padding: 10, marginTop: 10, marginBottom: 5 }} numberOfLines={3} ellipsizeMode={"tail"}>
                        {item.poem_txt}
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

        console.log("render poem");

        return (

            <FlatList
                data={this.props.data}
                pagingEnabled={true}
                ref={(ref) => { this.flatListRef = ref; }}
                getItemLayout={this.getItemLayout}
                keyExtractor={this._keyExtractor}
                horizontal={true}
                renderItem={this._renderPoem}
                onMomentumScrollEnd={this.onScrollEnd}
                {...this.props}
            />

        );

    }

}

export default PoemCards;
