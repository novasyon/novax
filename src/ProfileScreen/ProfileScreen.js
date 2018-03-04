import React from 'react';
import { AsyncStorage, StyleSheet, View, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import {
    Body, Container, Content, List, Title, Tabs,
    Tab, Right, Footer, FooterTab, Left, ListItem, Text,
    Card, CardItem, Item, Input, Icon, Col, Row, Grid, Badge,
    H3, Header, Spinner, Button, Segment, Picker, Subtitle, StyleProvider, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import DropDown, {
    Select,
    Option,
    OptionList,
} from 'react-native-option-select';
import config from '../config/config.js';


export default class ProfileScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            profile: []
        }
    }

    componentDidMount() {
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

    resetPassword(){
        this.props.navigation.navigate("ResetPassword");
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
                    <Header span noShadow
                        style={{
                            marginTop: 0, paddingTop: 60, paddingBottom: 20, elevation: 0,
                            backgroundColor: '#64b5f6'
                        }}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate("Home")}>
                                <Icon style={{ color: '#fff' }} name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title style={{ color: '#fff' }}>{this.state.profile.pseudo}</Title>
                            <Subtitle>{this.state.profile.email}</Subtitle>
                        </Body>
                        <Right>
                            <Button transparent>
                                <Icon style={{ color: '#fff' }} name="create" />
                            </Button>
                        </Right>
                    </Header>
                    <Card style={{ padding: 20, borderColor: "#fff" }}>
                        <CardItem header>
                            <Icon active name="happy" />
                            <Text>{this.state.profile.name}</Text>
                        </CardItem>
                        <CardItem body>
                            <Icon active name="pie" />
                            <Text>
                                {this.state.profile.poems_count} jokes,{this.state.profile.jokes_count} jokes,
                                {this.state.profile.quotes_count} quotes
                            </Text>
                        </CardItem>
                        <CardItem>
                            <Icon active name="podium" />
                            <Text style={{ marginLeft: 5 }}>Level {this.state.profile.level}</Text>
                            <Right></Right>
                        </CardItem>
                        <CardItem>
                            <Icon active name="mail" />
                            <Text style={{ marginLeft: 5 }}>{this.state.profile.email}</Text>
                            <Right></Right>
                        </CardItem>
                        <CardItem>
                            <Icon active name="map" />
                            <Text style={{ marginLeft: 5 }}>{this.state.profile.location}</Text>
                            <Right></Right>
                        </CardItem>
                        <CardItem>
                            <Icon active name="clipboard" />
                            <Text style={{ marginLeft: 5 }}>{this.state.profile.bio}</Text>
                            <Right></Right>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Button onPress={() => this.resetPassword()} block style={{ marginTop: 20, padding: 10 }}>
                                    <Text>Reset Password</Text>
                                </Button>
                            </Body>
                        </CardItem>
                    </Card>
                </Container>
            </StyleProvider>

        );
    }


}