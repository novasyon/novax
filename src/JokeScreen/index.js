import React, { Component } from "react";
import AsyncStorage from "react-native";
import Joke from "./Joke.js";
import JokesTags from "./JokesTags.js";
import JokesThemes from "./JokesThemes.js";
import ListJokesByUser from "./ListJokesByUser.js";
import JokeDetail from "../JokeDetailScreen/JokeDetailScreen"
import AddJoke from "../JokeDetailScreen/AddJoke"
import DetailTag from "../JokeDetailScreen/DetailTag"
import Search from '../SearchScreen/Search'
import { TabNavigator, StackNavigator } from "react-navigation";
import {
    Button,
    Container,
    Header,
    Body,
    Left,
    Right,
    Title,
    Text,
    Icon,
    Item,
    Footer,
    FooterTab,
    Label, StyleProvider
} from "native-base";
import getTheme from '../native-base-theme/components';
import material from '../native-base-theme/variables/material';
import platform from '../native-base-theme/variables/platform';
import { language } from '../config/language.js'



const TabNav = TabNavigator(

    {
        Joke: { screen: Joke },
        JokesTags: { screen: JokesTags},
        JokesThemes: { screen: JokesThemes }
    },

    {

        tabBarPosition: "bottom",
        tabBarComponent: props => {
        
        
        
           return (
                
                <StyleProvider style={getTheme(material)}>
                    <Footer>
                        <FooterTab>
                            <Button
                                vertical
                                active={props.navigationState.index === 0}
                                onPress={() => props.navigation.navigate("Joke")}
                            >
                                <Icon name="paper" />
                            </Button>
                            <Button
                                vertical
                                active={props.navigationState.index === 1}
                                onPress={() => props.navigation.navigate("JokesTags")}
                            >
                                <Icon name="pricetags" />
                            </Button>
                            <Button
                                vertical
                                active={props.navigationState.index === 2}
                                onPress={() => props.navigation.navigate("JokesThemes")}
                            >
                                <Icon name="albums" />
                            </Button>
                        </FooterTab>
                    </Footer>
                </StyleProvider>

            );
        }
    }
)

const JokeScreenNavigator = StackNavigator({
    Root: {
        screen: TabNav,
        navigationOptions: {
            header: null,
        },
        
    },
    AddJoke: {
        screen: AddJoke
    },
    Search:{
        screen:Search
    },
    JokeDetail: {
        screen: JokeDetail
    },
    JokeDetailTag: { screen: DetailTag },
    ListJokesByUser:{screen:ListJokesByUser}
});

export default JokeScreenNavigator;

