import React from 'react';
import { AsyncStorage, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import {
    Container, Content, List, Left, Body, Title, Right, Thumbnail,
    ListItem, Text, Card, CardItem, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider
}
    from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'
import { setting } from '../config/setting.js'


class PoemThemes extends React.Component {

    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';
    baseUrl = 'http://novasyon.net/apps/novasyon/';
    imagesUrl = 'http://novasyon.net/images/poem/';


    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isLoadingTheme: false,
            resultFound: false,
            themes: [],
            poems: [],
            chosenLanguage: 'english',
            language: language.english,
            script: language.english.poemUrl
        }
    }

    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                console.log("English:", language.english);
                this.setState({ chosenLanguage: chosenLanguage, language: language.english, script: language.english.poemUrl });
            } else if (chosenLanguage == 'spanish') {
                console.log("Spanish:", language.spanish);
                this.setState({ chosenLanguage: chosenLanguage, language: language.spanish, script: language.spanish.poemUrl });
            } else if (chosenLanguage == 'french') {
                console.log("French:", language.french);
                this.setState({ chosenLanguage: chosenLanguage, language: language.french, script: language.french.poemUrl });
            } else if (chosenLanguage == 'creole') {
                console.log("Creole:", language.creole);
                this.setState({ chosenLanguage: chosenLanguage, language: language.creole, script: language.creole.poemUrl });
            }

            //this._getAllPoem();

        }).done(() => {
            console.log("Done!");
            this._getAllTheme();

        });
    }


    groupResult(arr2) {

        /*var result = _(arr2)
            .groupBy('question')
            .map(function (item, itemId) {
                var obj = {};
                obj[itemId] = _.countBy(item, 'en')
                return obj
            }).value();*/

        //console.log(JSON.stringify(result, null, 2));
    }


    _getAllTheme() {

        this.setState({ isLoading: true, isLoadingTheme: false, themes: [], poems: [] });
        let allPoemUrl = this.baseUrl + this.state.script + "?themes";

        return fetch(allPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                //this.poems = responseJson;
                let resultFound = false;

                if (responseJson != undefined) {
                    resultFound = true;
                }

                this.setState({
                    isLoading: false,
                    isLoadingTheme: false,
                    themes: responseJson,
                    resultFound: resultFound,
                    poems: [],
                }, function () {
                    // do something with new state
                });


            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.getLanguage();
    }

    _getTheme(theme) {

        this.setState({ isLoading: false, isLoadingTheme: true, poems: [] });

        let allPoemUrl = this.baseUrl + this.state.script + "?theme=" + theme;

        console.log("Get Theme=", allPoemUrl);

        return fetch(allPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log("Theme=", responseJson);
                this.poems = responseJson;
                this.setState({
                    isLoading: false,
                    isLoadingTheme: false,
                    poems: responseJson,
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });
    }

    _onPressButton(item) {
        //console.log("Item ID=", item.id);
        this._getTheme(item.id);
        //this.props.navigation.navigate('PoemDetail', { id: item.id, title: item.title }); 
    }

    _onPressButtonPoemDetail(item) {
        this.props.navigation.navigate('PoemDetail', { id: item.id, title: item.title });
        //this.props.navigation.getNavigator('master').push('poemDetail', { id: item.id, title: item.title });
    }


    _renderThemes() {

        let chosenLanguage = this.state.chosenLanguage;
        let themeText = '';

        if (chosenLanguage == 'english') {
            return (
                <List horizontal={true} dataArray={this.state.themes}
                    renderRow={(item) =>
                        <ListItem style={{ paddingLeft: 10, paddingTop: 45, paddingBottom: 20, marginLeft: 0 }}
                            button onPress={() => { this._onPressButton(item) }}>
                            <Badge
                                style={{ backgroundColor: '#e53935' }}>
                                <Text>{item.en}</Text>
                            </Badge>
                        </ListItem>
                    }>
                </List>
            );
        }

        if (chosenLanguage == 'french') {
            return (
                <List horizontal={true} dataArray={this.state.themes}
                    renderRow={(item) =>
                        <ListItem style={{ paddingLeft: 10, paddingTop: 45, paddingBottom: 20, marginLeft: 0 }}
                            button onPress={() => { this._onPressButton(item) }}>
                            <Badge
                                style={{ backgroundColor: '#e53935' }}>
                                <Text>{item.fr}</Text>
                            </Badge>
                        </ListItem>
                    }>
                </List>
            );
        }

        if (chosenLanguage == 'spanish') {
            return (
                <List horizontal={true} dataArray={this.state.themes}
                    renderRow={(item) =>
                        <ListItem style={{ paddingLeft: 10, paddingTop: 45, paddingBottom: 20, marginLeft: 0 }}
                            button onPress={() => { this._onPressButton(item) }}>
                            <Badge
                                style={{ backgroundColor: '#e53935' }}>
                                <Text>{item.es}</Text>
                            </Badge>
                        </ListItem>
                    }>
                </List>
            );
        }

        if (chosenLanguage == 'creole') {
            return (
                <List horizontal={true} dataArray={this.state.themes}
                    renderRow={(item) =>
                        <ListItem style={{ paddingLeft: 10, paddingTop: 45, paddingBottom: 20, marginLeft: 0 }}
                            button onPress={() => { this._onPressButton(item) }}>
                            <Badge
                                style={{ backgroundColor: '#e53935' }}>
                                <Text>{item.ht}</Text>
                            </Badge>
                        </ListItem>
                    }>
                </List>
            );
        }

    }

    _renderPoemsByTheme() {


        if (this.state.isLoadingTheme) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );

        }

        if (this.state.poems.length == 0 || !this.state.resultFound) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>{this.state.language.no_record}</Text>
                </View>
            );
        }

        return (
            <List dataArray={this.state.poems}
                renderRow={(item) =>

                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButtonPoemDetail(item) }}>
                        <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
                        <Body>
                            <Text>
                                {item.title}
                            </Text>
                            <Text note>{item.author}</Text>
                            <Text note>
                                {item.views} {this.state.language.view_title}    {item.rating} {this.state.language.rating_title}
                            </Text>
                        </Body>
                    </ListItem>
                }>
            </List>
        );



    }

    render() {
        if (this.state.isLoading) {

            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );

        }

        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: "#fff" }}>
                    <Content>
                        <Header noShadow style={{ backgroundColor:setting.poem_color,marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button
                                    transparent
                                    onPress={() => this.props.navigation.navigate("DrawerOpen")}
                                >
                                    <Icon name="menu" />
                                </Button>
                            </Left>
                            <Body>
                                <Title><Image style={{ width: 50, height: 50 }} source={{ uri: 'http://novasyon.net/images/nova.png' }} />
                                    {this.state.language.tabThemes}
                                </Title>
                            </Body>
                            <Right />
                        </Header>
                        <Grid style={{ marginLeft: 0, padding: 0 }}>
                            <Row style={{ backgroundColor: '#fff', marginLeft: 0, marginTop: 0, padding: 0 }}>{this._renderThemes()}</Row>
                            <Row>{this._renderPoemsByTheme()}</Row>
                        </Grid>
                    </Content>
                </Container>
            </StyleProvider>
        );
    }
}

export default PoemThemes;