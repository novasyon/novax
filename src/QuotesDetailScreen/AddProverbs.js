import React from 'react';
import { AsyncStorage,StyleSheet, KeyboardAvoidingView, Dimensions, Image, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { ImagePicker } from 'expo';
import {
    Body, Container, Thumbnail, Content, Footer, FooterTab,
    Form, Label, List, Left, ListItem, Picker, Title, Right, Text,
    Card, CardItem, Item, Input, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js';


//const Item = Picker.Item;

function pickImages() {
    console.log("Picking Image");
    console.log(this.state);
}

console.disableYellowBox = true;


class AddProverbs extends React.Component {



    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';
    imagesUrl = 'http://novasyon.net/images/poem/';





    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ chosenLanguage: language.proverbs_english, script: language.proverbs_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ language: language.proverbs_spanish, script: language.proverbs_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ language: language.proverbs_french, script: language.proverbs_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ language: language.proverbs_creole, script: language.proverbs_creole.api });
            }

        }).done(() => {
            console.log("Done. Load category");
            this.getCategory();
        });
    }




    _pickImage = async () => {
        console.log("Pick Image");
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
            base64: true
        });

        console.log(result);

        if (!result.cancelled) {
            //to do check image size
            this.setState({ image: result.uri, imageBase64: result.base64 });

            //upload image
        }
    };


    constructor(props) {
        super(props);
        this.state = {

            isLoading: true,
            isInserted: false,
            name: '',
            email: '',
            poemTitle: '',
            poem: '',
            poemTag: '',
            poemKeyword: '',
            image: null,
            imageBase64: null,
            uploading: false,
            selected: '',
            themes: [],
            language: language.proverbs_english,
            script: language.proverbs_english.api
        }
    }


    _uploadImage() {

    }


    _submit() {


        console.log("Submit:", this.state);
        console.log("Date is ", new Date().toDateString());

        //get image uri and blob

        var querystring = require('querystring');
        let url = this.baseUrl + this.state.script + '?add';
        //http://novasyon.net/apps/novasyon/APIpoems.php
        //http://novasyon.net/apps/novasyon/InsertPoemen.php
        return fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: querystring.stringify(
                {
                    title: this.state.poemTitle,
                    author: this.state.name,
                    text: this.state.poem,
                    email: this.state.email,
                    keywords: this.state.keywords,
                    author_id: 0,
                    langp: 'en',
                    category: this.state.selected

                })
        }).then((response) => {
            responseJson = response.text();
            console.log("Add Proverb Response:", responseJson);

            //upload image to server

            this.setState({ isInserted: true });
        }).catch((error) => {
            console.log("Error!");
            console.error(error)
        });
    }

    onValueChange(value) {
        this.setState({
            selected: value
        });
    }

    _captureName(text) {
        this.setState(
            {
                name: text
            }
        );
    }

    _captureEmail(text) {
        this.setState(
            {
                email: text
            }
        );
    }

    _capturePoemTitle(text) {

        this.setState(
            {
                poemTitle: text
            }
        );

    }

    _capturePoem(text) {
        this.setState(
            {
                poem: text
            }
        );
    }

    _capturePoemTag(text) {
        this.setState(
            {
                poemTag: text
            }
        );
    }

    _capturePoemKeywords(text) {
        this.setState(
            {
                poemKeyword: text
            }
        );

    }


    getCategory() {
        //fetch themes
        let url = this.baseUrl + this.state.script + '?themes';

        //this.setState({ isLoading: true, isLoadingTheme: false, themes: [],});
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                //this.poems = responseJson;
                let resultFound = false;

                if (responseJson != undefined) {
                    resultFound = true;
                }

                this.setState({
                    isLoading: false,
                    themes: responseJson
                }, function () {
                    // do something with new state
                });


            })
            .catch((error) => {
                console.error(error);
            });
    }

    componentDidMount() {
        this.getLanguage();
    }

    _renderPicker() {

        return (

            <Picker
                style={{
                    marginTop: 10, width: 300, flex: 1,
                    borderWidth: 1,
                    borderColor: '#ebebeb'
                }}
                headerComponent={<Text>Category</Text>}
                inlineLabel
                supportedOrientations={['portrait', 'landscape']}
                iosHeader="Category"
                headerBackButtonText="Back"
                placeholder="Select a Category"
                mode="dropdown"
                selectedValue={this.state.selected}
                onValueChange={this.onValueChange.bind(this)}>

                {
                    this.state.themes.map(
                        (theme) => <Picker.Item label={theme.en} value={theme.en} />
                    )
                }

            </Picker>

        );
    }

    _onSelectItem(item) {

        if (!item.checked) {
            item.checked = true;
        } else {
            item.checked = false;
        }

        objIndex = this.state.themes.findIndex((obj => obj.label == item.label));
        this.state.themes[objIndex].checked = item.checked;
        console.log(this.state.themes);


    }

    _renderCheckbox() {
        return (
            <List
                dataArray={this.state.themes}
                horizontal={true}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 2, paddingTop: 0, marginLeft: 0 }}>
                        <CheckBox
                            style={{ flex: 0, padding: 10 }}
                            onClick={() => this._onSelectItem(item)}
                            isChecked={item.checked}
                            rightText={item.label}
                        />
                    </ListItem>
                }
            >
            </List>
        );
    }

    _renderForm() {

        

        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#ebebeb' }}>
                    <ScrollView>
                        <Content>
                            <Header noShadow style={{
                                marginTop: 0, paddingTop: 60, paddingBottom: 20, elevation: 0,
                                backgroundColor: '#64b5f6'
                            }}>
                                <Left>
                                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                                        <Icon style={{ color: '#fff' }} name="arrow-back" />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title style={{ color: '#fff' }}>{this.state.language.add_joke_title}</Title>
                                </Body>
                                
                            </Header>

                            <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>


                                <Form style={{ padding: 10 }}>
                                    <Item style={{ paddingBottom: 0 }}>{this._renderPicker()}</Item>

                                    <Item regular style={{ marginTop: 5 }}>

                                        <Input
                                            placeholder="Author Name"
                                            onChangeText={(text) =>
                                                this._captureName(text)
                                            } />
                                    </Item>
                                    <Item regular style={{ marginTop: 10, padding: 0 }}>

                                        <Input
                                            keyboardType="email-address"
                                            placeholder="Email"
                                            onChangeText={(text) =>
                                                this._captureEmail(text)
                                            }
                                        />
                                    </Item>
                                    <Item regular style={{ marginTop: 10, padding: 0 }}>

                                        <Input
                                            placeholder="Title"
                                            onChangeText={(text) =>
                                                this._capturePoemTitle(text)
                                            }
                                        />
                                    </Item>
                                    <Item regular style={{ marginTop: 10, padding: 0 }}>

                                        <Input
                                            placeholder="Keywords"
                                            onChangeText={(text) =>
                                                this._capturePoemKeywords(text)
                                            }
                                        />
                                    </Item>



                                    <Item regular style={{ height: 150, marginTop: 10, marginLeft: 0 }}>

                                        <Input
                                            multiline
                                            placeholder="Proverbs Text"
                                            onChangeText={(text) =>
                                                this._capturePoem(text)
                                            }
                                        />
                                    </Item>




                                </Form>
                            </KeyboardAvoidingView>

                        </Content>
                    </ScrollView>
                    <Footer>
                        <FooterTab>
                            <Button full style={{ backgroundColor: '#64b5f6' }} onPress={() => this._submit()}>
                                <Text style={{ fontSize: 15, color: '#fff' }}>Save</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
                </Container>
            </StyleProvider>

        );
    }

    render() {

        if (this.state.isInserted) {
            return (
                <StyleProvider style={getTheme(material)}>
                    <Container style={{ backgroundColor: "#64b5f6" }}>
                        <Content>
                            <Header span noShadow style={{ marginTop: 0, paddingTop: 25, paddingBottom: 10, elevation: 0 }}>
                                <Left>
                                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                                        <Icon name="arrow-back" />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title></Title>
                                </Body>
                                <Right>
                                </Right>
                            </Header>
                            <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                                <Text style={{ color: "#fff" }}>Proverb created successfully.</Text>
                            </View>
                        </Content>
                    </Container>
                </StyleProvider>
            );
        }

        return (this._renderForm());

    }
}

export default AddProverbs;