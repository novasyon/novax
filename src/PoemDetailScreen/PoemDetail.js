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
import PoemCards from '../components/PoemCards.js'
//import Share, { ShareSheet, Button } from 'react-native-share';






class PoemDetail extends React.Component {



    static navigationOptions = ({ navigation }) => ({
        header: null
    });



    constructor(props) {
        super(props);
        this.state = {
            active: true,
            title: '',
            isLoading: true,
            poemDetail: [],
            relatedPoem: [],
            poemIndex: 0,
            chosenLanguage: language.english,
            script: language.english.poemUrl,
            visible: false

        }
    }



    //params = this.props.route.params;
    poem = {};



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

            //this._getAllPoem();

        }).done(() => {
            console.log("Done!");
            this.getPoem();

            //this._getAllPoem();
        });
    }

    _onPressButton(item) {

        this.props.navigation.navigate('PoemDetail', { id: item.id, title: item.title });

    }


    _getRelatedPoem(id) {

        console.log("Related Poems URL-http://novasyon.net/apps/novasyon/", this.state.script + '?related=' + id)
        return fetch('http://novasyon.net/apps/novasyon/' + this.state.script + '?related=' + id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    relatedPoem: responseJson
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }


    _getDetailPost(id) {


        return fetch('http://novasyon.net/apps/novasyon/' + this.state.script + '?poem=' + id)
            .then((response) => response.json())
            .then((responseJson) => {
                this.setState({
                    isLoading: false,
                    title: responseJson.title,
                    poemDetail: responseJson
                });
                console.log("Get Related Poems");
                this._getRelatedPoem(this.props.navigation.state.params.id);
            })
            .then(
                //console.log();
                //()=>{this._getRelatedPoem(this.props.navigation.state.params.id)}
            )
            .catch((error) => {
                console.error(error);
            });

    }

    getPoem() {
        //console.log("PARAMS:", this.props.navigation.state.params);
        this._getDetailPost(this.props.navigation.state.params.id);
    }


    componentDidMount() {

        this.getLanguage();
        //this.getPoem();
        //this._getRelatedPoem(this.props.navigation.state.params.id);

    }


    goTag() {

        try {

            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("DetailTag", { id: this.props.navigation.state.params.id });
        } catch (error) {
            // Error saving data
        }
    }

    goPoemByUser(author) {
        console.log("Go Poems By User");
        this.props.navigation.navigate("ListPoemsByUser", { id: this.props.navigation.state.params.id, author: author });
    }


    renderCard() {

        return (
            <Card style={{ padding: 20, marginTop: 20, marginLeft: 20, marginRight: 20, marginBottom: 20 }}>
                <CardItem header>
                    <Text><H2>{poemDetail.title}</H2></Text>
                </CardItem>
                <CardItem>
                    <Body style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                        <Text>
                            {poemDetail.poem_txt}
                        </Text>
                    </Body>
                </CardItem>
                <CardItem header>
                    <Text>Authored By {poemDetail.author}</Text>
                    <Button transparent textStyle={{ color: 'red' }}>
                        <Icon name="heart" />
                        <Text>{rating}</Text>
                    </Button>
                </CardItem>
            </Card>
        );
    }

    share(poemDetail) {
        console.log("Share");

        Share.share({
            message: poemDetail.poem_txt,
            url: 'http://bam.tech',
            title: poemDetail.title
        }, {
                // Android only:
                dialogTitle: poemDetail.title
            })
    }

    nextPoem() {
        let nextIndex = this.state.poemIndex + 1;
        this.setState({ poemIndex: nextIndex });
    }

    previousPoem() {

        let previousIndex = this.state.poemIndex - 1;
        this.setState({ poemIndex: previousIndex });

    }

    renderRelatedPoemCards() {

        console.log('renderRelatedPoemCards. Length==', this.state.relatedPoem.length);

        if (this.state.relatedPoem.length > 0) {
            return (
                <PoemCards
                    data={this.state.relatedPoem}
                    language={this.state.chosenLanguage}
                    navigation={this.props.navigation}
                />)
        } else {
            return <View><Text>{this.state.chosenLanguage.no_record}</Text></View>
        }
    }

    renderRelatedPoemNextPrev() {

        if (this.state.relatedPoem.length > 0) {

            let poem = this.state.relatedPoem[this.state.poemIndex];


            let previousButton = <View />

            if (this.state.poemIndex > 0) {
                previousButton = <Button transparent onPress={() => this.previousPoem()}>
                    <Icon name="arrow-back" />
                </Button>
            }


            let nextButton = <View />

            if (this.state.relatedPoem.length > 1 && (this.state.relatedPoem.length - this.state.poemIndex) > 1) {

                nextButton = <Button transparent onPress={() => this.nextPoem()}>
                    <Icon name="arrow-forward" />
                </Button>

            }

            let thumbnail = <View />

            if (poem.image !== 'en' && poem.image !== 'es' && poem.image !== 'fr' && poem.image !== 'ht') {
                thumbnail = <Thumbnail square source={{ uri: 'http://novasyon.net/images/poem/' + poem.image }} />
            }


            return (
                <Card>
                    <CardItem>
                        <Left>
                            {thumbnail}
                            <Body>
                                <Text style={{ fontWeight: 'bold' }}>{this.state.chosenLanguage.title}</Text>
                                <Text style={{ fontSize: 15, color: '#64b5f6' }}>{poem.title}</Text>
                                <Text note style={{ fontSize: 12 }}>Authored By {poem.author}</Text>
                            </Body>
                        </Left>
                    </CardItem>
                    <CardItem>
                        <Body>
                            <Text note numberOfLines={3} ellipsizeMode={"tail"}>
                                {poem.poem_txt}
                            </Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            {previousButton}
                        </Left>
                        <Body>
                            <Button transparent onPress={() => this.props.navigation.navigate("PoemDetail", { id: poem.id, title: poem.title })}>
                                <Text>View</Text>
                            </Button>
                        </Body>
                        <Right>
                            {nextButton}
                        </Right>
                    </CardItem>
                </Card >

            );
        }

        return (
            <View />
            /* <Card style={{ padding: 10, width: Dimensions.get('window').width }}>
                 <CardItem header>
                     <Body><Text>No related poems.</Text></Body>
                 </CardItem>
             </Card>*/

        );
    }


    renderRelatedPoem() {

        const screenWidth = Dimensions.get('window').width

        let thumbnail = <View />

        console.log("Poem Image ", poem.image);

        if (item.image !== 'en') {
            thumbnail = <Thumbnail square source={{ uri: 'http://novasyon.net/images/poem/' + item.image }} />
        }

        return (

            <List horizontal dataArray={this.state.relatedPoem}
                renderRow={(item) =>
                    <Card>
                        <CardItem>
                            <Left>
                                {thumbnail}
                                <Body>
                                    <Text style={{ fontWeight: 'bold' }}>Poems</Text>
                                    <Text style={{ fontSize: 15, color: '#64b5f6' }}>{item.title}</Text>
                                    <Text note style={{ fontSize: 12 }}>Authored By {item.author}</Text>
                                </Body>
                            </Left>
                        </CardItem>
                        <CardItem>
                            <Body>
                                <Text note numberOfLines={3} ellipsizeMode={"tail"}>
                                    {item.poem_txt}
                                </Text>
                            </Body>
                        </CardItem>
                        <CardItem>
                            <Left>
                            </Left>
                            <Body>
                            </Body>
                            <Right>
                                <Button transparent>
                                    <Text onPress={() => this._onPressButton(item)}>More</Text>
                                </Button>
                            </Right>
                        </CardItem>
                    </Card>
                }>
            </List>
        );

    }

    goKeywordTag(keyword) {

        try {
            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("DetailTag", { keyword: keyword });
        } catch (error) {
            // Error saving data
        }

    }

    splitKeywords(keywords) {
        if (keywords.length > 0) {
            return keywords.split(",");
        } else {
            return [];
        }
    }


    renderPoem() {

        let poemDetail = this.state.poemDetail[0];
        let relatedPoemHeader = <View />

        if (poemDetail != undefined) {

            let rating = "0";
            let keywords = [];
            let renderKeywords = <View />
            keywords = this.splitKeywords(poemDetail.keywords);
            
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
            }else{
                //console.log("No Keywords");
                //renderKeywords=<Row><Text>No keywords</Text></Row>
            }

            if (poemDetail.rating != undefined) {
                rating = poemDetail.rating;
            }

            if (this.state.relatedPoem.length > 0) {
                relatedPoemHeader =

                    <Row style={{ padding: 15 }}>
                        <Body>
                            <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                {this.state.chosenLanguage.related}
                            </Text>
                        </Body>
                    </Row>
            }



            return (
                <Grid style={{ padding: 0 }}>
                    <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                        <Body style={{ padding: 20 }}>
                            <Body>
                                <Text style={{ color: "#000", fontSize: 15 }}> {poemDetail.title}</Text>
                            </Body>
                        </Body>
                    </Row>
                    <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>
                        <Left style={{ padding: 5 }}>
                            <Body>
                                <Button transparent onPress={() => this.goPoemByUser(poemDetail.author)}><Icon name="person" /></Button>
                                <Text note>{poemDetail.author}</Text>
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
                                <Text note>{time(poemDetail.date)}</Text>
                            </Body>
                        </Right>
                    </Row>
                    <Row>
                        <Image
                            style={{ width: Dimensions.get('window').width, height: 200 }}
                            source={{ uri: 'http://novasyon.net/images/poem/' + poemDetail.image }}
                        />
                    </Row>
                    {renderKeywords}
                    <Row>
                        <Body style={{ backgroundColor: "#fff", alignItems: 'center', padding: 10, justifyContent: 'center', flex: 1 }}>
                            <Text style={{ fontSize: 14, padding: 10 }}>
                                {poemDetail.poem_txt}
                            </Text>
                        </Body>
                    </Row>

                    {relatedPoemHeader}

                    <Row>
                        {
                            this.state.relatedPoem.length > 0 ?this.renderRelatedPoemCards():<Text>No Poems</Text>
                            
                            
                            }
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
                        <Header style={{ backgroundColor: setting.poem_color, marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={this.navigateBack}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>
                            <Body>
                                <Title>(this.state.poemDetail[2])}</Title> /*Poem title*/
                                <Subtitle>{this.state.language.title}</Subtitle> /*Poem*/
                            </Body>
                            <Right>
                                <Button transparent onPress={() => this.share(this.state.poemDetail[0])}>
                                    <Icon name="share" />
                                </Button>
                            </Right>
                        </Header>
                        {this.renderPoem()}
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


export default PoemDetail;