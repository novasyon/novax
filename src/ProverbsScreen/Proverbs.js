import React from 'react';
import { AsyncStorage, StyleSheet, View, FlatList, TouchableOpacity,Image } from 'react-native';
import {
    Body, Container, Content, List, Title,
    Tabs, Tab, Right, Footer, FooterTab, Left, ListItem, Text, Card, CardItem, Item,
    Input, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import { language } from '../config/language.js'
import { setting } from '../config/setting.js'
import { NavigationActions } from 'react-navigation'
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import Expo from 'expo';


const imageURI = Expo.Asset.fromModule(require('../assets/images/nova2.png')).uri;
const imageUriWeb = 'http://novasyon.net/images/nova.png';


class Proverbs extends React.Component {

    alphabets = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];


    //EN http://novasyon.net/apps/novasyon/APIpoems.php?letter=c
    //FR http://novasyon.net/apps/novasyon/APIpoemes.php?letter=c
    //HT http://novasyon.net/apps/novasyon/APIpowem.php?letter=c
    //ES http://novasyon.net/apps/novasyon/APIpoemas.php?letter=c

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';
    imagesUrl = 'http://novasyon.net/images/poem/';

    constructor(props) {
        super(props);
        this.state = {
            isLoading: true,
            isListPoem: true,
            isAddDetail: false,
            isSubmitDetail: false,
            isViewPoem: false,
            poemId: null,
            poems: [],
            chosenLanguage:'english',
            language: language.proverbs_english,
            script:language.proverbs_english.api
        }
    }

    isAuthenticated() {

        AsyncStorage.getItem("@MySuperStore:authenticated").then((isAuth) => {

            if (isAuth != null) {
                this.setState({isAuth:true});
            } else{
                this.setState({isAuth:false});
            }

        });
    }

    componentDidMount(){
        this.getLanguage();
    }

    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                //console.log("English:", language.english);
                this.setState({ chosenLanguage: language.proverbs_english,script:language.proverbs_english.api });
            } else if (chosenLanguage == 'spanish') {
                //console.log("Spanish:", language.spanish);
                this.setState({ chosenLanguage: language.proverbs_spanish,script:language.proverbs_spanish.api });
            } else if (chosenLanguage == 'french') {
                console.log("French:", language.french);
                this.setState({ chosenLanguage: language.proverbs_french,script:language.proverbs_french.api });
            } else if (chosenLanguage == 'creole') {
                //console.log("Creole:", language.proverbs_creole);
                this.setState({ chosenLanguage: language.proverbs_creole,script:language.proverbs_creole.api });
            }

        }).done(()=>{
            console.log("Done!");
            this._getAll();
        });
    }


    _keyExtractor = (item, index) => item.id;



    _onPressButton(item) {

        this.props.navigation.navigate('ProverbsDetail', { id: item.id, title: item.title });

    }

    _goSearch() {
        console.log("Go Search");
        this.props.navigation.navigate('Search');
    }

    _goAdd() {

        AsyncStorage.getItem("@MySuperStore:authenticated").then((isAuth) => {

            if (isAuth != null) {
                this.props.navigation.navigate('AddProverbs');
            }else{
                this.props.navigation.navigate('Login');
            } 

        });   
    }

    _captureSearch(text) {
        this.setState({ search: text });
    }





    _getRandom() {

        //console.log("Get Random Poem");

        this.setState({ isLoading: true, isListPoem: true, poems: [] });

        let randomPoemUrl = this.poemsUrl + '?random';
        //console.log(randomPoemUrl);

        return fetch(randomPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log("Poems:", responseJson);

                let jsonArr = [];

                if (responseJson instanceof Array) {
                    jsonArr = responseJson;
                } else {
                    jsonArr.push(responseJson);
                }

                this.poems = responseJson;
                this.setState({
                    title: 'Random Poems',
                    isLoading: false,
                    poems: jsonArr,
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }


    handleDetailSubmitted() {
        console.log('Detail Submitted');
    }

    closeView() {
        console.log("Close View Poem");
        //this.setState({ isViewPoem: false });
    }

    handleClose = () => {
        console.log("Close View Poem");
        //this.setState({ isViewPoem: false });
    }



    _getAll(language) {

        
        this.setState({ isLoading: true, isListPoem: true, poems: [] });

        //logic to switch end point based on language
        let allPoemUrl = this.baseUrl+this.state.script;
        console.log("Url=",allPoemUrl);

        return fetch(allPoemUrl)
            .then((response) => response.json())
            .then((responseJson) => {

                this.poems = responseJson;
                this.setState({
                    title: 'All Poems',
                    isLoading: false,
                    poems: responseJson,
                });

                //this.getLanguage();

            })
            .catch((error) => {
                console.error(error);
            });

    }

    _onPressBadge(item) {

        let poemLetterUrl = this.baseUrl+this.state.language.api + '?letter=' + item;

        let title = 'Poems With Letter ' + item;

        this.setState({ title: title, isLoading: true, poems: [] });

        console.log("Badge ", poemLetterUrl);
        return fetch(poemLetterUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                if (responseJson != undefined) {
                    console.log('no response');
                }
                this.poems = responseJson;
                this.setState({
                    isLoading: false,
                    poems: responseJson,
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }


    getProverbItem(item){
        let chosenLanguage = this.state.chosenLanguage.lang;
        //console.log("getProverbItem lang:",chosenLanguage);
        if(chosenLanguage==='english'){
            //console.log('getProverbItem english:',item.english);
            return item.english;
        }else if(chosenLanguage==='french'){
            //console.log("It's a french ",item.french)
            return item.french;
        }else if(chosenLanguage==='spanish'){
            return item.spanish;
        }else if(chosenLanguage==='creole'){
            return item.creole;
        }
    }


    _renderProverbs() {

        if (this.state.isLoading && this.state.poems.length == 0) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );
        }

        if (this.state.poems.length == 0) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>{this.state.language.no_record}</Text>
                </View>
            );
        }


        
        

        return (

            <List dataArray={this.state.poems}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop:20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButton(item) }}>
                        
                        <Body>
                            <Text>
                                {this.getProverbItem(item)}
                            </Text>
                            <Text note>
                                {item.rating} {this.state.language.rating_title}
                            </Text>
                        </Body>
                    </ListItem>
                }>
            </List>

        );

    }


    render() {

        
        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: "#fff" }}>
                    <Content>
                        <Header noShadow style={{ backgroundColor:setting.proverb_color,marginTop: 0, paddingTop: 60,paddingBottom:40, elevation: 0 }}>
                            <Left>
                                <Button
                                    transparent
                                    onPress={() => this.props.navigation.navigate("DrawerOpen")}
                                >
                                    <Icon name="menu" />
                                </Button>
                            </Left>
                            <Body>
                                
                                <Title>
                                   <Image style={{width:50,height:50}} source={{uri:imageUriWeb}} />
                                    {this.state.language.title}
                                </Title>
                            </Body>
                            <Right>

                                <Button transparent onPress={() => this._getAll()}>
                                    <Icon name='refresh' />
                                </Button>

                                <Button transparent onPress={() => this._goSearch()}>
                                    <Icon name='search' />
                                </Button>
                                {/*<Button transparent onPress={() => this._goAdd()}>
                                    <Icon name='md-add-circle' />
                                </Button>*/}
                            </Right>
                        </Header>

                        <Grid style={{ marginLeft: 0, padding: 0 }}>
                            <Row style={{ backgroundColor: '#fff', marginLeft: 0, marginTop: 0, padding: 0 }}>
                                <List dataArray={this.alphabets}
                                    horizontal={true}
                                    renderRow={(item) =>
                                        <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                                            button onPress={() => { this._onPressBadge(item) }}>
                                            <Badge primary>
                                                <Text>{item}</Text>
                                            </Badge>
                                        </ListItem>
                                    }>
                                </List>
                            </Row>
                            <Row>
                                {this._renderProverbs()}
                            </Row>
                        </Grid>
                    </Content>

                </Container>
            </StyleProvider>

        )
    }
}

const mystyles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        padding: 4,
    }
});

export default Proverbs;
