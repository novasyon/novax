import React from 'react';
import { StyleSheet, View, FlatList, TouchableOpacity, ListView, AsyncStorage } from 'react-native';
import {
    Container, Content, List, ListItem, Left, Body, Right, Title, Text, Card,
    CardItem, Icon, Col, Row, Grid, Badge, H3, Header, Spinner, Button, Segment, StyleProvider, Thumbnail
} from 'native-base';
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'
import { config } from '../config/config.js'


class DetailTags extends React.Component {

    static navigationOptions = ({ navigation }) => ({
        header: null
    });

    baseUrl = 'http://novasyon.net/apps/novasyon/';
    //baseUrl = config.baseApiUrl;
    //imagesUrl = config.baseImageUrl;
    proverbsUrl = 'http://novasyon.net/apps/novasyon/APIproverbs.php';
    imagesUrl = 'http://novasyon.net/images/Proverb/';
    //ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});

    constructor(props) {
        
        super(props);
        console.log("Proverbs Detail Tag");
        this.state = {
            isLoading: true,
            isLoadingTag: false,
            tags: [],
            proverbs: [],
            language: language.proverbs_english,
            script: language.proverbs_english.api
        }
    }

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

            //this._getAllProverb();

        }).done(() => {
            let keyword = this.props.navigation.state.params.keyword;
            if (keyword !== null) {
                console.log("Get Tag ", keyword);
                this._getTag(keyword);

            } else {
                this._getAllTags();
            }
        });
    }



    _getAllTags() {

        this.setState({ isLoading: true, isLoadingTag: false, tags: [], proverbs: [] });

        let allProverbUrl = this.baseUrl + this.state.script + "?tags";

        return fetch(allProverbUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                //this.proverbs = responseJson;
                this.setState({
                    isLoading: false,
                    isLoadingTag: false,
                    tags: responseJson,
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }



    _getTag(tag) {

        this.setState({ isLoading: false, isLoadingTag: true, proverbs: [] });

        let allProverbUrl = this.baseUrl + this.state.script + "?tag=" + tag;

        return fetch(allProverbUrl)
            .then((response) => response.json())
            .then((responseJson) => {
                console.log(responseJson);
                this.proverbs = responseJson;
                this.setState({
                    isLoading: false,
                    isLoadingTag: false,
                    proverbs: responseJson
                }, function () {
                    // do something with new state
                });
            })
            .catch((error) => {
                console.error(error);
            });

    }

    _renderTags() {

        console.log(this.state.tags[0]);

        return (
            <List dataArray={this.state.tags[0]}
                horizontal={true}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 60, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButton(item) }}>
                        <Badge
                            style={{ backgroundColor: '#e53935' }}>
                            <Text>{item}</Text>
                        </Badge>
                    </ListItem>
                }>
            </List>
        );
    }

    _onPressButton(item) {
        console.log("Item ID=", item);
        this._getTag(item);
        //this.props.navigation.getNavigator('master').push('proverbsSearchList', { tag: item });
    }

    _onPressButtonProverbDetail(item) {

        console.log("Item ID=", item.id);
        this.props.navigation.navigate('ProverbsDetail', { id: item.id, title: item.title });
    }

    _renderproverbsByTag() {

        //this._getTag();

        if (this.state.isLoadingTag) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );

        }

        if (this.state.proverbs.length == 0) {
            return (
                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Text>{this.state.language.noproverbs}</Text>
                </View>
            );
        }

        return (
            <List dataArray={this.state.proverbs}
                renderRow={(item) =>
                    <ListItem style={{ paddingLeft: 10, paddingTop: 20, paddingBottom: 20, marginLeft: 0 }}
                        button onPress={() => { this._onPressButtonProverbDetail(item) }}>
                        <Thumbnail square size={80} source={{ uri: this.imagesUrl + item.image }} />
                        <Body>
                            <Text>
                                {item.title}
                            </Text>
                            <Text note>{item.author}</Text>
                            <Text note>
                                Views: {item.views}    Rating:{item.rating}
                            </Text>
                        </Body>
                    </ListItem>
                }>
            </List>
        );


    }

    componentDidMount() {

        this.getLanguage();

    }


    render() {


        if (this.state.isLoading) {
            return (

                <View style={{ alignItems: 'center', justifyContent: 'center', flex: 1 }}>
                    <Spinner color='blue' />
                </View>
            );
        }

        header = <Header noShadow style={{ marginTop: 0, paddingTop: 60, paddingBottom: 40, elevation: 0 }}>
            <Left><Button transparent
                onPress={() => this.props.navigation.goBack()}
            ><Icon name="arrow-back" /></Button></Left>
            <Body>
                <Title>{this.state.language.tabTag}</Title>
            </Body>
            <Right />
        </Header>



        return (
            <StyleProvider style={getTheme(material)}>
                <Container style={{ backgroundColor: '#fff' }}>
                    <Content>
                        {header}
                        <Grid style={{ marginLeft: 0, padding: 0 }}>
                            <Row style={{ backgroundColor: '#fff', marginLeft: 0, marginTop: 0, padding: 0 }}>{this._renderTags()}</Row>
                            <Row>{this._renderproverbsByTag()}</Row>
                        </Grid>
                    </Content>
                </Container>
            </StyleProvider>
        )
    }
}

export default DetailTags;