import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import { Body, Container, Content, Form, Label, H1, List, Left, ListItem, Picker, Text, Card, CardItem, Item, Input, InputGroup, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment } from 'native-base';

import HomeScreen from "../HomeScreen/index.js";

class LoginScreen extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            isAuthenticated: false,
            userName: null,
            password: null,
            loginMessage: ""
        }
    }

    authenticate() {
        var querystring = require('querystring');

        return fetch('http://novasyon.net/apps/accountAPI.php?login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring.stringify({username: this.state.userName, password: this.state.password})
        }).then((response) => response.json()).then((responseJson) => {
            console.log("Response:", responseJson);
            if (responseJson[0].Login == "successful") {
                console.log("Login Success");
                AsyncStorage.setItem('@MySuperStore:authenticated', 'true');
                AsyncStorage.setItem('@MySuperStore:username', this.state.userName);
                AsyncStorage.setItem('@MySuperStore:password', this.state.password);
                this.setState({isAuthenticated: true});
            } else {
                console.log("Login Fail");
                this.setState({loginMessage: "Login Fail"});
            }
        }).catch((error) => {
            console.error(error);
        });
    }

    _submit() {
        this.authenticate();
    }

    _captureUserName(text) {
        this.setState({userName: text});
    }

    _capturePassword(text) {
        this.setState({password: text});
    }

    render() {

        if (!this.state.isAuthenticated) {

            //console.log("Login isAuthenticated=false");

            return (

                <View
                    style={{
                    justifyContent: 'center',
                    flex: 1,
                    padding: 20,
                    backgroundColor: '#ebebeb'
                }}>

                    <KeyboardAvoidingView
                        behavior='position'
                        style={{
                        flex: 1
                    }}>
                        <Form
                            style={{
                            padding: 10
                        }}>
                            <Text
                                style={{
                                fontWeight: 'bold',
                                fontFamily: 'Roboto',
                                alignItems: 'center',
                                padding: 20,
                                width: '100%'
                            }}>
                                <H1>novasyon</H1>
                            </Text>
                            <Item>
                                <Text>{this.state.loginMessage}</Text>
                            </Item>
                            <InputGroup style={styles.input}>
                                <Icon style={styles.inputIcon} name="ios-person"/>
                                <Input
                                    placeholder="username"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    onChangeText={(text) => this._captureUserName(text)}/>
                            </InputGroup>

                            <Item
                                regular
                                style={{
                                marginTop: 10
                            }}>
                                <InputGroup style={styles.input}>
                                    <Icon style={styles.inputIcon} name="ios-unlock"/>
                                    <Input
                                        password
                                        placeholder="password"
                                        secureTextEntry
                                        onChangeText={(text) => this._capturePassword(text)}/>
                                </InputGroup>
                            </Item>
                            <Button
                                onPress={() => this._submit()}
                                block
                                style={{
                                marginTop: 20,
                                padding: 10
                            }}>
                                <Text>Login</Text>
                            </Button>
                            <Button
                                onPress={() => this.props.navigation.navigate("SignUp")}
                                transparent
                                style={{
                                marginTop: 20,
                                padding: 10
                            }}>
                                <Text>Sign Up</Text>
                            </Button>
                            <Button
                                onPress={() => this.props.navigation.navigate("Home")}
                                transparent
                                style={{
                                marginTop: 20,
                                padding: 10
                            }}>
                                <Text>Home</Text>
                            </Button>
                        </Form>
                    </KeyboardAvoidingView>
                </View>
            );
        }

        return (<HomeScreen/>);

    }
}

export default LoginScreen;