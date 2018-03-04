import React from 'react';
import { ActivityIndicator, StyleSheet, View, FlatList, TouchableOpacity, ListView, AsyncStorage } from 'react-native';
import {
    Container, Content, List, ListItem, Left, Body, Right, Title, Text, Card,
    CardItem, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'
import { config } from '../config/config.js'


export default class ListJokesByUser extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });


    baseApiUrl = 'http://novasyon.net/apps/novasyon/';
    imagesUrl = 'http://novasyon.net/images/jokes/';

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            jokes: [],
            language: language.jokes_english,
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
                this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_english.api });
            } else if (chosenLanguage == 'french') {
                //console.log("French:", language.french);
                this.setState({ language: language.jokes_english, script: language.jokes_english.api });
            } else if (chosenLanguage == 'creole') {
                //console.log("Creole:", language.creole);
                this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_english.api });
            }

        }).done(() => {
            console.log("Done!");
            this.getJokes();
        });

    }


    getJokes() {

        let userId = this.props.navigation.state.params.id;


        this.setState({ isLoading: true, isListPoem: true, jokes: [] });

        //logic to switch end point based on language
        let url = this.baseApiUrl + this.state.script + "?user=" + userId;


        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {

                this.poems = responseJson;
                this.setState({
                    isLoading: false,
                    jokes: responseJson,
                });


            })
            .catch((error) => {
                console.error(error);
            });
    }


    componentDidMount() {
        this.getLanguage();
    }

    getThumbnail(item) {
        let thumbnail = <View />
        if (item.image !== 'en' && item.image !== 'es' && item.image !== 'fr' && item.image !== 'ht') {
            thumbnail = <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
        }

        return thumbnail;
    }

    render() {


        let result = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, marginTop: 100 }}>
            <Text>No jokes found</Text>
        </View>



        if (this.state.jokes.length > 0) {
            result = <List dataArray={this.state.jokes}
                renderRow={(item) =>

                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButton(item) }}>

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
        }

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }


        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: "#fff" }}>
                    <Content>
                        <Header style={{ marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>Jokes By User</Title>
                            </Body>
                            <Right />
                        </Header>
                        <Grid style={{ padding: 0 }}>
                            <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                                <Body style={{ padding: 20 }}>
                                    <Body>
                                        <Text style={{ color: "#000", fontSize: 18 }}>
                                            {this.props.navigation.state.params.author}
                                        </Text>
                                    </Body>
                                </Body>
                            </Row>
                            <Row>
                                {result}
                            </Row>
                        </Grid>
                    </Content>
                </Container>
            </StyleProvider>
        );

    }
}