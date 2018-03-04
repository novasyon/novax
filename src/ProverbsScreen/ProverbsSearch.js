import React from 'react';
import { AsyncStorage, StyleSheet, View, FlatList, TouchableOpacity } from 'react-native';
import {
    Body, Container, Content, List, Title, Tabs,
    Tab, Right, Footer, FooterTab, Left, ListItem, Text,
    Card, CardItem, Item, Input, Icon, Col, Row, Grid, Badge,
    H3, Header, Spinner, Button, Segment,Picker
} from 'native-base';
import config from '../config/config.js';


class ProverbsSearch extends React.Component {

    poemsUrl = 'http://novasyon.net/apps/novasyon/APIpoems.php';

    static navigationOptions = ({ navigation }) => ({
        header: null
    });


    constructor(props) {
        console.log('PoemSearch');
        super(props);
        this.state = {
            search: '',
            isLoading: true,
            poems: []
        }
    }


    _captureSearch() {

    }


    _searchPoem() {

        this.setState({ isLoading: true, poems: [] });

        let searchPoemUrl = this.poemsUrl + '?q=' + this.state.search;

        this._searchInput.value = '';

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
                let title = 'Search Poems - ' + this.state.search;
                this.setState({
                    title: title,
                    language: 'english',
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

    render() {

        return (
            <Container>
                <Content>
                    <Header noshadow style={{
                        marginTop: 0,
                        borderBottomWidth: 0,
                        paddingTop:60, paddingBottom: 0,
                        elevation: 0
                    }}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.goBack()}>
                                <Icon name="arrow-back" />
                            </Button>
                        </Left>
                        <Body>
                            <Title>Search Poem</Title>
                            <Text>No result</Text>
                        </Body>
                        <Right>
                        </Right>
                    </Header>
                    <Header searchBar noShadow>
                        <Item>
                            <Icon name="ios-search" />
                            <Input
                                ref={(c) => this._searchInput = c}
                                defaultValue=''
                                autoFocus={false}
                                placeholder="Search"
                                onChangeText={(text) =>
                                    this._captureSearch(text)
                                }
                                onSubmitEditing={() => this._searchPoem()}
                            />
                        </Item>
                        <Item><Input placeholder="ssss"/></Item>
                    </Header>
                </Content>
            </Container>
        );

    }


}

export default ProverbsSearch;