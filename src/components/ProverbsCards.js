import React from "react";
import { View, FlatList, VirtualizedList, Dimensions, Image,TouchableOpacity } from "react-native";
import { Card,Icon } from 'react-native-elements';
import { Button,Text } from 'native-base'

let currentIndex = 0;
const SCREEN_WIDTH = Dimensions.get('window').width;

class ProverbsCards extends React.Component {



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

        this.props.navigation.navigate("ProverbsDetail", { id: item.id, title: item.title, isHome: true })

    }

    getProverbItem(item) {
        let chosenLanguage = this.props.language.lang;
        //console.log("getProverbItem lang:", chosenLanguage);
        if (chosenLanguage === 'english') {
            //console.log('getProverbItem english:',item.english);
            return item.english;
        } else if (chosenLanguage === 'french') {
            return item.french;
        } else if (chosenLanguage === 'spanish') {
            return item.spanish;
        } else if (chosenLanguage === 'creole') {
            return item.creole;
        }
    }

    _renderProverbs = ({ item, index }) => {

        
        return (
            <Card
                style={{marginBottom:5,width: SCREEN_WIDTH, backgroundColor: '#fff'}}
                titleStyle={{padding:5,marginTop:5}}
                //dividerStyle={{backgroundColor:'#fff'}}
                key={item.id}
                title={this.props.language.title}
            >
            <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center' }}>
                <Text 
                onPress={() => { this.goToDetail(item) }} style={{ width:250,fontSize: 14,padding:10,color: '#000',height:70 }}
                numberOfLines={3} ellipsizeMode={"tail"}
                >
                    {this.getProverbItem(item)}
                </Text>
                </View>
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
                    renderItem={this._renderProverbs}
                    onMomentumScrollEnd={this.onScrollEnd}
                    {...this.props}
                />
            </View>
        );

    }

}

export default ProverbsCards;
