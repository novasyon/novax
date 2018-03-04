import React from 'react';
import { AsyncStorage, StyleSheet, KeyboardAvoidingView, Dimensions, Image, View, FlatList, TouchableOpacity, ScrollView } from 'react-native';
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
import { setting } from '../config/setting.js';


//const Item = Picker.Item;

function pickImages() {
    console.log("Picking Image");
    console.log(this.state);
}

console.disableYellowBox = true;


class AddPoem extends React.Component {



    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';
    imagesUrl = 'http://novasyon.net/images/poem';


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



    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                //console.log("English:", language.english);
                this.setState({ chosenLanguage: language.english, script: language.english.poemUrl });
            } else if (chosenLanguage == 'spanish') {
                //console.log("Spanish:", language.spanish);
                this.setState({ chosenLanguage: language.spanish, script: language.spanish.poemUrl });
            } else if (chosenLanguage == 'french') {
                //console.log("French:", language.french);
                this.setState({ chosenLanguage: language.french, script: language.french.poemUrl });
            } else if (chosenLanguage == 'creole') {
                //console.log("Creole:", language.creole);
                this.setState({ chosenLanguage: language.creole, script: language.creole.poemUrl });
            }

        }).done(() => {
            console.log("Done!");
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
            chosenLanguage: language.english,
            script: language.english.poemUrl,
            profile: null,
            author_id: 0
        }
    }


    _uploadImage() {

        let imagePath = this.state.image;
        console.log("Upload Image: ", imagePath);
        let filename = imagePath.split('/').pop();

        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;


        var querystring = require('querystring');
        var data = new FormData();
        data.append('picture', { uri: imagePath, name: 'testaizul.jpg', type: 'image/jpg' });
        //let url = this.imagesUrl;
        let url = "http://localhost/novasyon-api/images"
        //http://novasyon.net/apps/novasyon/APIpoems.php
        //http://novasyon.net/apps/novasyon/InsertPoemen.php
        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'multipart/form-data;'
            },
            body: data
        }).then((response) => {
            responseJson = response.text();
            console.log("Upload Image Response:", responseJson);
        }).catch((error) => {
            console.log("Error!");
            console.error(error)
        });



    }


    _submit() {


        console.log("Submit Poems:", this.state);
        console.log("Date is ", new Date().toDateString());
        let author_id = this.state.author_id;

        //get image uri and blob
        if (this.state.profile !== null) {
            author_id = this.state.profile.id;
        }

        let imagePath = this.state.image;
        
        let filename = imagePath.split('/').pop();
        console.log("Upload Image: ", filename);
        // Infer the type of the image
        let match = /\.(\w+)$/.exec(filename);
        let type = match ? `image/${match[1]}` : `image`;

        imagePath = imagePath.substring(7,imagePath.length);
        console.log("Image Path ",imagePath);
        console.log("Image type ",type);
        //filename = 'test.jpg';
        type='image/jpg';



        var querystring = require('querystring');
        let url = this.baseUrl + this.state.script + '?add';
        //url = 'http://localhost/novasyon-api/submit';
        
       

        return fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
              },
            body: querystring.stringify({
                title: this.state.poemTitle,
                author: this.state.name,
                text: this.state.poem,
                email: this.state.email,
                keywords: this.state.keywords,
                image:this.state.imageBase64,
                author_id,
                filename:filename,
                langp: 'en',
                category: this.state.selected
            })
        }).then((response) => {
            responseJson = response.text();
            console.log("Add Poem Response:", responseJson);
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

    componentWillMount() {
        this.getProfile();
    }

    componentDidMount() {

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
                headerBackButtonText="X"
                placeholder={this.state.chosenLanguage.field_select_category}
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

        //https://facebook.github.io/react/img/logo_og.png

        let image = this.state.image;
        let imageView = null;
        const screenWidth = Dimensions.get('window').width

        if (image != undefined) {
            console.log("Image URI:", image);
            //imageView = <Image large source={{ uri: image }} resizeMode="contain" style={{ width: screenWidth, height: 200 }} />
            imageView = <Thumbnail square large source={{ uri: image }} />

        } else {


            //imageView = <Button transparent onPress={this._pickImage}><Icon name="camera" /></Button>
            //imageView = <Button full onPress={this._pickImage}><Text style={{ fontWeight: 'bold' }}>Upload Image</Text></Button>
        }

        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#ebebeb' }}>
                    <ScrollView>
                        <Content>
                            <Header noShadow style={{
                                backgroundColor: setting.poem_color,
                                marginTop: 0, paddingTop: 60, paddingBottom: 20, elevation: 0
                            }}>
                                <Left>
                                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                                        <Icon style={{ color: '#fff' }} name="arrow-back" />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title style={{ color: '#fff' }}>{this.state.chosenLanguage.add_poem_title}</Title>
                                </Body>
                                <Right>
                                    <Button transparent onPress={this._pickImage}>
                                        <Icon style={{ color: '#fff' }} name="image" />
                                    </Button>
                                </Right>
                            </Header>

                            <KeyboardAvoidingView behavior='position' style={{ flex: 1 }}>


                                <Form style={{ padding: 10 }}>
                                    <Item style={{ paddingBottom: 0 }}>{this._renderPicker()}</Item>

                                    <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1, padding: 20 }}>{imageView}</View>

                                    <Item regular style={{ marginTop: 5 }}>

                                        <Input
                                            placeholder={this.state.chosenLanguage.field_author_name}
                                            onChangeText={(text) =>
                                                this._captureName(text)
                                            } />
                                    </Item>
                                    <Item regular style={{ marginTop: 10, padding: 0 }}>

                                        <Input
                                            keyboardType="email-address"
                                            placeholder={this.state.chosenLanguage.field_email}
                                            onChangeText={(text) =>
                                                this._captureEmail(text)
                                            }
                                        />
                                    </Item>
                                    <Item regular style={{ marginTop: 10, padding: 0 }}>

                                        <Input
                                            placeholder={this.state.chosenLanguage.field_title}
                                            onChangeText={(text) =>
                                                this._capturePoemTitle(text)
                                            }
                                        />
                                    </Item>
                                    <Item regular style={{ marginTop: 10, padding: 0 }}>

                                        <Input
                                            placeholder={this.state.chosenLanguage.field_keywords}
                                            onChangeText={(text) =>
                                                this._capturePoemKeywords(text)
                                            }
                                        />
                                    </Item>



                                    <Item regular style={{ height: 150, marginTop: 10, marginLeft: 0 }}>

                                        <Input
                                            multiline
                                            placeholder={this.state.chosenLanguage.field_text}
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
                                <Text style={{ fontSize: 15, color: '#fff' }}>{this.state.chosenLanguage.save_title}</Text>
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
                            <Header span noShadow
                                style={{ backgroundColor: setting.poem_color, marginTop: 0, paddingTop: 25, paddingBottom: 10, elevation: 0 }}>
                                <Left>
                                    <Button transparent onPress={() => this.props.navigation.goBack()}>
                                        <Icon name="arrow-back" />
                                    </Button>
                                </Left>
                                <Body>
                                    <Title>{this.state.chosenLanguage.add_poem_title}</Title>
                                </Body>
                                <Right>
                                </Right>
                            </Header>
                            <View style={{ alignItems: 'center',flexDirection:'column', justifyContent: 'center', flex: 1 }}>
                                <Text style={{ color: "#fff" }}>{this.state.chosenLanguage.done}</Text>
                            </View>
                        </Content>
                    </Container>
                </StyleProvider>
            );
        }

        return (this._renderForm());

    }
}

export default AddPoem;