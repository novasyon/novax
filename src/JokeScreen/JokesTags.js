import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ListView, AsyncStorage, Image } from 'react-native';
import {
    Container, Content, List, ListItem, Left, Body, Right, Title, Text, Card,
    CardItem, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'
import { setting } from '../config/setting.js'


class JokesTags extends React.Component {

    /*static navigationOptions = ({ navigation }) => ({
        header: null
    });*/

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';
    imagesUrl = 'http://novasyon.net/jokes/poem/';
    //ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    constructor(props) {
        super(props);

        this.state = {
            isLoading: true,
            isLoadingTag: false,
            tags: [],
            poems: [],
            chosenLanguage: language.jokes_english,
            script: language.jokes_english.api
        }
    }

    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                //console.log("English:", language.english);
                this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_english.api });
            } else if (chosenLanguage == 'spanish') {
                //console.log("Spanish:", language.spanish);
                this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_spanish.api });
            } else if (chosenLanguage == 'french') {
                //console.log("French:", language.french);
                this.setState({ language: language.jokes_french, script: language.jokes_french.api });
            } else if (chosenLanguage == 'creole') {
                //console.log("Creole:", language.creole);
                this.setState({ chosenLanguage: language.jokes_creole, script: language.jokes_creole.api });
            }

            //this._getAllPoem();

        }).done(() => {
            console.log("Done!");
            this._getAllTags();

        });
    }



    _getAllTags() {

        this.setState({ isLoading: true, isLoadingTag: false, tags: [], poems: [] });

        let allPoemUrl = this.baseUrl + this.state.script + "?tags";

        console.log("Url:",allPoemUrl);

        return fetch(allPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                //this.poems = responseJson;
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

        this.setState({ isLoading: false, isLoadingTag: true, poems: [] });

        let allPoemUrl = this.baseUrl + this.state.script + "?tag=" + tag;

        return fetch(allPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.poems = responseJson;
                this.setState({
                    isLoading: false,
                    isLoadingTag: false,
                    poems: responseJson
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
                    <ListItem style={{ paddingLeft: 10, paddingTop: 40, paddingBottom: 40, marginLeft: 0 }}
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
        //this.props.navigation.getNavigator('master').push('poemsSearchList', { tag: item });
    }

    _onPressButtonPoemDetail(item) {

        console.log("Item ID=", item.id);
        this.props.navigation.navigate('JokeDetail', { id: item.id, title: item.title });
        //this.props.navigation.getNavigator('master').push('poemDetail', { id: item.id, title: item.title });

    }

    _renderPoemsByTag() {

        //this._getTag();

        if (this.state.isLoadingTag) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );

        }

        if (this.state.poems.length == 0) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>{this.state.chosenLanguage.noPoems}</Text>
                </View>
            );
        }

        

        return (
            <List dataArray={this.state.poems}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButtonPoemDetail(item) }}>
                        {this.getThumbnail(item)}
                        <Body>
                            <Text>
                                {item.title}
                            </Text>
                            <Text note>{item.author}</Text>
                            <Text note>
                                {item.views} {this.state.chosenLanguage.view_title}  {item.rating}{this.state.chosenLanguage.rating_title}
                            </Text>
                        </Body>
                    </ListItem>
                }>
            </List>
        );
    }

    getThumbnail(item){
        let thumbnail = <View />
        if (item.image !== 'en' && item.image !== 'es' && item.image !== 'fr' && item.image !== 'ht' ) {
          thumbnail = <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
        }

        return thumbnail;
    }

    componentDidMount() {

        this.getLanguage();

        console.log("Props:", this.props.poemId);

        if (this.props.poemId != undefined) {
            this.setState({ isFromDetail: true });
        }


        /*AsyncStorage.getItem("@MySuperStore:isFromDetail").then((isFromDetail) => {
            if (isFromDetail != null) {
                console.log("Is From Detail=",isFromDetail);
                this.setState({ isFromDetail: true });
            }
        });*/
    }


    navigateBack() {

        this.props.navigation.navigate("PoemDetail", { id: this.props.poemId })
        //AsyncStorage.removeItem("@MySuperStore:isFromDetail");
        //this.props.navigation.goBack();
    }


    render() {


        if (this.state.isLoading) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );
        }


        //logic to render header base on state
        //if(this.props.navigation.state.params.routeFromDetail!=undefined){
        //console.log("hhhhh")
        //}



        header = <Header noShadow style={{ backgroundColor:setting.joke_color,marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
            <Left><Button transparent
                onPress={() => this.props.navigation.navigate("DrawerOpen")}
            ><Icon name="menu" /></Button></Left>
            <Body>
                <Title><Image style={{ width: 50, height: 50 }} source={{ uri: 'http://novasyon.net/images/nova.png' }} /> {this.state.chosenLanguage.tabTag}</Title>
            </Body>
            <Right />
        </Header>


        if (this.state.isFromDetail) {
            header = <View />
        }



        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#fff' }}>
                    <Content>
                        {header}
                        <Grid style={{ marginLeft: 0, padding: 0 }}>
                            <Row style={{ backgroundColor: '#fff', marginLeft: 0, marginTop: 0, padding: 0 }}>{this._renderTags()}</Row>
                            <Row>{this._renderPoemsByTag()}</Row>
                        </Grid>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

export default JokesTags;