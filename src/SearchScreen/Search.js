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
import { language } from '../config/language.js'




class Search extends React.Component {



    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';
    imagesUrl = 'http://novasyon.net/images/poem/';
    baseUrl = 'http://novasyon.net/apps/novasyon/';
    //screenWidth = Dimensions.get('window').width;

    static navigationOptions = ({ navigation }) => ({
        header: null
    });


    constructor(props) {
        super(props);
        this.state = {
            init: true,
            resultTitle: '',
            search: '',
            isLoading: false,
            selected: '',
            poems: [],
            chosenLanguage: language.english,
            script: language.english.poemUrl
        }
    }

    getLanguage() {
        this.setState({isLoading:true});

        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            this.setState({ chosenLanguage: chosenLanguage });
            if (chosenLanguage == 'english') {
                //console.log("English:", language.english);
                this.setState({ isLoading:false,chosenLanguage: language.english,script:language.english.api });
            } else if (chosenLanguage == 'spanish') {
                //console.log("Spanish:", language.spanish);
                this.setState({ isLoading:false,chosenLanguage: language.spanish,script:language.spanish.api });
            } else if (chosenLanguage == 'french') {
                //console.log("French:", language.french);
                this.setState({ isLoading:false,chosenLanguage: language.french,script:language.french.api });
            } else if (chosenLanguage == 'creole') {
                //console.log("Creole:", language.creole);
                this.setState({isLoading:false,chosenLanguage: language.creole,script:language.creole.api });
            }

        }).done(() => {
            console.log("Done!");
        });
    }

    componentDidMount() {
        this.getLanguage();
    }

    _onPressButton(item) {

        if(this.state.selected=='poems'){
            this.props.navigation.navigate('PoemDetail', { id: item.id, title: item.title });
        }else if(this.state.selected=='jokes'){
            this.props.navigation.navigate('JokeDetail', { id: item.id, title: item.title });
        }else if(this.state.selected=='proverbs'){
            this.props.navigation.navigate('ProverbsDetail', { id: item.id});
        }

    }


    _captureSearch(text) {
        this.setState({ search: text });
    }


    _search() {

        

        this.setState({ init: false, isLoading: true, poems: [] });

        let searchPoemUrl = this.baseUrl + this.state.script + '?q=' + this.state.search;

        this._searchInput.value = '';

        console.log("Url:",searchPoemUrl);

        return fetch(searchPoemUrl)
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
                let title = 'Total result - ' + jsonArr.length;
                this.setState({
                    resultTitle: title,
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

    _choose(value) {
        console.log("_choose:",value," chosen Language is ",this.state.chosenLanguage.lang);
        
        this.state.selected = value;
        let lang = this.state.chosenLanguage.lang;

        console.log("Lang is ",lang , 'and value is ',value);

        if (value === 'quotes' && lang === 'english') {
            this.setState({ chosenLanguage: language.quotes_english, script: language.quotes_english.api });
        } else if (value === 'quotes' && lang === 'french') {
            this.setState({ chosenLanguage: language.quotes_french, script: language.quotes_french.api });
        } else if (value === 'quotes' && lang === 'spanish') {
            this.setState({ chosenLanguage: language.quotes_spanish, script: language.quotes_spanish.api });
        } else if (value === 'quotes' && lang === 'creole') {
            console.log("CREOLE");
            this.setState({ chosenLanguage: language.quotes_creole, script: language.quotes_creole.api });
        }else if (value === 'proverbs' && lang === 'english') {
            this.setState({ chosenLanguage: language.proverbs_english, script: language.proverbs_english.api });
        } else if (value === 'proverbs' && lang === 'french') {
            this.setState({ chosenLanguage: language.proverbs_french, script: language.proverbs_french.api });
        } else if (value === 'proverbs' && lang === 'spanish') {
            this.setState({ chosenLanguage: language.proverbs_spanish, script: language.proverbs_spanish.api });
        } else if (value === 'proverbs' && lang === 'creole') {
            this.setState({ chosenLanguage: language.proverbs_creole, script: language.proverbs_creole.api });
        }else if (value === 'jokes' && lang === 'english') {
            this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_english.api });
        } else if (value === 'jokes' && lang === 'french') {
            this.setState({ chosenLanguage: language.jokes_french, script: language.jokes_french.api });
        } else if (value === 'jokes' && lang === 'spanish') {
            this.setState({ chosenLanguage: language.jokes_spanish, script: language.jokes_spanish.api });
        } else if (value === 'jokes' && lang === 'creole') {
            this.setState({ chosenLanguage: language.jokes_creole, script: language.jokes_creole.api });
        } else if (value === 'poems' && lang === 'english') {
            this.setState({ chosenLanguage: language.english, script: language.english.poemUrl });
        } else if (value === 'poems' && lang === 'french') {
            this.setState({ chosenLanguage: language.french, script: language.french.poemUrl });
        } else if (value === 'poems' && lang === 'spanish') {
            this.setState({ chosenLanguage: language.spanish, script: language.spanish.poemUrl });
        } else if (value === 'poems' && lang === 'creole') {
            this.setState({ chosenLanguage: language.creole, script: language.creole.poemUrl });
        }else{
            console.log("unmatch");
        }

    }

    _renderPicker() {

        let poemTitle = 'Poems';
        let jokeTitle='Jokes';
        let proverbsTitle = 'Proverbs';
        let quotesTitle='Quotes';
        let selectText='Select';

        if(this.state.chosenLanguage.lang=='english'){
            poemTitle = language.common.poems_title_english;
            jokeTitle = language.common.jokes_title_english;
            proverbsTitle = language.common.proverbs_title_english;
            quotesTitle = language.common.quotes_title_english;
            selectText = language.common.select_english;

        } else if(this.state.chosenLanguage.lang=='spanish'){

            poemTitle = language.common.poems_title_spanish;
            jokeTitle = language.common.jokes_title_spanish;
            proverbsTitle = language.common.proverbs_title_spanish;
            quotesTitle = language.common.quotes_title_spanish;
            selectText = language.common.select_spanish;


        } else if(this.state.chosenLanguage.lang=='french'){

            poemTitle = language.common.poems_title_french;
            jokeTitle = language.common.jokes_title_french;
            proverbsTitle = language.common.proverbs_title_french;
            quotesTitle = language.common.quotes_title_french;
            selectText = language.common.select_french;


        } else if(this.state.chosenLanguage.lang=='creole'){

            poemTitle = language.common.poems_title_creole;
            jokeTitle = language.common.jokes_title_creole;
            proverbsTitle = language.common.proverbs_title_creole;
            quotesTitle = language.common.quotes_title_creole;
            selectText = language.common.select_creole;


        }

        return (

            <Picker
                style={{
                    marginTop: 0, flex: 0, width: Dimensions.get('window').width - 100, height: "ios" ? 30 : 40,
                    borderWidth: 0
                }}
                supportedOrientations={['portrait', 'landscape']}
                iosHeader={selectText}
                headerBackButtonText="<"
                placeholder={selectText}
                mode="dropdown"
                selectedValue={this.state.selected}
                onValueChange={this._choose.bind(this)}>

                <Picker.Item label={jokeTitle} value="jokes" />
                <Picker.Item label={poemTitle} value="poems" />
                <Picker.Item label={proverbsTitle} value="proverbs" />
                <Picker.Item label={quotesTitle} value="quotes" />
            </Picker>

        );
    }

    _getOptionList() {
        return this.refs['OPTIONLIST'];
    }

    getProverbItem(item){
        let chosenLanguage = this.state.chosenLanguage.lang;
        console.log("getProverbItem lang:",chosenLanguage);
        if(chosenLanguage==='english'){
            console.log('getProverbItem english:',item.english);
            return item.english;
        }else if(chosenLanguage==='french'){
            return item.french;
        }else if(chosenLanguage==='spanish'){
            return item.spanish;
        }else if(chosenLanguage==='creole'){
            return item.creole;
        }
    }


    _renderPoems() {

        if (this.state.isLoading) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );
        }


        if (!this.state.isLoading && this.state.poems.length == 0) {

            return (
                <View style={{ padding: 20 }}><Text>{this.state.chosenLanguage.no_record}</Text></View>
            );

        }

        if(this.state.selected==='proverbs'){

            return (

            <List dataArray={this.state.poems}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButton(item) }}>
                        <Body>
                            <Text>
                                {this.getProverbItem(item)}
                            </Text>
                            <Text note>
                                {item.rating} {this.state.chosenLanguage.rating_title}
                            </Text>
                        </Body>
                    </ListItem>
                }>
            </List>
        );
        }

        if(this.state.selected==='quotes'){
            
                        return (
            
                        <List dataArray={this.state.poems}
                            renderRow={(item) =>
                                <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                                    button onPress={() => { this._onPressButton(item) }}>
                                    <Body>
                                        <Text>
                                            {item.text}
                                        </Text>
                                        <Text note>
                                            {item.nviews} {this.state.chosenLanguage.view_title}
                                        </Text>
                                    </Body>
                                </ListItem>
                            }>
                        </List>
                    );
                    }


        return (

            <List dataArray={this.state.poems}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButton(item) }}>
                        <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
                        <Body>
                            <Text>
                                {item.title}
                            </Text>
                            <Text note>{item.author}</Text>
                            <Text note>
                                {item.views} {this.state.chosenLanguage.view_title}  {item.rating} {this.state.chosenLanguage.rating_title}
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
                        <Header noshadow style={{
                            marginTop: 0,
                            borderBottomWidth: 0,
                            paddingTop: 60, paddingBottom: 20,
                            elevation: 0
                        }}>
                            <Left>
                                <Button transparent onPress={() => this.props.navigation.goBack()}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{this.state.chosenLanguage.search_title}</Title>
                                <Subtitle style={{ padding: 10 }}>{this.state.resultTitle}</Subtitle>
                            </Body>
                            <Right></Right>

                        </Header>

                        <Header searchBar noShadow style={{ borderBottomWidth: 0 }}>
                            <Item>
                                <Icon name="ios-search" />
                                <Input
                                    ref={(c) => this._searchInput = c}
                                    defaultValue=''
                                    autoFocus={false}
                                    placeholder={this.state.chosenLanguage.search_title}
                                    onChangeText={(text) =>
                                        this._captureSearch(text)
                                    }
                                    onSubmitEditing={() => this._search()}
                                />
                            </Item>
                            <Button transparent onPress={() => this._search()}>
                                <Text>{this.state.chosenLanguage.search_title}</Text>
                            </Button>

                        </Header>

                        <Header searchBar noShadow style={{ paddingBottom: 10, borderBottomWidth: 0 }}>
                            <Item>{this._renderPicker()}</Item>
                        </Header>

                        {this._renderPoems()}

                    </Content>
                </Container>
            </StyleProvider>
        );

    }
}

export default Search;