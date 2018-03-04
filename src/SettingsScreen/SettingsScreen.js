import React from 'react';
import { Linking, Share, AsyncStorage, ActivityIndicator, Dimensions, StyleSheet, Image, View, FlatList, FormData } from 'react-native';
import {
    Container, Body, Content, Title, List, Left, Form, Input, Item, Picker,
    ListItem, Text, Card, CardItem, Header, H1,
    H2, H3, Button, Icon, Fab, Right, Grid, Col, Row, StyleProvider, Footer, FooterTab, Thumbnail, Switch
} from 'native-base';
import { CheckBox } from 'react-native-elements'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js';
import { setting } from '../config/setting.js';
import { time } from '../util/Utils.js'
import { Rating } from 'react-native-elements';

class SettingsScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            chosenLanguage: language.settings_english,
            english: false,
            spanish: false,
            french: false,
            creole: false
        }
    }

    getLanguage() {

        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ english: true, chosenLanguage: language.settings_english});
            } else if (chosenLanguage == 'spanish') {
                this.setState({ spanish: true, chosenLanguage: language.settings_spanish});
            } else if (chosenLanguage == 'french') {
                this.setState({ french: true, chosenLanguage: language.settings_french});
            } else if (chosenLanguage == 'creole') {
                this.setState({ creole: true, chosenLanguage: language.settings_creole});
            }

        }).done(() => {
            console.log("Done!");
        });
    }

    componentWillMount(){
        this.getLanguage();
    }

    navigateBack = () => {
        this.props.navigation.goBack();
    }

    

    toggle(language) {

        if (language === 'english') {
            this.state.english ? this.setState({ english: false }) : this.setState({ english: true, spanish: false, french: false, creole: false });
        } else if (language === 'spanish') {
            this.state.spanish ? this.setState({ spanish: false }) : this.setState({ spanish: true, english: false, french: false, creole: false });
        } else if (language === 'french') {
            this.state.french ? this.setState({ french: false }) : this.setState({ french: true, english: false, spanish: false, creole: false });
        } else if (language === 'creole') {
            this.state.creole ? this.setState({ creole: false }) : this.setState({ creole: true, english: false, french: false, spanish: false });
        }

        AsyncStorage.setItem("@MySuperStore:language", language);
        this.getLanguage();
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
                                <Title>{this.state.chosenLanguage.title}</Title>
                            </Body>
                            <Right />
                        </Header>
                        <List>
                            <ListItem itemHeader first>
                                <Text>{this.state.chosenLanguage.default_language}</Text>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text>{this.state.chosenLanguage.english_title}</Text>
                                </Body>
                                <Right>
                                    <Switch value={this.state.english} onValueChange={() => this.toggle('english')} />
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text>{this.state.chosenLanguage.spanish_title}</Text>
                                </Body>
                                <Right>
                                    <Switch value={this.state.spanish} onValueChange={() => this.toggle('spanish')} />
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text>{this.state.chosenLanguage.french_title}</Text>
                                </Body>
                                <Right>
                                    <Switch value={this.state.french} onValueChange={() => this.toggle('french')} />
                                </Right>
                            </ListItem>
                            <ListItem>
                                <Body>
                                    <Text>{this.state.chosenLanguage.creole_title}</Text>
                                </Body>
                                <Right>
                                    <Switch value={this.state.creole} onValueChange={() => this.toggle('creole')} />
                                </Right>
                            </ListItem>

                        </List>

                    </Content>

                </Container>
            </StyleProvider>
        );

    }



}

export default SettingsScreen;