import React from 'react';
import { ActivityIndicator,StyleSheet, View, FlatList, TouchableOpacity, ListView, AsyncStorage } from 'react-native';
import {
    Container, Content, List, ListItem, Left, Body, Right, Title, Text, Card,
    CardItem, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'
import { config } from '../config/config.js'


export default class ListProverbsByUser extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });


    baseApiUrl = 'http://novasyon.net/apps/novasyon/';

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            poems: [],
            chosenLanguage: language.english,
            script: language.english.poemUrl
        }
    }

    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ chosenLanguage: language.proverbs_english, script: language.proverbs_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ chosenLanguage: language.proverbs_spanish, script: language.proverbs_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ chosenLanguage: language.proverbs_french, script: language.proverbs_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ chosenLanguage: language.proverbs_creole, script: language.proverbs_creole.api });
            }

            //this._getAllPoem();

        }).done(() => {
            console.log("Done!");
            this.getPoems();
        });
    }


    getPoems() {

        let userId = this.props.navigation.state.params.id;


        this.setState({ isLoading: true, isListPoem: true, poems: [] });

        //logic to switch end point based on language
        let allPoemUrl = this.baseApiUrl + this.state.script + "?user=" + userId;

        console.log("Url=", allPoemUrl);

        return fetch(allPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {

                this.poems = responseJson;
                this.setState({
                    isLoading: false,
                    poems: responseJson,
                });


            })
            .catch((error) => {
                console.error(error);
            });
    }


    componentDidMount() {
        this.getLanguage();
    }

    getProverbItem(item){
        let chosenLanguage = this.state.chosenLanguage.lang;
        //console.log("getProverbItem lang:",chosenLanguage);
        if(chosenLanguage==='english'){
            //console.log('getProverbItem english:',item.english);
            return item.english;
        }else if(chosenLanguage==='french'){
            //console.log("It's a french ",item.french)
            return item.french;
        }else if(chosenLanguage==='spanish'){
            return item.spanish;
        }else if(chosenLanguage==='creole'){
            return item.creole;
        }
    }

    render() {


        let result = <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1,marginTop:100 }}>
                    <Text>No poems found</Text>
                </View>

        if(this.state.poems > 0){
            result = <List dataArray={this.state.poems}
                                    renderRow={(item) =>
                                        <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                                            button onPress={() => { this._onPressButton(item) }}>
                                            <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
                                            <Body>
                                                <Text>
                                                    {this.getProverbItem(item)}
                                                </Text>
                                                <Text note>
                                                    Rating:{item.rating}
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
                                <Title>Proverbs By User</Title>
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