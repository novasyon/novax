import React from 'react';
import { Share, AsyncStorage, ActivityIndicator, Dimensions, StyleSheet, Image, View, FlatList, FormData } from 'react-native';
import {
    Container, Body, Content, Title, List, Left, Badge,
    ListItem, Text, Card, CardItem, Header, H1,
    H2, H3, Button, Icon, Fab, Right, Grid, Col, Row, StyleProvider, Footer, FooterTab, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js';
import { time } from '../util/Utils.js'
import QuotesCards from '../components/QuotesCards.js'

let imageFolder = 'poem';
let query = 'quote';




class QuotesDetail extends React.Component {

    imagesUrl = 'http://novasyon.net/images/quotes/';
    baseUrl = "http://novasyon.net/apps/novasyon/";

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    constructor(props) {
        super(props);
        this.state = {
            active: true,
            title: '',
            isLoading: true,
            detail: [],
            related: [],
            index: 0,
            chosenLanguage: language.quotes_english,
            script: language.quotes_english.api,

        }
    }


    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ chosenLanguage: language.quotes_english, script: language.quotes_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ chosenLanguage: language.quotes_spanish, script: language.quotes_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ chosenLanguage: language.quotes_french, script: language.quotes_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ chosenLanguage: language.quotes_creole, script: language.quotes_creole.api });
            }

        }).done(() => {
            console.log("Done!");
            this.getDetail();
        });
    }

    _onPressButton(item) {
        console.log("Joke ID=", item.id);
        this.props.navigation.navigate('QuotesDetail', { id: item.id, title: item.title });

    }


    getRelated(id) {

        console.log("URL-", this.baseUrl, ",", this.state.script + '?related=' + id)
        return fetch(this.baseUrl + this.state.script)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    related: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }


    getDetail() {
        let url = this.baseUrl + this.state.script + '?' + query + '=' + this.props.navigation.state.params.id;
        console.log(url);
        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    title: responseJson.title,
                    detail: responseJson
                });

                this.getRelated(this.props.navigation.state.params.id);
            })
            .catch((error) => {
                console.error(error);
            });

    }


    componentDidMount() {
        this.getLanguage();
    }

    getTag(tag) {

        this.setState({ isLoading: true });

        let url = this.baseUrl + this.state.script + "?tag=" + tag;
        console.log("Get Tag URL:", url);

        return fetch(url)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.jokes = responseJson;
                this.setState({
                    isLoading: false,
                    detail: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }

    goTag() {

        try {

            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("DetailTag", { id: this.props.navigation.state.params.id });
        } catch (error) {
            // Error saving data
        }
    }


    goKeywordTag(keyword) {

        try {
            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("DetailTag", { keyword: keyword });
        } catch (error) {
            // Error saving data
        }

    }

    goListByUser(author) {
        //console.log("Go Poems By User");
        this.props.navigation.navigate("ListQuotesByUser", { id: this.props.navigation.state.params.id, author: author });
    }

    share(quote) {
        console.log("Share");

        Share.share({
            message: quote,
            url: 'http://bam.tech',
            title: this.state.chosenLanguage.title
        }, { dialogTitle: this.state.chosenLanguage.title })
    }


    next() {
        let nextIndex = this.state.index + 1;
        this.setState({ index: nextIndex });
    }

    previous() {

        let previousIndex = this.state.index - 1;
        this.setState({ index: previousIndex });

    }

    /*

        if (this.state.related.length > 0) {

            let detail = this.state.related[this.state.index];


            let previousButton = <View />

            if (this.state.index > 0) {
                previousButton = <Button transparent onPress={() => this.previous()}>
                    <Icon name="arrow-back" />
                </Button>
            }


            let nextButton = <View />

            if (this.state.related.length > 1 && (this.state.related.length - this.state.index) > 1) {

                nextButton = <Button transparent onPress={() => this.next()}>
                    <Icon name="arrow-forward" />
                </Button>

            }


            return (

                <Card style={{ padding: 10, width: Dimensions.get('window').width }}>
                    <CardItem header>
                        <Body>
                            <Text>{detail.text}</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            {previousButton}
                        </Left>
                        <Body>
                            <Button transparent onPress={() => this.props.navigation.navigate("QuotesDetail", 
                                { id: detail.id, title: detail.title })}>
                                <Text>View</Text>
                            </Button>
                        </Body>
                        <Right>
                            {nextButton}
                        </Right>
                    </CardItem>
                </Card>

            );
        }

        return (
            <Card style={{ padding: 10, width: Dimensions.get('window').width }}>
                <CardItem header>
                    <Body><Text>No related Quotes.</Text></Body>
                </CardItem>
            </Card>

        );
    }*/


    renderRelated() {

        if (this.state.related.length > 0) {
            return (
                <QuotesCards
                    data={this.state.related}
                    language={this.state.chosenLanguage}
                    navigation={this.props.navigation}
                />)
        } else {
            return <View />
        }

    }


    splitKeywords(keywords) {
        if (keywords.length > 0) {
            return keywords.split(" ");
        } else {
            return [];
        }
    }




    renderDetail() {

        let detail = this.state.detail[0];
        let relatedHeader = <View />

        if (detail != undefined) {

            let rating = "0";
            let keywords = [];
            let renderKeywords = <View />
            keywords = this.splitKeywords(detail.keywords);
            console.log("Keywords==", keywords);
            console.log("Keywords Length===", keywords.length);

            if (keywords.length > 0) {
                renderKeywords =


                    <Row style={{ backgroundColor: '#fff' }}>
                        <Col style={{ width: 70 }}><Button transparent onPress={() => this.goTag()}><Icon name="pricetag" /></Button></Col>
                        <Col>
                            <List dataArray={keywords}
                                horizontal={true}
                                renderRow={(item) =>
                                    <ListItem style={{ padding: 1, marginLeft: 0 }}
                                        button onPress={() => { this.goKeywordTag(item) }}>
                                        <Badge
                                            style={{ backgroundColor: '#e53935' }}>
                                            <Text>{item}</Text>
                                        </Badge>
                                    </ListItem>
                                }>
                            </List>
                        </Col>
                    </Row>

            }


            if (detail.rating != undefined) {
                rating = detail.rating;
            }

            if (this.state.related.length > 0) {
                relatedHeader =

                    <Row style={{ padding: 10 }}>
                        <Body>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                {this.state.chosenLanguage.related_quotes}
                            </Text>
                        </Body>
                    </Row>
            }


            return (
                <Grid style={{ padding: 0 }}>


                    <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                        <Left style={{ padding: 20 }}>
                            <Body>
                                <Text style={{ color: "#000", fontSize: 17, fontWeight: 'bold', textAlign: 'left' }}> {detail.text}</Text>
                            </Body>
                        </Left>
                    </Row>
                    {renderKeywords}
                    {this.getThumbnail(detail)}
                    {relatedHeader}
                    <Row>
                        {this.renderRelated()}
                    </Row>
                </Grid>
            );
        }
    }

    getThumbnail(item) {
        let thumbnail = <View />
        //console.log("Thumbnail=",item.image);
        if (item.image !== '') {
            thumbnail = <Row><Image style={{ width: Dimensions.get('window').width, height: 200 }}
                source={{ uri: this.imagesUrl + item.image }} /></Row>
        }

        return thumbnail;
    }


    navigateBack = () => {

        if (this.props.navigation.state.params.isHome != undefined) {
            this.props.navigation.navigate('Home');
        } else {
            this.props.navigation.goBack()
        }

    }


    render() {

        if (this.state.isLoading) {

            return (
                <View style={{ flex: 1, paddingTop: 20 }}>
                    <ActivityIndicator />
                </View>
            );
        }




        return (
            <StyleProvider style={getTheme(material)}>
                <Container>
                    <Content>
                        <Header style={{ marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={this.navigateBack}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>{this.state.language.title} </Title> /*Quote title*/
                                <Subtitle># (this.state.detail[0])}</Subtitle> /*Quote*/
                            </Body>
                            <Right>
                                <Button transparent onPress={() => this.share(this.state.detail[0])}>
                                    <Icon name="share" />
                                </Button>
                            </Right>
                        </Header>
                        {this.renderDetail()}
                    </Content>

                </Container>
            </StyleProvider>
        );


    }

}

const styles = StyleSheet.create({

    header: {
        color: '#87838B',
        fontWeight: 'bold',
    },

    bigblue: {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: 30,
    },
    red: {
        color: 'red',
    },
});

export default QuotesDetail;