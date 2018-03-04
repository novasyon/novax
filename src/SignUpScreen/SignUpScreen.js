import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ScrollView, AsyncStorage, KeyboardAvoidingView } from 'react-native';
import {
    Body, Container, Content, Form, Label, H1, List, Left, ListItem, Picker, Footer,
    Text, Card, CardItem, Item, Input, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment
} from 'native-base';


class SignUpScreen extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            userName: '',
            email: '',
            password: '',
            done: false
        }
    }

    submit() {

        console.log("Register")

        var querystring = require('querystring');

        return fetch('http://novasyon.net/apps/accountAPI.php?register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: querystring.stringify({ username: this.state.userName, email: this.state.email, password: this.state.password })
        })
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Response:", responseJson);
                this.state({ done: true })

            })
            .catch((error) => {
                console.error(error);
            });

    }

    goLogin() {
        this.props.navigation.navigate("Login");
    }


    captureUserName(text) {
        this.setState({ userName: text });
    }

    captureEmail(text) {
        this.setState({ email: text });
    }

    capturePassword(text) {
        this.setState({ password: text });
    }

    render() {

        if (this.state.done) {

            return (

                <View style={{ justifyContent: 'center', flex: 1, padding: 20, backgroundColor: '#ebebeb' }}>

                    <Button onPress={() => this.goLogin()} block style={{ marginTop: 20, padding: 10 }}>
                        <Text>Login</Text>
                    </Button>

                </View>
            );

        }

        return (

            <View style={{ justifyContent: 'center', flex: 1, padding: 20, backgroundColor: '#ebebeb' }}>
                <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>
                    <Form style={{ padding: 10 }}>
                        <Text style={{ fontWeight: 'bold', fontFamily: 'Roboto', alignItems: 'center', padding: 20, width: '100%' }}>
                            <H1>Sign Up</H1>
                        </Text>
                        
                        <Item regular>
                            <Input placeholder="username"
                                onChangeText={(text) =>
                                    this.captureUserName(text)
                                } />
                        </Item>
                        <Item regular style={{ marginTop: 10 }}>
                            <Input placeholder="email"
                                onChangeText={(text) =>
                                    this.captureEmail(text)
                                } />
                        </Item>
                        <Item regular style={{ marginTop: 10 }}>
                            <Input password placeholder="password"
                                onChangeText={(text) =>
                                    this.capturePassword(text)
                                }
                            />
                        </Item>
                        <Button onPress={() => this.submit()} block style={{ marginTop: 20, padding: 10 }}>
                            <Text>Sign Up</Text>
                        </Button>
                        <Button onPress={() => this.props.navigation.navigate("Home")} transparent 
                            style={{ marginTop: 20, padding: 10,flex:1,justifyContent:'center' }}>
                            <Text>Home</Text>
                        </Button>
                    </Form>
                </KeyboardAvoidingView>
            </View>
        )

    }


}

export default SignUpScreen;