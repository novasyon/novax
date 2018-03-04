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


class ResetPasswordScreen extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            username:'',
            passwordReset:false,
            passwordVerified: true,
            newPassword: '',
            verifyNewPassword: ''

        }
    }

    componentWillMount(){
        this.getUsername();
    }    


    getUsername(){
        AsyncStorage.getItem("@MySuperStore:username").then((username)=>{
            this.setState({username:username})
        }).done(()=>{
            console.log("Done getUsername");
        })
    }

    captureNewPassword(text) {
        this.setState({ newPassword: text });
    }

    captureVerifyPassword(text) {
        this.setState({ verifyNewPassword: text });
    }

    navigateBack = () => {

        this.props.navigation.goBack();

    }

    resetPassword() {

        if (this.state.newPassword === this.state.verifyNewPassword) {
            console.log("Proceed reset password for ",this.state.username);
            this.setState({ passwordVerified: true });
            var querystring = require('querystring');

            return fetch('http://novasyon.net/apps/accountAPI.php?updatepassword', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: querystring.stringify({ username: this.state.username, password: this.state.newPassword })
            })
                .then((response) => response.json())
                .then((responseJson) => {
                    console.log("Response:", responseJson);
                    this.setState({passwordReset:true});
                })
                .catch((error) => {
                    console.error(error);
                });

        } else {
            this.setState({ passwordVerified: false });
        }

    }


    render() {

        let statusMessage = <View />

        if (!this.state.passwordVerified) {
            statusMessage = <Item regular style={{ marginTop: 10, padding: 0 }}><Text>Password incorrect</Text></Item>
        }

        if(this.state.passwordReset){
            statusMessage = <Item regular style={{ marginTop: 10, padding: 0 }}><Text>Password updated.</Text></Item>
        }

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
                                <Title>Reset Password</Title>
                            </Body>
                            <Right />
                        </Header>

                        <Form style={{ padding: 10 }}>
                            {statusMessage}
                            <Item regular style={{ marginTop: 50, padding: 0 }}>
                                <Input password placeholder="Enter New Password"
                                    onChangeText={(text) =>
                                        this.captureNewPassword(text)
                                    } />
                            </Item>

                            <Item regular style={{ marginTop: 10, padding: 0 }}>
                                <Input password placeholder="Verify Password"
                                    onChangeText={(text) =>
                                        this.captureVerifyPassword(text)
                                    } />
                            </Item>
                        </Form>
                    </Content>
                    <Footer>
                        <FooterTab>
                            <Button full style={{ backgroundColor: '#64b5f6' }} onPress={() => this.resetPassword()}>
                                <Text style={{ fontSize: 15, color: '#fff' }}>Reset Password</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>

        );

    }
}

export default ResetPasswordScreen;