import React from 'react';
import { Linking, Share, AsyncStorage, ActivityIndicator, Dimensions, StyleSheet, Image, View, FlatList, FormData } from 'react-native';
import {
    Container, Body, Content, Title, List, Left, Form, Input, Item, Picker,
    ListItem, Text, Card, CardItem, Header, H1,
    H2, H3, Button, Icon, Fab, Right, Grid, Col, Row, StyleProvider, Footer, FooterTab, Thumbnail
} from 'native-base';
import { CheckBox } from 'react-native-elements'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js';
import { setting } from '../config/setting.js';
import { time } from '../util/Utils.js'
import { Rating } from 'react-native-elements';


class RatingScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    baseUrl = 'http://novasyon.net/apps/novasyon/';

    constructor(props) {
        super(props);

        this.state = {
            rate: null,
            profile: null,
            chosenLanguage: language.rate_english
        }
    }

    navigateBack = () => {

        this.props.navigation.goBack();

    }

    getLanguage() {

        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ english: true, chosenLanguage: language.rate_english });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ spanish: true, chosenLanguage: language.rate_spanish });
            } else if (chosenLanguage == 'french') {
                this.setState({ french: true, chosenLanguage: language.rate_french });
            } else if (chosenLanguage == 'creole') {
                this.setState({ creole: true, chosenLanguage: language.rate_creole });
            }

        }).done(() => {
            console.log("Done!");
        });
    }

    componentWillMount() {
        this.getProfile();
        this.getLanguage();
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

    ratingCompleted(rating) {
        console.log("Rating is: " + rating)
        this.setState({ rate: rating });
    }

    rate() {

        console.log("Submit Rate for profile ", this.state.profile.id);

        var querystring = require('querystring');
        let url = 'http://novasyon.net/apps/novasyon/APIrating.php';
        console.log("Rating Url==", url);
        //http://novasyon.net/apps/novasyon/APIpoems.php
        //http://novasyon.net/apps/novasyon/InsertPoemen.php
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring.stringify(
                {
                    rating: this.state.rating,
                    userid: this.state.profile.id

                })
        }).then((response) => {
            responseJson = response.text();
            console.log("Add Rate Response:", responseJson);

            //upload image to server

            this.setState({ isInserted: true });
        }).catch((error) => {
            console.log("Error!");
            console.error(error)
        });

    }

    goFeedback() {
        console.log("Feedback");
        this.props.navigation.navigate("Feedback");
    }


    render() {

        return (

            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#fff' }}>
                    <Content>
                        <Header
                            style={{ marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={this.navigateBack}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{this.state.chosenLanguage.rating}</Title>
                            </Body>
                            <Right />
                        </Header>
                        <Row>
                            <Body style={{ display: 'flex', justifyContent: 'center', flexDirection: 'column' }}>
                                <Rating
                                    showRating
                                    type="star"
                                    fractions={1}
                                    showRating
                                    startingValue={3}
                                    imageSize={40}
                                    onFinishRating={(rating) => {
                                        //console.log("Rating is: " + rating)
                                        this.setState({ rate: rating });
                                    }}
                                    style={{ paddingVertical: 10 }}
                                />
                            </Body>
                        </Row>
                        <Row>
                            <Body style={{ padding: 10, justifyContent: 'center' }}>
                                <Text>{this.state.chosenLanguage.desc}</Text>
                                <Button primary transparent onPress={() => this.goFeedback()}><Text>{this.state.chosenLanguage.feedback}</Text></Button>
                            </Body>
                        </Row>
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button full style={{ backgroundColor: '#64b5f6' }} onPress={() => this.rate()}>
                                <Text style={{ fontSize: 15, color: '#fff' }}>{this.state.chosenLanguage.title}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>

        );

    }
}

export default RatingScreen;