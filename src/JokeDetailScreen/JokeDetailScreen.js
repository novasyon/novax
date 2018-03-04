import React from 'react';
import { Share, AsyncStorage, ActivityIndicator, Dimensions, StyleSheet, Image, View, FlatList, FormData } from 'react-native';
import {
    Container, Body, Content, Title, List, Left,Badge,
    ListItem, Text, Card, CardItem, Header, H1,
    H2, H3, Button, Icon, Fab, Right, Grid, Col, Row, StyleProvider, Footer, FooterTab, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js';
import { setting } from '../config/setting.js';
import { time } from '../util/Utils.js'
import JokeCards from '../components/JokeCards.js'





class JokeDetail extends React.Component {

    imagesUrl = 'http://novasyon.net/images/jokes/';

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
            chosenLanguage: language.jokes_english,
            script: language.jokes_english.api,

        }
    }


    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ chosenLanguage: language.jokes_english, script: language.jokes_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ chosenLanguage: language.jokes_spanish, script: language.jokes_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ chosenLanguage: language.jokes_french, script: language.jokes_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ chosenLanguage: language.jokes_creole, script: language.jokes_creole.api });
            }

        }).done(() => {
            console.log("Done!");
            this.getDetail();
        });
    }

    _onPressButton(item) {
        console.log("Joke ID=", item.id);
        this.props.navigation.navigate('JokeDetail', { id: item.id, title: item.title });

    }


    getRelated(id) {

        console.log("URL-http://novasyon.net/apps/novasyon/", this.state.script + '?related=' + id)
        return fetch('http://novasyon.net/apps/novasyon/' + this.state.script)
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

        console.log(this.props.navigation.state.params);
        return fetch('http://novasyon.net/apps/novasyon/' + this.state.script + '?joke=' + this.props.navigation.state.params.id)
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


    goTag() {

        try {

            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("JokeDetailTag", { id: this.props.navigation.state.params.id });
        } catch (error) {
            // Error saving data
        }
    }

    goJokesByUser(author) {
        console.log("Go Poems By User");
        this.props.navigation.navigate("ListJokesByUser", { id: this.props.navigation.state.params.id, author: author });
    }

    share(detail) {
        console.log("Share");

        Share.share({
            message: detail.text,
            url: 'http://novasyon.net/en/jokes.php',
            title: detail.title
        }, { dialogTitle: detail.title })
    }


    next() {
        let nextIndex = this.state.index + 1;
        this.setState({ index: nextIndex });
    }

    previous() {

        let previousIndex = this.state.index - 1;
        this.setState({ index: previousIndex });

    }

    renderRelated() {

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

            let thumbnail = <View />

            if (detail.image !== 'en') {
                thumbnail = <Thumbnail source={{ uri: this.imagesUrl + detail.image }} />
            }


            return (

                <Card>
                    <CardItem>
                        <Left>
                            {thumbnail}
                            <Body>
                                <Text style={{ fontWeight: 'bold' }}>Jokes</Text>
                                <Text style={{ fontSize: 15, color: '#64b5f6' }}>{detail.title}</Text>
                                <Text note style={{ fontSize: 12 }}>Authored By {detail.author}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text note numberOfLines={3} ellipsizeMode={"tail"}>
                                {detail.text}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            {previousButton}
                        </Left>
                        <Body>
                            <Button transparent onPress={() => this.props.navigation.navigate("JokeDetail", { id: detail.id, title: detail.title })}>
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
                    <Body><Text>No related jokes.</Text></Body>
                </CardItem>
            </Card>

        );
    }


    renderRelatedCards() {

        //console.log('renderRelatedPoemCards. Length==', this.state.relatedPoem.length);

        if (this.state.related.length > 0) {
            return (
                <JokeCards
                    data={this.state.related}
                    language={this.state.chosenLanguage}
                    navigation={this.props.navigation}
                />)
        } else {
            return <View />
        }
    }

    goKeywordTag(keyword) {

        try {
            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("JokeDetailTag", { keyword: keyword });
        } catch (error) {
            // Error saving data
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

                    <Row style={{ padding: 15 }}>
                        <Body>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                {this.state.chosenLanguage.related}
                            </Text>
                        </Body>
                    </Row>
            }

            let image = <View />

            if (detail.image !== 'en' && detail.image !== 'es' && detail.image !== 'fr' && detail.image !== 'ht') {
                image = <Row>
                    <Image
                        style={{ width: Dimensions.get('window').width, height: 200 }}
                        source={{ uri: this.imagesUrl + detail.image }}
                    />
                </Row>
            }



            return (
                <Grid style={{ padding: 0 }}>
                    <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                        <Body style={{ padding: 20 }}>
                            <Body>
                                <Text style={{ color: "#000", fontSize: 15 }}> {detail.title}</Text>
                            </Body>
                        </Body>
                    </Row>
                    <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                        <Left style={{ padding: 5 }}>
                            <Body>
                                <Button transparent onPress={() => this.goJokesByUser(detail.author)}><Icon name="person" /></Button>
                                <Text note>{detail.author}</Text>
                            </Body>
                        </Left>

                        <Body style={{ padding: 5 }}>
                            <Body>
                                <Button transparent onPress={() => this.goTag()}><Icon name="pricetag" /></Button>
                                <Text note>{this.state.chosenLanguage.tabTag}</Text>
                            </Body>
                        </Body>
                        <Right style={{ padding: 5 }}>
                            <Body>
                                <Button transparent><Icon name="clock" /></Button>
                                <Text note>{time(detail.date)}</Text>
                            </Body>
                        </Right>
                    </Row>
                    {image}
                    {renderKeywords}

                    <Row>
                        <Body style={{ backgroundColor: "#fff", alignItems: 'center', padding: 10, justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 14, padding: 10 }}>
                                {detail.text}
                            </Text>
                        </Body>
                    </Row>

                    {relatedHeader}

                    <Row>
                        {this.renderRelatedCards()}
                    </Row>
                </Grid>
            );
        }
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
                        <Header style={{ backgroundColor: setting.joke_color, marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={this.navigateBack}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>(this.state.detail[2])}</Title> /*Joke title*/
                                <Subtitle>{this.state.language.title}</Subtitle> /*Joke*/
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

export default JokeDetail;