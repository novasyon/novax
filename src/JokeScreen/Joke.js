import React from 'react';
import { AsyncStorage, StyleSheet, View, FlatList, TouchableOpacity, Image } from 'react-native';
import {
    Body, Container, Content, List, Title,
    Tabs, Tab, Right, Footer, FooterTab, Left, ListItem, Text, Card, CardItem, Item,
    Input, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import { language } from '../config/language.js'
import { setting } from '../config/setting.js'
import { NavigationActions } from 'react-navigation'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';




class Joke extends React.Component {

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    jokesUrl = 'http://novasyon.net/apps/novasyon/APIjokes.php';
    imagesUrl = 'http://novasyon.net/images/jokes/';

    alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


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
            language: language.jokes_english,
                this.setState({ language: language.jokes_english, script: language.jokes_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ language: language.jokes_spanish, script: language.jokes_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ language: language.jokes_french, script: language.jokes_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ language: language.jokes_creole, script: language.jokes_creole.api });
            }

        }).done(() => {
            console.log("Done!");
            this.getList();
        });
    }


    _onPressButton(item) {
        console.log("Joke Id=",item.id);
        this.props.navigation.navigate('JokeDetail', { id: item.id, title: item.title });

    }



    getList() {

        this.setState({ isLoading: true, jokes: [] });
        let url = this.baseUrl + this.state.script;
        console.log("Url=", url);

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {

                this.poems = responseJson;
                this.setState({
                    title: 'All Jokes',
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


    _onPressBadge(item) {

        let url = this.baseUrl + this.state.script + '?letter=' + item;


        this.setState({ isLoading: true, jokes: [] });

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                //console.log(responseJson);
                if (responseJson != undefined) {
                    console.log('no response');
                }
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

    search(){
        this.props.navigation.navigate('Search');
    }

    add(){
            AsyncStorage.getItem("@MySuperStore:authenticated").then((isAuth) => {

            if (isAuth != null) {
                this.props.navigation.navigate('AddJoke');
            }else{
                this.props.navigation.navigate('Login');
            } 

        });
    }

    getThumbnail(item){
        let thumbnail = <View />
        //console.log("Thumbnail=",item.image);
        if (item.image !== 'en' && item.image !== 'es' && item.image !== 'fr' && item.image !== 'ht' ) {
          thumbnail = <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
        }

        return thumbnail;
    }


    renderList() {

        if (this.state.isLoading && this.state.jokes.length == 0) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );
        }

        if (this.state.jokes.length == 0) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>{this.state.language.no_record}</Text>
                </View>
            );
        }

        

        return (<List dataArray={this.state.jokes}
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
                            {item.views} {this.state.language.view_title}    {item.rating} {this.state.language.rating_title}
                        </Text>
                    </Body>
                </ListItem>
            }>
        </List>)
    }

    render() {

        console.log("render");
        console.log(this.state.jokes);

        return (


            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: "#fff" }}>
                    <Content>
                        <Header noShadow style={{ backgroundColor:setting.joke_color,marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button
                                    transparent
                                    onPress={() => this.props.navigation.navigate("DrawerOpen")}
                                >
                                    <Icon name="menu" />
                                </Button>
                            </Left>
                            <Body>

                                <Title>
                                    <Image style={{ width: 50, height: 50 }} source={{ uri: 'http://novasyon.net/images/nova.png' }} />
                                    {this.state.language.title}
                                </Title>
                            </Body>
                            <Right>

                                <Button transparent>
                                    <Icon name='refresh' onPress={() => this.getList()} />
                                </Button>

                                <Button transparent>
                                    <Icon name='search' onPress={() => this.search()} />
                                </Button>
                                <Button transparent onPress={()=>this.add()}>
                                    <Icon name='md-add-circle' />
                                </Button>
                            </Right>
                        </Header>

                        <Grid style={{ marginLeft: 0, padding: 0 }}>
                            <Row style={{ backgroundColor: '#fff', marginLeft: 0, marginTop: 0, padding: 0 }}>
                                <List dataArray={this.alphabets}
                                    horizontal={true}
                                    renderRow={(item) =>
                                        <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                                            button onPress={() => { this._onPressBadge(item) }}>
                                            <Badge primary>
                                                <Text>{item}</Text>
                                            </Badge>
                                        </ListItem>
                                    }>
                                </List>
                            </Row>
                            <Row>
                                {this.renderList()}
                            </Row>
                        </Grid>
                    </Content>

                </Container>
            </StyleProvider>

        )
    }

}

export default Joke;