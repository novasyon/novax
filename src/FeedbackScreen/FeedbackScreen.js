import React from 'react';
import {
    Linking, Share, AsyncStorage, ActivityIndicator,
    Dimensions, StyleSheet, Image, View, FlatList, FormData, KeyboardAvoidingView
} from 'react-native';
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

class FeedbackScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });


    constructor(props) {
        super(props);

        this.state = {
            chosenLanguage: language.feedback_english,
            subject: '',
            detail: '',
            selected1: false,
            profile: ''
        }
    }

    getLanguage() {

        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ english: true, chosenLanguage: language.feedback_english });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ spanish: true, chosenLanguage: language.feedback_spanish });
            } else if (chosenLanguage == 'french') {
                this.setState({ french: true, chosenLanguage: language.feedback_french });
            } else if (chosenLanguage == 'creole') {
                this.setState({ creole: true, chosenLanguage: language.feedback_creole });
            }

        }).done(() => {
            console.log("Done!");
        });
    }


    componentWillMount() {
        this.getLanguage();
        this.getProfile();
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
                        console.log("Profile:", responseJson);

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


    captureTitle(text) {
        this.setState(
            {
                title: text
            }
        );
    }

    captureDetail(text) {
        this.setState(
            {
                detail: text
            }
        );
    }

    onValueChange(value) {
        this.setState({
            selected1: value
        });
    }

    navigateBack = () => {

        this.props.navigation.goBack();

    }

    openMail() {
        console.log("Open Mail");
        Linking.openURL("mailto:?to=info@novasyon.net");
    }

    feedback() {
        console.log("Feedback");

        //Fetch API here
        var querystring = require('querystring');
        let url = 'http://novasyon.net/apps/novasyon/APIfeedback.php';
        console.log("Feedback Url==", url);
        //http://novasyon.net/apps/novasyon/APIpoems.php
        //http://novasyon.net/apps/novasyon/InsertPoemen.php
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring.stringify(
                {
                    subject: this.state.subject,
                    username: this.state.profile.id,
                    useremail: this.state.profile.name,
                    detail: this.state.detail,
                    feedbacktype: this.state.selected1
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


    render() {
        return (
            <StyleProvider style={getTheme(material)}>
                <Container >
                    <Content>
                        <Header
                            style={{ marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={this.navigateBack}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{this.state.chosenLanguage.title}</Title>
                            </Body>
                            <Right />
                        </Header>
                        <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
                            <Form style={{ padding: 10 }}>
                                <Item style={{ paddingBottom: 0 }}>
                                    <Picker
                                        style={{
                                            marginTop: 10, width: 300, flex: 1,
                                            borderWidth: 1,
                                            borderColor: '#ebebeb'
                                        }}
                                        headerComponent={<Text>{this.state.chosenLanguage.picker_title}</Text>}
                                        inlineLabel
                                        supportedOrientations={['portrait', 'landscape']}
                                        headerBackButtonText="X"
                                        iosHeader={this.state.chosenLanguage.select_one}
                                        placeholder={this.state.chosenLanguage.picker_title}
                                        mode="dropdown"
                                        selectedValue={this.state.selected1}
                                        onValueChange={this.onValueChange.bind(this)}
                                    >
                                        <Item label={this.state.chosenLanguage.suggestions} value="suggestions" />
                                        <Item label={this.state.chosenLanguage.bugs} value="bugs" />
                                        <Item label={this.state.chosenLanguage.questions} value="questions" />
                                        <Item label={this.state.chosenLanguage.others} value="others" />
                                    </Picker>
                                </Item>
                                <Item regular style={{ marginTop: 10, padding: 5 }}>
                                    <Input placeholder={this.state.chosenLanguage.subject}
                                        onChangeText={(text) =>
                                            this.captureTitle(text)
                                        } />
                                </Item>

                                <Item regular style={{ height: 200, marginTop: 10, padding: 5, marginLeft: 0 }}>

                                    <Input
                                        multiline
                                        placeholder={this.state.chosenLanguage.details}
                                        onChangeText={(text) =>
                                            this.captureDetail(text)
                                        }
                                    />
                                </Item>

                            </Form>
                        </KeyboardAvoidingView>
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button full style={{ backgroundColor: '#64b5f6' }} onPress={() => this.openMail()}>
                                <Text style={{ fontSize: 15, color: '#fff' }}>{this.state.chosenLanguage.button}</Text>
                            </Button>
                        </FooterTab>
                    </Footer>

                </Container>
            </StyleProvider>)
    }
}

export default FeedbackScreen
