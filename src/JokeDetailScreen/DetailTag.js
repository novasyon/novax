import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ListView, AsyncStorage } from 'react-native';
import {
    Container, Content, List, ListItem, Left, Body, Right, Title, Text, Card,
    CardItem, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'
import { config } from '../config/config.js'


class DetailTags extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    //baseUrl = config.baseApiUrl;
    //imagesUrl = config.baseImageUrl;
    jokesUrl = 'http://novasyon.net/apps/novasyon/APIjokes.php';
    imagesUrl = 'http://novasyon.net/images/Joke/';
    //ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isLoadingTag: false,
            tags: [],
            jokes: [],
            language: language.jokes_english,
            script: language.jokes_english.api
        }
    }

    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ language: language.jokes_spanish, script: language.jokes_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ language: language.jokes_french, script: language.jokes_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ language: language.jokes_creole, script: language.jokes_creole.api });
            }

            //this._getAllJoke();

        }).done(() => {
            let keyword = this.props.navigation.state.params.keyword;
            if(keyword!==undefined){
                console.log("Get Tag ",keyword);
                this._getTag(keyword);

            }else{
                this._getAllTags();
            }

        });
    }



    _getAllTags() {

        console.log("Get All Tags")
        this.setState({ isLoading: true, isLoadingTag: false, tags: [], jokes: [] });

        let allJokeUrl = this.baseUrl + this.state.script + "?tags";
        console.log("URL==",allJokeUrl);

        return fetch(allJokeUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                //this.jokes = responseJson;
                this.setState({
                    isLoading: false,
                    isLoadingTag: false,
                    tags: responseJson,
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }



    _getTag(tag) {

        this.setState({ isLoading: false, isLoadingTag: true, jokes: [] });

        let allJokeUrl = this.baseUrl + this.state.script + "?tag=" + tag;
        console.log("URL==",allJokeUrl);

        return fetch(allJokeUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.jokes = responseJson;
                this.setState({
                    isLoading: false,
                    isLoadingTag: false,
                    jokes: responseJson
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }

    _renderTags() {

        console.log(this.state.tags[0]);

        return (
            <List dataArray={this.state.tags[0]}
                horizontal={true}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 60, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButton(item) }}>
                        <Badge
                            style={{ backgroundColor: '#e53935' }}>
                            <Text>{item}</Text>
                        </Badge>
                    </ListItem>
                }>
            </List>
        );
    }

    _onPressButton(item) {
        console.log("Item ID=", item);
        this._getTag(item);
        //this.props.navigation.getNavigator('master').push('jokesSearchList', { tag: item });
    }

    _onPressButtonJokeDetail(item) {

        console.log("Item ID=", item.id);
        this.props.navigation.navigate('JokeDetail', { id: item.id, title: item.title });
    }

    getThumbnail(item){
        let thumbnail = <View />
        //console.log("Thumbnail=",item.image);
        if (item.image !== 'en' && item.image !== 'es' && item.image !== 'fr' && item.image !== 'ht' ) {
          thumbnail = <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
        }

        return thumbnail;
    }

    _renderjokesByTag() {

        //this._getTag();

        if (this.state.isLoadingTag) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );

        }

        if (this.state.jokes.length == 0) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>{this.state.language.nojokes}</Text>
                </View>
            );
        }

        return (
            <List dataArray={this.state.jokes}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButtonJokeDetail(item) }}>
                       {this.getThumbnail(item)}
                        <Body>
                            <Text>
                                {item.title}
                            </Text>
                            <Text note>{item.author}</Text>
                            <Text note>
                                Views: {item.views}    Rating:{item.rating}
                            </Text>
                        </Body>
                    </ListItem>
                }>
            </List>
        );


    }

    componentDidMount() {

        this.getLanguage();

      }


    render() {


        if (this.state.isLoading) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );
        }

        header = <Header noShadow style={{ marginTop: 0, paddingTop: 60,paddingBottom:40, elevation: 0 }}>
            <Left><Button transparent
                onPress={() => this.props.navigation.goBack()}
            ><Icon name="arrow-back" /></Button></Left>
            <Body>
                <Title>{this.state.language.tabTag}</Title>
            </Body>
            <Right />
        </Header>

        
       
        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#fff' }}>
                    <Content>
                        {header}
                        <Grid style={{ marginLeft: 0, padding: 0 }}>
                            <Row style={{ backgroundColor: '#fff', marginLeft: 0, marginTop: 0, padding: 0 }}>{this._renderTags()}</Row>
                            <Row>{this._renderjokesByTag()}</Row>
                        </Grid>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

export default DetailTags;