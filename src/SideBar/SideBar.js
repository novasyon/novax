import React from "react";
import { AsyncStorage, AppRegistry, Image, StyleSheet, StatusBar, View } from "react-native";
import {
    Button,
    Text,
    Header,
    Container,
    List,
    Body,
    Title,
    ListItem,
    Content,
    Left,
    Icon, StyleProvider, Right, Thumbnail, FooterTab, Footer
} from "native-base";

import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import config from '../config/config.js';
import { lang } from '../config/config.js';
import Expo from 'expo';
import Accordion from 'react-native-collapsible/Accordion';
import Collapsible from 'react-native-collapsible';
import _ from 'lodash';
import MenuItem from './MenuItem';



let menus = [
    //{ menuTitle: "Home",routeName:"Home"},
    {
        menuTitle: "English", routeName: "Home", language: "english", menuItems:
        [
            { routeName: "Poems", state: "Poem", title: "Poems", language: 'english', icon: "pencil-square", type: 'font-awesome' },
            { routeName: "Joke", state: "Joke", title: "Jokes", language: 'english', icon: "smile-o", type: 'font-awesome' },
            { routeName: "Proverbs", state: "Proverbs", title: "Proverbs", language: 'english', icon: "book", type: 'font-awesome' },
            { routeName: "Quotes", state: "Quotes", title: "Quotes", language: 'english', icon: "quote", type: 'entypo' }

        ]
    },
    {
        menuTitle: "French", routeName: "FrenchHome", language: "french", menuItems:
        [
            { routeName: "FrenchPoems", state: "Poems", title: "Poèmes", language: 'french', icon: "pencil-square", type: 'font-awesome' },
            { routeName: "FrenchJoke", state: "Joke", title: "Blagues", language: 'french', icon: "smile-o", type: 'font-awesome' },
            { routeName: "FrenchProverbs", state: "Provebs", title: "Proverbes", language: 'french', icon: "book", type: 'font-awesome' },
            { routeName: "FrenchQuotes", state: "Quotes", title: "Citations", language: 'french', icon: "quote", type: 'entypo' }
        ]
    },
    {
        menuTitle: "Spanish", routeName: "SpanishHome", language: "spanish", menuItems:
        [
            { routeName: "SpanishPoems", state: "Poem", title: "Poema", language: 'spanish', icon: "pencil-square", type: 'font-awesome' },
            { routeName: "SpanishJoke", state: "Joke", title: "Bromas", language: 'spanish', icon: "smile-o", type: 'font-awesome' },
            { routeName: "SpanishProverbs", state: "Proverbs", title: "Proverbios", language: 'spanish', icon: "book", type: 'font-awesome' },
            { routeName: "SpanishQuotes", state: "Quotes", title: "Citas", language: 'spanish', icon: "quote", type: 'entypo' }
        ]
    },
    {
        menuTitle: "Creole", routeName: "CreoleHome", language: "creole", menuItems:
        [
            { routeName: "CreolePoems", state: "Poem", title: "Powèm", language: 'creole', icon: "pencil-square", type: 'font-awesome' },
            { routeName: "CreoleJoke", state: "Joke", title: "Blag", language: 'creole', icon: "smile-o", type: 'font-awesome' },
            { routeName: "CreoleProverbs", state: "Proverbs", title: "Pwoveb", language: 'creole', icon: "book", type: 'font-awesome' },
            { routeName: "CreoleQuotes", state: "Quotes", title: "Sitasyon", language: 'creole', icon: "quote", type: 'entypo' }
        ]
    },
]



const routes = [
    { routeName: "Home", state: "Home", title: "Home", language: 'english' },
    { routeName: "Poems", state: "Poem", title: "English Poems", language: 'english' },
    { routeName: "Joke", state: "Joke", title: "English Jokes", language: 'english' },
    { routeName: "FrenchPoems", state: "Poems", title: "French Poems", language: 'french' },
    { routeName: "FrenchJoke", state: "Joke", title: "French Jokes", language: 'french' },
    { routeName: "SpanishPoems", state: "Poems", title: "Spanish Poems", language: 'spanish' },
    { routeName: "SpanishJoke", state: "Joke", title: "Spanish Jokes", language: 'spanish' },
    { routeName: "CreolePoems", state: "Poems", title: "Creole Poems", language: 'creole' },
    { routeName: "CreoleJoke", state: "Joke", title: "Creole Jokes", language: 'creole' },
];

const imageURI = Expo.Asset.fromModule(require('../assets/images/novasyon_logo.png')).uri;
//const imageUrilWeb = 'http://novasyon.net/images/novasyon_logo.png';
const imageUriWeb = 'http://novasyon.net/images/nova.png';

export default class SideBar extends React.Component {


    constructor(props) {
        super(props);
        this.state = {
            isAuth: false,
            isCollapsed: true,
            profile: null
        }
    }


    componentDidMount() {
        this.isAuthenticated();
    }


    isAuthenticated() {

        AsyncStorage.getItem("@MySuperStore:authenticated").then((isAuth) => {

            if (isAuth != null) {
                this.setState({ isAuth: true });
            } else {
                this.setState({ isAuth: false });
            }

        });

        AsyncStorage.getItem("@MySuperStore:username").then((username) => {

            if (username != null) {
                this.setState({ username: username });
            }

        });

        AsyncStorage.getItem("@MySuperStore:password").then((password) => {

            if (password != null) {
                this.setState({ password: password });
            }

        });

    }

    getProfile() {

        this.setState({ isLoading: true });

        AsyncStorage.getItem("@MySuperStore:username").then((username) => {

            if (username != null) {

                let url = 'http://novasyon.net/apps/accountAPI.php?user_info=' + username;
                //console.log(randomPoemUrl);

                return fetch(url)
                    .then((response) => response.json())
                    .then((responseJson) => {
                        console.log("Profile:", JSON.stringify(responseJson));

                        this.setState({
                            isLoading: false,
                            profile: responseJson[0],
                        });
                    })
                    .catch((error) => {
                        console.error(error);
                    });
            }
        });
    }




    route(routeName, language, state) {

        try {
            console.log("Route:", routeName, " Language:", language);
            AsyncStorage.setItem('@MySuperStore:language', language);
            this.props.navigation.navigate(routeName);

        } catch (error) {
            // Error saving data
        }
    }


    login() {
        console.log("Login");
        this.props.navigation.navigate("Login");
    }

    logout() {

        console.log("Logout");

        var querystring = require('querystring');

        return fetch('http://novasyon.net/apps/accountAPI.php?logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: querystring.stringify({ username: this.state.userName, password: this.state.password })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Response:", responseJson);
                if (responseJson[0].Logged == "no") {
                    console.log("Logout Success");
                    AsyncStorage.removeItem('@MySuperStore:authenticated');
                    this.setState({ isAuth: false });
                }
            })
            .catch((error) => {
                console.error(error);
            });
    }

    goProfile() {
        console.log("Profile");
        this.props.navigation.navigate("Profile");
    }

    goFeedback() {
        console.log("Feedback");
        this.props.navigation.navigate("Feedback");
    }

    goSettings() {
        console.log("Setting");
        this.props.navigation.navigate("Setting");
    }

    goRating() {
        console.log("Rating");
        this.props.navigation.navigate("Rating");
    }

    signUp() {
        this.props.navigation.navigate("SignUp");
    }


    toggleCollapse() {
        console.log("toggleCollapse");
        if (this.state.isCollapsed) {
            this.setState({ isCollapsed: false })
        } else {
            this.setState({ isCollapsed: true })
        }
    }

    routeCallback(data) {
        this.route(data.routeName, data.language, data.state)
    }

    goHome(language) {
        AsyncStorage.setItem("@MySuperStore:language", language);
        this.route("Home", language, "Home")
    }


    render() {

        homeButton = <Button transparent onPress={() => this.route("Home", "english", "Home")}><Icon name='home' /></Button>;
        authButton = <Button transparent onPress={() => this.login()}><Icon name='log-in' /></Button>;
        profileButton = <View />
        signUp = <Footer>
            <FooterTab>
                <Button full style={{ backgroundColor: '#64b5f6' }} onPress={() => this.signUp()}>
                    <Text style={{ fontSize: 15, color: '#fff' }}>Sign Up</Text>
                </Button>
            </FooterTab>
        </Footer>

        if (this.state.isAuth) {
            authButton = <Button transparent onPress={() => this.logout()}><Icon name='log-out' /></Button>
            profileButton = <Button transparent onPress={() => this.goProfile()}><Icon name='person' /></Button>
            signUp = <View />
        }

        //console.log("IsCollapse=", this.state.isCollapsed);

        let currentStyle = styles.list_hide;

        if (this.state.isCollapsed) {
            //console.log("Change da style");
            currentStyle = styles.list_show;

        }

        let menuz = _.cloneDeep(menus);

        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#263d4c' }}>
                    <Content>
                        <Header noShadow style={{
                            marginTop: 0, paddingTop: 30, paddingBottom: 0, elevation: 0
                        }}>
                            <Left><Thumbnail square size={150} style={{ marginLeft: 20 }} source={{ uri: imageUriWeb }} /></Left>
                            <Body><Text style={{ fontSize: 15, fontWeight: 'bold', color: '#fff' }}>{this.state.username}</Text></Body>
                        </Header>
                        <Header noShadow style={{
                            marginTop: 0, paddingTop: 0, paddingBottom: 0, elevation: 0
                        }}>

                            <Right>
                                {homeButton}
                                <Button transparent onPress={() => this.goRating()}><Icon name='star' /></Button>
                                <Button transparent onPress={() => this.goFeedback()}><Icon name='bulb' /></Button>
                                <Button transparent onPress={() => this.goSettings()}><Icon name='settings' /></Button>
                                {profileButton}
                                {authButton}
                            </Right>
                        </Header>
                        <List
                            //style={{ backgroundColor: '#64b5f6' }}
                            dataArray={menuz}
                            renderRow={menu => {
                                //console.log("loop 1");
                                return (
                                    <MenuItem menu={menu} route={(data) => this.routeCallback(data)} />
                                );
                            }}
                        />

                    </Content>
                    {signUp}            
                </Container>
            </StyleProvider>
        );
    }
}

const styles = StyleSheet.create({

    list_hide: {
        backgroundColor: '#fff',
        width: 0,
        height: 0
    },

    list_show: {
        backgroundColor: '#ebebeb',
    }
});