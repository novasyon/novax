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
import { setting } from '../config/setting.js';
import { time } from '../util/Utils.js'
import ProverbsCards from '../components/ProverbsCards.js'

let imageFolder = 'poem';
let query = 'proverb';


class ProverbsDetail extends React.Component {

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
            chosenLanguage: language.proverbs_english,
            script: language.proverbs_english.api,

        }
    }


    getLanguage() {


        AsyncStorage.getItem("@MySuperStore:language").then((chosenLanguage) => {
            console.log("Chosen Language:", chosenLanguage);
            if (chosenLanguage == 'english') {
                this.setState({ chosenLanguage: language.proverbs_english, script: language.proverbs_english.api });
            } else if (chosenLanguage == 'spanish') {
                this.setState({ chosenLanguage: language.proverbs_spanish, script: language.proverbs_spanish.api });
            } else if (chosenLanguage == 'french') {
                this.setState({ chosenLanguage: language.proverbs_french, script: language.proverbs_french.api });
            } else if (chosenLanguage == 'creole') {
                this.setState({ chosenLanguage: language.proverbs_creole, script: language.proverbs_creole.api });
            }

        }).done(() => {
            console.log("Done!");
            this.getDetail();
        });
    }

    _onPressButton(item) {
        console.log("Proverb ID=", item.id);
        this.props.navigation.navigate('ProverbsDetail', { id: item.id, title: item.title });

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
        return fetch('http://novasyon.net/apps/novasyon/' + this.state.script + '?' + query + '=' + this.props.navigation.state.params.id)
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

    getProverbItem(item) {
        let chosenLanguage = this.state.chosenLanguage.lang;
        console.log("getProverbItem lang:", chosenLanguage);
        if (chosenLanguage === 'english') {
            //console.log('getProverbItem english:',item.english);
            return item.english;
        } else if (chosenLanguage === 'french') {
            return item.french;
        } else if (chosenLanguage === 'spanish') {
            return item.spanish;
        } else if (chosenLanguage === 'creole') {
            return item.creole;
        }
    }


    goTag() {

        try {

            AsyncStorage.setItem('@MySuperStore:isFromDetail', 'true');
            this.props.navigation.navigate("ProverbsDetailTag", { id: this.props.navigation.state.params.id });
        } catch (error) {
            // Error saving data
        }
    }

    goListByUser(author) {
        //console.log("Go Poems By User");
        this.props.navigation.navigate("ListProverbsByUser", { id: this.props.navigation.state.params.id, author: author });
    }

    share(proverb) {
        console.log("Share");

        Share.share({
            message: proverb,
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


            return (

                <Card style={{ padding: 10, width: Dimensions.get('window').width }}>
                    <CardItem header>
                        <Body>
                            <Text>{this.getProverbItem(detail)}</Text>
                        </Body>
                    </CardItem>
                    <CardItem>
                        <Left>
                            {previousButton}
                        </Left>
                        <Body>
                            <Button transparent onPress={() => this.props.navigation.navigate("ProverbsDetail",
                                { id: detail.id, title: detail.title })}>
                                <Text>{this.state.chosenLanguage.view_title}</Text>
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
                    <Body><Text>{this.state.chosenLanguage.no_record}</Text></Body>
                </CardItem>
            </Card>

        );
    }


    renderRelatedCards() {

        //console.log('renderRelatedPoemCards. Length==', this.state.relatedPoem.length);

        if (this.state.related.length > 0) {
            return (
                <ProverbsCards
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



    renderDetail(detail, proverb) {


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
                        <Col style={{ width: 70 }}><Button transparent onPress={() => this.Tag()}><Icon name="pricetag" /></Button></Col>
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
                                {this.state.chosenLanguage.related}
                            </Text>
                        </Body>
                    </Row>
            }

            //let proverb = this.getProverbItem(detail);
            let def = " "

            if (detail.def !== '') {
                def = detail.def;
            }

            return (
                <Grid style={{ padding: 0, justifyContent: 'space-between' }}>
                    <Row style={{ backgroundColor: "#fff", borderBottomWidth: 1, borderBottomColor: "#ebebeb" }}>

                        <Body style={{ padding: 5 }}>
                            <Body>
                                <Button transparent onPress={() => this.goTag()}><Icon name="pricetag" /></Button>
                                <Text note>{this.state.chosenLanguage.tabTag}</Text>
                            </Body>
                        </Body>
                    </Row>

                    <Row style={{
                        backgroundColor: "#fff", borderBottomWidth: 1,
                        borderBottomColor: "#ebebeb", justifyContent: 'center',
                        height: Dimensions.get('window').height / 3
                    }}>
                        <Left style={{ padding: 20 }}>
                            <Body style={{ justifyContent: 'center' }}>
                                <Text style={{ color: "#000", fontSize: 20, fontWeight: 'bold', textAlign: 'left' }}> {proverb}</Text>
                                <Text note>{def}</Text>
                            </Body>
                        </Left>
                    </Row>
                    {renderKeywords}
                    {relatedHeader}

                    <Row style={{ justifyContent: 'flex-end' }}>
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


        let detail = this.state.detail[0];
        let proverb = this.getProverbItem(detail);

        return (
            <StyleProvider style={getTheme(material)}>
                <Container >
                    <Content>
                        <Header
                            style={{ backgroundColor: setting.proverb_color, marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
                            <Left>
                                <Button transparent onPress={this.navigateBack}>
                                    <Icon name="arrow-back" />
                                </Button>
                            </Left>                            
							<Body>
                                <Title>{this.state.language.title} </Title> /*Proverb title*/
                                <Subtitle># (this.state.detail[0])}</Subtitle> /*Proverb*/
                            </Body>
                            <Right>
                                <Button transparent onPress={() => this.share(proverb)}>
                                    <Icon name="share" />
                                </Button>
                            </Right>
                        </Header>
                        <View style={{
                            flex: 1,
                            flexDirection: 'column',
                            justifyContent: 'space-between',
                        }}>
                            {this.renderDetail(detail, proverb)}
                        </View>
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

export default ProverbsDetail;